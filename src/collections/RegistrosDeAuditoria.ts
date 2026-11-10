/**
 * Registros de auditoria
 * Implementa: RF-192, RF-186 (histórico de quem publicou), RNF-046
 * Modelo: não é entidade de 6.7 — é a trilha exigida por RF-192, que 6.7 não modela
 * Premissas: PR-023 (dois sócios sem hierarquia; sem hierarquia, o registro é o
 *   único mecanismo de responsabilização que resta)
 * Perguntas abertas que afetam este arquivo: —
 * Dono: Onda 2b
 *
 * Escrito apenas por hook (`src/lib/auditoria.ts`), nunca à mão: por isso criação,
 * alteração e exclusão estão fechadas para todo usuário. O histórico campo a campo
 * com texto anterior recuperável é RNF-077 — Fase 2, e não está aqui.
 */

import type { CollectionConfig } from 'payload'

import { ACOES_DE_AUDITORIA } from '../lib/auditoria'
import { somenteAutenticado } from '../lib/campos-payload'
import { SLUG_REGISTROS_DE_AUDITORIA, SLUG_USUARIOS } from '../lib/slugs'

const negar = (): boolean => false

export const RegistrosDeAuditoria: CollectionConfig = {
  slug: SLUG_REGISTROS_DE_AUDITORIA,
  labels: { plural: 'Registros de auditoria', singular: 'Registro de auditoria' },
  admin: {
    useAsTitle: 'registro',
    defaultColumns: ['createdAt', 'acao', 'colecao', 'registro', 'autor'],
    description:
      'Somente leitura. Cada linha é uma ação executada no painel, com autor e momento (RF-192).',
  },
  access: {
    read: somenteAutenticado,
    create: negar,
    update: negar,
    delete: negar,
  },
  fields: [
    {
      name: 'acao',
      type: 'select',
      required: true,
      options: ACOES_DE_AUDITORIA.map((acao) => ({ label: acao, value: acao })),
      index: true,
    },
    { name: 'colecao', type: 'text', required: true, index: true },
    { name: 'documentoId', type: 'text', required: true, index: true },
    {
      name: 'registro',
      type: 'text',
      required: true,
      admin: { description: 'Identificação legível do registro afetado no momento da ação.' },
    },
    {
      name: 'autor',
      type: 'relationship',
      relationTo: SLUG_USUARIOS,
      admin: { description: 'Sócio autenticado que executou a ação (RF-183, RNF-046).' },
    },
  ],
  // `createdAt` é o momento da ação; não existe alteração posterior a registrar.
  timestamps: true,
}

export default RegistrosDeAuditoria
