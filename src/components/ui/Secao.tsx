/**
 * Primitivo de seção — ritmo vertical e região identificada.
 * Visual: 11.15 (64 px entre seções), 11.7 (uma ideia por seção)
 * Acessibilidade: 13.5 (regiões declaradas e rotuladas), 13.10 (revelação ao
 *   rolar só com script e sem movimento reduzido — Onda 5)
 * Dono: Onda 2a
 *
 * RITMO — RESTYLE (2026-11-10). A Onda 2a lia "64 px entre seções" (11.15)
 * como valor exato, com 32 px de cada lado. Com seções alternando superfície
 * (base, elevada, escura), a separação entre seções é a troca de fundo, e o
 * espaço de 64 px passou a ser tratado como PISO do respiro interno: cada
 * seção leva `--az-respiro-secao` (64 px em tela pequena, 96 px a partir de
 * 1024 px — os dois da escala de 8 px de 11.15) acima e abaixo. O aperto de
 * 32 px era a principal causa da leitura "modelo pronto" da página.
 *
 * `rotuladaPor` recebe o `id` do título da seção. Uma seção sem nome
 * acessível não é uma região útil para quem navega por marcos (13.5 regra 3):
 * por isso o rótulo é uma propriedade explícita e não um detalhe opcional
 * escondido no `className`.
 */

import type { ReactNode } from 'react'

import { juntarClasses } from './juntarClasses'

export type SuperficieDaSecao = 'base' | 'elevada' | 'escura'

const POR_SUPERFICIE: Record<SuperficieDaSecao, string> = {
  base: 'bg-superficie',
  elevada: 'bg-superficie-elevada',
  // Restyle: coluna escura de 11.12 num trecho da página (tokens.css).
  escura: 'az-faixa-escura',
}

export type PropsDaSecao = {
  /** `id` do `Titulo` que nomeia a seção. Vira `aria-labelledby`. */
  rotuladaPor?: string
  /** Nome acessível em texto, quando a seção não tem título visível. */
  rotulo?: string
  superficie?: SuperficieDaSecao
  id?: string
  /**
   * Restyle — primeira dobra da página: recebe a entrada única na carga
   * (`.hero[data-enter]`, globals.css). Só uma seção por página.
   */
  primeiraDobra?: boolean
  children: ReactNode
  className?: string
}

export const Secao = ({
  rotuladaPor,
  rotulo,
  superficie = 'base',
  id,
  primeiraDobra = false,
  children,
  className,
}: PropsDaSecao) => (
  <section
    id={id}
    aria-labelledby={rotuladaPor}
    aria-label={rotuladaPor ? undefined : rotulo}
    data-enter={primeiraDobra ? '' : undefined}
    // Onda 5 — candidata à revelação ao rolar (RevelarAoRolar.tsx). Só o
    // atributo vazio: o estado oculto nunca vem do servidor (13.10 regra 5).
    // A primeira dobra já tem a entrada própria e fica de fora.
    data-revelar={primeiraDobra ? undefined : ''}
    className={juntarClasses(
      'py-respiro',
      primeiraDobra && 'hero',
      POR_SUPERFICIE[superficie],
      className,
    )}
  >
    {children}
  </section>
)
