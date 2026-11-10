// Dono: Onda 3c
//
// Proteção contra spam do formulário de contato — 14.6, camadas 1 a 6 ativas,
// camada 7 como PONTO DE EXTENSÃO previsto e inerte (PR-050 corrigida).
//
// Implementa: RF-126 (camadas 1, 2, 3, 4, ponto de extensão do captcha)
// Perguntas abertas: nenhuma — mecanismo técnico, sem dado de negócio.
//
// SERVIDOR APENAS. Nenhuma verificação aqui é exposta ao visitante como razão
// específica de bloqueio (14.4: "nunca informar que foi classificado como
// spam"): o chamador (`src/app/api/contato/route.ts`) traduz qualquer reprovação
// deste módulo na MESMA mensagem de falha de servidor, sem acusação.
//
// PR-050, O QUE ISTO TORNA VERDADEIRO: ativar o desafio interativo depois é
// escrever o corpo de `verificarDesafio` — nenhuma outra função deste arquivo,
// nem a validação em `contato-contrato.ts`, nem o roteamento em
// `src/app/api/contato/route.ts`, precisa mudar. É exatamente a garantia que
// PR-050 e RF-126 exigem: "configuração, não reconstrução".

import { resolveMx, resolve4, resolve6 } from 'node:dns/promises'

import { iscaFoiPreenchida, type EnvioDeContato } from './contato-contrato'
import { tokenJaFoiUsado, validarToken, type ResultadoDoToken } from './token-de-formulario'

/**
 * Tempo mínimo de preenchimento (14.6, camada 2). "Poucos segundos": baixo o
 * bastante para não punir quem usa preenchimento automático do navegador.
 */
export const TEMPO_MINIMO_DE_PREENCHIMENTO_MS = 3_000

export type MotivoDeReprovacao =
  | 'isca'
  | 'token-invalido'
  | 'token-reutilizado'
  | 'tempo-insuficiente'
  | 'taxa-excedida'
  | 'dominio-de-email'
  | 'desafio'

export type ResultadoDoAntispam = { suspeito: false } | { suspeito: true; motivo: MotivoDeReprovacao }

// ---------------------------------------------------------------------------
// Camada 4 — limitação de taxa por origem. Em memória do processo: suficiente
// para o volume baixo previsto (PR-002); reinício zera a contagem, o que só
// pode tornar o limite mais PERMISSIVO, nunca bloquear alguém a mais.
// ---------------------------------------------------------------------------

const JANELA_DE_TAXA_MS = 10 * 60 * 1000 // 10 minutos
const MAXIMO_POR_JANELA = 8

const contagemPorOrigem = new Map<string, number[]>()

const dentroDaJanela = (marcas: number[], agora: number): number[] =>
  marcas.filter((marca) => agora - marca < JANELA_DE_TAXA_MS)

/** Registra uma tentativa e diz se a origem excedeu a taxa (camada 4). */
const excedeuTaxa = (origem: string): boolean => {
  const agora = Date.now()
  const marcasAnteriores = dentroDaJanela(contagemPorOrigem.get(origem) ?? [], agora)
  const excedeu = marcasAnteriores.length >= MAXIMO_POR_JANELA
  marcasAnteriores.push(agora)
  contagemPorOrigem.set(origem, marcasAnteriores)
  return excedeu
}

// ---------------------------------------------------------------------------
// Camada 5 — existência do domínio de e-mail. NUNCA bloqueia por provedor
// gratuito (RF-126, 14.6): só confirma que o domínio pode, em princípio,
// receber mensagem. Falha na própria checagem (rede indisponível, DNS fora do
// ar) NUNCA bloqueia o visitante — é erro aberto (fail-open), porque um falso
// positivo aqui custa um lead inteiro por um problema que não é do visitante.
// ---------------------------------------------------------------------------

const TEMPO_LIMITE_DE_DNS_MS = 2_000

const comTempoLimite = async <T>(promessa: Promise<T>, limiteMs: number): Promise<T> => {
  let temporizador: ReturnType<typeof setTimeout>
  const tempoEsgotado = new Promise<never>((_, rejeitar) => {
    temporizador = setTimeout(() => rejeitar(new Error('tempo-limite-dns')), limiteMs)
  })
  try {
    return await Promise.race([promessa, tempoEsgotado])
  } finally {
    clearTimeout(temporizador!)
  }
}

