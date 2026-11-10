// Dono: Onda 3b
//
// Título, descrição, canônico e dados estruturados (12.1..12.6). Único ponto
// desta onda que monta `Metadata` do Next e blocos JSON-LD — evita que cada
// página monte sua própria versão divergente do mesmo contrato.
//
// TRAVA DESTA ONDA: a montagem de título e descrição passa SEMPRE por
// `tituloSeoDe` / `descricaoSeoDe` (src/lib/seo-automatico.ts, Onda 2b) —
// nunca lê `seoTitulo`, `seoDescricao`, `nome` ou `resumo*` diretamente. É essa
// indireção que impede o título congelar quando o nome do registro muda.
//
// VAZAMENTO CORRIGIDO NA ONDA 4a. `tituloSeoDe` chegou a incluir `produto.nome`
// cru na cadeia de fallback — o nome PROPOSTO ("Theo", "Iago", "Nina"), não
// aprovado como identificação principal (PR-063, dev/CONVENCOES.md §4.4) —
// alcançando título de busca e Open Graph sem que um `seoTitulo` manual
// existisse. `seo-automatico.ts` agora passa pela mesma
// `identificacaoPublicaDoProduto` (src/lib/identificacao-de-produto.ts) que já
// protege H1, card e trilha, antes de tocar em `nome`. Nenhum `seoTitulo`
// manual é mais necessário para os três produtos provisórios.
//
// Canônico sempre por `montarUrlAbsoluta` (src/lib/rotas.ts, Onda 3a) — nenhum
// domínio nem caminho literal. Indexação cruza a decisão por página com
// `permiteIndexacao()` (src/lib/env.ts, Onda 1): homologação nunca indexa,
// mesmo que a página peça indexação (RF-164).

import type { Metadata } from 'next'

import { permiteIndexacao } from './env'
import { type Idioma, IDIOMA_PADRAO, montarUrlAbsoluta } from './rotas'
import { NOME_DA_MARCA, TRILHA } from './rotulos'
import { descricaoSeoDe, tituloSeoDe } from './seo-automatico'

const SUFIXO_DE_MARCA = `${NOME_DA_MARCA}`

/**
 * Título de página, com o sufixo fixo de marca (12.2, regra geral): `| ArtZan`
 * em toda página exceto a inicial, onde a marca vem primeiro dentro do
 * próprio título (o hero da inicial já é redigido assim pelo editor).
 * `undefined` quando o registro não tem nome nem sobrescrita — nunca um
 * título genérico inventado por este arquivo.
 */
export const tituloDePagina = (registro: unknown, comSufixoDeMarca = true): string | undefined => {
  const base = tituloSeoDe(registro)
  if (!base) return undefined
  return comSufixoDeMarca ? `${base} | ${SUFIXO_DE_MARCA}` : base
}

/** Descrição de busca. `undefined` quando o registro não tem resumo nem sobrescrita. */
export const descricaoDePagina = (registro: unknown): string | undefined => descricaoSeoDe(registro)

export type ImagemDeCompartilhamento = {
  /** Relativa (mesma origem, mídia do Payload) ou absoluta. Nunca inventada. */
  url: string
  alt: string
}

export type OpcoesDeMetadados = {
  /** Registro cujo `seoTitulo`/`seoDescricao`/nome/resumo alimentam o título e a descrição. */
  registro: unknown
  /** Segmentos após o idioma. `[]` para a inicial, `['sobre']`, `['produtos', slug]`. */
  segmentos: string[]
  idioma?: Idioma
  /**
   * Decisão de indexação DESTA página (RF-164, 12.5). Combinada com
   * `permiteIndexacao()`: homologação nunca indexa, mesmo com `true` aqui.
   */
  indexavel?: boolean
  /** `false` só na inicial, cujo título já traz a marca (12.2). */
  comSufixoDeMarca?: boolean
  imagem?: ImagemDeCompartilhamento
}

/**
 * `Metadata` do Next para uma página pública. Cobre título, descrição,
 * canônico (12.5) e Open Graph (12.6). Dados estruturados são um bloco à
 * parte — ver `dadosEstruturadosParaScript` — porque o Next não tem um campo
 * de `Metadata` para JSON-LD.
 */
