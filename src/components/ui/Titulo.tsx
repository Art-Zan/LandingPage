/**
 * Primitivo de título, com nível semântico controlado.
 * Visual: 11.14 (escala e pesos), 11.7 (varredura de nível 1)
 * Acessibilidade: 13.5 (hierarquia sem salto de nível) · Descoberta: 12.3
 * Dono: Onda 2a
 *
 * POR QUE `nivel` É OBRIGATÓRIO E SEPARADO DE `visual`.
 * A hierarquia de cabeçalho é requisito de SEO (12.3) e de acessibilidade
 * (13.5), não decoração: um `<h1>` por página, sem salto de nível, porque a
 * navegação por títulos é a forma mais usada de percorrer uma página com
 * leitor de tela. O tamanho, por outro lado, é decisão de layout.
 * Separar as duas coisas é o que impede o erro mais comum do sistema — usar
 * `<h3>` porque "o texto precisa ser menor", quebrando a hierarquia para
 * resolver um problema de tamanho.
 *
 * Não há valor padrão para `nivel`: quem escreve a página precisa declarar
 * onde está na hierarquia. `visual` tem padrão derivado do nível.
 */

import type { ReactNode } from 'react'

import { juntarClasses } from './juntarClasses'

export type NivelDeTitulo = 1 | 2 | 3 | 4 | 5 | 6
export type PesoVisualDeTitulo = 'h1' | 'h2' | 'h3'

/** 11.14 — três degraus de tamanho e peso. H4 a H6 herdam a aparência de H3. */
const POR_PESO_VISUAL: Record<PesoVisualDeTitulo, string> = {
  // Restyle: entrelinha fechada e aperto óptico (tokens.css) no H1 e no H2.
  h1: 'text-h1 font-h1 leading-h1 tracking-titulo',
  h2: 'text-h2 font-h2 tracking-titulo',
  h3: 'text-h3 font-h3',
}

const PADRAO_POR_NIVEL: Record<NivelDeTitulo, PesoVisualDeTitulo> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h3',
  5: 'h3',
  6: 'h3',
}

export type PropsDoTitulo = {
  /** Posição na hierarquia da página. Nunca escolhido por tamanho. */
  nivel: NivelDeTitulo
  /** Aparência, quando ela precisa divergir do nível. */
  visual?: PesoVisualDeTitulo
  /** Necessário quando o título rotula uma seção via `aria-labelledby` (13.5). */
  id?: string
  children: ReactNode
  className?: string
}

export const Titulo = ({ nivel, visual, id, children, className }: PropsDoTitulo) => {
  const Elemento = `h${nivel}` as const

  return (
    <Elemento
      id={id}
      className={juntarClasses(
        'font-titulo leading-titulo text-texto-principal text-balance [overflow-wrap:anywhere]',
        POR_PESO_VISUAL[visual ?? PADRAO_POR_NIVEL[nivel]],
        className,
      )}
    >
      {children}
    </Elemento>
  )
}
