// Dono: Onda 3a
//
// Construção de TODA URL interna do site. Nenhum template, componente,
// metadado ou entrada de sitemap escreve um caminho literal
// (dev/CONVENCOES.md, seção 5.1, regra 2).
//
// Implementa: RNF-083 (reserva estrutural de segundo idioma), RF-161 (canônico),
//             RF-163 (sitemap só do idioma padrão), Q-002 (domínio ainda não confirmado)
// Perguntas abertas que afetam este arquivo: Q-011 (quando o inglês liga),
//             Q-002 (domínio definitivo — vem de NEXT_PUBLIC_SITE_URL, nunca literal)
//
// A reserva de inglês é feita por CENTRALIZAÇÃO, não por criação de rota:
// nenhum arquivo existe sob `/en` na etapa 1, então qualquer endereço em
// inglês responde 404. Este módulo já recebe o idioma como parâmetro e emite
// prefixo vazio para `pt-BR`. Ligar o inglês depois é acrescentar um segmento
// dinâmico de rota e passar outro idioma — não é reescrever endereço publicado.

import { SITE_URL } from './env'

export type Idioma = 'pt-BR' | 'en'

export const IDIOMA_PADRAO: Idioma = 'pt-BR'

/**
 * Prefixo de caminho por idioma. O português NÃO ganha prefixo: `/produtos`
 * continua sendo o endereço publicado quando o inglês for ligado
 * (CONVENCOES.md 5.1, regra 1).
 */
const PREFIXO_POR_IDIOMA: Readonly<Record<Idioma, string>> = {
  'pt-BR': '',
  en: '/en',
}

/**
 * Segmento reservado ao segundo idioma. Nenhuma página, produto, categoria ou
 * solução pode usá-lo como slug (CONVENCOES.md 5.1, regra 4).
 */
export const SEGMENTO_RESERVADO_DE_IDIOMA = 'en'

/**
 * Idiomas cujas páginas podem ser publicadas e indexadas na etapa 1.
 * Enquanto o inglês estiver desligado, esta lista tem um elemento só — e é
 * ela que o sitemap percorre, o que torna impossível emitir uma entrada em
 * inglês por esquecimento (CONVENCOES.md 5.3, trava 3).
 */
export const IDIOMAS_PUBLICADOS: readonly Idioma[] = [IDIOMA_PADRAO] as const

/** Um idioma pode ser publicado e indexado hoje? */
export const idiomaEstaPublicado = (idioma: Idioma): boolean =>
  IDIOMAS_PUBLICADOS.includes(idioma)

const normalizarSegmento = (segmento: string): string =>
  segmento.trim().replace(/^\/+/, '').replace(/\/+$/, '')

/**
 * Caminho relativo. Emite prefixo vazio para pt-BR e '/en' para en.
 * Segmentos vazios são descartados, de modo que `montarCaminho('pt-BR')`
 * devolve `/`.
 */
export function montarCaminho(idioma: Idioma, ...segmentos: string[]): string {
  const prefixo = PREFIXO_POR_IDIOMA[idioma]
  const partes = segmentos
    .map(normalizarSegmento)
    .filter((parte) => parte.length > 0)
    .map((parte) => parte.split('/').filter(Boolean).join('/'))
    .filter((parte) => parte.length > 0)

  if (partes.length === 0) return prefixo === '' ? '/' : prefixo
  return `${prefixo}/${partes.join('/')}`
}

/**
 * URL absoluta, com origem vinda de NEXT_PUBLIC_SITE_URL via src/lib/env.ts.
 * Nenhum domínio literal existe no código (CONVENCOES.md, seção 4).
 */
export function montarUrlAbsoluta(idioma: Idioma, ...segmentos: string[]): string {
  const caminho = montarCaminho(idioma, ...segmentos)
  return caminho === '/' ? `${SITE_URL}/` : `${SITE_URL}${caminho}`
}

/**
 * Atalhos nomeados. Nenhum consumidor monta caminho por concatenação de string.
 * As rotas de etapa 2 e Futuro (4.2 e 4.3) NÃO aparecem aqui de propósito:
 * um atalho existente convida a criar o link.
 */
export const ROTAS = {
  inicial: (idioma: Idioma = IDIOMA_PADRAO): string => montarCaminho(idioma),
  sobre: (idioma: Idioma = IDIOMA_PADRAO): string => montarCaminho(idioma, 'sobre'),
  catalogo: (idioma: Idioma = IDIOMA_PADRAO): string => montarCaminho(idioma, 'produtos'),
  produto: (slug: string, idioma: Idioma = IDIOMA_PADRAO): string =>
    montarCaminho(idioma, 'produtos', slug),
  contato: (idioma: Idioma = IDIOMA_PADRAO): string => montarCaminho(idioma, 'contato'),
  obrigado: (idioma: Idioma = IDIOMA_PADRAO): string => montarCaminho(idioma, 'obrigado'),
  privacidade: (idioma: Idioma = IDIOMA_PADRAO): string =>
    montarCaminho(idioma, 'privacidade'),
  termos: (idioma: Idioma = IDIOMA_PADRAO): string => montarCaminho(idioma, 'termos'),
  parceiros: (idioma: Idioma = IDIOMA_PADRAO): string => montarCaminho(idioma, 'parceiros'),
} as const
