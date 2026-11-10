/**
 * Marca visual de conteúdo provisório.
 * Contrato: dev/CONVENCOES.md, seção 7 (7.3 — o que acontece em homologação)
 * Visual: 11.12 (cor de atenção — 5,65:1 no tema claro, 10,68:1 no escuro),
 *         11.14 (caixa alta só em rótulo curto, +4% de espaçamento), 11.15
 * Acessibilidade: 13.3 (nada depende só de cor), 13.8 (caixa alta proibida em
 *                 bloco de texto — esta é uma etiqueta de duas palavras)
 * Ambiente: RNF-103 (homologação), RF-164 (homologação não indexável)
 * Perguntas abertas que afetam este arquivo: 16.6 — os cinco insumos do
 *   lançamento não existem (Q-005 capturas, Q-077/Q-078 logotipo, D-16 textos
 *   legais, D-17 ambiente de avaliação)
 * Dono: Onda 2a
 *
 * COMPORTAMENTO, EM UMA FRASE: aparece SÓ em homologação; em produção não
 * renderiza nada.
 *
 * A leitura do ambiente passa por `src/lib/env.ts`, único ponto do código
 * autorizado a ler `process.env` para configuração (dev/CONVENCOES.md, seção
 * 2). Este arquivo NÃO lê `process.env`.
 *
 * ESTA MARCA NÃO É A TRAVA. A trava de produção é o `prebuild` que quebra o
 * build e o `beforeChange` da coleção (seção 7.4), ambos da Onda 4. A marca é
 * o sinal para o revisor humano em homologação, e por isso precisa ser
 * impossível de confundir com conteúdo real: etiqueta persistente, em caixa
 * alta curta, contorno próprio e cor de atenção — que nunca é usada em
 * conteúdo.
 *
 * O TEXTO DA ETIQUETA VEM DE QUEM A USA. Nenhum rótulo fica fixo aqui: a
 * redação é da Onda 4, sob o glossário de 11.8 (RNF-074).
 */

import { ehHomologacao } from '@/lib/env'

import { juntarClasses } from './juntarClasses'

export type PropsDaMarcaDePlaceholder = {
  /**
   * Rótulo curto da etiqueta, em caixa normal — a caixa alta é aplicada pelo
   * estilo. Duas ou três palavras: é uma etiqueta, não uma frase.
   */
  rotulo: string
  /**
   * O que exatamente é provisório neste ponto — campo, imagem, registro.
   * Some da tela em produção junto com a etiqueta.
   */
  detalhe?: string
  className?: string
}

export const MarcaDePlaceholder = ({ rotulo, detalhe, className }: PropsDaMarcaDePlaceholder) => {
  // Em produção o componente não existe na árvore renderizada.
  if (!ehHomologacao()) return null

  return (
    <span
      className={juntarClasses(
        'inline-flex flex-wrap items-center gap-entre-alvos',
        'p-2 rounded-controle border border-atencao bg-superficie',
        'text-apoio leading-corpo text-atencao',
        className,
      )}
    >
      <span className="font-rotulo uppercase tracking-caixa-alta">{rotulo}</span>
      {detalhe ? <span className="normal-case">{detalhe}</span> : null}
    </span>
  )
}
