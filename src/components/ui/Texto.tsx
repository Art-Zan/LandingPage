/**
 * Primitivo de texto corrido e de apoio.
 * Visual: 11.14 (corpo de 16 px, apoio de 14 px), 11.7 (densidade)
 * Acessibilidade: 13.8 (altura de linha 1,5; largura de 60–75 caracteres;
 *                 alinhamento à esquerda; sem caixa alta em bloco de texto)
 * Dono: Onda 2a
 *
 * `limitarLargura` existe porque a regra de 13.8 é fácil de esquecer: numa
 * tela larga, um parágrafo sem limite ocupa a largura inteira do contêiner e
 * o olho perde o retorno da linha. Ele fica LIGADO por padrão em texto
 * corrido, e quem precisar de largura total desliga explicitamente.
 */

import type { ReactNode } from 'react'

import { juntarClasses } from './juntarClasses'

export type VarianteDeTexto = 'corpo' | 'apoio'
export type TomDeTexto = 'principal' | 'secundario'

const POR_VARIANTE: Record<VarianteDeTexto, string> = {
  corpo: 'text-corpo font-corpo',
  apoio: 'text-apoio font-corpo',
}

const POR_TOM: Record<TomDeTexto, string> = {
  principal: 'text-texto-principal',
  secundario: 'text-texto-secundario',
}

export type PropsDoTexto = {
  variante?: VarianteDeTexto
  tom?: TomDeTexto
  /** `span` para texto dentro de outra frase; `p` para parágrafo. */
  como?: 'p' | 'span' | 'div'
  /** 13.8 — 60 a 75 caracteres no máximo. Ligado por padrão. */
  limitarLargura?: boolean
  id?: string
  children: ReactNode
  className?: string
}

export const Texto = ({
  variante = 'corpo',
  tom = 'principal',
  como: Elemento = 'p',
  limitarLargura = true,
  id,
  children,
  className,
}: PropsDoTexto) => (
  <Elemento
    id={id}
    className={juntarClasses(
      'leading-corpo',
      POR_VARIANTE[variante],
      POR_TOM[tom],
      limitarLargura && Elemento !== 'span' && 'max-w-texto',
      className,
    )}
  >
    {children}
  </Elemento>
)
