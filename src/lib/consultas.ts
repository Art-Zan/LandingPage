// Dono: Onda 3b
//
// Leitura do conteúdo pelo site público. É o ÚNICO lugar desta onda que fala com
// o Payload, e existe por três razões que são requisitos, não conveniência:
//
//  1. **Trava 2 de dev/CONVENCOES.md §5.3** — toda consulta passa `locale: 'pt-BR'`
//     EXPLÍCITO. Nenhuma usa `locale: 'all'`. Com um único ponto de leitura, a
//     trava é verificável por inspeção deste arquivo, e não por disciplina
//     espalhada por template.
//  2. **RF-147 / RF-070** — rascunho nunca é acessível publicamente. Duas
//     proteções independentes: `overrideAccess: false`, que aplica
//     `leituraSomenteDoPublicado` como visitante anônimo, e o filtro explícito
//     por `_status`. Uma sozinha bastaria; as duas juntas sobrevivem a alguém
//     mexer na outra.
//  3. **RF-040 / RF-186** — nenhuma listagem é lista fixa mantida à mão.
//
// Implementa (parcialmente): RF-022, RF-025, RF-040, RF-049, RF-065, RF-066,
//   RF-140, RF-147, RNF-082 (o que fica DESLIGADO — ver nota no fim do arquivo)
// Perguntas abertas que afetam este arquivo: Q-006 (nenhuma solução publicada),
//   Q-025 (nenhum parceiro autorizado), Q-023 (gatilhos de 6.6 não atingidos)

import { getPayload } from 'payload'

import config from '@payload-config'

import type {
  ConfiguracaoDoSite,
  PaginasInstitucionai,
  Parceiro,
  Produto,
} from '@/payload-types'

import { IDIOMA_PADRAO } from './rotas'
import {
  SLUG_PAGINAS_INSTITUCIONAIS,
  SLUG_PARCEIROS,
  SLUG_PRODUTOS,
} from './slugs'

/**
 * Idioma de toda leitura pública. É o `IDIOMA_PADRAO` do construtor de rotas —
 * a mesma constante, para que a camada de conteúdo e a camada de endereço não
 * possam divergir (CONVENCOES.md §5.3, travas 2 e 4).
 */
const LOCALE_PUBLICO = IDIOMA_PADRAO

/** Somente registros publicados. Rascunho responde como inexistente (RF-070). */
const SOMENTE_PUBLICADO = { _status: { equals: 'published' } } as const

/**
 * Slugs das páginas institucionais que os templates desta onda leem.
 * São registros que a Onda 4 precisa criar: sem eles, a seção correspondente é
 * omitida — nunca substituída por texto de preenchimento (princípio 2 de 2.8).
 */
export const SLUG_DA_PAGINA_INICIAL = 'inicio'
export const SLUG_DA_PAGINA_SOBRE = 'sobre'
export const SLUG_DA_PAGINA_DO_CATALOGO = 'catalogo'
/**
 * Slug institucional da introdução opcional de P-07 (RF-100: "precedidos de
 * introdução sobre o papel das parcerias"). Acrescentado pela Onda 4b junto
 * com `src/app/(site)/parceiros/`, seguindo o mesmo padrão das três
 * constantes acima (Onda 3b). Sem registro publicado com este slug, a
 * introdução é omitida — a listagem de parceiros não depende dela.
 */
export const SLUG_DA_PAGINA_DE_PARCEIROS = 'parceiros'

const obterPayload = async () => getPayload({ config })

/** Página institucional publicada, por slug. `null` quando não existe. */
export const obterPaginaInstitucional = async (
  slug: string,
): Promise<PaginasInstitucionai | null> => {
  const payload = await obterPayload()
  const resultado = await payload.find({
    collection: SLUG_PAGINAS_INSTITUCIONAIS,
    locale: LOCALE_PUBLICO,
    draft: false,
    overrideAccess: false,
    depth: 1,
    limit: 1,
    pagination: false,
    where: { and: [{ slug: { equals: slug } }, SOMENTE_PUBLICADO] },
  })
  return resultado.docs[0] ?? null
}

/**
 * Todos os produtos publicados, em grade uniforme (RF-040).
 * Ordem estável e não aleatória: `ordemDeDestaque` quando informada, e o nome
 * como desempate determinístico.
 */
