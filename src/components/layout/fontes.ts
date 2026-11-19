/**
 * Carregamento das duas famílias tipográficas do sistema.
 * Implementa: RNF-014 (máx. 2 famílias, 4 arquivos, 150 KB, texto legível antes
 *             do carregamento), RNF-010 (deslocamento de layout na troca de fonte)
 * Dono: Onda 3a · REBRAND (2026-11-13): famílias trocadas.
 *
 * REBRAND — linguagem visual adaptada do material comercial do MarQGol:
 *   Barlow Condensed (título, caixa alta, condensada) + Barlow (texto corrido).
 *   As duas são SIL OFL. Substituem Space Grotesk e Inter de 11.14 — o PRD
 *   precisa ser revisado em 11.14 para registrar a troca.
 *
 * ORÇAMENTO DE RNF-014, MEDIDO (bytes reais em `public/fonts/`):
 *   barlow-condensed-latin-700-normal.woff2 ...  22.444 B  (título)
 *   barlow-condensed-latin-600-normal.woff2 ...  22.308 B  (sobretítulo, rótulo)
 *   barlow-latin-400-normal.woff2 .............  22.196 B  (corpo)
 *   barlow-latin-600-normal.woff2 .............  22.772 B  (ênfase no corpo)
 *   ---------------------------------------------------------------
 *   2 famílias · 4 arquivos · 89.720 B = 87,6 KB   (teto: 4 arquivos / 150 KB)
 *
 * Barlow não tem versão variável: cada peso é um arquivo. Quatro pesos é o
 * teto de RNF-014, e por isso não existe 800 nem 500. Subconjunto `latin`
 * apenas (U+0000–00FF cobre a acentuação do português, PR-006).
 *
 * Arquivo local e não `next/font/google`: o build não depende de rede.
 */

import localFont from 'next/font/local'

/** Título: condensada, caixa alta, bloco de placar. */
export const fonteDeTitulo = localFont({
  src: [
    {
      path: '../../../public/fonts/barlow-condensed-latin-600-normal.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/barlow-condensed-latin-700-normal.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--az-fonte-titulo',
  fallback: ['Arial Narrow', 'Roboto Condensed', 'system-ui', 'sans-serif'],
  adjustFontFallback: 'Arial',
  preload: true,
})

/** Texto corrido. */
export const fonteDeCorpo = localFont({
  src: [
    {
      path: '../../../public/fonts/barlow-latin-400-normal.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/barlow-latin-600-normal.woff2',
      weight: '600',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--az-fonte-corpo',
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
  adjustFontFallback: 'Arial',
  preload: true,
})

/** Classes que publicam as duas variáveis. Aplicadas UMA vez, no `<html>`. */
export const CLASSES_DE_FONTE = `${fonteDeTitulo.variable} ${fonteDeCorpo.variable}`
