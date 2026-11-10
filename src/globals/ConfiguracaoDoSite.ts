/**
 * Configuração do site
 * Implementa: RF-065 (texto padrão de contratação, único para todo o catálogo),
 *   RF-028 (identificação da empresa no rodapé — razão social e dados de
 *   registro "quando disponíveis"), RNF-074 (nenhum texto de negócio fixo em código)
 * Modelo: não é entidade de 6.7 — existe porque RF-065 exige que o texto sobre
 *   modelo de contratação e ausência de preço seja "definido uma vez e aplicado a
 *   todos os produtos, não editável individualmente". Sem este lugar, a única
 *   alternativa seria escrever o texto dentro de um template, o que a seção 8,
 *   regra 6, de dev/CONVENCOES.md proíbe.
 * Premissas: PR-005 (preço não publicado)
 * Perguntas abertas que afetam este arquivo: Q-008 (preço não será publicado —
 *   se um dia houver faixa real, este é o ponto único de mudança), Q-053 / Q-086
 *   (razão social, CNPJ e endereço — 16.6 classifica como bloqueio de
 *   lançamento; valores não fornecidos e NÃO inventados aqui)
 * Dono: Onda 2b (`textoPadraoDeContratacao`) — grupo `identificacaoDaEmpresa`
 *   acrescentado pela Onda 4a (Tarefa 2). A Onda 3a relatou, em seu log, que
 *   os dados de 16.6 "Dados de rodapé" (razão social, CNPJ, endereço) não
 *   tinham onde morar; a Onda 4a fechou a lacuna acrescentando este grupo,
 *   sem preencher valor — o preenchimento é responsabilidade do cliente.
 *
 * Nasce VAZIO de propósito: o texto é dado de negócio e não é inventado por agente.
 */

import type { GlobalConfig } from 'payload'

import { leituraPublica, somenteAutenticado } from '../lib/campos-payload'

export const ConfiguracaoDoSite: GlobalConfig = {
  slug: 'configuracao-do-site',
  label: 'Configuração do site',
  access: {
    read: leituraPublica,
    update: somenteAutenticado,
  },
  fields: [
    {
      name: 'textoPadraoDeContratacao',
      type: 'textarea',
      localized: true,
      label: 'Texto padrão sobre contratação e ausência de preço',
      admin: {
        description:
          'Exibido igual em TODAS as páginas de produto (RF-065). Explica que a ArtZan trabalha com assinatura recorrente e com projeto sob encomenda, conforme o escopo, que o valor depende do escopo e qual é o caminho para proposta. Preço não é publicado (PR-005, Q-008).',
      },
    },
    {
      type: 'group',
      name: 'identificacaoDaEmpresa',
      label: 'Identificação da empresa',
      admin: {
        description:
          'Razão social, CNPJ e endereço (Q-053 / Q-086, 16.6 "Dados de rodapé"). ' +
          'BLOQUEIO DE LANÇAMENTO enquanto vazio (16.6): sem estes dados o site não ' +
          'identifica quem responde por ele. Nenhum valor é preenchido por agente de ' +
          'desenvolvimento, nem como exemplo — o dado não existe hoje. Campo vazio no ' +
          'rodapé é marcado como placeholder em homologação e omitido em produção ' +
          '(dev/CONVENCOES.md §7.3/§7.4), nunca renderizado vazio.',
      },
      fields: [
        {
          name: 'razaoSocial',
          type: 'text',
          label: 'Razão social',
          admin: {
            description: 'Nome jurídico completo da empresa, não a marca ("ArtZan").',
          },
        },
        {
          name: 'cnpj',
          type: 'text',
          label: 'CNPJ',
        },
        {
          name: 'endereco',
          type: 'textarea',
          label: 'Endereço',
          admin: {
            description: 'Endereço físico a publicar no rodapé, conforme Q-053.',
          },
        },
      ],
    },
  ],
}

export default ConfiguracaoDoSite
