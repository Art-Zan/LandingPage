/**
 * Primitivo de ação — botão e link com aparência de botão.
 * Visual: 11.12 (paleta), 11.14 (rótulo), 11.15 (raio, borda, sem sombra)
 * Conversão: 14.1 (três níveis de chamada para ação)
 * Acessibilidade: 13.2 (foco), 13.6 (envio e estado de processamento), 13.9 (alvo de toque)
 * Premissas: PR-062 (o azul é exclusivo da ação primária)
 * Perguntas abertas que afetam este arquivo: Q-074 (confirmação de PR-062)
 * Dono: Onda 2a
 *
 * AS TRÊS VARIANTES SÃO OS TRÊS NÍVEIS DE 14.1, e não três estilos à escolha:
 *   `primaria`   — leva a um formulário. No máximo UMA por seção.
 *   `secundaria` — aprofunda a navegação no portfólio. Não pode competir em peso.
 *   `discreta`   — baixo compromisso: institucional, legais, link externo.
 *
 * PR-062 ESTRUTURADO PARA QUE A VIOLAÇÃO SEJA VISÍVEL: o azul aparece uma
 * única vez neste arquivo, no mapa `PRIMARIA`. A variante secundária usa
 * `acao-secundaria`, que é o texto principal do tema, em RÓTULO E CONTORNO —
 * `bg-transparent` está escrito de propósito, para que qualquer tentativa de
 * preencher a secundária exija apagar essa palavra. Se o nome
 * `acao-primaria` aparecer em mais de um dos três mapas abaixo, PR-062 foi
 * quebrado.
 *
 * ESTE ARQUIVO NÃO CONTÉM RÓTULO. O texto do botão vem sempre de quem o usa,
 * porque 14.1 fixa os rótulos e 11.8 exige o mesmo rótulo para a mesma ação
 * em todo o site (RNF-074).
 */

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

import { juntarClasses } from './juntarClasses'

export type VarianteDeBotao = 'primaria' | 'secundaria' | 'discreta'

/** Comum às três variantes. Alvo de toque de 44 px (13.9) e foco pelo contorno global (13.2). */
const BASE = juntarClasses(
  // Restyle: camada de passagem e pressão (globals.css, .az-botao).
  'az-botao btn inline-flex items-center justify-center gap-entre-alvos',
  'min-h-toque min-w-toque px-card',
  // Rebrand (2026-11-13): rótulo de placar — condensada, caixa alta, espaçada.
  'font-titulo text-rotulo font-h1 uppercase tracking-caixa-alta leading-corpo no-underline',
  'rounded-controle border',
  'transition-colors duration-padrao',
  'cursor-pointer disabled:cursor-default',
)

/** Ação primária — o ÚNICO lugar do sistema onde o azul preenche (PR-062). */
const PRIMARIA = juntarClasses(
  'bg-acao-primaria text-sobre-acao-primaria border-acao-primaria',
  'hover:bg-acao-primaria-foco hover:border-acao-primaria-foco',
)

/** Ação secundária — rótulo e contorno no texto principal do tema. Sem preenchimento. */
const SECUNDARIA = juntarClasses(
  'bg-transparent text-acao-secundaria border-acao-secundaria',
  'hover:bg-superficie-elevada',
)

/** Ação terciária — peso mínimo, sem contorno visível. */
const DISCRETA = juntarClasses(
  'bg-transparent text-texto-principal border-transparent underline',
  'hover:bg-superficie-elevada',
)

const POR_VARIANTE: Record<VarianteDeBotao, string> = {
  primaria: PRIMARIA,
  secundaria: SECUNDARIA,
  discreta: DISCRETA,
}

/**
 * Estado desabilitado (13.3): sem mínimo de contraste obrigatório, mas legível
 * — texto secundário sobre superfície elevada mede 5,23:1 no tema claro e
 * 8,16:1 no escuro. E nunca é o único indicador: o elemento também é inerte
 * para o teclado e anunciado como desabilitado pela tecnologia assistiva.
 */
