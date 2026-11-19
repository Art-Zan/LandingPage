// Dono: Onda 5 (marca, capa e movimento — 2026-11-13)
//
// Ponto ÚNICO de endereço dos ativos visuais rasterizados: logotipo e imagem
// da capa da inicial. Lido pelo site (cabeçalho, rodapé, capa) e pelo gerador
// `scripts/gerar-ativos-visuais.ts`, que produz exatamente estes arquivos.
// Sem importação de nada: o script roda fora do Next.

/**
 * Logotipo (anexo do cliente de 2026-11-13, recortado e reamostrado — nunca
 * redesenhado). `largura`/`altura` são as de EXIBIÇÃO em px; o arquivo é
 * gerado em 2x. O fundo é transparente: a peça é sempre posta sobre a placa
 * clara `--az-fundo-da-marca` (11.13 — não existe versão reversa aprovada,
 * Q-077/Q-078), por isso o mesmo arquivo serve aos dois temas.
 */
export const MARCA = {
  monograma: { src: '/marca/artzan-monograma.webp', largura: 36, altura: 36 },
  logo: { src: '/marca/artzan-logo.webp', largura: 160, altura: 160 },
  /** Peça completa em alta resolução, transparente. Mestre para usos futuros. */
  logoMestre: '/marca/artzan-logo.png',
} as const

/**
 * IMAGEM DA CAPA — PROVISÓRIA.
 *
 * O projeto não tem foto própria e a regra vigente é não usar banco de
 * imagens. Esta é uma composição abstrata gerada por
 * `scripts/gerar-ativos-visuais.ts` (facetas sólidas na geometria do
 * monograma, tons de `--az-capa-tom-*`). Para trocar por uma foto real:
 *   1. gerar os arquivos nas larguras abaixo, nos mesmos nomes (ou mudar
 *      `ARQUIVO_DA_CAPA`), em webp, ≤ 200 KB cada (RNF-012);
 *   2. remedir o contraste: o véu (`--az-capa-veu*`) foi calibrado para o
 *      pior tom DESTA composição; uma foto pede refazer a conta de
 *      `verificar-contraste.mjs` com o pixel mais claro da área do texto.
 * Nenhum outro arquivo precisa mudar.
 */
export const CAPA_PROVISORIA = true

export type OrientacaoDaCapa = 'paisagem' | 'retrato'

export const PROPORCAO_DA_CAPA: Record<OrientacaoDaCapa, { largura: number; altura: number }> = {
  paisagem: { largura: 16, altura: 9 },
  retrato: { largura: 9, altura: 16 },
}

export const LARGURAS_DA_CAPA: Record<OrientacaoDaCapa, readonly number[]> = {
  paisagem: [960, 1440, 1920],
  retrato: [600, 900, 1200],
}

export const ARQUIVO_DA_CAPA = (orientacao: OrientacaoDaCapa, largura: number) =>
  `/capa/capa-${orientacao}-${largura}.webp`

/** Menor arquivo gerado com largura ≥ a pedida; o maior, se nenhum bastar. */
export const arquivoDaCapaPara = (orientacao: OrientacaoDaCapa, larguraPedida: number) => {
  const larguras = LARGURAS_DA_CAPA[orientacao]
  const escolhida = larguras.find((l) => l >= larguraPedida) ?? larguras[larguras.length - 1]!
  return ARQUIVO_DA_CAPA(orientacao, escolhida)
}