export const listarProdutosPublicados = async (): Promise<Produto[]> => {
  const payload = await obterPayload()
  const resultado = await payload.find({
    collection: SLUG_PRODUTOS,
    locale: LOCALE_PUBLICO,
    draft: false,
    overrideAccess: false,
    depth: 1,
    pagination: false,
    sort: ['ordemDeDestaque', 'nome'],
    where: SOMENTE_PUBLICADO,
  })
  return resultado.docs
}

/**
 * Produtos marcados como destaque na inicial (RF-022), até o limite pedido.
 * Produto despublicado desaparece do bloco sem edição manual, porque o filtro é
 * de estado, não de lista.
 */
export const listarProdutosEmDestaque = async (limite: number): Promise<Produto[]> => {
  const payload = await obterPayload()
  const resultado = await payload.find({
    collection: SLUG_PRODUTOS,
    locale: LOCALE_PUBLICO,
    draft: false,
    overrideAccess: false,
    depth: 1,
    limit: limite,
    sort: ['ordemDeDestaque', 'nome'],
    where: { and: [{ destaqueNaInicial: { equals: true } }, SOMENTE_PUBLICADO] },
  })
  return resultado.docs
}

/** Produto publicado por slug. `null` quando não existe ou é rascunho (RF-070). */
export const obterProdutoPorSlug = async (slug: string): Promise<Produto | null> => {
  const payload = await obterPayload()
  const resultado = await payload.find({
    collection: SLUG_PRODUTOS,
    locale: LOCALE_PUBLICO,
    draft: false,
    overrideAccess: false,
    depth: 2,
    limit: 1,
    pagination: false,
    where: { and: [{ slug: { equals: slug } }, SOMENTE_PUBLICADO] },
  })
  return resultado.docs[0] ?? null
}

/**
 * Parceiros publicados **e com autorização de marca registrada** (RF-025, RF-103,
 * PR-018). A autorização é filtrada aqui, na leitura, além de ser exigida na
 * gravação por `exigirAutorizacaoDeMarca`: a faixa da inicial não pode depender de
 * uma trava só.
 *
 * O cenário esperado no lançamento é lista vazia (Q-025, Q-054) — e o resultado
 * vazio faz a seção inteira desaparecer, sem logo genérico nem "em breve".
 */
export const listarParceirosPublicados = async (): Promise<Parceiro[]> => {
  const payload = await obterPayload()
  const resultado = await payload.find({
    collection: SLUG_PARCEIROS,
    locale: LOCALE_PUBLICO,
    draft: false,
    overrideAccess: false,
    depth: 1,
    pagination: false,
    sort: ['ordem', 'nome'],
    where: {
      and: [
        SOMENTE_PUBLICADO,
        { 'autorizacaoDeUsoDeMarca.autorizada': { equals: true } },
      ],
    },
  })
  return resultado.docs
}

/**
 * Configuração do site. Fonte única do texto padrão de contratação exibido igual
 * em TODAS as páginas de produto (RF-065). Nasce vazia: o texto é dado de negócio
 * e não é inventado por agente — vazio omite a frase, nunca a substitui.
 */
export const obterConfiguracaoDoSite = async (): Promise<ConfiguracaoDoSite> => {
  const payload = await obterPayload()
  return payload.findGlobal({
    slug: 'configuracao-do-site',
    locale: LOCALE_PUBLICO,
    overrideAccess: false,
    depth: 0,
  })
}

// ---------------------------------------------------------------------------
// O QUE ESTE ARQUIVO NÃO OFERECE, E POR QUÊ (RNF-082, 6.6, CONVENCOES.md §8.10).
//
// Não existe função de filtro, busca, ordenação escolhida pelo visitante,
// agrupamento por categoria ou paginação. Não como esqueleto, não desligada por
// bandeira, não comentada: **não existe**. Quatro produtos ficam abaixo de TODOS
// os gatilhos de 6.6 (agrupamento em 7, filtro em 10 produtos ou 4 categorias,
// busca em 15). O mecanismo vive no MODELO — `Categorias.visivelPublicamente`,
// `Categorias.ordemDeExibicao`, a relação N:N em `Produtos.categorias` — e ligá-lo
// será decisão editorial mais uma consulta nova aqui, não migração de dados nem
// alteração de template (RF-048).
//
// `sort` fixo NÃO é ordenação no sentido de 6.6: é a ordem padrão estável exigida
// por RF-040 ("nunca aleatória entre carregamentos"), sem controle na interface.
// ---------------------------------------------------------------------------
