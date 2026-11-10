/**
 * P-08 — Recebimento do formulário de contato comercial
 * Implementa: RF-120, RF-122 (validação obrigatória no servidor), RF-124
 *   (envio duplicado descartado), RF-126 (antispam com ponto de extensão),
 *   RF-127, RF-128, RF-129 (roteamento e assunto legível), RF-130
 *   (confirmação ao remetente), RF-132 (falha preserva dados e alerta),
 *   RNF-043 (tetos de tamanho), RNF-092 (alerta obrigatório)
 * Modelo: nenhum — leads não são persistidos no Payload (Q-014, PR-021): o
 *   destino é a caixa de e-mail dos sócios, com registro durável em arquivo
 *   (14.5), nunca um painel de gestão de leads.
 * Conversão: 14.3, 14.5, 14.6, 14.7
 * Perguntas abertas que afetam este arquivo: Q-031/Q-063 (e-mail institucional
 *   não existe — `configuracaoDeEntrega().completa` é `false` neste ambiente,
 *   e o envio real de e-mail fica sem efeito até existir), Q-091 (idem para
 *   o alerta por e-mail/webhook — o alerta local em arquivo cobre o vazio)
 * Dono: Onda 3c
 */

import { NextResponse } from 'next/server'

import { avaliarEnvio } from '@/lib/antispam'
import { dispararAlerta } from '@/lib/alerta'
import { configuracaoDeEntrega } from '@/lib/configuracao-contato'
import { enviarEmail, type ResultadoDeEnvioDeEmail } from '@/lib/correio'
import {
  ACOES_DE_ORIGEM,
  CONTEXTO_PADRAO,
  FALHAS,
  PRAZO_DE_RESPOSTA,
  TIPOS_DE_ORIGEM,
  normalizarParaEnvio,
  rotuloDoAssunto,
  validarDados,
  type AcaoDeOrigem,
  type ContextoDeOrigem,
  type DadosDoFormulario,
  type ErrosDeValidacao,
  type TipoDeOrigem,
} from '@/lib/contato-contrato'
import {
  atualizarStatusDaSolicitacao,
  ehEnvioDuplicado,
  registrarAssinaturaDeEnvio,
  registrarOcorrenciaDeSpam,
  registrarSolicitacao,
} from '@/lib/registro-de-solicitacoes'
import { marcarTokenComoUsado } from '@/lib/token-de-formulario'

// `node:net`/`node:tls` (via `src/lib/correio.ts`) exigem o runtime Node —
// nunca o runtime Edge.
export const runtime = 'nodejs'

type CorpoDaRequisicao = {
  dados?: Partial<DadosDoFormulario>
  contexto?: Partial<ContextoDeOrigem>
  token?: unknown
  isca?: unknown
  desafio?: unknown
}

const textoDe = (valor: unknown): string => (typeof valor === 'string' ? valor : '')
const booleanoDe = (valor: unknown): boolean => valor === true

/** Nunca confia no formato recebido do cliente — reconstrói campo a campo. */
const extrairDados = (bruto: Partial<DadosDoFormulario> | undefined): DadosDoFormulario => ({
  nome: textoDe(bruto?.nome),
  email: textoDe(bruto?.email),
  empresa: textoDe(bruto?.empresa),
  assunto: textoDe(bruto?.assunto),
  interesse: textoDe(bruto?.interesse),
  mensagem: textoDe(bruto?.mensagem),
  consentimentoDeTratamento: booleanoDe(bruto?.consentimentoDeTratamento),
  aceiteDeComunicacoes: booleanoDe(bruto?.aceiteDeComunicacoes),
})

const ehTipoDeOrigemValido = (valor: unknown): valor is TipoDeOrigem =>
  typeof valor === 'string' && (TIPOS_DE_ORIGEM as readonly string[]).includes(valor)

const ehAcaoDeOrigemValida = (valor: unknown): valor is AcaoDeOrigem =>
  typeof valor === 'string' && (ACOES_DE_ORIGEM as readonly string[]).includes(valor)