const DESABILITADO =
  'disabled:bg-superficie-elevada disabled:text-texto-secundario disabled:border-borda'

type PropsCompartilhadas = {
  variante?: VarianteDeBotao
  /** Ocupa a largura do contêiner — útil em tela pequena, onde o alvo cheio erra menos (PR-017). */
  larguraTotal?: boolean
  /** Restyle: seta desenhada ao fim do rótulo, que anda 3 px na passagem. Decorativa. */
  comSeta?: boolean
  children: ReactNode
  className?: string
}

type PropsDeBotao = PropsCompartilhadas &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children' | 'disabled'> & {
    href?: undefined
    desabilitado?: boolean
    /**
     * Estado de processamento (13.6 regra 14). Desabilita o controle — o que
     * também é a proteção contra envio duplicado — e marca `aria-busy`.
     */
    carregando?: boolean
    /**
     * Texto anunciado a leitor de tela enquanto processa. Sem valor padrão de
     * propósito: a redação é decidida por quem constrói o formulário, sob o
     * glossário de 11.8, e não fica fixa num primitivo (RNF-074).
     */
    rotuloDeCarregamento?: string
  }

type PropsDeLink = PropsCompartilhadas &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children' | 'href'> & {
    /** Presente ⇒ o primitivo vira `<a>`. Construa o caminho com `src/lib/rotas.ts`. */
    href: string
  }

export type PropsDoBotao = PropsDeBotao | PropsDeLink

/** Indicador de processamento. Decorativo: o estado é anunciado por `aria-busy` e pelo texto. */
const IndicadorDeCarregamento = () => (
  <svg
    className="h-4 w-4 animate-spin"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="8" cy="8" r="6" opacity="0.25" />
    <path d="M14 8a6 6 0 0 0-6-6" strokeLinecap="round" />
  </svg>
)

/** Restyle — seta só com segmentos retos (11.11). Decorativa (13.4). */
export const Seta = ({ className }: { className?: string }) => (
  <svg
    className={juntarClasses('az-seta h-4 w-4', className)}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="square"
    strokeLinejoin="miter"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M2 8h11M9 4l4 4-4 4" />
  </svg>
)

export const Botao = (props: PropsDoBotao) => {
  const {
    variante = 'secundaria',
    larguraTotal = false,
    comSeta = false,
    children,
    className,
  } = props
  const conteudo = comSeta ? (
    <>
      {children}
      <Seta />
    </>
  ) : (
    children
  )

  const classes = juntarClasses(BASE, POR_VARIANTE[variante], larguraTotal && 'w-full', className)

  // `href` é o discriminante da união: presente ⇒ link, ausente ⇒ botão.
  if (props.href !== undefined) {
    const {
      href,
      variante: _variante,
      larguraTotal: _larguraTotal,
      comSeta: _comSeta,
      children: _children,
      className: _className,
      ...resto
    } = props
    return (
      <a href={href} className={classes} {...resto}>
        {conteudo}
      </a>
    )
  }

  const {
    variante: _v,
    larguraTotal: _l,
    comSeta: _s,
    children: _c,
    className: _cn,
    href: _h,
    desabilitado = false,
    carregando = false,
    rotuloDeCarregamento,
    type = 'button',
    ...resto
  } = props

  const inerte = desabilitado || carregando

  return (
    <button
      type={type}
      className={juntarClasses(classes, DESABILITADO)}
      disabled={inerte}
      aria-busy={carregando || undefined}
      {...resto}
    >
      {carregando ? <IndicadorDeCarregamento /> : null}
      {conteudo}
      {carregando && rotuloDeCarregamento ? (
        <span className="az-apenas-leitor-de-tela" role="status">
          {rotuloDeCarregamento}
        </span>
      ) : null}
    </button>
  )
}
