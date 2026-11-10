// Dono: Onda 2b
//
// Fábricas de campo reutilizadas pelas coleções de 6.7. Existem para que a mesma
// regra (slug, SEO automático, marcação de placeholder, data de publicação) tenha
// UMA implementação — RNF-070, RNF-071.

import type { Access, Field, FieldHook } from 'payload'

import { gerarSlug, validarSlug, SLUG_MIDIA } from './slugs'

/** Lê uma propriedade de um objeto de dados do Payload sem recorrer a `any`. */
const ler = (fonte: unknown, chave: string): unknown =>
  typeof fonte === 'object' && fonte !== null ? (fonte as Record<string, unknown>)[chave] : undefined

const textoNaoVazio = (valor: unknown): valor is string =>
  typeof valor === 'string' && valor.trim() !== ''

/**
 * Leitura pública restrita ao que está publicado (RF-147).
 * Quem está autenticado no painel vê rascunho; visitante anônimo, nunca.
 */
export const leituraSomenteDoPublicado: Access = ({ req }) => {
  if (req.user) return true
  return { _status: { equals: 'published' } }
}

/** Coleções sem estado de publicação (taxonomia, mídia): leitura pública, escrita autenticada. */
export const leituraPublica: Access = () => true

/** Toda escrita exige um sócio autenticado (RF-183, RF-188). */
export const somenteAutenticado: Access = ({ req }) => Boolean(req.user)

/**
 * Slug — 6.5 inteiro, mais PR-014.
 * - derivado automaticamente do nome quando vazio (regra 6);
 * - `unique` no banco: conflito recusa a gravação e exige resolução manual,
 *   nunca sufixo numérico automático (regra 3);
 * - `access.update` fecha o campo depois da primeira publicação (PR-014); a
 *   recusa explícita, com mensagem, está em `travarSlugAposPublicacao`.
 */
export const campoSlug = (origem: 'nome' | 'titulo'): Field => {
  const derivar: FieldHook = ({ value, data, originalDoc }) => {
    if (textoNaoVazio(value)) return gerarSlug(value)
    const base = ler(data, origem) ?? ler(originalDoc, origem)
    if (textoNaoVazio(base)) return gerarSlug(base)
    return value
  }

  return {
    name: 'slug',
    type: 'text',
    required: true,
    unique: true,
    index: true,
    label: 'Slug (endereço público)',
    admin: {
      position: 'sidebar',
      description:
        'Gerado a partir do nome. Editável apenas ANTES da primeira publicação — depois dela o endereço é compromisso público (PR-014). Conflito de slug bloqueia a gravação e exige resolução manual: o sistema nunca acrescenta número ao final.',
    },
    access: {
      update: ({ doc }) => !ler(doc, 'dataDePublicacao'),
    },
    hooks: { beforeValidate: [derivar] },
    validate: validarSlug,
  }
}

/**
 * Título e descrição de SEO (6.7, RF-160): opcionais e localizados.
 * Vazio significa AUTOMÁTICO a partir de nome e resumo — a derivação é aplicada
 * na leitura, por `src/lib/seo-automatico.ts`, e não é gravada: gravar o valor
 * derivado congelaria o texto e quebraria a atualização automática.
 */
export const camposDeSeo = (): Field[] => [
  {
    type: 'collapsible',
    label: 'SEO',
    admin: { initCollapsed: true },
    fields: [
      {
        name: 'seoTitulo',
        type: 'text',
        localized: true,
        admin: {
          description:
            'Deixe vazio para usar o nome do registro. Preencher aqui é sobrescrita manual (RF-160).',
        },
      },
      {
        name: 'seoDescricao',
        type: 'textarea',
        localized: true,
        admin: {
          description:
            'Deixe vazio para usar o resumo do registro. Preencher aqui é sobrescrita manual (RF-160).',
        },
      },
    ],
  },
]

/**
 * Marcação de conteúdo provisório — dev/CONVENCOES.md §7.2.
 * Em produção, registro marcado e publicado ao mesmo tempo é recusado na origem
 * por `recusarPlaceholderPublicadoEmProducao` (§7.4).
 */
export const campoPlaceholder = (): Field => ({
  name: 'placeholder',
  type: 'checkbox',
  defaultValue: false,
  label: 'Conteúdo provisório (placeholder)',
  admin: {
    position: 'sidebar',
    description:
      'Marque enquanto este registro contiver texto ou imagem provisória. Em homologação ele é marcado visualmente; em produção, registro provisório NÃO pode ser publicado.',
  },
})

/**
 * Data da primeira publicação (6.7, "Datas de publicação e atualização — auto").
 * Gravada uma única vez, pelo hook `registrarDataDePublicacao`. A data de
 * atualização é o `updatedAt` que o Payload mantém sozinho em toda coleção.
 */
export const campoDataDePublicacao = (): Field => ({
  name: 'dataDePublicacao',
  type: 'date',
  index: true,
  admin: {
    position: 'sidebar',
    readOnly: true,
    description:
      'Preenchida automaticamente na primeira publicação. É ela que trava o slug (PR-014).',
    date: { pickerAppearance: 'dayAndTime' },
  },
})

/** Imagem de destaque (6.7). O texto alternativo é obrigatório na própria mídia (RF-187). */
export const campoImagemDestaque = (obrigatoria: boolean): Field => ({
  name: 'imagemDestaque',
  type: 'upload',
  relationTo: SLUG_MIDIA,
  required: obrigatoria,
  admin: {
    description:
      'Captura de tela real do produto (Q-005), nunca ilustração genérica. Alimenta card e compartilhamento.',
  },
})

/** Versionamento com rascunho e publicado (6.7 "Status de publicação", RF-147). */
export const versoesComRascunho = {
  drafts: {
    // Rascunho incompleto PODE ser salvo (RF-070, RF-185): a validação de campo
    // obrigatório e de mínimo de itens roda apenas na transição para publicado.
    validate: false,
  },
  maxPerDoc: 20,
} as const

export { ler as lerPropriedade, textoNaoVazio }
