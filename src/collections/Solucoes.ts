/**
 * Solução composta
 * Implementa: RF-082, RF-083, RF-084, RF-086, RF-087, RF-181, RF-182, RF-185, RF-186
 * Modelo: 6.7 (Solução composta) · URLs e slug: 6.4, 6.5
 * Premissas: PR-003 (N:N com produto — razão de ser desta arquitetura),
 *   PR-010 (mínimo de dois produtos), PR-014 (slug imutável após publicar)
 * Perguntas abertas que afetam este arquivo: Q-006 (resolvida: nenhuma solução
 *   composta existe no lançamento — a coleção existe vazia, e é assim que se
 *   pretende), Q-011 (reserva de inglês)
 * Dono: Onda 2b
 *
 * POR QUE ESTA COLEÇÃO EXISTE SEM NENHUM REGISTRO: as páginas P-05 e P-06 estão
 * classificadas como Futuro, mas o modelo é MVP (dev/CONVENCOES.md §4.3). É este
 * lado do vínculo que grava a relação; o lado do produto é derivado (RF-066).
 * Adiar a tabela criaria exatamente o retrabalho que 16.9 proíbe.
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
import { SLUG_CATEGORIAS, SLUG_PARCEIROS, SLUG_PRODUTOS, SLUG_SOLUCOES } from '../lib/slugs'
import {
  recusarPlaceholderPublicadoEmProducao,
  recusarSlugDuplicado,
  registrarDataDePublicacao,
  travarSlugAposPublicacao,
  validarComposicaoDaSolucao,
} from '../lib/validacao-publicacao'

export const Solucoes: CollectionConfig = {
  slug: SLUG_SOLUCOES,
  labels: { plural: 'Soluções', singular: 'Solução' },
  admin: {
    useAsTitle: 'nome',
    defaultColumns: ['nome', 'slug', '_status', 'dataDePublicacao'],
    description:
      'Combina dois ou mais produtos do portfólio para uma necessidade mais ampla. Não é produto novo: se tiver funcionalidade própria, é produto (RF-085).',
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
      validarComposicaoDaSolucao,
      registrarDataDePublicacao,
    ],
  },
  fields: [
    {
      name: 'nome',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'Nomeia a necessidade atendida, nunca a lista de produtos (6.7).' },
    },
    campoSlug('nome'),
    { name: 'resumo', type: 'text', required: true, localized: true },
    {
      name: 'necessidadeAtendida',
      type: 'richText',
      required: true,
      label: 'Necessidade ou cenário atendido',
    },
    {
      name: 'produtos',
      type: 'relationship',
      relationTo: SLUG_PRODUTOS,
      hasMany: true,
      required: true,
      minRows: 2,
      label: 'Produtos que compõem',
      admin: {
        description:
          'Mínimo de 2 (PR-010). É este campo que alimenta, do outro lado, o bloco derivado da página de cada produto (RF-066) — lá ele não pode ser digitado.',
      },
    },
    {
      name: 'ganhoDaCombinacao',
      type: 'richText',
      required: true,
      admin: {
        description:
          'O ganho exclusivo da união. Solução sem ganho próprio é a soma das partes e não deveria existir (RF-084, 12.7 regra 5).',
      },
    },
    { name: 'publicoAlvo', type: 'textarea', required: true, label: 'Para quem é' },
    {
      name: 'casosDeUso',
      type: 'textarea',
      admin: { description: 'Opcional. Ausente, a seção é omitida por completo (RF-063).' },
    },
    {
      name: 'adocaoPorEtapas',
      type: 'textarea',
      admin: {
        description:
          'Opcional. Caminho de adoção, incluindo por qual produto começar (produto de entrada).',
      },
    },
    campoImagemDestaque(true),
    {
      name: 'categorias',
      type: 'relationship',
      relationTo: SLUG_CATEGORIAS,
      hasMany: true,
      admin: { description: 'Opcional. Relação N:N, mesma taxonomia dos produtos.' },
    },
    {
      // Espelho do vínculo que o parceiro grava (RF-106). Mantido como `join` para
      // que a relação parceiro↔solução tenha UM dono, sem risco de os dois lados
      // divergirem. O bloco é condicional e some quando vazio (RF-082).
      name: 'parceirosEnvolvidos',
      type: 'join',
      collection: SLUG_PARCEIROS,
      on: 'solucoesRelacionadas',
      admin: {
        description:
          'Derivado: vincule pelo cadastro do parceiro. Só aparecem parceiros com autorização de marca registrada (PR-018).',
      },
    },
    ...camposDeSeo(),
    campoPlaceholder(),
    campoDataDePublicacao(),
  ],
}

export default Solucoes
