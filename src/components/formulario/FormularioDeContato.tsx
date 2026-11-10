'use client'

/**
 * P-08 — Formulário de contato comercial (parte interativa)
 * Implementa: RF-120, RF-122, RF-123, RF-124, RF-126 (camada 1, campo isca),
 *   RF-127, RF-128, RF-131, RF-132, RF-220, RF-221
 * Conversão: 14.1 (ação única, "Enviar solicitação"), 14.2, 14.3, 14.4, 14.7, 14.10
 * Acessibilidade: 13.6 (formulário acessível — rótulo, erro, resumo, foco,
 *   estado de processamento), 13.7 (redação), 13.9 (alvo de 44 px)
 * Premissas: PR-012, PR-046, PR-049, PR-050, PR-069
 * Perguntas abertas que afetam este arquivo: Q-089 (texto do aceite de
 *   comunicações pendente de validação jurídica), Q-091 (canais diretos sem
 *   valor real ainda)
 * Dono: Onda 3c
 */

import { useId, useRef, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'

import { Botao, Campo } from '@/components/ui'
import {
  ASSUNTOS,
  DADOS_VAZIOS,
  FALHAS,
  INTERESSE_INDEFINIDO,
  MENSAGENS,
  PRAZO_DE_RESPOSTA,
  ROTULO_DE_ENVIO_EM_ANDAMENTO,
  ROTULO_DO_ENVIO,
  validarDados,
  type ContextoDeOrigem,
  type DadosDoFormulario,
  type ErrosDeValidacao,
} from '@/lib/contato-contrato'
import type { EstadoDoCanal } from '@/lib/configuracao-contato'
import { ROTAS } from '@/lib/rotas'

import { CampoDeAceite } from './CampoDeAceite'
import { CampoDeSelecao, type OpcaoDeSelecao } from './CampoDeSelecao'
import { CanalDireto } from './CanalDireto'

export type PropsDoFormularioDeContato = {
  /** Token de origem, emitido pela renderização do servidor (14.6, camada 3). */
  token: string
  contexto: ContextoDeOrigem
  opcoesDeInteresse: readonly OpcaoDeSelecao[]
  interesseInicial?: string
  produtoDeOrigem?: { slug: string; nome: string }
  estadoDoWhatsapp: EstadoDoCanal
  estadoDoEmail: EstadoDoCanal
}

/** Tempo de espera pela resposta antes de tratar como tempo esgotado (RF-132). */
const TEMPO_LIMITE_DO_ENVIO_MS = 20_000

type EstadoDoEnvio = 'ocioso' | 'enviando' | 'falhou'

const CAMPOS_EM_ORDEM: (keyof ErrosDeValidacao)[] = [
  'nome',
  'email',
  'empresa',
  'assunto',
  'interesse',
  'mensagem',
  'consentimentoDeTratamento',
]

export const FormularioDeContato = ({
  token,
  contexto,
  opcoesDeInteresse,
  interesseInicial,
  produtoDeOrigem,
  estadoDoWhatsapp,
  estadoDoEmail,
}: PropsDoFormularioDeContato) => {
  const roteador = useRouter()
  const idPrefixo = useId()

  const [dados, setDados] = useState<DadosDoFormulario>({
    ...DADOS_VAZIOS,
    interesse: interesseInicial ?? '',
  })
  const [erros, setErros] = useState<ErrosDeValidacao>({})
  const [isca, setIsca] = useState('')
  const [estadoDoEnvio, setEstadoDoEnvio] = useState<EstadoDoEnvio>('ocioso')
  const [mensagemDeFalha, setMensagemDeFalha] = useState<string | undefined>(undefined)

  const referenciaDoResumo = useRef<HTMLDivElement | null>(null)

  // `Campo` (Onda 2a) não encaminha `ref` — é componente de função simples,
  // sem `forwardRef`. Em vez de alterar arquivo de outra onda, o foco do
  // primeiro campo com erro (13.6 regra 7) usa o próprio `id`, que este
  // componente já controla.
  const idDoCampo = (campo: keyof DadosDoFormulario): string => `${idPrefixo}-${campo}`

  const atualizarCampo = <C extends keyof DadosDoFormulario>(campo: C, valor: DadosDoFormulario[C]) => {
    setDados((atual) => ({ ...atual, [campo]: valor }))
    // 13.6: campo corrigido tem o erro removido imediatamente.
    setErros((atual) => {
      if (!(campo in atual)) return atual
      const proximo = { ...atual }
      delete proximo[campo as keyof ErrosDeValidacao]
      return proximo
    })
  }

  const focarPrimeiroErro = (errosAtuais: ErrosDeValidacao) => {
    const primeiroCampoComErro = CAMPOS_EM_ORDEM.find((campo) => errosAtuais[campo])
    const elemento = primeiroCampoComErro
      ? document.getElementById(idDoCampo(primeiroCampoComErro))
      : null
    if (elemento instanceof HTMLElement) {
      elemento.focus()
    } else {
      referenciaDoResumo.current?.focus()
    }
  }

  const enviar = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()

    const errosDeValidacao = validarDados(dados)
    if (Object.keys(errosDeValidacao).length > 0) {
      setErros(errosDeValidacao)
      // Foco vai ao resumo primeiro (ele existe sempre que há mais de um
      // erro) ou direto ao campo único — 13.6 regra 6 e 7.
      window.setTimeout(() => focarPrimeiroErro(errosDeValidacao), 0)
      return
    }

    setEstadoDoEnvio('enviando')
    setMensagemDeFalha(undefined)

    const controlador = new AbortController()
    const temporizador = window.setTimeout(() => controlador.abort(), TEMPO_LIMITE_DO_ENVIO_MS)

    try {
      const resposta = await fetch('/api/contato', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        signal: controlador.signal,
        body: JSON.stringify({
          dados,
          contexto,
          token,
          isca,
          desafio: '', // PR-050 — ponto de extensão, hoje sempre vazio.
        }),
      })

      const corpo = (await resposta.json().catch(() => null)) as
        | { ok: true }
        | { ok: false; tipo: 'validacao'; erros: ErrosDeValidacao }
        | { ok: false; tipo: 'falha'; mensagem: string }
        | null

      if (!corpo) {
        setEstadoDoEnvio('falhou')
        setMensagemDeFalha(FALHAS.servidor)
        return
      }

      if (corpo.ok) {
        const destino = produtoDeOrigem
          ? `${ROTAS.obrigado()}?produto=${encodeURIComponent(produtoDeOrigem.slug)}`
          : ROTAS.obrigado()
        roteador.push(destino)
        return
      }

      if (corpo.tipo === 'validacao') {
        setErros(corpo.erros)
        window.setTimeout(() => focarPrimeiroErro(corpo.erros), 0)
        setEstadoDoEnvio('falhou')
        return
      }

      setEstadoDoEnvio('falhou')
      setMensagemDeFalha(corpo.mensagem)
    } catch (erro) {
      setEstadoDoEnvio('falhou')
      setMensagemDeFalha(
        erro instanceof DOMException && erro.name === 'AbortError' ? FALHAS.tempoEsgotado : FALHAS.rede,
      )
    } finally {
      window.clearTimeout(temporizador)
    }
  }

  const quantidadeDeErros = Object.keys(erros).length
  const enviando = estadoDoEnvio === 'enviando'

  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-6">
      {produtoDeOrigem ? (
        <p className="text-apoio leading-corpo text-texto-secundario">
          Sobre:{' '}
          <span className="font-rotulo text-texto-principal">{produtoDeOrigem.nome}</span>
          . Pode mudar o assunto abaixo se preferir falar sobre outra coisa.
        </p>
      ) : null}

      {quantidadeDeErros > 0 ? (
        <div
          ref={referenciaDoResumo}
          tabIndex={-1}
          role="alert"
          className="rounded-controle border border-erro bg-superficie p-card-compacto text-corpo text-erro"
        >
          <p>{MENSAGENS.resumo(quantidadeDeErros)}</p>
        </div>
      ) : null}

      {/* Camada 1 de antispam (14.6): campo isca, invisível para todos —
          incluindo teclado e leitor de tela — e nunca alcançável por Tab. */}
      <input
        type="text"
        name="site"
        value={isca}
        onChange={(evento) => setIsca(evento.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}
      />

      <Campo
        id={idDoCampo('nome')}
        rotulo="Nome"
        obrigatorio
        textoDeObrigatoriedade="(obrigatório)"
        autoComplete="name"
        value={dados.nome}
        onChange={(evento) => atualizarCampo('nome', evento.target.value)}
        erro={erros.nome}
      />

      <Campo
        id={idDoCampo('email')}
        rotulo="E-mail"
        tipo="email"
        obrigatorio
        textoDeObrigatoriedade="(obrigatório)"
        textoDeApoio="Vamos responder por aqui."
        autoComplete="email"
        value={dados.email}
        onChange={(evento) => atualizarCampo('email', evento.target.value)}
        erro={erros.email}
      />

      <Campo
        id={idDoCampo('empresa')}
        rotulo="Empresa"
        autoComplete="organization"
        value={dados.empresa}
        onChange={(evento) => atualizarCampo('empresa', evento.target.value)}
        erro={erros.empresa}
      />

      <CampoDeSelecao
        id={idDoCampo('assunto')}
        rotulo="Assunto"
        obrigatorio
        textoDeObrigatoriedade="(obrigatório)"
        rotuloDaOpcaoVazia="Selecione um assunto"
        opcoes={ASSUNTOS.map((a) => ({ valor: a.valor, rotulo: a.rotulo }))}
        value={dados.assunto}
        onChange={(evento) => atualizarCampo('assunto', evento.target.value)}
        erro={erros.assunto}
      />

      <CampoDeSelecao
        id={idDoCampo('interesse')}
        rotulo="Sobre qual software é a sua mensagem?"
        opcoes={[{ valor: INTERESSE_INDEFINIDO, rotulo: 'Ainda não sei' }, ...opcoesDeInteresse]}
        value={dados.interesse || INTERESSE_INDEFINIDO}
        onChange={(evento) => atualizarCampo('interesse', evento.target.value)}
        erro={erros.interesse}
      />

      <Campo
        id={idDoCampo('mensagem')}
        rotulo="Mensagem"
        tipo="textarea"
        linhas={5}
        obrigatorio
        textoDeObrigatoriedade="(obrigatório)"
        textoDeApoio="Conte em poucas linhas o que você precisa resolver."
        value={dados.mensagem}
        onChange={(evento) => atualizarCampo('mensagem', evento.target.value)}
        erro={erros.mensagem}
      />

      <div className="flex flex-col gap-2 border-t border-borda pt-6">
        <p className="text-apoio leading-corpo text-texto-secundario">
          Usamos os dados desta solicitação só para responder a ela. Saiba mais na{' '}
          <a href={ROTAS.privacidade()} className="text-acao-secundaria underline">
            Política de privacidade
          </a>
          .
        </p>

        <CampoDeAceite
          id={idDoCampo('consentimentoDeTratamento')}
          obrigatorio
          marcado={dados.consentimentoDeTratamento}
          aoMudar={(valor) => atualizarCampo('consentimentoDeTratamento', valor)}
          erro={erros.consentimentoDeTratamento}
          rotulo="Autorizo o uso dos meus dados para responder a esta solicitação. (obrigatório)"
        />
      </div>

      <CampoDeAceite
        id={`${idPrefixo}-aceite-de-comunicacoes`}
        marcado={dados.aceiteDeComunicacoes}
        aoMudar={(valor) => atualizarCampo('aceiteDeComunicacoes', valor)}
        rotulo="Quero receber e-mails da ArtZan sobre novidades e novos softwares. Você pode cancelar a qualquer momento."
      />

      {estadoDoEnvio === 'falhou' && mensagemDeFalha ? (
        <p role="alert" className="text-corpo leading-corpo text-erro">
          {mensagemDeFalha}
        </p>
      ) : null}

      <Botao
        type="submit"
        variante="primaria"
        larguraTotal
        carregando={enviando}
        desabilitado={enviando}
        rotuloDeCarregamento={ROTULO_DE_ENVIO_EM_ANDAMENTO}
      >
        {ROTULO_DO_ENVIO}
      </Botao>

      <p className="text-apoio leading-corpo text-texto-secundario">
        Respondemos em {PRAZO_DE_RESPOSTA}.
      </p>

      <div className="flex flex-col gap-4 border-t border-borda pt-6">
        <p className="text-apoio font-rotulo leading-corpo text-texto-principal">
          Prefere outro canal?
        </p>
        <ul className="flex flex-col gap-4">
          <CanalDireto tipo="whatsapp" rotulo="WhatsApp" estado={estadoDoWhatsapp} />
          <CanalDireto tipo="email" rotulo="E-mail" estado={estadoDoEmail} />
        </ul>
      </div>
    </form>
  )
}
