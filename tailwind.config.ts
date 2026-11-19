// Onda 1 — registro dos tokens. NENHUM VALOR DE COR VIVE AQUI.
//
// RNF-072: cor, tipografia e espaçamento são definidos UMA VEZ, em referência única.
// Essa referência única é `src/styles/tokens.css`, escrita pela ONDA 2a.
// Este arquivo apenas dá nome de utilitário Tailwind às variáveis CSS de lá.
//
// Regra que não pode ser quebrada por nenhuma onda: se aparecer um valor
// hexadecimal neste arquivo, RNF-072 está violado e o tema escuro (11.13)
// deixa de ser uma troca de coluna.

import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/app/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}', './src/lib/**/*.{ts,tsx}'],

  // 11.13 — o tema escuro é uma troca de valores das mesmas variáveis.
  // A estratégia `class` permite alternância explícita além do `prefers-color-scheme`.
  darkMode: ['class', '[data-tema="escuro"]'],

  theme: {
    extend: {
      colors: {
        // ---------------------------------------------------------------
        // TOKENS DE COR — nomeados por FUNÇÃO, nunca por cor (11.12).
        // A Onda 2a define o valor de cada `--az-*` em src/styles/tokens.css,
        // nas duas colunas da tabela de 11.12, e é responsável por manter a
        // tabela de contraste válida. Nomes abaixo são contrato: não renomear.
        // ---------------------------------------------------------------
        superficie: 'var(--az-superficie)',
        'superficie-elevada': 'var(--az-superficie-elevada)',
        'texto-principal': 'var(--az-texto-principal)',
        'texto-secundario': 'var(--az-texto-secundario)',
        borda: 'var(--az-borda)',
        'acao-primaria': 'var(--az-acao-primaria)',
        'acao-primaria-foco': 'var(--az-acao-primaria-foco)',
        'acao-secundaria': 'var(--az-acao-secundaria)',
        destaque: 'var(--az-destaque)',
        sucesso: 'var(--az-sucesso)',
        atencao: 'var(--az-atencao)',
        erro: 'var(--az-erro)',
        // Rótulo sobre preenchimento de ação primária — par verificado em 11.12.
        'sobre-acao-primaria': 'var(--az-sobre-acao-primaria)',
        // Restyle — letra Z do wordmark em texto, por tema (tokens.css).
        'marca-z': 'var(--az-marca-z)',
        // Rebrand — sinal (sobretítulo, numeral) e traço forte (régua, contorno).
        sinal: 'var(--az-sinal)',
        traco: 'var(--az-traco)',
      },

      fontFamily: {
        // 11.14 — duas famílias, licença aberta. A Onda 2a escolhe os arquivos,
        // define `--az-fonte-*` e respeita RNF-014 (máx. 4 arquivos, 150 KB).
        titulo: 'var(--az-fonte-titulo)',
        corpo: 'var(--az-fonte-corpo)',
      },

      fontSize: {
        // 11.14 — escala fechada. Corpo de 16 px é piso absoluto, sem exceção.
        h1: 'var(--az-tamanho-h1)',
        h2: 'var(--az-tamanho-h2)',
        h3: 'var(--az-tamanho-h3)',
        corpo: 'var(--az-tamanho-corpo)',
        apoio: 'var(--az-tamanho-apoio)',
        rotulo: 'var(--az-tamanho-rotulo)',
        // Restyle — linha de apoio da primeira dobra (acima do piso de 16 px).
        lead: 'var(--az-tamanho-destaque)',
        'marca-rodape': 'var(--az-tamanho-marca-rodape)',
      },

      // Onda 2a — nomes acrescentados. Nenhum valor: todos apontam para
      // `--az-*` de src/styles/tokens.css (RNF-072).
      fontWeight: {
        h1: 'var(--az-peso-h1)',
        h2: 'var(--az-peso-h2)',
        h3: 'var(--az-peso-h3)',
        corpo: 'var(--az-peso-corpo)',
        rotulo: 'var(--az-peso-rotulo)',
      },

      lineHeight: {
        // 13.8 — altura de linha mínima de 1,5 no corpo.
        corpo: 'var(--az-altura-linha-corpo)',
        titulo: 'var(--az-altura-linha-titulo)',
        h1: 'var(--az-altura-linha-h1)',
      },

      letterSpacing: {
        // 11.14 — +4%, só em caixa alta e só em elemento curto.
        'caixa-alta': 'var(--az-espacamento-caixa-alta)',
        // Restyle — aperto óptico de título (nunca abertura).
        titulo: 'var(--az-espacamento-titulo)',
        sobretitulo: 'var(--az-espacamento-sobretitulo)',
      },

      maxWidth: {
        // 13.8 — 60 a 75 caracteres no máximo em telas largas.
        texto: 'var(--az-largura-texto)',
        titulo: 'var(--az-largura-titulo)',
        conteudo: 'var(--az-largura-conteudo)',
      },

      minHeight: {
        // 13.9 — alvo de toque de 44 × 44 px.
        toque: 'var(--az-alvo-toque)',
      },

      minWidth: {
        toque: 'var(--az-alvo-toque)',
      },

      aspectRatio: {
        // 11.17 — proporção idêntica para toda captura de tela de produto.
        captura: 'var(--az-proporcao-captura)',
      },

      transitionDuration: {
        // 13.10 — desligada por completo sob prefers-reduced-motion.
        padrao: 'var(--az-transicao)',
        painel: 'var(--az-tempo-painel)',
      },

      transitionTimingFunction: {
        padrao: 'var(--az-curva)',
      },

      borderRadius: {
        // 11.15 — exatamente dois raios. Nenhum outro valor é permitido.
        controle: 'var(--az-raio-controle)', // 10 px — controle pequeno
        bloco: 'var(--az-raio-bloco)', // 16 px — card, container, imagem
        pilula: 'var(--az-raio-pilula)', // rebrand — etiqueta com ponto de cor
      },

      borderWidth: {
        // 11.15 — espessura única de 1 px em todo contorno.
        DEFAULT: 'var(--az-borda-espessura)',
        traco: 'var(--az-traco-espessura)',
      },

      spacing: {
        // 11.15 — respiro em escala de 8 px: 8/16/24/32/48/64/96.
        // A escala nativa do Tailwind já cobre esses valores (2/4/6/8/12/16/24);
        // os apelidos abaixo existem para o que o PRD nomeia de forma específica.
        'card-compacto': 'var(--az-espaco-card-compacto)', // 16 px — tela pequena
        card: 'var(--az-espaco-card)', // 24 px — tela grande
        secao: 'var(--az-espaco-secao)', // 64 px — entre seções
        // Onda 2a — metade de `secao`: duas seções vizinhas com este
        // preenchimento vertical somam exatamente os 64 px de 11.15.
        'secao-meio': 'var(--az-espaco-secao-meio)',
        // 13.9 — espaçamento mínimo entre alvos acionáveis adjacentes.
        'entre-alvos': 'var(--az-espaco-entre-alvos)',
        // Restyle — respiro vertical de seção e altura do cabeçalho fixo.
        respiro: 'var(--az-respiro-secao)',
        cabecalho: 'var(--az-altura-cabecalho)',
      },

      boxShadow: {
        // 11.15 — sombra difusa é PROIBIDA em elemento estático.
        // Nenhum token de sombra é registrado de propósito. Se uma onda precisar
        // de elevação, a resposta é `superficie-elevada` + `borda`, não sombra.
      },
    },
  },

  plugins: [],
}

export default config
