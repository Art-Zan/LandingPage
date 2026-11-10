/**
 * Carregamento das duas famílias tipográficas do sistema.
 * Implementa: RNF-014 (máx. 2 famílias, 4 arquivos, 150 KB, texto legível antes
 *             do carregamento), RNF-010 (deslocamento de layout na troca de fonte)
 * Visual: 11.14 (Space Grotesk em título, Inter em corpo — licença aberta, SIL OFL)
 * Perguntas abertas que afetam este arquivo: Q-075 (existe fonte já em uso pela
 *   empresa que deva prevalecer? Se sim, troca-se o arquivo aqui e o valor de
 *   `--az-fonte-*` em tokens.css — nada mais)
 * Dono: Onda 3a
 *
 * ORÇAMENTO DE RNF-014, MEDIDO (bytes reais em `public/fonts/`):
 *   space-grotesk-latin-variable.woff2 ....  22.288 B  (21,8 KB)
 *   inter-latin-variable.woff2 ............  48.256 B  (47,1 KB)
 *   ------------------------------------------------------------
 *   2 famílias · 2 arquivos · 70.544 B = 68,9 KB   (teto: 4 arquivos / 150 KB)
 *
 * SUBCONJUNTO `latin` APENAS, E É DECISÃO, NÃO ESQUECIMENTO. O intervalo
 * U+0000–00FF cobre integralmente a acentuação do português (ã ç é ê í ó ô õ ú
 * à â) exigida por PR-006. Os arquivos `latin-ext` das duas famílias somariam
 * mais 104.008 B e estourariam o teto de 150 KB de RNF-014 sem servir a
 * nenhum caractere do conteúdo publicado. Caractere fora do intervalo cai na
 * pilha de alternativa do sistema — legível, apenas com outro desenho.
 *
 * POR QUE ARQUIVO LOCAL E NÃO `next/font/google`: `next/font/google` baixa a
 * fonte durante o build. Build sem rede — ou com a API do Google indisponível —
 * passa a falhar por motivo alheio ao código. O arquivo versionado torna o
 * build determinístico e o peso auditável byte a byte, que é o que RNF-014 pede.
 *
 * LIGAÇÃO COM OS TOKENS. `variable` escreve exatamente as variáveis que a Onda
 * 2a declarou em `src/styles/tokens.css`; `fallback` repete a MESMA pilha de
 * alternativa declarada lá, para que o valor não seja alterado — só ganhe o
 * arquivo real à frente e a face de métrica ajustada que reduz o deslocamento
 * de RNF-010. Nenhum tamanho, peso ou altura de linha é definido aqui: esses
 * continuam sendo tokens, e este arquivo não os toca.
 * A fonte de verdade da pilha continua sendo `tokens.css`. Se ela mudar lá,
 * muda aqui — e o inverso não vale.
 */

import localFont from 'next/font/local'

/** 11.14 — títulos: geométrica de traço anguloso, números de largura uniforme. */
export const fonteDeTitulo = localFont({
  src: [
    {
      path: '../../../public/fonts/space-grotesk-latin-variable.woff2',
      // Arquivo variável: cobre 400 (não usado em título) a 700 (H1) num só peso declarado.
      weight: '400 700',
      style: 'normal',
    },
  ],
  // RNF-014 — o texto aparece imediatamente na alternativa e é trocado depois.
  display: 'swap',
  variable: '--az-fonte-titulo',
  fallback: ['Segoe UI', 'system-ui', '-apple-system', 'Helvetica Neue', 'Arial', 'sans-serif'],
  adjustFontFallback: 'Arial',
  preload: true,
})

/** 11.14 — texto corrido: humanista desenhada para tela. */
export const fonteDeCorpo = localFont({
  src: [
    {
      path: '../../../public/fonts/inter-latin-variable.woff2',
      weight: '400 700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--az-fonte-corpo',
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
  adjustFontFallback: 'Arial',
  preload: true,
})

/** Classes que publicam as duas variáveis. Aplicadas UMA vez, no `<html>`. */
export const CLASSES_DE_FONTE = `${fonteDeTitulo.variable} ${fonteDeCorpo.variable}`