/** Contexto nunca fica vazio (PR-049): entrada fora do formato válido cai no padrão institucional. */
const extrairContexto = (bruto: Partial<ContextoDeOrigem> | undefined): ContextoDeOrigem => {
  if (!bruto || !ehTipoDeOrigemValido(bruto.tipoDeEntidade) || !ehAcaoDeOrigemValida(bruto.acao)) {
    return CONTEXTO_PADRAO
  }
  return {
    paginaDeOrigem: typeof bruto.paginaDeOrigem === 'string' ? bruto.paginaDeOrigem : CONTEXTO_PADRAO.paginaDeOrigem,
    tipoDeEntidade: bruto.tipoDeEntidade,
    entidade: typeof bruto.entidade === 'string' ? bruto.entidade : undefined,
    acao: bruto.acao,
    campanha:
      bruto.campanha && typeof bruto.campanha === 'object'
        ? Object.fromEntries(
            Object.entries(bruto.campanha).filter((par): par is [string, string] => typeof par[1] === 'string'),
          )
        : undefined,
  }
}

const obterOrigem = (requisicao: Request): string =>
  requisicao.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
  requisicao.headers.get('x-real-ip') ||
  'origem-desconhecida'

type CorpoDeSucesso = { ok: true }
type CorpoDeErroDeValidacao = { ok: false; tipo: 'validacao'; erros: ErrosDeValidacao }
type CorpoDeFalha = { ok: false; tipo: 'falha'; mensagem: string }

const respostaDeSucesso = (): NextResponse<CorpoDeSucesso> =>
  NextResponse.json({ ok: true }, { status: 200 })

const respostaDeErroDeValidacao = (erros: ErrosDeValidacao): NextResponse<CorpoDeErroDeValidacao> =>
  NextResponse.json({ ok: false, tipo: 'validacao', erros }, { status: 400 })

/**
 * Falha "genérica" — usada tanto para falha real de processamento/entrega
 * quanto para reprovação silenciosa de antispam (14.4: "nunca informar que
 * foi classificado como spam"; mesma mensagem de falha de servidor, sem
 * acusação). HTTP 200 de propósito: um status diferente para o caso de spam
 * seria, ele mesmo, um sinal que ajudaria um robô a se adaptar.
 */
const respostaDeFalha = (mensagem: string): NextResponse<CorpoDeFalha> =>
  NextResponse.json({ ok: false, tipo: 'falha', mensagem }, { status: 200 })

type MotivoDeFalhaDeEmail = Extract<ResultadoDeEnvioDeEmail, { entregue: false }>['motivo']

const mapearMotivoDeEmailParaMensagem = (motivo: MotivoDeFalhaDeEmail): string => {
  switch (motivo) {
    case 'rede':
      return FALHAS.rede
    case 'tempo-esgotado':
      return FALHAS.tempoEsgotado
    case 'nao-configurado':
    case 'servidor':
    default:
      return FALHAS.servidor
  }
}