export const construirMetadados = ({
  registro,
  segmentos,
  idioma = IDIOMA_PADRAO,
  indexavel = true,
  comSufixoDeMarca = true,
  imagem,
}: OpcoesDeMetadados): Metadata => {
  const titulo = tituloDePagina(registro, comSufixoDeMarca)
  const descricao = descricaoDePagina(registro)
  const canonico = montarUrlAbsoluta(idioma, ...segmentos)
  const podeIndexar = indexavel && permiteIndexacao()

  return {
    title: titulo,
    description: descricao,
    alternates: { canonical: canonico },
    robots: podeIndexar
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      title: titulo,
      description: descricao,
      url: canonico,
      siteName: NOME_DA_MARCA,
      locale: 'pt_BR',
      type: 'website',
      images: imagem ? [{ url: imagem.url, alt: imagem.alt }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: titulo,
      description: descricao,
      images: imagem ? [imagem.url] : undefined,
    },
  }
}

// ---------------------------------------------------------------------------
// DADOS ESTRUTURADOS (12.4). Espelham só o que é visível na própria página
// (regra transversal de 12.4) — nenhum campo de avaliação, nota, preço ou
// disponibilidade, porque nenhum deles existe (PR-005, PR-007, Q-008).
// ---------------------------------------------------------------------------

type NoDeGrafo = Record<string, unknown>

/**
 * Organization + WebSite (12.4), uma vez por site, na inicial.
 *
 * CAMPOS AUSENTES, POR FALTA DE DADO (não por esquecimento): razão social e
 * identificação fiscal (Q-086), endereço físico, ponto de contato comercial
 * (e-mail e WhatsApp — território da Onda 3c) e logotipo derivado (11.16,
 * Q-077/Q-078 — arquivo ainda não existe). Cada um entra assim que tiver
 * valor verificável; nenhum é inventado agora.
 */
export const jsonLdOrganizacaoEWebsite = (): NoDeGrafo => {
  const urlDoSite = montarUrlAbsoluta(IDIOMA_PADRAO)
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: NOME_DA_MARCA,
        url: urlDoSite,
      },
      {
        '@type': 'WebSite',
        name: NOME_DA_MARCA,
        url: urlDoSite,
        inLanguage: 'pt-BR',
      },
    ],
  }
}

export type DadosDeProdutoParaJsonLd = {
  /** Identificação pública já resolvida por PR-063 — nunca `produto.nome` cru. */
  titulo: string
  descricao?: string
  urlCanonica: string
  imagem?: ImagemDeCompartilhamento
}

/**
 * SoftwareApplication + BreadcrumbList (12.4) para P-04. Sem campo de oferta
 * — não há preço publicado (PR-005, Q-008): a ausência é deliberada, não
 * lacuna.
 */
export const jsonLdDeProduto = (dados: DadosDeProdutoParaJsonLd): NoDeGrafo => {
  const urlDaInicial = montarUrlAbsoluta(IDIOMA_PADRAO)
  const urlDoCatalogo = montarUrlAbsoluta(IDIOMA_PADRAO, 'produtos')

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: dados.titulo,
        description: dados.descricao,
        url: dados.urlCanonica,
        image: dados.imagem?.url,
        applicationCategory: 'BusinessApplication',
        provider: { '@type': 'Organization', name: NOME_DA_MARCA, url: urlDaInicial },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: TRILHA.inicio, item: urlDaInicial },
          { '@type': 'ListItem', position: 2, name: TRILHA.softwares, item: urlDoCatalogo },
          { '@type': 'ListItem', position: 3, name: dados.titulo, item: dados.urlCanonica },
        ],
      },
    ],
  }
}

/** AboutPage (12.4) para P-02. Custo baixo, ajuda na desambiguação institucional. */
export const jsonLdDePaginaSobre = (urlCanonica: string): NoDeGrafo => ({
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  url: urlCanonica,
  about: { '@type': 'Organization', name: NOME_DA_MARCA },
})

/**
 * Serializa um bloco de dados estruturados para uso em
 * `<script type="application/ld+json">`. JSON puro: nenhuma marca de HTML
 * escapada é necessária porque o conteúdo é gerado por este arquivo, nunca
 * texto livre de visitante.
 */
export const serializarDadosEstruturados = (dados: NoDeGrafo): string => JSON.stringify(dados)
