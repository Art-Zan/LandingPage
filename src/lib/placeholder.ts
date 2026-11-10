// Dono: Onda 4c
//
// Detecção de registro provisório (placeholder) PUBLICADO — dev/CONVENCOES.md,
// seção 7.4. É o único lugar que sabe QUAIS coleções combinam o campo
// `placeholder` (src/lib/campos-payload.ts, Onda 2b) com um estado de
// publicação (`_status`), e como enumerar quem viola a trava de produção.
//
// Consumido por `scripts/verificar-placeholder-producao.ts` (parte 1 da trava:
// o build falha e lista cada ofensor). A parte 2 da trava — recusar a
// publicação na origem — já existe e não é deste arquivo: é
// `recusarPlaceholderPublicadoEmProducao` em `src/lib/validacao-publicacao.ts`
// (Onda 2b). Este módulo é só leitura: nunca grava, nunca publica, nunca
// desmarca um registro.
//
// Categoria fica de fora de propósito: não tem `_status` em 6.7 (é regida por
// `visivelPublicamente`, PR-013), então "placeholder publicado" não se aplica
// a ela hoje — confirmado em src/collections/Categorias.ts.

import type { CollectionSlug, Payload } from 'payload'

import {
  SLUG_ITENS_DE_CONTEUDO,
  SLUG_PAGINAS_INSTITUCIONAIS,
  SLUG_PARCEIROS,
  SLUG_PRODUTOS,
  SLUG_SOLUCOES,
} from './slugs'

export type OfensorPlaceholder = {
  colecao: CollectionSlug
  id: number | string
  /** Identificação legível: slug quando existe, senão o título/nome, senão o id. */
  identificador: string
}

/**
 * As cinco coleções de 6.7 que têm rascunho/publicado E o campo `placeholder`
 * ao mesmo tempo — as únicas em que "provisório e publicado" é uma combinação
 * possível de existir no banco. Campo usado para compor o identificador legível
 * de cada uma, na ordem em que a coleção tende a ter (nome | titulo).
 */
const COLECOES_VERIFICADAS: ReadonlyArray<{
  slug: CollectionSlug
  campoDeIdentificacao: 'nome' | 'titulo'
}> = [
  { slug: SLUG_PRODUTOS as CollectionSlug, campoDeIdentificacao: 'nome' },
  { slug: SLUG_SOLUCOES as CollectionSlug, campoDeIdentificacao: 'nome' },
  { slug: SLUG_PARCEIROS as CollectionSlug, campoDeIdentificacao: 'nome' },
  { slug: SLUG_PAGINAS_INSTITUCIONAIS as CollectionSlug, campoDeIdentificacao: 'titulo' },
  { slug: SLUG_ITENS_DE_CONTEUDO as CollectionSlug, campoDeIdentificacao: 'titulo' },
]

const lerCampo = (documento: unknown, chave: string): unknown =>
  typeof documento === 'object' && documento !== null
    ? (documento as Record<string, unknown>)[chave]
    : undefined

/**
 * Enumera todo registro com `placeholder: true` e `_status: 'published'` nas
 * cinco coleções verificadas. Lista vazia = nada a recusar (dev/CONVENCOES.md
 * §7.4: "o build FALHA se existir qualquer registro..." — ausência de
 * registro é a única condição de sucesso).
 *
 * `overrideAccess: true` de propósito: esta verificação roda fora de uma
 * requisição de visitante, no processo de build, e precisa enxergar rascunho
 * e publicado da mesma forma que o painel enxergaria — ela está procurando
 * exatamente o que não deveria existir, não simulando a leitura pública.
 */
export const encontrarPlaceholdersPublicados = async (
  payload: Payload,
): Promise<OfensorPlaceholder[]> => {
  const ofensores: OfensorPlaceholder[] = []

  for (const { slug, campoDeIdentificacao } of COLECOES_VERIFICADAS) {
    const resultado = await payload.find({
      collection: slug,
      depth: 0,
      draft: false,
      overrideAccess: true,
      pagination: false,
      where: {
        and: [{ _status: { equals: 'published' } }, { placeholder: { equals: true } }],
      },
    })

    for (const documento of resultado.docs) {
      const slugDoRegistro = lerCampo(documento, 'slug')
      const titulo = lerCampo(documento, campoDeIdentificacao)
      const identificador =
        (typeof slugDoRegistro === 'string' && slugDoRegistro) ||
        (typeof titulo === 'string' && titulo) ||
        String(lerCampo(documento, 'id') ?? '?')

      ofensores.push({
        colecao: slug,
        id: (lerCampo(documento, 'id') as number | string) ?? '?',
        identificador,
      })
    }
  }

  return ofensores
}
