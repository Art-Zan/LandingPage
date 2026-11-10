/**
 * Categoria
 * Implementa: RF-181, RF-048 (o dado que os gatilhos de 6.6 leem), RF-182, RNF-082
 * Modelo: 6.7 (Categoria) · Regras de slug: 6.5
 * Premissas: PR-013 (categoria existe desde o início, mesmo sem exibição pública),
 *   PR-014 (slug imutável após a publicação)
 * Perguntas abertas que afetam este arquivo: Q-023 (gatilhos numéricos mantidos —
 *   com 4 produtos o catálogo fica abaixo de todos eles; nada é exibido no
 *   lançamento), Q-011 (reserva de inglês)
 * Dono: Onda 2b
 *
 * O QUE ESTÁ DESLIGADO E POR QUÊ: agrupamento, filtro, ordenação, busca e
 * paginação (6.6) leem exatamente estes campos. Nada aqui precisa mudar para
 * ativá-los — a ativação é decisão editorial na camada de exibição (RNF-082).
 * Classificação sem pertencimento único: a relação com produto é N:N e mora no
 * produto (6.7).
 */

import type { CollectionConfig } from 'payload'

import { hooksDeAuditoria } from '../lib/auditoria'
import { campoPlaceholder, campoSlug, leituraPublica, somenteAutenticado } from '../lib/campos-payload'
import { SLUG_CATEGORIAS } from '../lib/slugs'
import { recusarSlugDuplicado, travarSlugAposPublicacao } from '../lib/validacao-publicacao'

export const Categorias: CollectionConfig = {
  slug: SLUG_CATEGORIAS,
  labels: { plural: 'Categorias', singular: 'Categoria' },
  admin: {
    useAsTitle: 'nome',
    defaultColumns: ['nome', 'slug', 'visivelPublicamente', 'ordemDeExibicao'],
    description:
      'Classifica produtos e soluções. Uma categoria pode existir sem ser exibida (PR-013).',
  },
  access: {
    // Categoria não tem página nem estado de publicação no modelo de 6.7; a
    // exposição pública é regida por `visivelPublicamente`, lido pelo template.
    read: leituraPublica,
    create: somenteAutenticado,
    update: somenteAutenticado,
    delete: somenteAutenticado,
  },
  hooks: {
    ...hooksDeAuditoria,
    beforeChange: [travarSlugAposPublicacao, recusarSlugDuplicado],
  },
  fields: [
    { name: 'nome', type: 'text', required: true, localized: true },
    campoSlug('nome'),
    {
      name: 'descricaoCurta',
      type: 'textarea',
      localized: true,
      admin: {
        description:
          'Opcional hoje. Passa a ser obrigatória no dia em que a categoria ganhar URL própria: categoria sem texto editorial não sustenta indexação (6.6, P-18 — Fase 2).',
      },
    },
    {
      name: 'ordemDeExibicao',
      type: 'number',
      admin: {
        description: 'Menor primeiro. Só tem efeito quando o agrupamento por categoria for ativado (6.6).',
      },
    },
    {
      name: 'visivelPublicamente',
      type: 'checkbox',
      required: true,
      defaultValue: false,
      admin: {
        description:
          'Desmarcada, a categoria continua classificando internamente e não aparece em nenhuma página (PR-013).',
      },
    },
    campoPlaceholder(),
  ],
}

export default Categorias
