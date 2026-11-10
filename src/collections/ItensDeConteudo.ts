/**
 * Item de conteúdo
 * Implementa: RF-144, RF-145, RF-147, RF-181, RF-185, RF-186 (modelo apenas)
 * Modelo: 6.7 (Item de conteúdo) · URLs e slug: 6.4 (sem data no endereço), 6.5
 * Premissas: PR-014, PR-015 (índice sem itens não é exibido)
 * Perguntas abertas que afetam este arquivo: Q-027 (produção editorial), Q-011
 * Dono: Onda 2b
 *
 * AS PÁGINAS P-10 e P-11 SÃO FASE 2 (dev/CONVENCOES.md §4.3) — o modelo, não. A
 * distinção é deliberada: rota fora do escopo não significa tabela fora do escopo.
 * Nada aqui é exibido no lançamento.
 */

import type { CollectionConfig } from 'payload'

import { hooksDeAuditoria } from '../lib/auditoria'
import {
  campoDataDePublicacao,
  campoImagemDestaque,
  campoPlaceholder,
  campoSlug,
  camposDeSeo,
  leituraSomenteDoPublicado,
  somenteAutenticado,
  versoesComRascunho,
} from '../lib/campos-payload'
import {
  SLUG_ITENS_DE_CONTEUDO,
  SLUG_PRODUTOS,
  SLUG_SOLUCOES,
  SLUG_USUARIOS,
} from '../lib/slugs'
import {
  recusarPlaceholderPublicadoEmProducao,
  recusarSlugDuplicado,
  registrarDataDePublicacao,
  travarSlugAposPublicacao,
} from '../lib/validacao-publicacao'

export const ItensDeConteudo: CollectionConfig = {
  slug: SLUG_ITENS_DE_CONTEUDO,
  labels: { plural: 'Itens de conteúdo', singular: 'Item de conteúdo' },
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'slug', '_status', 'dataDePublicacao'],
    description: 'Artigo editorial. As páginas públicas correspondentes são Fase 2.',
  },
  versions: versoesComRascunho,
  access: {
    read: leituraSomenteDoPublicado,
    create: somenteAutenticado,
    update: somenteAutenticado,
    delete: somenteAutenticado,
  },
  hooks: {
    ...hooksDeAuditoria,
    beforeChange: [
      travarSlugAposPublicacao,
      recusarSlugDuplicado,
      recusarPlaceholderPublicadoEmProducao,
      registrarDataDePublicacao,
    ],
  },
  fields: [
    { name: 'titulo', type: 'text', required: true, localized: true },
    campoSlug('titulo'),
    { name: 'resumo', type: 'textarea', required: true, localized: true },
    { name: 'corpo', type: 'richText', required: true },
    {
      name: 'temaEditorial',
      type: 'text',
      admin: { description: 'Opcional.' },
    },
    {
      name: 'produtosRelacionados',
      type: 'relationship',
      relationTo: SLUG_PRODUTOS,
      hasMany: true,
      admin: { description: 'Leva tráfego orgânico ao catálogo (RF-145).' },
    },
    {
      name: 'solucoesRelacionadas',
      type: 'relationship',
      relationTo: SLUG_SOLUCOES,
      hasMany: true,
    },
    campoImagemDestaque(true),
    {
      name: 'autor',
      type: 'relationship',
      relationTo: SLUG_USUARIOS,
      admin: { position: 'sidebar', description: 'Opcional (6.7).' },
    },
    ...camposDeSeo(),
    campoPlaceholder(),
    campoDataDePublicacao(),
  ],
}

export default ItensDeConteudo
