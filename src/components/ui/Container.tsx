/**
 * Primitivo de largura — centraliza o conteúdo e dá a margem lateral única.
 * Visual: 11.15 (respiro na escala de 8 px) · Acessibilidade: 13.8 (refluxo a 320 px)
 * Responsividade: 10.1 (mobile-first, referência mínima de 360 px)
 * Dono: Onda 2a
 *
 * Existe para que a margem lateral seja decidida UMA vez. Sem ele, cada
 * template escolhe o seu preenchimento e o site perde o alinhamento vertical
 * entre cabeçalho, seções e rodapé — exatamente o que RNF-072 evita.
 */

import type { ReactNode } from 'react'

import { juntarClasses } from './juntarClasses'

export type PropsDoContainer = {
  /** `div` por padrão; `header`, `footer` e `main` quando o container É o marco. */
  como?: 'div' | 'header' | 'footer' | 'main' | 'nav'
  children: ReactNode
  className?: string
  id?: string
}

export const Container = ({ como: Elemento = 'div', children, className, id }: PropsDoContainer) => (
  <Elemento
    id={id}
    className={juntarClasses(
      'mx-auto w-full max-w-conteudo px-card-compacto md:px-card',
      className,
    )}
  >
    {children}
  </Elemento>
)
