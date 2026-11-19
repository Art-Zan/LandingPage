/**
 * Composição angular — figura decorativa da primeira dobra.
 * Visual: 11.11 (o ápice do "A" do monograma: só segmentos retos e vértices
 *   agudos, nenhuma curva), 11.15 (preenchimento sólido de token, borda de
 *   1 px, nenhum gradiente, nenhuma sombra), 11.13 (troca de tema por token)
 * Acessibilidade: 13.4 (decorativa: `aria-hidden`, sem texto alternativo)
 * Perguntas abertas que afetam este arquivo: Q-005 (enquanto não existir
 *   captura de tela real, a primeira dobra não tem imagem de produto — esta
 *   figura ocupa o lugar sem fingir ser produto), Q-077/Q-078 (o monograma
 *   NÃO é redesenhado aqui: a figura repete só o ângulo do ápice, nunca a
 *   forma do logotipo)
 * Dono: Restyle (2026-11-10), território de src/components/ui
 *
 * Nove ápices concêntricos em traço de 1 px na cor da borda; uma faixa
 * sólida na tinta do tema entre o quarto e o quinto. Não é ilustração de
 * produto, não carrega texto e não é dado de negócio.
 */

import { juntarClasses } from './juntarClasses'

const BASE = 500
const CENTRO = 320
const INCLINACAO = 0.55
const APICES = Array.from({ length: 9 }, (_, i) => 20 + i * 52)

const perna = (apice: number) => INCLINACAO * (BASE - apice)

const pontosDoApice = (apice: number) =>
  `${CENTRO - perna(apice)},${BASE} ${CENTRO},${apice} ${CENTRO + perna(apice)},${BASE}`

/** Faixa sólida entre dois ápices consecutivos (polígono fechado). */
const pontosDaFaixa = (externo: number, interno: number) =>
  [
    `${CENTRO - perna(externo)},${BASE}`,
    `${CENTRO},${externo}`,
    `${CENTRO + perna(externo)},${BASE}`,
    `${CENTRO + perna(interno)},${BASE}`,
    `${CENTRO},${interno}`,
    `${CENTRO - perna(interno)},${BASE}`,
  ].join(' ')

export type PropsDaComposicaoAngular = {
  className?: string
}

export const ComposicaoAngular = ({ className }: PropsDaComposicaoAngular) => (
  <svg
    viewBox="0 0 640 520"
    preserveAspectRatio="xMidYMax meet"
    aria-hidden="true"
    focusable="false"
    className={juntarClasses('block h-auto w-full', className)}
  >
    <polygon points={pontosDaFaixa(APICES[3]!, APICES[4]!)} className="fill-texto-principal" />
    {APICES.map((apice) => (
      <polyline
        key={apice}
        points={pontosDoApice(apice)}
        className="fill-none stroke-borda"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="miter"
      />
    ))}
    <line
      x1="0"
      y1={BASE}
      x2="640"
      y2={BASE}
      className="stroke-borda"
      strokeWidth="1"
      vectorEffect="non-scaling-stroke"
    />
  </svg>
)
