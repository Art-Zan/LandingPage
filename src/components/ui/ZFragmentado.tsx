'use client'

/**
 * "Z" do wordmark que se fragmenta aos poucos, se desfaz e volta.
 * Pedido do usuário (2026-11-13). Usado só no nome da capa da inicial.
 *
 * COMO FUNCIONA. A letra real fica no texto (leitor de tela e indexação a
 * leem normalmente). Por cima, doze estilhaços `aria-hidden`, cada um com a
 * mesma letra recortada por `clip-path` num triângulo — os doze juntos
 * cobrem a caixa inteira, sem vão. Em repouso os estilhaços estão ocultos e
 * a letra base aparece; durante a animação a letra base some e cada
 * estilhaço deriva para fora do centro, gira, encolhe, desfoca e some, em
 * cascata, e depois volta ao lugar.
 *
 * QUANDO RODA. Uma vez, depois da entrada da capa; de novo a cada passagem
 * do ponteiro ou toque no nome. Um ciclo dura 4,2 s — abaixo dos 5 s de
 * 13.10 —, nunca em laço. Sob movimento reduzido não roda nunca (e o CSS
 * também desliga, segunda trava). Só transform, opacity e filter animam.
 */

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'

/** Malha de 12 triângulos que cobre a caixa da letra (coordenadas em %). */
const P = {
  A: [0, 0], B: [40, 0], C: [65, 0], D: [100, 0],
  E: [0, 48], F: [35, 40], G: [70, 55], H: [100, 45],
  I: [0, 100], J: [30, 100], K: [60, 100], L: [100, 100],
} as const
type Ponto = keyof typeof P

const TRIANGULOS: [Ponto, Ponto, Ponto][] = [
  ['A', 'B', 'F'], ['A', 'F', 'E'], ['B', 'C', 'F'], ['C', 'G', 'F'],
  ['C', 'D', 'H'], ['C', 'H', 'G'], ['E', 'F', 'J'], ['E', 'J', 'I'],
  ['F', 'G', 'K'], ['F', 'K', 'J'], ['G', 'H', 'L'], ['G', 'L', 'K'],
]

/** Ordem de saída: de cima para baixo, alternando lados — "aos poucos". */
const ORDEM = [4, 0, 5, 2, 1, 3, 10, 7, 11, 6, 8, 9]

const ESTILHACOS = TRIANGULOS.map((tri, indice) => {
  const [cx, cy] = [0, 1].map((k) => tri.reduce((s, p) => s + P[p][k]!, 0) / 3) as [number, number]
  // Deriva para fora do centro; vertical contida (a máscara de entrada da
  // capa recorta acima e abaixo da linha).
  const dx = ((cx - 50) / 50) * 0.55 + (indice % 2 ? 0.12 : -0.08)
  const dy = ((cy - 50) / 50) * 0.14
  const giro = (indice % 3 === 0 ? -1 : 1) * (18 + ((indice * 37) % 40))
  return {
    poligono: `polygon(${tri.map((p) => `${P[p][0]}% ${P[p][1]}%`).join(', ')})`,
    estilo: {
      '--az-z-dx': `${dx.toFixed(3)}em`,
      '--az-z-dy': `${dy.toFixed(3)}em`,
      '--az-z-giro': `${giro}deg`,
      '--az-z-ordem': ORDEM.indexOf(indice),
    } as CSSProperties,
  }
})

/** Atraso da primeira vez: depois que o nome sobe da máscara (globals.css). */
const ATRASO_INICIAL_MS = 1400

export const ZFragmentado = ({ letra, className }: { letra: string; className?: string }) => {
  const [ativo, setAtivo] = useState(false)
  const refRaiz = useRef<HTMLSpanElement>(null)

  const disparar = useCallback(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setAtivo(true)
  }, [])

  useEffect(() => {
    const temporizador = window.setTimeout(disparar, ATRASO_INICIAL_MS)
    return () => window.clearTimeout(temporizador)
  }, [disparar])

  // Replay na passagem do ponteiro / toque sobre o nome inteiro (o pai).
  useEffect(() => {
    const alvo = refRaiz.current?.closest('.az-marca-capa')
    if (!alvo) return
    alvo.addEventListener('pointerenter', disparar)
    alvo.addEventListener('click', disparar)
    return () => {
      alvo.removeEventListener('pointerenter', disparar)
      alvo.removeEventListener('click', disparar)
    }
  }, [disparar])

  return (
    <span
      ref={refRaiz}
      className={`az-z ${className ?? ''}`}
      data-ativo={ativo ? '' : undefined}
      // O último estilhaço a voltar encerra o ciclo; só então pode recomeçar.
      onAnimationEnd={(evento) => {
        if ((evento.target as HTMLElement).dataset.ultimo !== undefined) setAtivo(false)
      }}
    >
      <span className="az-z__base">{letra}</span>
      {ESTILHACOS.map((estilhaco, indice) => (
        <span
          key={indice}
          aria-hidden="true"
          className="az-z__estilhaco"
          data-ultimo={ORDEM[ORDEM.length - 1] === indice ? '' : undefined}
          style={{ ...estilhaco.estilo, clipPath: estilhaco.poligono }}
        >
          {letra}
        </span>
      ))}
    </span>
  )
}
