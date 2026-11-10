// Dono: Onda 2b
//
// Biblioteca finita de blocos das páginas institucionais — RF-146, RF-140, RF-141.
// "Os blocos disponíveis são finitos e documentados; a ordem é ajustável; nenhum
// bloco permite inserir estrutura arbitrária que quebre o padrão visual ou a
// hierarquia de cabeçalhos" (RF-146).
//
// NOTA: o PRD exige a biblioteca mas não enumera os blocos. Os quatro abaixo são o
// conjunto mínimo que cobre P-02 (texto, imagem opcional, bloco de integrações com
// ação própria, equipe opcional), P-13 e P-14 (texto datado). Acrescentar bloco é
// decisão de produto, não de implementação — relatado ao maestro.

import type { Block } from 'payload'

import { SLUG_MIDIA } from './slugs'

/** Texto corrido com subtítulo opcional. Base de toda página institucional e legal. */
const blocoDeTexto: Block = {
  slug: 'blocoDeTexto',
  labels: { plural: 'Blocos de texto', singular: 'Bloco de texto' },
  fields: [
    {
      name: 'titulo',
      type: 'text',
      admin: {
        description:
          'Subtítulo da seção. Vira um nível abaixo do título da página — a hierarquia de cabeçalhos é do template, não editável aqui (RF-146).',
      },
    },
    { name: 'corpo', type: 'richText', required: true },
  ],
}

/** Imagem com legenda. O texto alternativo é obrigatório na própria mídia (RF-187). */
const blocoDeImagem: Block = {
  slug: 'blocoDeImagem',
  labels: { plural: 'Blocos de imagem', singular: 'Bloco de imagem' },
  fields: [
    { name: 'imagem', type: 'upload', relationTo: SLUG_MIDIA, required: true },
    { name: 'legenda', type: 'text' },
  ],
}

/**
 * Chamada para ação com destino interno. Atende o bloco de desenvolvimento de
 * integrações de P-02 (11.20), que tem ação própria de contato e não é card de
 * catálogo.
 */
const blocoDeChamada: Block = {
  slug: 'blocoDeChamada',
  labels: { plural: 'Blocos de chamada', singular: 'Bloco de chamada' },
  fields: [
    { name: 'titulo', type: 'text', required: true },
    { name: 'texto', type: 'textarea' },
    { name: 'rotuloDaAcao', type: 'text', required: true },
    {
      name: 'destino',
      type: 'text',
      required: true,
      admin: {
        description:
          'Caminho interno, começando por barra (ex.: /contato). O endereço final é montado pelo construtor de rotas, que reserva o segmento de idioma (RNF-083).',
      },
      validate: (valor: unknown): true | string =>
        typeof valor === 'string' && valor.startsWith('/')
          ? true
          : 'Informe um caminho interno começando por "/". Link externo não é destino de chamada institucional.',
    },
  ],
}

/** Lista de itens curtos: "como trabalhamos", equipe (opcional em P-02, RF-140). */
const blocoDeLista: Block = {
  slug: 'blocoDeLista',
  labels: { plural: 'Blocos de lista', singular: 'Bloco de lista' },
  fields: [
    { name: 'titulo', type: 'text' },
    {
      name: 'itens',
      type: 'array',
      minRows: 1,
      required: true,
      fields: [
        { name: 'titulo', type: 'text', required: true },
        { name: 'texto', type: 'textarea' },
      ],
    },
  ],
}

export const BLOCOS_INSTITUCIONAIS: Block[] = [
  blocoDeTexto,
  blocoDeLista,
  blocoDeImagem,
  blocoDeChamada,
]
