/**
 * Tipos de parceria — taxonomia controlada
 * Implementa: RF-102, RF-100 (agrupamento da listagem por tipo), RF-181
 * Modelo: 6.7 (Parceiro, campo "Tipo de parceria") — vira coleção própria porque
 *   RF-102 exige acrescentar ou remover tipo SEM alteração de código, o que um
 *   campo de seleção fixo não permite
 * Premissas: —
 * Perguntas abertas que afetam este arquivo: Q-024 (resolvida: a taxonomia do PRD
 *   é mantida — tecnológico, implantação, revenda, indicação, institucional). Os
 *   registros em si são dado de cadastro e NÃO são criados por código.
 * Dono: Onda 2b
 */

import type { CollectionConfig } from 'payload'

import { hooksDeAuditoria } from '../lib/auditoria'
import { campoSlug, leituraPublica, somenteAutenticado } from '../lib/campos-payload'
import { SLUG_TIPOS_DE_PARCERIA } from '../lib/slugs'
import { recusarSlugDuplicado } from '../lib/validacao-publicacao'

export const TiposDeParceria: CollectionConfig = {
  slug: SLUG_TIPOS_DE_PARCERIA,
  labels: { plural: 'Tipos de parceria', singular: 'Tipo de parceria' },
  admin: {
    useAsTitle: 'nome',
    defaultColumns: ['nome', 'slug', 'ordemDeExibicao'],
    description:
      'Lista controlada usada pelos parceiros. Um parceiro pode ter mais de um tipo e aparece em cada grupo pertinente (RF-102).',
  },
  access: {
    read: leituraPublica,
    create: somenteAutenticado,
    update: somenteAutenticado,
    delete: somenteAutenticado,
  },
  hooks: {
    ...hooksDeAuditoria,
    beforeChange: [recusarSlugDuplicado],
  },
  fields: [
    { name: 'nome', type: 'text', required: true, localized: true },
    campoSlug('nome'),
    {
      name: 'ordemDeExibicao',
      type: 'number',
      admin: { description: 'Menor primeiro. Define a ordem dos grupos em P-07 (RF-100).' },
    },
  ],
}

export default TiposDeParceria