export async function POST(requisicao: Request): Promise<NextResponse> {
  let corpoBruto: CorpoDaRequisicao
  try {
    corpoBruto = (await requisicao.json()) as CorpoDaRequisicao
  } catch {
    // Corpo que não é sequer JSON válido não é um erro de validação de campo
    // — não é o formulário desta página que está falando com a rota.
    return NextResponse.json({ ok: false, tipo: 'falha', mensagem: FALHAS.servidor } satisfies CorpoDeFalha, {
      status: 400,
    })
  }

  const dados = extrairDados(corpoBruto.dados)
  const contexto = extrairContexto(corpoBruto.contexto)
  const token = textoDe(corpoBruto.token)
  const isca = textoDe(corpoBruto.isca)
  const desafio = textoDe(corpoBruto.desafio)
  const origem = obterOrigem(requisicao)

  // RF-122 — validação de servidor, obrigatória e nunca dispensada, mesmo que
  // o cliente já tenha validado antes.
  const erros = validarDados(dados)
  if (Object.keys(erros).length > 0) {
    return respostaDeErroDeValidacao(erros)
  }

  // RF-126 — antispam. Qualquer reprovação aqui é tratada de forma
  // indistinguível de uma falha de servidor para quem está do outro lado.
  const resultadoDoAntispam = await avaliarEnvio({ envio: { isca, token, desafio }, email: dados.email, origem })
  if (resultadoDoAntispam.suspeito) {
    await registrarOcorrenciaDeSpam(resultadoDoAntispam.motivo, origem)
    return respostaDeFalha(FALHAS.servidor)
  }

  // RF-124 — envio idêntico do mesmo remetente numa janela curta.
  if (ehEnvioDuplicado(dados)) {
    return respostaDeFalha(FALHAS.duplicado)
  }

  const dadosNormalizados = normalizarParaEnvio(dados)

  // 14.5, requisito 2 — registra ANTES de qualquer tentativa de entrega.
  // Falhar depois deste ponto nunca perde o dado: ele já está em disco.
  const idDaSolicitacao = await registrarSolicitacao(dadosNormalizados, contexto)
  registrarAssinaturaDeEnvio(dadosNormalizados)

  const assuntoLegivel = `[Contato — ${rotuloDoAssunto(dadosNormalizados.assunto)}] ${dadosNormalizados.nome}`
  const corpoParaOsSocios = [
    `Nova solicitação de contato (${idDaSolicitacao}).`,
    `Nome: ${dadosNormalizados.nome}`,
    `E-mail: ${dadosNormalizados.email}`,
    dadosNormalizados.empresa ? `Empresa: ${dadosNormalizados.empresa}` : undefined,
    `Assunto: ${rotuloDoAssunto(dadosNormalizados.assunto)}`,
    dadosNormalizados.interesse ? `Produto de interesse: ${dadosNormalizados.interesse}` : undefined,
    `Aceite de comunicações futuras: ${dadosNormalizados.aceiteDeComunicacoes ? 'sim' : 'não'}`,
    '',
    'Mensagem:',
    dadosNormalizados.mensagem,
    '',
    `Origem: ${contexto.paginaDeOrigem} (${contexto.tipoDeEntidade}${contexto.entidade ? ` — ${contexto.entidade}` : ''}, ação ${contexto.acao})`,
  ]
    .filter((linha): linha is string => linha !== undefined)
    .join('\n')

  const config = configuracaoDeEntrega()

  const envioParaOsSocios = await enviarEmail({
    para: config.caixaDeLeads,
    assunto: assuntoLegivel,
    corpoTexto: corpoParaOsSocios,
  })

  if (!envioParaOsSocios.entregue) {
    await atualizarStatusDaSolicitacao(idDaSolicitacao, 'falha-de-envio', envioParaOsSocios.motivo)
    await dispararAlerta({
      mensagem: `Falha ao entregar lead ${idDaSolicitacao} à caixa de leads`,
      idDaSolicitacao,
      detalhe: { motivo: envioParaOsSocios.motivo, contexto },
    })
    // O token NÃO é marcado como usado: a mesma tentativa, com os mesmos
    // dados já preservados na tela, pode ser reenviada sem recarregar a
    // página (RF-132) e sem ser barrada como reutilização de token.
    return respostaDeFalha(mapearMotivoDeEmailParaMensagem(envioParaOsSocios.motivo))
  }

  // Lead entregue: a partir daqui, o pedido do visitante FOI recebido pela
  // empresa. O token é consumido — um reenvio a partir daqui criaria um
  // segundo lead para o mesmo pedido.
  marcarTokenComoUsado(token)

  const envioDeConfirmacao = await enviarEmail({
    para: dadosNormalizados.email,
    assunto: 'Recebemos sua mensagem — ArtZan',
    corpoTexto: [
      `Olá, ${dadosNormalizados.nome}.`,
      '',
      `Recebemos sua mensagem. Um de nós responde em ${PRAZO_DE_RESPOSTA} por e-mail.`,
      '',
      'Resumo do que você enviou:',
      `Assunto: ${rotuloDoAssunto(dadosNormalizados.assunto)}`,
      `Mensagem: ${dadosNormalizados.mensagem}`,
      '',
      dadosNormalizados.aceiteDeComunicacoes
        ? 'Você também aceitou receber nossos e-mails. Pode cancelar quando quiser.'
        : undefined,
      `Identificador da solicitação: ${idDaSolicitacao}`,
    ]
      .filter((linha): linha is string => linha !== undefined)
      .join('\n'),
  })

  if (!envioDeConfirmacao.entregue) {
    // Falha PARCIAL: o lead chegou à empresa (o que importa para RF-129/14.5)
    // mas a confirmação ao visitante (RF-130) não saiu. Ainda é uma falha de
    // entrega de formulário no sentido de RNF-092 — alerta, sem negar ao
    // visitante que o pedido dele foi recebido, porque foi.
    await atualizarStatusDaSolicitacao(
      idDaSolicitacao,
      'confirmacao-nao-entregue',
      envioDeConfirmacao.motivo,
    )
    await dispararAlerta({
      mensagem: `Lead ${idDaSolicitacao} entregue, mas a confirmação ao remetente falhou`,
      idDaSolicitacao,
      detalhe: { motivo: envioDeConfirmacao.motivo },
    })
    return respostaDeSucesso()
  }

  await atualizarStatusDaSolicitacao(idDaSolicitacao, 'entregue')
  return respostaDeSucesso()
}
