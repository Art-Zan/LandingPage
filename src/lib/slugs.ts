// Dono: Onda 2b
//
// Slugs de coleção e regras de slug de conteúdo (PRD 6.5, PR-014, RNF-083).
//
// NOTA DE CICLO DE IMPORTAÇÃO — por que os slugs de coleção são espelhados aqui.
// `src/payload.config.ts` (Onda 1) exporta ADMIN_USER_SLUG e MEDIA_SLUG. Importar
// esses valores dentro de um arquivo de coleção criaria o ciclo
// payload.config -> coleção -> payload.config: em ESM o corpo do config ainda não
// executou quando a coleção é avaliada, e ler a constante no topo do módulo lança
// ReferenceError (TDZ). Por isso os valores usados em `slug:` e `relationTo:`
// vivem aqui, em um módulo sem dependências. Os nomes e valores são idênticos aos
// de payload.config.ts; divergência entre os dois arquivos é erro de manutenção e
// está relatada ao maestro.

export const SLUG_USUARIOS = 'usuarios' // = ADMIN_USER_SLUG
export const SLUG_MIDIA = 'midia' // = MEDIA_SLUG
export const SLUG_CATEGORIAS = 'categorias'
export const SLUG_PRODUTOS = 'produtos'
export const SLUG_SOLUCOES = 'solucoes'
export const SLUG_PARCEIROS = 'parceiros'
export const SLUG_TIPOS_DE_PARCERIA = 'tipos-de-parceria'
export const SLUG_PAGINAS_INSTITUCIONAIS = 'paginas-institucionais'
export const SLUG_ITENS_DE_CONTEUDO = 'itens-de-conteudo'
export const SLUG_REGISTROS_DE_AUDITORIA = 'registros-de-auditoria'

/**
 * Segmentos que nenhum slug de conteúdo pode ocupar.
 * `en` é a reserva de idioma de RNF-083 / dev/CONVENCOES.md §5.1: o segmento
 * precisa continuar livre para quando o inglês for ativado. Mantido igual a
 * LOCALE_RESERVADO de payload.config.ts (ver nota de ciclo acima).
 */
export const SEGMENTOS_RESERVADOS: readonly string[] = ['en']

/** Prefixos proibidos por 6.5, regra 2: repetiriam o tipo em todo o catálogo. */
const PREFIXOS_PROIBIDOS: readonly string[] = ['software-', 'softwares-', 'solucao-', 'solucoes-']

const LIMITE_DE_CARACTERES = 60
const LIMITE_DE_PALAVRAS = 5

/**
 * Deriva o slug a partir do nome oficial (6.5, regra 6): minúsculas, sem acento,
 * sem cedilha, sem caractere especial; espaço e pontuação viram hífen.
 * NÃO acrescenta sufixo numérico em nenhuma hipótese (6.5, regra 3).
 */
export const gerarSlug = (origem: string): string =>
  origem
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * Aplica as regras de 6.5 a um slug já normalizado. Retorna `true` ou a mensagem
 * de recusa, no formato esperado por `validate` do Payload.
 *
 * DIVERGÊNCIA REGISTRADA: 6.5, regra 4, pede "de 2 a 5 palavras". O mínimo de duas
 * palavras NÃO é aplicado porque contradiz os próprios endereços do PRD — `/sobre`,
 * `/contato`, `/termos` e `/busca` (6.4) têm uma palavra. O máximo de 5 palavras e
 * o limite de 60 caracteres são aplicados.
 */
export const validarSlug = (valor: unknown): true | string => {
  if (typeof valor !== 'string' || valor.trim() === '') {
    return 'Slug obrigatório: é o endereço público do registro (6.5).'
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(valor)) {
    return 'Slug inválido: use apenas letras minúsculas, números e hífen, sem acento, cedilha, espaço ou caractere especial (6.5, regra 1).'
  }
  if (valor.length > LIMITE_DE_CARACTERES) {
    return `Slug com ${valor.length} caracteres: o limite é ${LIMITE_DE_CARACTERES} (6.5, regra 4).`
  }
  const palavras = valor.split('-')
  if (palavras.length > LIMITE_DE_PALAVRAS) {
    return `Slug com ${palavras.length} palavras: o limite é ${LIMITE_DE_PALAVRAS} (6.5, regra 4).`
  }
  if (SEGMENTOS_RESERVADOS.includes(valor)) {
    return `"${valor}" é segmento reservado do padrão de endereços (reserva de idioma, RNF-083). Escolha outro slug.`
  }
  if (PREFIXOS_PROIBIDOS.some((prefixo) => valor.startsWith(prefixo))) {
    return 'Slug não pode começar por "software-" ou "solucao-": o prefixo se repetiria em todo o catálogo (6.5, regra 2).'
  }
  if (palavras.some((palavra) => /^(19|20)\d{2}$/.test(palavra) || /^v\d+(\.\d+)?$/.test(palavra))) {
    return 'Slug não pode conter ano, versão ou termo temporal (6.5, regra 4).'
  }
  return true
}
