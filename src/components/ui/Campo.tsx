/**
 * Primitivo de campo de formulário.
 * Visual: 11.12, 11.14 (rótulo em 14 px, campo em 16 px), 11.15
 * Acessibilidade: 13.6 (formulários acessíveis), 13.7 (redação do erro),
 *                 13.2 (foco), 13.9 (alvo de toque), 13.3 (nada só por cor)
 * Conversão: 14.2 (poucos campos obrigatórios)
 * Premissas: PR-017 (uso predominante em tela pequena)
 * Dono: Onda 2a
 *
 * O QUE ESTE PRIMITIVO TORNA IMPOSSÍVEL, POR CONSTRUÇÃO:
 *  · Campo sem rótulo visível — `rotulo` é obrigatório e sempre renderizado.
 *  · Rótulo dentro do campo — `placeholder` está removido do tipo (13.6 regra 1).
 *    Não é convenção pedindo cooperação: não existe a propriedade.
 *  · Rótulo solto do campo — `htmlFor`/`id` sempre casados a partir de `id`.
 *  · Erro só por cor — a mensagem é TEXTO, com ícone de reforço, `aria-invalid`
 *    e `aria-describedby` (13.6 regra 5, 13.3).
 *  · Instrução tarde demais — `textoDeApoio` é renderizado ANTES do campo
 *    (13.6 regra 3).
 *  · Obrigatoriedade só por asterisco colorido — vai em texto e em `required`
 *    (13.6 regra 4).
 *
 * `id` é propriedade obrigatória em vez de gerado: identificador estável
 * permite que o resumo de erros no topo do formulário (13.6 regra 6) aponte
 * para o campo, e mantém o primitivo como componente de servidor.
 *
 * Nenhum rótulo, apoio ou mensagem vive neste arquivo: todo texto vem de quem
 * monta o formulário, sob o glossário de 11.8 (RNF-074).
 */

import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

import { juntarClasses } from './juntarClasses'

/** 14.2 mantém poucos campos; a lista fecha o que o formulário do site precisa. */
export type TipoDeCampo = 'text' | 'email' | 'tel' | 'url' | 'textarea'

type AtributosProibidos =
  | 'id'
  | 'className'
  | 'required'
  | 'aria-invalid'
  | 'aria-describedby'
  | 'placeholder'
  | 'type'

type PropsCompartilhadas = {
  /** Identificador estável do campo. Casa rótulo, apoio, erro e resumo de erros. */
  id: string
  /** Rótulo visível e persistente, acima do campo (13.6 regras 1 e 2). */
  rotulo: string
  tipo?: TipoDeCampo
  /** Instrução: formato esperado, restrição. Renderizada ANTES do campo. */
  textoDeApoio?: string
  /**
   * Mensagem de erro já redigida conforme 13.7: diz o que houve e como
   * resolver, sem culpar o visitante e sem jargão.
   */
  erro?: string
  obrigatorio?: boolean
  /** Sufixo em texto que marca a obrigatoriedade (13.6 regra 4). Ex.: "(obrigatório)". */
  textoDeObrigatoriedade?: string
  className?: string
}

type PropsDeEntrada = PropsCompartilhadas &
  Omit<InputHTMLAttributes<HTMLInputElement>, AtributosProibidos> & {
    tipo?: Exclude<TipoDeCampo, 'textarea'>
    linhas?: undefined
  }

type PropsDeAreaDeTexto = PropsCompartilhadas &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, AtributosProibidos | 'rows'> & {
    tipo: 'textarea'
    linhas?: number
  }

export type PropsDoCampo = PropsDeEntrada | PropsDeAreaDeTexto

/** Texto do campo em 16 px — piso absoluto de 11.14: menos que isso provoca zoom em navegador móvel. */
const CONTROLE = juntarClasses(
  'w-full min-h-toque',
  'px-card-compacto py-2',
  'text-corpo leading-corpo text-texto-principal',
  'bg-superficie border rounded-controle',
  'transition-colors duration-padrao',
)

const CONTORNO_NORMAL = 'border-borda'
const CONTORNO_COM_ERRO = 'border-erro'

/** Reforço visual do erro. A informação está no texto; o ícone é redundância (13.3). */
const IconeDeErro = () => (
  <svg
    className="h-4 w-4 shrink-0"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="8" cy="8" r="6" />
    <path d="M8 5v4" strokeLinecap="round" />
    <path d="M8 11.5h.01" strokeLinecap="round" />
  </svg>
)

export const Campo = (props: PropsDoCampo) => {
  const {
    id,
    rotulo,
    textoDeApoio,
    erro,
    obrigatorio = false,
    textoDeObrigatoriedade,
    className,
  } = props

  const idDoApoio = `${id}-apoio`
  const idDoErro = `${id}-erro`
  const descritoPor =
    juntarClasses(textoDeApoio ? idDoApoio : undefined, erro ? idDoErro : undefined) || undefined

  const classesDoControle = juntarClasses(CONTROLE, erro ? CONTORNO_COM_ERRO : CONTORNO_NORMAL)

  const compartilhado = {
    id,
    className: classesDoControle,
    required: obrigatorio,
    'aria-invalid': erro ? true : undefined,
    'aria-describedby': descritoPor,
  } as const

  // O controle é montado fora do JSX porque cada ramo da união descarta um
  // conjunto diferente de propriedades antes de repassar o resto ao elemento.
  const controle =
    props.tipo === 'textarea'
      ? (() => {
          const {
            id: _id,
            rotulo: _rotulo,
            tipo: _tipo,
            textoDeApoio: _apoio,
            erro: _erro,
            obrigatorio: _obrigatorio,
            textoDeObrigatoriedade: _textoObrigatorio,
            className: _className,
            linhas,
            ...resto
          } = props
          return <textarea {...compartilhado} rows={linhas} {...resto} />
        })()
      : (() => {
          const {
            id: _id,
            rotulo: _rotulo,
            tipo,
            textoDeApoio: _apoio,
            erro: _erro,
            obrigatorio: _obrigatorio,
            textoDeObrigatoriedade: _textoObrigatorio,
            className: _className,
            linhas: _linhas,
            ...resto
          } = props
          return <input type={tipo ?? 'text'} {...compartilhado} {...resto} />
        })()

  return (
    <div className={juntarClasses('flex flex-col gap-2', className)}>
      <label htmlFor={id} className="text-apoio font-rotulo leading-corpo text-texto-principal">
        {rotulo}
        {obrigatorio && textoDeObrigatoriedade ? (
          <span className="text-texto-secundario"> {textoDeObrigatoriedade}</span>
        ) : null}
      </label>

      {/* 13.6 regra 3 — instrução ANTES do campo, nunca depois. */}
      {textoDeApoio ? (
        <p id={idDoApoio} className="text-apoio leading-corpo text-texto-secundario">
          {textoDeApoio}
        </p>
      ) : null}

      {controle}

      {/* 13.6 regra 5 — erro em texto, junto ao campo, anunciado por tecnologia assistiva. */}
      {erro ? (
        <p
          id={idDoErro}
          role="alert"
          className="flex items-start gap-entre-alvos text-apoio leading-corpo text-erro"
        >
          <IconeDeErro />
          <span>{erro}</span>
        </p>
      ) : null}
    </div>
  )
}
