// Dono: Onda 3b
//
// Resolve como cada produto é IDENTIFICADO PUBLICAMENTE — H1, título de card,
// trilha, assunto de formulário — sob a regra de dev/CONVENCOES.md §4.4 e PRD
// 11.4 (regra 6) / PR-063: só "Sistema Lara" tem nome aprovado. Os outros três
// produtos do lançamento se identificam pela DESCRIÇÃO FUNCIONAL enquanto
// Q-084 / D-12 não fecham; o nome proposto (Theo, Iago, Nina) é complemento
// explicitamente marcado como "a aprovar", NUNCA a identificação principal
// (dev/CONVENCOES.md §8, item 3).
//
// LACUNA DE MODELO RELATADA AO MAESTRO. `Produtos.nome` (Onda 2b, único campo
// de nome) não distingue "nome aprovado" de "nome proposto", e não existe
// campo de "descrição funcional" no modelo de conteúdo (6.7). Por isso a
// decisão abaixo é derivada do SLUG — imutável após a primeira publicação
// (PR-014) e enumerado, um a um, por dev/CONVENCOES.md §4.4 — e não de um
// campo de conteúdo digitado. Isto não é dado de negócio inventado: é a
// mesma tabela de convenção que já governa o slug de cada produto, lida em
// código em vez de repetida à mão em cada template. Se o modelo ganhar um
// campo próprio (`descricaoFuncional`, `nomeAprovado`), este arquivo passa a
// ser o único ponto a ajustar.

import type { Produto } from '@/payload-types'

/**
 * Espelha dev/CONVENCOES.md §4.4, coluna "Slug". Descrição funcional, NUNCA o
 * nome proposto — é o texto que 11.4 usa como identificação principal
 * enquanto o nome não for aprovado ("Alocação de quadras — reservas e
 * horários", "scout para partidas esportivas", "placar esportivo").
 */
const DESCRICAO_FUNCIONAL_POR_SLUG: Readonly<Record<string, string>> = {
  'alocacao-de-quadras': 'Alocação de quadras',
  'scout-esportivo': 'Scout para partidas esportivas',
  'placar-esportivo': 'Placar esportivo',
}

/** Espelha dev/CONVENCOES.md §4.4: o único slug com nome aprovado hoje. */
const SLUGS_COM_NOME_APROVADO: readonly string[] = ['sistema-lara']

/** O nome do registro pode ser usado como identificação principal? */
export const nomeDoProdutoEstaAprovado = (produto: Pick<Produto, 'slug'>): boolean =>
  SLUGS_COM_NOME_APROVADO.includes(produto.slug)

export type IdentificacaoDoProduto = {
  /** Identificação principal: H1, título de card, trilha, assunto de formulário. */
  titulo: string
  /**
   * Presente só quando o nome do produto ainda não foi aprovado. É o nome
   * PROPOSTO (Theo, Iago, Nina) — complemento explícito, nunca identificação
   * principal (dev/CONVENCOES.md §8, item 3). Quem renderiza este campo é
   * obrigado a rotulá-lo como "a aprovar"; este módulo não decide a redação
   * do rótulo (RNF-074 — texto de interface não fica preso a este arquivo).
   */
  nomePropostoAAprovar?: string
}

/**
 * Identificação pública do produto, sob PR-063. Nunca lê `produto.nome`
 * isoladamente sem checar a aprovação primeiro — é essa checagem que evita
 * publicar "Theo" como identificação principal antes de Q-084 fechar.
 */
export const identificacaoPublicaDoProduto = (
  produto: Pick<Produto, 'slug' | 'nome'>,
): IdentificacaoDoProduto => {
  if (nomeDoProdutoEstaAprovado(produto)) {
    return { titulo: produto.nome }
  }

  const descricaoFuncional = DESCRICAO_FUNCIONAL_POR_SLUG[produto.slug]

  // Slug fora da tabela de dev/CONVENCOES.md §4.4: nenhum produto do
  // lançamento deveria cair aqui. Em vez de lançar exceção e derrubar a
  // página inteira, cai para o nome do registro — e o fato fica visível na
  // revisão editorial porque o produto não bate com nenhum dos quatro
  // conhecidos.
  if (!descricaoFuncional) {
    return { titulo: produto.nome }
  }

  return { titulo: descricaoFuncional, nomePropostoAAprovar: produto.nome }
}
