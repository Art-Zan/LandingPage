// Onda 1 — leitura tipada do ambiente. Único ponto do código que lê `process.env`
// para configuração de site; nenhuma outra onda deve espalhar `process.env` pelos
// templates (RNF-070, RNF-074).

/**
 * Modo do ambiente. Dois valores, e apenas dois.
 * - `homolog`: homologação (RNF-103). Placeholder é marcado visualmente e o site
 *   inteiro é declarado não indexável.
 * - `producao`: ambiente público. Registro placeholder publicado quebra o build.
 */
export type SiteMode = 'homolog' | 'producao'

const MODOS: readonly SiteMode[] = ['homolog', 'producao'] as const

const lerSiteMode = (): SiteMode => {
  const bruto = process.env.SITE_MODE
  // Ausência de valor NÃO cai em `producao`: o modo permissivo é o seguro aqui,
  // porque tratar homologação como produção por engano publicaria placeholder.
  if (!bruto) return 'homolog'
  const valor = bruto.trim().toLowerCase()
  if (!(MODOS as readonly string[]).includes(valor)) {
    throw new Error(
      `SITE_MODE inválido: "${bruto}". Valores aceitos: ${MODOS.join(' | ')}.`,
    )
  }
  return valor as SiteMode
}

export const SITE_MODE: SiteMode = lerSiteMode()

export const ehProducao = (): boolean => SITE_MODE === 'producao'
export const ehHomologacao = (): boolean => SITE_MODE === 'homolog'

/**
 * Base absoluta do site, sem barra final. Alimenta canônico (RF-161) e sitemap (RF-163).
 */
export const SITE_URL: string = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
).replace(/\/+$/, '')

/**
 * O site é indexável apenas em produção (RF-164): homologação nunca entra em buscador.
 */
export const permiteIndexacao = (): boolean => ehProducao()
