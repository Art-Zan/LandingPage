/**
 * Texto de título preparado para a entrada da primeira dobra.
 * Visual: 13.10 (movimento curto, desligado sob movimento reduzido)
 * Dono: Restyle (2026-11-10), território de src/components/ui
 *
 * Envolve o texto do H1 numa máscara: dentro de `.hero[data-enter]` com
 * `html.m-enter`, o título sobe de dentro dela uma vez na carga
 * (globals.css). Fora disso, é texto comum.
 */

import type { ReactNode } from 'react'

export const TextoDeEntrada = ({ children }: { children: ReactNode }) => (
  <span className="az-entrada-mascara">
    <span className="az-entrada-titulo">{children}</span>
  </span>
)
