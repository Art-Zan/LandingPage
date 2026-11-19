/**
 * Moldura padrão de captura de tela de produto.
 * Visual: 11.17 (mesma proporção, mesma borda de 1 px, sem bisel nem sombra
 *         de dispositivo), 11.15 (raio de bloco, sem efeito de profundidade),
 *         11.12 (borda e superfície)
 * Acessibilidade: 13.4 (texto alternativo), 13.11 (captura é ilustração, nunca
 *                 fonte da informação)
 * Perguntas abertas que afetam este arquivo:
 *   Q-005 (as capturas não existem), Q-081 (quem aprova o enquadramento)
 * Dono: Onda 2a
 *
 * POR QUE ESTA MOLDURA É UM PRIMITIVO E NÃO UM ESTILO SOLTO.
 * 11.17 diz que a captura de tela é o ÚNICO elemento que de fato varia entre
 * produtos, e que ela vive sempre dentro de moldura padrão IDÊNTICA. É esse
 * "idêntica" que impede o vigésimo produto de exigir decisão de identidade
 * nova — o principal mecanismo de coesão que resta sob o padrão de nomes
 * independentes de Q-051. Uma moldura reescrita por template é o começo da
 * fragmentação que PR-040 proíbe.
 *
 * PROIBIDO POR CONSTRUÇÃO: bisel, relevo, brilho, contorno duplo e sombra de
 * dispositivo (11.15, 11.17). Não há propriedade que os ligue, e a proporção
 * não é configurável: ela vem do token `--az-proporcao-captura`.
 *
 * A IMAGEM É PASSADA COMO FILHO, de propósito. Carregamento sob demanda,
 * prioridade da imagem da primeira tela e escolha de `next/image` são decisões
 * de desempenho da página (RNF-011), não do primitivo visual. O TEXTO
 * ALTERNATIVO é obrigação de quem passa a imagem, conforme a regra por tipo
 * de 13.4: descreve o que a tela mostra em termos de FUNÇÃO, nunca "captura
 * de tela do sistema", em até 125 caracteres.
 */

import type { ReactNode } from 'react'

import { juntarClasses } from './juntarClasses'

export type PropsDaMolduraCaptura = {
  /** A imagem. Precisa carregar o próprio texto alternativo (13.4). */
  children: ReactNode
  /**
   * Legenda visível. Nunca repete o texto alternativo — o leitor de tela
   * ouviria a mesma frase duas vezes (13.4).
   */
  legenda?: string
  className?: string
}

export const MolduraCaptura = ({ children, legenda, className }: PropsDaMolduraCaptura) => (
  <figure className={juntarClasses('m-0', className)}>
    <div
      className={juntarClasses(
        // Restyle: `az-moldura-captura` dá à imagem o zoom de 1,03 dentro do
        // quadro quando o card que a contém recebe o ponteiro (globals.css).
        'az-moldura-captura aspect-captura overflow-hidden',
        'rounded-bloco border border-borda bg-superficie-elevada',
        // A imagem preenche a moldura sem alterar a proporção do quadro.
        '[&>*]:h-full [&>*]:w-full [&>*]:object-cover',
      )}
    >
      {children}
    </div>
    {legenda ? (
      <figcaption className="mt-2 max-w-texto text-apoio leading-corpo text-texto-secundario">
        {legenda}
      </figcaption>
    ) : null}
  </figure>
)