/** O domínio do e-mail parece capaz de receber mensagem? Fail-open em qualquer dúvida. */
export const dominioDeEmailProvavelmenteValido = async (email: string): Promise<boolean> => {
  const dominio = email.split('@')[1]?.trim().toLowerCase()
  if (!dominio) return false // formato já teria sido pego por RF-122; aqui é defesa em profundidade

  try {
    const registrosMx = await comTempoLimite(resolveMx(dominio), TEMPO_LIMITE_DE_DNS_MS)
    if (registrosMx.length > 0) return true
  } catch {
    // Sem MX ou DNS indisponível — tenta A/AAAA antes de decidir.
  }

  try {
    const enderecos4 = await comTempoLimite(resolve4(dominio), TEMPO_LIMITE_DE_DNS_MS)
    if (enderecos4.length > 0) return true
  } catch {
    // segue para IPv6
  }

  try {
    const enderecos6 = await comTempoLimite(resolve6(dominio), TEMPO_LIMITE_DE_DNS_MS)
    return enderecos6.length > 0
  } catch {
    // Nenhuma resolução funcionou — pode ser domínio inexistente OU DNS fora
    // do ar. Fail-open: não é papel do antispam decidir isso sozinho.
    return true
  }
}

// ---------------------------------------------------------------------------
// Camada 7 — ponto de extensão do captcha (PR-050). Hoje SEMPRE aprova,
// porque nenhum desafio é exibido ao visitante (RF-126, critério de aceite:
// "nenhum desafio interativo é exibido ao visitante no lançamento").
// ---------------------------------------------------------------------------

/**
 * Ativar o captcha depois = substituir o `true` abaixo por uma chamada ao
 * verificador do provedor escolhido, usando `envio.desafio` como resposta do
 * visitante. Nenhuma outra peça do fluxo muda.
 */
const verificarDesafio = (_desafio: string): boolean => true

// ---------------------------------------------------------------------------
// Avaliação combinada. Ordem importa: mais barato primeiro (13.6/14.6 — nunca
// gastar uma consulta de DNS para descartar o que a isca já resolveria).
// ---------------------------------------------------------------------------

export type AvaliarEnvioParametros = {
  envio: Pick<EnvioDeContato, 'isca' | 'token' | 'desafio'>
  email: string
  origem: string
}

export const avaliarEnvio = async ({
  envio,
  email,
  origem,
}: AvaliarEnvioParametros): Promise<ResultadoDoAntispam> => {
  // Camada 1 — isca.
  if (iscaFoiPreenchida(envio)) return { suspeito: true, motivo: 'isca' }

  // Camadas 2 e 3 — token de origem, que também carrega o tempo decorrido.
  // `tokenJaFoiUsado` só é verdadeiro para um token de uma submissão já
  // ENTREGUE COM ÊXITO (`marcarTokenComoUsado` é chamado pelo chamador de
  // `avaliarEnvio` só depois do sucesso, nunca aqui) — por isso uma falha de
  // envio anterior nunca impede a nova tentativa com o mesmo token, sem
  // recarregar a página (RF-132).
  const resultadoDoToken: ResultadoDoToken = validarToken(envio.token)
  if (!resultadoDoToken.valido) return { suspeito: true, motivo: 'token-invalido' }
  if (tokenJaFoiUsado(envio.token)) return { suspeito: true, motivo: 'token-reutilizado' }
  if (Date.now() - resultadoDoToken.emitidoEm < TEMPO_MINIMO_DE_PREENCHIMENTO_MS) {
    return { suspeito: true, motivo: 'tempo-insuficiente' }
  }

  // Camada 4 — taxa por origem.
  if (excedeuTaxa(origem)) return { suspeito: true, motivo: 'taxa-excedida' }

  // Camada 5 — domínio de e-mail.
  if (!(await dominioDeEmailProvavelmenteValido(email))) {
    return { suspeito: true, motivo: 'dominio-de-email' }
  }

  // Camada 7 — ponto de extensão (hoje inerte).
  if (!verificarDesafio(envio.desafio)) return { suspeito: true, motivo: 'desafio' }

  return { suspeito: false }
}
