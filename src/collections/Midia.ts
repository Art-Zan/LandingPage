/**
 * Mídia — biblioteca central de imagens
 * Implementa: RF-187, RF-064 (texto alternativo que bloqueia o uso), RNF-006
 *   (variações responsivas), RNF-012 (peso e formato), RNF-026, RNF-085
 * Modelo: infraestrutura de upload exigida pelas entidades de 6.7
 * Premissas: —
 * Perguntas abertas que afetam este arquivo: Q-005 (as capturas de tela reais dos
 *   produtos ainda não existem — item bloqueante de 16.6)
 * Dono: Onda 2b
 */

import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'

import { hooksDeAuditoria } from '../lib/auditoria'
import { leituraPublica, lerPropriedade, somenteAutenticado } from '../lib/campos-payload'
import { SLUG_MIDIA } from '../lib/slugs'

/** RNF-012: nenhuma imagem individual excede 200 KB depois de otimizada. */
const LIMITE_POR_ARQUIVO_EM_BYTES = 200 * 1024

export const Midia: CollectionConfig = {
  slug: SLUG_MIDIA,
  labels: { plural: 'Mídia', singular: 'Arquivo de mídia' },
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'filename', 'filesize', 'updatedAt'],
    description:
      'Carregue uma vez, reutilize em qualquer entidade (RF-187). Toda imagem exige texto alternativo.',
  },
  access: {
    // A imagem publicada precisa ser servida a visitante anônimo.
    read: leituraPublica,
    create: somenteAutenticado,
    update: somenteAutenticado,
    delete: somenteAutenticado,
  },
  upload: {
    mimeTypes: ['image/*'],
    // RNF-012: formato moderno; o Next negocia a alternativa compatível.
    formatOptions: { format: 'webp', options: { quality: 78 } },
    resizeOptions: { width: 1600, withoutEnlargement: true },
    // RNF-006: variações por largura de dispositivo, geradas sem ação manual.
    imageSizes: [
      { name: 'miniatura', width: 400, withoutEnlargement: true },
      { name: 'card', width: 800, withoutEnlargement: true },
      { name: 'conteudo', width: 1200, withoutEnlargement: true },
      { name: 'social', width: 1200, height: 630, position: 'centre' },
    ],
    adminThumbnail: 'miniatura',
  },
  hooks: {
    ...hooksDeAuditoria,
    beforeChange: [
      // RNF-012: reprocessa (webp + redimensionamento acima) e, se ainda assim
      // passar do teto, recusa. Sem isto o orçamento de peso de RNF-011 é rompido
      // pelo primeiro produto com galeria.
      ({ data }) => {
        const tamanho = lerPropriedade(data, 'filesize')
        if (typeof tamanho === 'number' && tamanho > LIMITE_POR_ARQUIVO_EM_BYTES) {
          throw new APIError(
            `Arquivo com ${Math.round(tamanho / 1024)} KB depois da otimização; o teto é ${LIMITE_POR_ARQUIVO_EM_BYTES / 1024} KB por imagem (RNF-012). Reduza as dimensões ou a qualidade antes de carregar.`,
            400,
          )
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Texto alternativo',
      admin: {
        description:
          'Obrigatório no carregamento (RF-187, RNF-026): descreve a imagem para quem não a vê. Imagem decorativa não pertence à biblioteca de conteúdo.',
      },
    },
  ],
}

export default Midia
