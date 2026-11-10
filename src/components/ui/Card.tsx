/**
 * Primitivo de card — base do card de produto do catálogo (P-03).
 * Visual: 11.12 (superfície elevada e borda), 11.15 (raio de bloco, borda de
 *         1 px, SEM SOMBRA), 11.7 (respiro)
 * Acessibilidade: 13.9 (o card inteiro é o alvo, sem link menor aninhado dentro)
 * Dono: Onda 2a
 *
 * ELEVAÇÃO SEM SOMBRA (11.15). Card, cabeçalho, rodapé e seção nunca recebem
 * sombra: estão no mesmo plano da página e se separam do fundo pela superfície
 * elevada mais a borda de 1 px. Não existe propriedade de sombra aqui, e
 * `tailwind.config.ts` não registra token de sombra — a ausência é o
 * mecanismo, não a disciplina.
 *
 * CARD ACIONÁVEL (13.9). Com `href`, o próprio card VIRA o link: não há
 * elemento `<a>` menor dentro dele. É o que impede o erro clássico do card de
 * catálogo — um link "ver detalhes" aninhado num card já clicável, que produz
 * dois alvos sobrepostos e dois anúncios no leitor de tela.
 */

import type { ReactNode } from 'react'

import { juntarClasses } from './juntarClasses'

export type SuperficieDoCard = 'base' | 'elevada'

/** Preenchimento de 16 px em tela pequena e 24 px em tela grande (11.15). */
const BASE = juntarClasses(
  'block rounded-bloco border border-borda',
  'p-card-compacto md:p-card',
)

const POR_SUPERFICIE: Record<SuperficieDoCard, string> = {
  base: 'bg-superficie',
  elevada: 'bg-superficie-elevada',
}

/** Passagem do ponteiro muda a borda, nunca desenha contorno: foco e passagem são distintos (13.2 regra 8). */
const ACIONAVEL = juntarClasses(
  'no-underline text-texto-principal',
  'transition-colors duration-padrao',
  'hover:border-texto-principal',
)

type PropsCompartilhadas = {
  superficie?: SuperficieDoCard
  children: ReactNode
  className?: string
}

type PropsEstatico = PropsCompartilhadas & {
  /** Elemento do card quando ele não é acionável. `li` para item de lista de catálogo. */
  como?: 'div' | 'article' | 'li'
  href?: undefined
}

type PropsAcionavel = PropsCompartilhadas & {
  como?: undefined
  /** Presente ⇒ o card inteiro é o link. Construa o caminho com `src/lib/rotas.ts`. */
  href: string
  /**
   * Rótulo acessível quando o texto visível do card não descreve sozinho o
   * destino (14.1: o rótulo descreve o resultado). Vem de quem monta a
   * página — nunca fica fixo aqui (RNF-074).
   */
  rotuloAcessivel?: string
}

export type PropsDoCard = PropsEstatico | PropsAcionavel

export const Card = (props: PropsDoCard) => {
  const { superficie = 'elevada', children, className } = props
  const classes = juntarClasses(BASE, POR_SUPERFICIE[superficie], className)

  if (props.href !== undefined) {
    return (
      <a href={props.href} aria-label={props.rotuloAcessivel} className={juntarClasses(classes, ACIONAVEL)}>
        {children}
      </a>
    )
  }

  const Elemento = props.como ?? 'div'
  return <Elemento className={classes}>{children}</Elemento>
}
