/**
 * Parceiro
 * Implementa: RF-100, RF-101, RF-102, RF-103, RF-104, RF-105, RF-106, RF-181,
 *   RF-185, RF-186
 * Modelo: 6.7 (Parceiro)
 * Premissas: PR-018 (nenhuma marca de terceiro é publicada sem autorização formal
 *   registrada), PR-014
 * Perguntas abertas que afetam este arquivo: Q-025 (um parceiro em vista, não
 *   confirmado), Q-054 (respondida: não existe autorização de uso de marca de
 *   nenhum parceiro — o estado esperado no lançamento é P-07 inteira ausente)
 * Dono: Onda 2b
 *
 * COMO A PUBLICAÇÃO SEM AUTORIZAÇÃO É IMPEDIDA, MECANICAMENTE: duas travas
 * independentes. A primeira é `validate` no próprio campo de autorização, que só
 * aceita verdadeiro — e, como rascunho não é validado, ela morde exatamente na
 * transição para publicado. A segunda é `exigirAutorizacaoDeMarca`, hook que
 * recusa a publicação nomeando o que falta, inclusive por API, onde não há painel.
 */

import type { CollectionConfig } from 'payload'

import { hooksDeAuditoria } from '../lib/auditoria'
import {
  campoDataDePublicacao,
  campoPlaceholder,
  leituraSomenteDoPublicado,
  somenteAutenticado,
  versoesComRascunho,
} from '../lib/campos-payload'
import {
  SLUG_MIDIA,
  SLUG_PARCEIROS,
  SLUG_PRODUTOS,
  SLUG_SOLUCOES,
  SLUG_TIPOS_DE_PARCERIA,
} from '../lib/slugs'
import {
  exigirAutorizacaoDeMarca,
  recusarPlaceholderPublicadoEmProducao,
  registrarDataDePublicacao,
} from '../lib/validacao-publicacao'

export const Parceiros: CollectionConfig = {
  slug: SLUG_PARCEIROS,
  labels: { plural: 'Parceiros', singular: 'Parceiro' },
  admin: {
    useAsTitle: 'nome',
    defaultColumns: ['nome', '_status', 'ordem', 'dataDePublicacao'],
    description:
      'Organização externa com relação declarada com a ArtZan. Parceiro NÃO é cliente e não pode ser exibido de forma que sugira isso (2.6).',
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
      recusarPlaceholderPublicadoEmProducao,
      exigirAutorizacaoDeMarca,
      registrarDataDePublicacao,
    ],
  },
  fields: [
    { name: 'nome', type: 'text', required: true, localized: true },
    {
      name: 'logo',
      type: 'upload',
      relationTo: SLUG_MIDIA,
      required: true,
      admin: { description: 'O texto alternativo é obrigatório na própria mídia (RF-187).' },
    },
    {
      name: 'descricaoCurta',
      type: 'textarea',
      required: true,
      localized: true,
      admin: { description: 'De 1 a 3 linhas. Redigida em conjunto com o parceiro (11.6).' },
    },
    {
      name: 'tiposDeParceria',
      type: 'relationship',
      relationTo: SLUG_TIPOS_DE_PARCERIA,
      hasMany: true,
      required: true,
      minRows: 1,
      admin: {
        description:
          'Taxonomia controlada e editável sem desenvolvimento (RF-102). Com mais de um tipo, o parceiro aparece em cada grupo pertinente.',
      },
    },
    {
      name: 'naturezaDaRelacao',
      type: 'textarea',
      required: true,
      admin: {
        description:
          'O que a parceria entrega ao cliente. Obrigatório porque "relação vaga" é causa registrada de abandono em J-04.',
      },
    },
    {
      name: 'produtosRelacionados',
      type: 'relationship',
      relationTo: SLUG_PRODUTOS,
      hasMany: true,
      admin: { description: 'Opcional. Relação N:N (RF-106).' },
    },
    {
      name: 'solucoesRelacionadas',
      type: 'relationship',
      relationTo: SLUG_SOLUCOES,
      hasMany: true,
      admin: {
        description:
          'Opcional. Relação N:N (RF-106). É este campo que a solução lê, do outro lado, como "parceiros envolvidos".',
      },
    },
    {
      name: 'linkExterno',
      type: 'text',
      admin: {
        description:
          'Opcional. Abre em nova aba, sem transferir autoridade de busca e sem expor a janela de origem (RF-104) — atributos aplicados pelo template.',
      },
    },
    {
      name: 'autorizacaoDeUsoDeMarca',
      type: 'group',
      label: 'Autorização de uso de marca',
      admin: {
        description:
          'Controle interno. Sem autorização formal registrada, nada deste parceiro é publicado — nem logotipo, nem nome, nem descrição da relação (PR-018, RF-103).',
      },
      fields: [
        {
          name: 'autorizada',
          type: 'checkbox',
          required: true,
          defaultValue: false,
          label: 'Autorização formal registrada',
          validate: (valor: unknown): true | string =>
            valor === true
              ? true
              : 'Sem autorização formal registrada o parceiro não pode ser publicado (PR-018, RF-103). Salve como rascunho até a autorização existir.',
        },
        {
          name: 'dataDaAutorizacao',
          type: 'date',
          required: true,
          admin: { date: { pickerAppearance: 'dayOnly' } },
        },
        {
          name: 'responsavel',
          type: 'text',
          required: true,
          admin: { description: 'Quem concedeu a autorização, do lado do parceiro (RF-103).' },
        },
      ],
    },
    {
      name: 'ordem',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Ordem dentro do grupo do tipo de parceria (RF-100).',
      },
    },
    campoPlaceholder(),
    campoDataDePublicacao(),
  ],
}

export default Parceiros
