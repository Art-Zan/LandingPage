/**
 * Rota de revisão visual dos primitivos de `src/components/ui/`.
 * Não implementa nenhum RF/P-xx do PRD: é instrumento interno de conferência,
 * não superfície do site (ver comentário de topo de `GaleriaDePrimitivos.tsx`,
 * Onda 2a, que lista as quatro condições que este arquivo satisfaz).
 * Dono: Onda 3a
 *
 * AS QUATRO CONDIÇÕES, E ONDE CADA UMA É SATISFEITA AQUI:
 *  1. Vive em `(dev)`, fora de `(site)` — grupo irmão, sem `layout.tsx`
 *     próprio, então cai direto no layout raiz (`src/app/layout.tsx`) e
 *     nunca herda cabeçalho/rodapé do shell público.
 *  2. `metadata.robots` abaixo — `index: false, follow: false`.
 *  3. Não é referenciada por nenhum menu (`src/components/layout/navegacao.ts`
 *     não a cita) nem por `src/app/sitemap.ts` (que só varre produtos,
 *     páginas institucionais conhecidas e as rotas estruturais do site).
 *  4. `notFound()` quando `ehProducao()` — lido por `src/lib/env.ts`, único
 *     ponto do código autorizado a ler `process.env` para configuração.
 *
 * `GaleriaDePrimitivos` é importada pelo CAMINHO DO ARQUIVO, e não por
 * `@/components/ui`, porque `src/components/ui/index.ts` deliberadamente não
 * a reexporta ("ela não é primitivo e não deve ser importada por nenhuma
 * página do site").
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { GaleriaDePrimitivos } from '@/components/ui/demonstracao/GaleriaDePrimitivos'
import { ehProducao } from '@/lib/env'

export const metadata: Metadata = {
  title: 'Revisão de primitivos',
  robots: { index: false, follow: false },
}

export default function PaginaDeRevisaoDosPrimitivos() {
  if (ehProducao()) notFound()

  return <GaleriaDePrimitivos />
}
