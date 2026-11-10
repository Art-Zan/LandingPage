/**
 * Usuários do painel — os dois sócios da ArtZan
 * Implementa: RF-183, RF-188, RF-189, RF-190, RNF-046, RNF-047, RNF-048, RNF-049
 * Modelo: infraestrutura de autenticação exigida por `admin.user` (não é entidade de 6.7)
 * Premissas: PR-023 (exatamente duas pessoas, conta individual, sem hierarquia)
 * Perguntas abertas que afetam este arquivo: Q-012 (e-mail institucional dos sócios
 *   ainda não existe — é ele que sustenta a recuperação de acesso de RF-190)
 * Dono: Onda 2b
 *
 * NÃO há campo de papel ou permissão: Q-034 resolveu que os dois sócios executam
 * tudo, sem hierarquia de aprovação (RF-183). Criar um campo "papel" aqui seria
 * reintroduzir uma decisão que o cliente já tomou em sentido contrário.
 */

import type { CollectionConfig } from 'payload'

import { somenteAutenticado } from '../lib/campos-payload'
import { SLUG_USUARIOS } from '../lib/slugs'

const UMA_HORA_EM_SEGUNDOS = 60 * 60
const DEZ_MINUTOS_EM_MILISSEGUNDOS = 10 * 60 * 1000

export const Usuarios: CollectionConfig = {
  slug: SLUG_USUARIOS,
  labels: { plural: 'Usuários', singular: 'Usuário' },
  admin: {
    useAsTitle: 'nome',
    defaultColumns: ['nome', 'email', 'updatedAt'],
    description:
      'Contas individuais dos sócios. Conta compartilhada é proibida: sem ela a auditoria de RF-192 não identifica responsável.',
  },
  auth: {
    // RF-189: a sessão expira e exige nova autenticação. O Payload renova o token
    // enquanto há atividade no painel, o que aproxima o comportamento da expiração
    // por inatividade pedida pelo requisito. O aviso antes de descartar rascunho
    // não salvo é interface, e é etapa 2.
    tokenExpiration: 2 * UMA_HORA_EM_SEGUNDOS,
    // RNF-047 / RNF-048: tentativa repetida é bloqueada temporariamente.
    maxLoginAttempts: 5,
    lockTime: DEZ_MINUTOS_EM_MILISSEGUNDOS,
    useAPIKey: false,
    // RF-190: a recuperação usa o e-mail do sócio, canal independente do painel.
    forgotPassword: {},
  },
  access: {
    read: somenteAutenticado,
    create: somenteAutenticado,
    update: somenteAutenticado,
    delete: somenteAutenticado,
    admin: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'nome',
      type: 'text',
      required: true,
      admin: { description: 'Nome da pessoa. Aparece na trilha de auditoria (RF-192).' },
    },
  ],
}

export default Usuarios
