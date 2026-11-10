/**
 * Primitivo de seção — ritmo vertical e região identificada.
 * Visual: 11.15 (64 px entre seções), 11.7 (uma ideia por seção)
 * Acessibilidade: 13.5 (regiões declaradas e rotuladas)
 * Dono: Onda 2a
 *
 * O RITMO É 64 px ENTRE SEÇÕES (11.15), e é assim que ele é obtido: cada
 * seção leva 32 px de preenchimento acima e abaixo, de modo que duas seções
 * vizinhas somam exatamente 64 px. Usar 64 px em cada uma daria 128 px, que
 * não é o valor do PRD — é o erro que este primitivo existe para não deixar
 * acontecer em cada template.
 *
 * `rotuladaPor` recebe o `id` do título da seção. Uma seção sem nome
 * acessível não é uma região útil para quem navega por marcos (13.5 regra 3):
 * por isso o rótulo é uma propriedade explícita e não um detalhe opcional
 * escondido no `className`.
 */

import type { ReactNode } from 'react'

import { juntarClasses } from './juntarClasses'

export type SuperficieDaSecao = 'base' | 'elevada'

const POR_SUPERFICIE: Record<SuperficieDaSecao, string> = {
  base: 'bg-superficie',
  elevada: 'bg-superficie-elevada',
}

export type PropsDaSecao = {
  /** `id` do `Titulo` que nomeia a seção. Vira `aria-labelledby`. */
  rotuladaPor?: string
  /** Nome acessível em texto, quando a seção não tem título visível. */
  rotulo?: string
  superficie?: SuperficieDaSecao
  id?: string
  children: ReactNode
  className?: string
}

export const Secao = ({
  rotuladaPor,
  rotulo,
  superficie = 'base',
  id,
  children,
  className,
}: PropsDaSecao) => (
  <section
    id={id}
    aria-labelledby={rotuladaPor}
    aria-label={rotuladaPor ? undefined : rotulo}
    className={juntarClasses('py-secao-meio', POR_SUPERFICIE[superficie], className)}
  >
    {children}
  </section>
)
