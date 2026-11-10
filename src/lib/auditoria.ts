// Dono: Onda 2b
//
// Trilha de auditoria no nível de ação — RF-192, RNF-046, RF-186.
// Registra O QUÊ, QUEM e QUANDO em toda criação, alteração, publicação,
// despublicação e exclusão. O histórico campo a campo com texto anterior
// recuperável é RNF-077, classificado Fase 2, e NÃO é feito aqui.
//
// A INTERFACE de consulta é etapa 2 (P-19..P-22). Isto é o registro.

import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { lerPropriedade } from './campos-payload'
import { SLUG_REGISTROS_DE_AUDITORIA } from './slugs'

export const ACOES_DE_AUDITORIA = [
  'criacao',
  'atualizacao',
  'publicacao',
  'despublicacao',
  'exclusao',
] as const

export type AcaoDeAuditoria = (typeof ACOES_DE_AUDITORIA)[number]

const PUBLICADO = 'published'

/** Identificação legível do registro afetado, sem depender de qual coleção é. */
const identificar = (documento: unknown): string => {
  for (const chave of ['nome', 'titulo', 'filename', 'slug']) {
    const valor = lerPropriedade(documento, chave)
    if (typeof valor === 'string' && valor.trim() !== '') return valor
  }
  return String(lerPropriedade(documento, 'id') ?? 'sem identificação')
}

const classificar = (documento: unknown, anterior: unknown, operacao: string): AcaoDeAuditoria => {
  if (operacao === 'create') return 'criacao'
  const estadoAtual = lerPropriedade(documento, '_status')
  const estadoAnterior = lerPropriedade(anterior, '_status')
  if (estadoAtual === PUBLICADO && estadoAnterior !== PUBLICADO) return 'publicacao'
  if (estadoAnterior === PUBLICADO && estadoAtual !== PUBLICADO) return 'despublicacao'
  return 'atualizacao'
}

type ArgumentosDeRegistro = {
  acao: AcaoDeAuditoria
  colecao: string
  documento: unknown
  // `req` do Payload; tipado no ponto de uso pelos hooks abaixo.
  req: Parameters<CollectionAfterChangeHook>[0]['req']
}

const gravar = async ({ acao, colecao, documento, req }: ArgumentosDeRegistro): Promise<void> => {
  try {
    await req.payload.create({
      collection: SLUG_REGISTROS_DE_AUDITORIA,
      data: {
        acao,
        autor: req.user?.id ?? null,
        colecao,
        documentoId: String(lerPropriedade(documento, 'id') ?? ''),
        registro: identificar(documento),
      },
      // Compartilha a transação da própria alteração (RF-186): ou a alteração e
      // seu registro entram juntos, ou nenhum dos dois entra.
      req,
    })
  } catch (erro) {
    req.payload.logger.error(
      { colecao, erro },
      'Falha ao gravar registro de auditoria (RF-192).',
    )
  }
}

export const registrarAlteracao: CollectionAfterChangeHook = async ({
  collection,
  doc,
  operation,
  previousDoc,
  req,
}) => {
  await gravar({
    acao: classificar(doc, previousDoc, operation),
    colecao: collection.slug,
    documento: doc,
    req,
  })
  return doc
}

export const registrarExclusao: CollectionAfterDeleteHook = async ({ collection, doc, req }) => {
  await gravar({ acao: 'exclusao', colecao: collection.slug, documento: doc, req })
  return doc
}

/** Conjunto de hooks aplicado a toda coleção auditada. */
export const hooksDeAuditoria = {
  afterChange: [registrarAlteracao],
  afterDelete: [registrarExclusao],
}
