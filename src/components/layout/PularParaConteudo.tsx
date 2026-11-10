/**
 * Link de salto para o conteúdo principal.
 * Implementa: RF-009 (primeiro elemento focável de toda página, ordem de
 *   tabulação e devolução de foco previsível)
 * Acessibilidade: 13.2 regra 4 (invisível até o foco, nunca removido do
 *   fluxo, nunca oculto de forma permanente)
 * Dono: Onda 3a
 *
 * A APARÊNCIA VEM DE `src/styles/globals.css` (`.az-pular-para-conteudo`,
 * Onda 2a): posição, transição de entrada e contorno de foco já estão lá.
 * Este arquivo só decide ONDE o link vive na árvore — precisa ser o primeiro
 * elemento focável de `(site)/layout.tsx`, antes do cabeçalho — e para onde
 * ele aponta: o `id` do elemento de conteúdo principal.
 *
 * NENHUM VALOR VISUAL É ESCRITO AQUI (dev/CONVENCOES.md §8, item 5): a única
 * classe aplicada é o utilitário de componente já definido em `globals.css`.
 */

export type PropsDePularParaConteudo = {
  /** `id` do elemento que recebe o foco — o `<main>` do shell público. */
  destino: string
}

export const PularParaConteudo = ({ destino }: PropsDePularParaConteudo) => (
  <a href={`#${destino}`} className="az-pular-para-conteudo">
    Pular para o conteúdo
  </a>
)
