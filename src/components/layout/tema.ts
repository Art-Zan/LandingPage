/**
 * Preferência de tema — contrato compartilhado entre o script de primeiro
 * pintar (layout raiz) e o controle de troca (`ControleDeTema`).
 * Visual: 11.13 (os dois temas existem; o mecanismo é decisão de implementação)
 * Acessibilidade: 13.10 (o script de primeiro pintar nunca anima; a troca
 *   pelo controle esmaece só por ponteiro e sem movimento reduzido — Onda 5),
 *   13.3 (nada depende só de cor)
 * Dono: Onda 3a
 *
 * REGRA, EM UMA FRASE: sem preferência declarada, vale a do sistema
 * operacional; com preferência declarada, ela vence a do sistema NOS DOIS
 * SENTIDOS — inclusive forçar claro num sistema escuro.
 *
 * O mecanismo é o atributo `data-tema` no elemento raiz, e ele já existe:
 * `src/styles/tokens.css` (Onda 2a) declara as quatro camadas de cascata
 * — claro padrão, `prefers-color-scheme: dark` em `:root:not([data-tema='claro'])`,
 * `:root[data-tema='escuro']` e `:root[data-tema='claro']`. Este arquivo não
 * define nenhum valor visual: só decide QUANDO o atributo existe.
 *
 * AUSÊNCIA DO ATRIBUTO É ESTADO VÁLIDO e significa "seguir o sistema". Por isso
 * o script abaixo remove o atributo em vez de escrever um terceiro valor.
 */

/** Valores aceitos em `data-tema`. `sistema` é a ausência do atributo. */
export type PreferenciaDeTema = 'sistema' | 'claro' | 'escuro'

/** Chave de armazenamento local. Não é dado pessoal e não sai do navegador. */
export const CHAVE_DE_TEMA = 'az-tema'

/** Nome do atributo lido pela cascata de `tokens.css`. */
export const ATRIBUTO_DE_TEMA = 'data-tema'

export const ehPreferenciaDeTema = (valor: unknown): valor is PreferenciaDeTema =>
  valor === 'sistema' || valor === 'claro' || valor === 'escuro'

/**
 * Script executado ANTES do primeiro pintar, de forma síncrona, no `<head>`.
 *
 * SEM ELE HÁ LAMPEJO DE TEMA ERRADO: o HTML chega sem atributo, o navegador
 * pinta o tema do sistema e só depois o React aplicaria a preferência salva.
 * Como este script é síncrono e anterior ao `<body>`, o atributo já está no
 * elemento raiz no primeiro pintar e nenhum quadro errado chega à tela.
 *
 * Ele NÃO decide qual tema mostrar quando não há preferência salva: nesse caso
 * não escreve nada e a decisão fica com `prefers-color-scheme`, em CSS puro —
 * que continua funcionando com JavaScript desligado.
 *
 * `try/catch` é obrigatório: `localStorage` lança em navegação privada de
 * alguns navegadores e com armazenamento de terceiros bloqueado. Falhar aqui
 * derrubaria a página inteira por causa de uma preferência de cor.
 */
export const SCRIPT_DE_TEMA = `(function(){try{var v=localStorage.getItem(${JSON.stringify(
  CHAVE_DE_TEMA,
)});if(v==='claro'||v==='escuro'){document.documentElement.setAttribute(${JSON.stringify(
  ATRIBUTO_DE_TEMA,
)},v);}}catch(e){}})();`
