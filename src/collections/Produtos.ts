/**
 * Produto — software de prateleira do catálogo
 * Implementa: RF-060..066, RF-070, RF-180, RF-182, RF-185, RF-186, RF-187,
 *   RF-192 (trilha), RNF-082, RNF-083
 * Modelo: 6.7 (Produto) · URLs e slug: 6.4, 6.5 · Piso de conteúdo: 12.7
 * Premissas: PR-003 (produto↔solução é N:N e o lado do produto é derivado),
 *   PR-008 (template único), PR-013, PR-014 (slug imutável após publicar),
 *   PR-057 (piso de conteúdo por página publicada)
 * Perguntas abertas que afetam este arquivo: Q-005 (capturas de tela reais não
 *   existem — sem elas nenhum produto é publicável), Q-084 / D-12 (três dos quatro
 *   produtos ainda não têm nome aprovado; publicar congela slug provisório),
 *   Q-008 (preço não publicado), Q-011 (reserva de inglês)
 * Dono: Onda 2b
 *
 * O QUE ESTE ARQUIVO IMPEDE, MECANICAMENTE:
 *  - digitar as soluções das quais o produto participa: o campo é `join`, virtual,
 *    sem coluna e sem entrada de escrita em nenhuma API (PR-003, RF-066);
 *  - publicar abaixo do piso de PR-057: hook de transição para publicado, que
 *    nomeia cada pendência (RF-062, RF-070, RF-185, RF-193);
 *  - editar o slug depois da primeira publicação (PR-014);
 *  - resolver conflito de slug com sufixo numérico (6.5, regra 3).
 * Rascunho incompleto continua podendo ser salvo — é o comportamento pedido.
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
import {
  SLUG_CATEGORIAS,
  SLUG_MIDIA,
  SLUG_PRODUTOS,
  SLUG_SOLUCOES,
} from '../lib/slugs'
import {
  recusarPlaceholderPublicadoEmProducao,
  recusarSlugDuplicado,
  registrarDataDePublicacao,
  travarSlugAposPublicacao,
  validarPisoDeConteudoDoProduto,
} from '../lib/validacao-publicacao'

export const Produtos: CollectionConfig = {
  slug: SLUG_PRODUTOS,
  labels: { plural: 'Produtos', singular: 'Produto' },
  admin: {
    useAsTitle: 'nome',
    defaultColumns: ['nome', 'slug', '_status', 'dataDePublicacao', 'placeholder'],
    description:
      'Um software de prateleira do catálogo. Serviço sob encomenda (integrações) NÃO entra aqui: não é entidade de catálogo (11.20, 6.4).',
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
      validarPisoDeConteudoDoProduto,
      registrarDataDePublicacao,
    ],
  },
  fields: [
    {
      name: 'nome',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description:
          'Base do título da página. Nome de produto não aprovado não é publicado: até Q-084, a identificação pública é a descrição funcional (PR-063).',
      },
    },
    campoSlug('nome'),
    {
      name: 'resumoUmaLinha',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'Uma linha. Alimenta o card do catálogo e a descrição de SEO.' },
    },
    {
      name: 'problemaQueResolve',
      type: 'richText',
      required: true,
      admin: {
        description:
          'De 1 a 3 parágrafos, mínimo de 400 caracteres para publicar (PR-057). Descreva a dor com exatidão: produtos vizinhos descritos em termos genéricos viram a mesma página com nomes diferentes (12.7).',
      },
    },
    {
      name: 'descricaoCompleta',
      type: 'richText',
      required: true,
      localized: true,
      admin: { description: 'Mínimo de 500 caracteres para publicar (PR-057).' },
    },
    {
      name: 'publicoAlvo',
      type: 'textarea',
      required: true,
      label: 'Para quem é',
      admin: {
        description:
          'Papéis ou tipos de organização. Descrição vaga aqui produz lead desqualificado (RF-062).',
      },
    },
    {
      name: 'funcionalidades',
      type: 'array',
      required: true,
      minRows: 3,
      labels: { plural: 'Funcionalidades', singular: 'Funcionalidade' },
      admin: { description: 'Mínimo de 3 para publicar (RF-062).' },
      fields: [
        { name: 'titulo', type: 'text', required: true },
        {
          name: 'descricao',
          type: 'textarea',
          required: true,
          admin: { description: 'Mínimo de 40 caracteres (PR-057).' },
        },
      ],
    },
    {
      name: 'beneficios',
      type: 'array',
      required: true,
      minRows: 3,
      labels: { plural: 'Benefícios', singular: 'Benefício' },
      admin: {
        description:
          'Mínimo de 3 para publicar (RF-062). Redigidos como resultado, sem repetir a lista de funcionalidades.',
      },
      fields: [
        {
          name: 'texto',
          type: 'textarea',
          required: true,
          admin: { description: 'Mínimo de 30 caracteres (PR-057).' },
        },
      ],
    },
    {
      name: 'categorias',
      type: 'relationship',
      relationTo: SLUG_CATEGORIAS,
      hasMany: true,
      required: true,
      minRows: 1,
      admin: {
        description:
          'Relação N:N: um produto pertence a quantas categorias fizerem sentido, e por isso a URL nunca contém categoria (6.4).',
      },
    },
    campoImagemDestaque(true),
    {
      name: 'galeriaDeTelas',
      type: 'upload',
      relationTo: SLUG_MIDIA,
      hasMany: true,
      admin: {
        description:
          'Opcional, inclusive depois de a imagem de destaque existir. Sem material, a seção é omitida por completo — nunca substituída por imagem genérica (RF-063, RF-064).',
      },
    },
    {
      name: 'videoDemonstracao',
      type: 'text',
      admin: {
        description: 'Opcional. Endereço do vídeo. Sem vídeo, a seção não aparece (RF-063).',
      },
    },
    {
      name: 'integracoes',
      type: 'text',
      hasMany: true,
      admin: {
        description:
          'Opcional. Só quando a integração existir de fato (6.7). Lista vazia omite a seção inteira.',
      },
    },
    {
      name: 'modeloDeContratacao',
      type: 'select',
      hasMany: true,
      required: true,
      label: 'Informações comerciais — modelo de contratação',
      options: [
        { label: 'Assinatura recorrente', value: 'assinatura-recorrente' },
        { label: 'Projeto sob encomenda', value: 'projeto-sob-encomenda' },
      ],
      admin: {
        description:
          'Q-007: os dois modelos coexistem, e um produto pode se enquadrar em um, no outro ou nos dois. Preço não é publicado (PR-005, Q-008); o texto padrão sobre valor é único para todo o catálogo e vive na configuração do site (RF-065).',
      },
    },
    {
      // PR-003 / RF-066: DERIVADO, NUNCA DIGITADO.
      // `join` é campo virtual: não existe coluna, não aceita escrita por painel,
      // API REST, GraphQL ou API local. A única forma de o vínculo existir é
      // alguém incluir este produto em uma solução — que é exatamente a regra.
      name: 'solucoesQueParticipa',
      type: 'join',
      collection: SLUG_SOLUCOES,
      on: 'produtos',
      label: 'Soluções das quais participa',
      admin: {
        description:
          'Derivado do vínculo N:N, nunca digitado (PR-003, RF-066). Sem vínculo, o bloco é omitido na página. No lançamento não existe solução composta publicada (Q-006), então este bloco fica sempre vazio — de propósito.',
      },
    },
    {
      name: 'produtosRelacionados',
      type: 'relationship',
      relationTo: SLUG_PRODUTOS,
      hasMany: true,
      admin: {
        description:
          'Opcional. Rotulado sempre como "relacionado", nunca como "solução" (RF-067). Exibição classificada como Fase 2.',
      },
      filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
    },
    {
      name: 'destaqueNaInicial',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'ordemDeDestaque',
      type: 'number',
      admin: {
        position: 'sidebar',
        condition: (data) => Boolean(data?.destaqueNaInicial),
        description: 'Menor primeiro.',
      },
    },
    ...camposDeSeo(),
    campoPlaceholder(),
    campoDataDePublicacao(),
  ],
}

export default Produtos
