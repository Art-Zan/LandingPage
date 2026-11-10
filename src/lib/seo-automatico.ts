// Dono: Onda 2b (contrato) / Onda 4a (correção do vazamento de SEO nos três
// produtos provisórios)
//
// Derivação de título e descrição de SEO — 6.7 ("automáticos a partir de nome e
// resumo") e RF-160 (sobrescrita manual possível).
//
// O valor derivado NÃO é gravado: campo de SEO vazio significa "automático". Se
// fosse gravado na primeira publicação, mudar o nome do produto deixaria o título
// de SEO congelado no nome antigo, sem ninguém perceber.
//
// A camada de template (Onda 3b, `src/lib/seo.ts`) deve chamar estas funções em
// vez de ler `seoTitulo` / `seoDescricao` diretamente.
//
// ——— Papel da Onda 4a ———
//
// A Onda 2b definiu o contrato: `seoTitulo`/`seoDescricao` vazios caem na cadeia
// automática. Para a maioria das entidades (Parceiro, páginas institucionais,
// Categoria, Solução, TipoDeParceria) essa cadeia lê `nome`/`titulo` direto,
// sem problema. Para Produto, porém, `nome` carrega o nome proposto ("Theo",
// "Iago", "Nina") quando D-12 ainda não fechou, e publicá-lo no título de
// busca violaria 11.4 (proibição de nome não aprovado em identificação pública)
// e PR-063 (mesma proibição,como premissa estrutural).
//
// A Onda 4a fechou o defeito fazendo `tituloSeoDe` passar por
// `identificacaoPublicaDoProduto` (src/lib/identificacao-de-produto.ts, Onda 3b)
// ANTES de tocar em `nome`. Hoje a função só consulta essa camada quando o
// registro tem `slug` E `nome` preenchidos: para os quatro slugs conhecidos
// (incluindo o `sistema-lara` com nome aprovado), devolve a identificação
// pública aprovada; para qualquer outro slug (Categoria, Solução,
// TipoDeParceria), devolve o próprio `nome` sem alteração — comportamento
// idêntico ao anterior, sem regressão. Registros sem `slug` (Parceiro, página
// institucional identificada só por `titulo`) seguem caindo em `nome`/`titulo`
// como antes.

import { lerPropriedade, textoNaoVazio } from './campos-payload'
import { identificacaoPublicaDoProduto } from './identificacao-de-produto'

const primeiroTextoDe = (registro: unknown, chaves: readonly string[]): string | undefined => {
  for (const chave of chaves) {
    const valor = lerPropriedade(registro, chave)
    if (textoNaoVazio(valor)) return valor.trim()
  }
  return undefined
}

/**
 * Identificação pública de PR-063, quando o registro tiver a forma de um
 * produto (`slug` e `nome` preenchidos). `undefined` para qualquer registro
 * sem `slug` — nunca lança exceção, porque a maioria das coleções (Parceiro,
 * página institucional) não tem esse campo.
 */
const identificacaoAprovadaDoRegistro = (registro: unknown): string | undefined => {
  const slug = lerPropriedade(registro, 'slug')
  const nome = lerPropriedade(registro, 'nome')
  if (!textoNaoVazio(slug) || !textoNaoVazio(nome)) return undefined
  return identificacaoPublicaDoProduto({ slug, nome }).titulo
}

/**
 * Título de SEO: sobrescrita manual quando existir; senão, a identificação
 * pública aprovada (nunca o nome proposto não aprovado); senão, `titulo` do
 * registro (páginas institucionais, sem `nome`).
 */
export const tituloSeoDe = (registro: unknown): string | undefined => {
  const manual = primeiroTextoDe(registro, ['seoTitulo'])
  if (manual) return manual

  const identificacao = identificacaoAprovadaDoRegistro(registro)
  if (identificacao) return identificacao

  return primeiroTextoDe(registro, ['nome', 'titulo'])
}

/** Descrição de SEO: sobrescrita manual quando existir, senão o resumo do registro. */
export const descricaoSeoDe = (registro: unknown): string | undefined =>
  primeiroTextoDe(registro, ['seoDescricao', 'resumo', 'resumoUmaLinha', 'descricaoCurta'])
