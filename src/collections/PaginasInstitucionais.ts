/**
 * Página institucional
 * Implementa: RF-140, RF-141, RF-146, RF-147, RF-181, RF-185, RF-186, RF-164
 *   (o campo que declara a página não indexável)
 * Modelo: 6.7 (Página institucional) · Blocos: `src/lib/blocos-institucionais.ts`
 * Premissas: PR-009 (equipe reduzida e não técnica), PR-014, PR-019 (a redação dos
 *   textos legais é do cliente — Q-028: há setor jurídico responsável)
 * Perguntas abertas que afetam este arquivo: D-16 (textos legais não existem;
 *   `/privacidade` e `/termos` ficam com conteúdo provisório marcado até existirem)
 * Dono: Onda 2b
 *
 * A data de atualização exibida pelas páginas legais é o `updatedAt` que o Payload
 * mantém automaticamente em toda coleção — não há campo redundante para isso.
 */

import type { CollectionConfig } from 'payload'

import { hooksDeAuditoria } from '../lib/auditoria'
import { BLOCOS_INSTITUCIONAIS } from '../lib/blocos-institucionais'
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
import { SLUG_PAGINAS_INSTITUCIONAIS } from '../lib/slugs'
import {
  recusarPlaceholderPublicadoEmProducao,
  recusarSlugDuplicado,
  registrarDataDePublicacao,
  travarSlugAposPublicacao,
} from '../lib/validacao-publicacao'

export const PaginasInstitucionais: CollectionConfig = {
  slug: SLUG_PAGINAS_INSTITUCIONAIS,
  labels: { plural: 'Páginas institucionais', singular: 'Página institucional' },
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'slug', 'indexavel', '_status', 'updatedAt'],
    description:
      'Montada a partir da biblioteca finita de blocos (RF-146). A ordem é ajustável; a estrutura de cada bloco não é editável.',
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
    {
      name: 'corpo',
      type: 'blocks',
      required: true,
      minRows: 1,
      label: 'Corpo em blocos',
      blocks: BLOCOS_INSTITUCIONAIS,
      admin: {
        description:
          'Arraste para reordenar. Nenhum bloco permite inserir estrutura arbitrária que quebre o padrão visual ou a hierarquia de cabeçalhos (RF-146).',
      },
    },
    campoImagemDestaque(false),
    {
      name: 'indexavel',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description:
          'Desmarque em páginas que não devem entrar em buscador — `/obrigado` e `/busca` (6.7, RF-164).',
      },
    },
    ...camposDeSeo(),
    campoPlaceholder(),
    campoDataDePublicacao(),
  ],
}

export default PaginasInstitucionais
