/**
 * Mapa do site.
 * Implementa: RF-163 (gerado a partir dos registros publicados, nunca
 *   mantido à mão; regenerado a cada publicação/despublicação porque é
 *   calculado na resposta, não em arquivo estático), RF-172 (utilitárias e
 *   não indexáveis ficam de fora), RNF-083 (reserva de inglês)
 * Modelo: 12.5 (sitemap, robots e canonical)
 * Perguntas abertas que afetam este arquivo:
 *   Q-006 — nenhuma solução composta existe; `/solucoes` e abaixo não têm
 *     rota (dev/CONVENCOES.md §4.3) e por isso não podem entrar aqui.
 *   Q-025 / D-05 — `/parceiros` só entra com ao menos um parceiro publicado
 *     e autorizado; a mesma consulta de `(site)/layout.tsx` decide.
 *   D-16 — `/privacidade` e `/termos` só entram quando existir o registro
 *     institucional PUBLICADO com `indexavel: true`; enquanto o texto
 *     jurídico não existir, a trava de placeholder em produção
 *     (dev/CONVENCOES.md §7.4) impede a publicação, e este arquivo nunca
 *     precisa adivinhar o estado — ele só lê o que já está publicado.
 * Dono: Onda 3a
 *
 * TRAVA 3 DE dev/CONVENCOES.md §5.3: toda URL sai de `IDIOMA_PADRAO`
 * ('pt-BR'), o único elemento de `IDIOMAS_PUBLICADOS` (src/lib/rotas.ts).
 * Nenhum `hreflang`/`alternates` é emitido — não existe função de sitemap do
 * Next para isso além de `alternates.languages`, que simplesmente não é
 * preenchido aqui. Enquanto o inglês estiver desligado, um segundo idioma
 * neste arquivo seria uma entrada que responde 404.
 *
 * `/` e `/produtos` E `/contato` SÃO ROTAS ESTRUTURAIS, não gated por um
 * registro do CMS: existem em código desde a etapa 1 (P-01, P-03, P-08 são
 * piso inegociável de 16.9) e nunca dependem de uma "página institucional"
 * ter sido publicada para responder. As demais páginas institucionais
 * (`/sobre`, `/privacidade`, `/termos`) SÃO gated pelo próprio registro:
 * só entram quando publicadas e marcadas indexáveis.
 *
 * SÓ OS SLUGS DE `PAGINAS_INSTITUCIONAIS_CONHECIDAS` VIRAM ENDEREÇO. Um slug
 * institucional fora desta lista (por exemplo, um rascunho de FAQ em Fase 2)
 * não é adivinhado como rota: sem endereço conhecido em `src/lib/rotas.ts`
 * para ele, ele fica de fora — o comportamento seguro é omitir, nunca
 * inventar caminho.
 */

import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'

import config from '@payload-config'

import { permiteIndexacao } from '@/lib/env'
import { listarParceirosPublicados, listarProdutosPublicados } from '@/lib/consultas'
import { IDIOMA_PADRAO, montarUrlAbsoluta, ROTAS } from '@/lib/rotas'
import { SLUG_PAGINAS_INSTITUCIONAIS } from '@/lib/slugs'

const LOCALE_PUBLICO = IDIOMA_PADRAO

const PAGINAS_INSTITUCIONAIS_CONHECIDAS: ReadonlyArray<{
  slug: string
  caminho: () => string
}> = [
  { slug: 'sobre', caminho: () => ROTAS.sobre(LOCALE_PUBLICO) },
  { slug: 'privacidade', caminho: () => ROTAS.privacidade(LOCALE_PUBLICO) },
  { slug: 'termos', caminho: () => ROTAS.termos(LOCALE_PUBLICO) },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // RF-164 — homologação inteira é não indexável: o mapa não anuncia nada.
  if (!permiteIndexacao()) return []

  const entradas: MetadataRoute.Sitemap = [
    { url: montarUrlAbsoluta(LOCALE_PUBLICO), changeFrequency: 'monthly' },
    { url: montarUrlAbsoluta(LOCALE_PUBLICO, 'produtos'), changeFrequency: 'weekly' },
    { url: montarUrlAbsoluta(LOCALE_PUBLICO, 'contato'), changeFrequency: 'yearly' },
  ]

  const produtos = await listarProdutosPublicados()
  for (const produto of produtos) {
    entradas.push({
      url: montarUrlAbsoluta(LOCALE_PUBLICO, 'produtos', produto.slug),
      lastModified: new Date(produto.updatedAt),
      changeFrequency: 'monthly',
    })
  }

  // Q-025 / D-05 — mesma regra de "Parceiros" no menu: só entra publicado.
  const parceiros = await listarParceirosPublicados()
  if (parceiros.length > 0) {
    entradas.push({
      url: montarUrlAbsoluta(LOCALE_PUBLICO, 'parceiros'),
      changeFrequency: 'monthly',
    })
  }

  // Leitura direta e local: `src/lib/consultas.ts` (Onda 3b) só expõe busca
  // por slug único, não uma listagem de todas as páginas indexáveis. A
  // trava de locale explícito (§5.3) é respeitada aqui do mesmo jeito.
  const payload = await getPayload({ config })
  const paginas = await payload.find({
    collection: SLUG_PAGINAS_INSTITUCIONAIS,
    locale: LOCALE_PUBLICO,
    draft: false,
    overrideAccess: false,
    depth: 0,
    pagination: false,
    where: {
      and: [{ indexavel: { equals: true } }, { _status: { equals: 'published' } }],
    },
  })

  for (const pagina of paginas.docs) {
    const conhecida = PAGINAS_INSTITUCIONAIS_CONHECIDAS.find((item) => item.slug === pagina.slug)
    if (!conhecida) continue
    entradas.push({ url: conhecida.caminho(), lastModified: new Date(pagina.updatedAt) })
  }

  return entradas
}
