/**
 * Fundo da capa — imagem cheia, com direção de arte por orientação, e véu.
 * Visual: 11.12 (véu = superfície escura de 11.12, opacidade fixa de token;
 *   contraste do texto medido no pior caso por verificar-contraste.mjs),
 *   11.15 (véu sólido, nenhum gradiente; a imagem é feita de facetas sólidas)
 * Desempenho: RNF-011/RNF-012 (webp ≤ 200 KB por arquivo, pré-gerado em três
 *   larguras por orientação), LCP (sem carga diferida, prioridade alta e
 *   pré-carga só da orientação que a tela vai usar)
 * Acessibilidade: 13.4 (decorativa: alternativo vazio e fora da árvore de
 *   acessibilidade), 13.11 (nenhum texto dentro da imagem)
 * Perguntas abertas que afetam este arquivo: Q-005 (não há imagem própria —
 *   a composição é PROVISÓRIA, ver src/lib/ativos-visuais.ts)
 * Dono: Onda 5 (2026-11-13), território de src/components/ui
 *
 * `getImageProps` (next/image) monta o `srcset` com um carregador próprio
 * que aponta para os arquivos JÁ gerados em `public/capa/` — o otimizador
 * do Next não reprocessa uma imagem que já sai no peso e no formato certos.
 * `<picture>` escolhe retrato até 767 px e paisagem acima: em tela de
 * celular de pé, recortar a paisagem jogaria fora 3/4 da composição.
 */

import { getImageProps, type ImageLoader } from 'next/image'
import { preload } from 'react-dom'

import {
  ARQUIVO_DA_CAPA,
  arquivoDaCapaPara,
  LARGURAS_DA_CAPA,
  type OrientacaoDaCapa,
} from '@/lib/ativos-visuais'

const carregadorPara =
  (orientacao: OrientacaoDaCapa): ImageLoader =>
  ({ width }) =>
    arquivoDaCapaPara(orientacao, width)

const MIDIA_RETRATO = '(max-width: 47.99rem)'
const MIDIA_PAISAGEM = '(min-width: 48rem)'
const TAMANHOS = '100vw'

const propsDa = (orientacao: OrientacaoDaCapa) => {
  const larguras = LARGURAS_DA_CAPA[orientacao]
  return getImageProps({
    src: ARQUIVO_DA_CAPA(orientacao, larguras[larguras.length - 1]!),
    alt: '',
    fill: true,
    sizes: TAMANHOS,
    priority: true,
    fetchPriority: 'high',
    loader: carregadorPara(orientacao),
  }).props
}

export const FundoDeCapa = () => {
  const retrato = propsDa('retrato')
  const paisagem = propsDa('paisagem')

  // LCP: pré-carga da imagem da orientação em uso, com a mesma consulta de
  // mídia do `<source>` — a outra nunca é baixada.
  for (const [props, media] of [
    [retrato, MIDIA_RETRATO],
    [paisagem, MIDIA_PAISAGEM],
  ] as const) {
    preload(props.src, {
      as: 'image',
      imageSrcSet: props.srcSet,
      imageSizes: TAMANHOS,
      fetchPriority: 'high',
      media,
    })
  }

  return (
    <div aria-hidden="true" className="az-capa__fundo">
      <div className="az-capa__paralaxe">
        <picture className="az-capa__imagem">
          <source media={MIDIA_RETRATO} srcSet={retrato.srcSet} sizes={TAMANHOS} />
          {/* eslint-disable-next-line jsx-a11y/alt-text -- alt="" vem de getImageProps */}
          <img {...paisagem} />
        </picture>
      </div>
      <div className="az-capa__veu" />
    </div>
  )
}
