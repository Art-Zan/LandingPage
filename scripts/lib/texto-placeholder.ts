// Dono: Onda 4c
//
// Fábrica de TEXTO provisório para o seed (scripts/seed.ts) e conversor para o
// formato Lexical que os campos `richText` do Payload esperam.
//
// REGRA ABSOLUTA DO DESPACHO DA ONDA: "o seed não inventa dado de negócio.
// Nada de CNPJ, razão social, endereço, telefone, e-mail, preço, prazo,
// número, depoimento, nome de cliente ou texto jurídico — nem como exemplo."
// Por isso todo texto gerado aqui é OSTENSIVAMENTE provisório: descreve o que
// falta, cita o requisito que o exige e nunca finge ser a redação real. Quem
// ler este texto em homologação — mesmo sem abrir o painel — precisa entender
// que está vendo um espaço reservado, não a voz da empresa.
//
// Os parágrafos comuns abaixo são deliberadamente REUTILIZADOS entre produtos:
// só a abertura muda (o domínio do produto). Isso é o oposto de "texto
// plausível variado" — a repetição É o sinal de que ninguém redigiu isto à
// mão, o que é exatamente o que se quer transmitir.

export const FRASES_PLACEHOLDER_COMUNS: readonly string[] = [
  'Nenhum dado de negócio, número, prazo, preço, nome de cliente ou resultado mencionado neste texto é real — é uma marcação deliberada de conteúdo ausente, não uma descrição do produto (dev/CONVENCOES.md, contrato de placeholder, seção 7).',
  'Este registro tem o campo "placeholder" marcado; em homologação a interface sinaliza isso visivelmente, e em produção a publicação deste conteúdo é recusada mecanicamente enquanto o texto real não substituir este parágrafo (dev/CONVENCOES.md §7.4).',
  'O comprimento deste parágrafo existe só para satisfazer o piso mínimo de caracteres de publicação de teste nesta máquina de desenvolvimento (PR-057) — não avalie o produto a partir do que está escrito aqui.',
  'Quando o texto redigido pelo cliente chegar, ele substitui este parágrafo inteiro, e o campo "placeholder" deste registro precisa ser desmarcado antes de qualquer publicação em produção.',
]

/**
 * Parágrafo longo (para `problemaQueResolve`, `descricaoCompleta`): abre
 * nomeando o domínio real do produto (dado já público do próprio projeto, não
 * inventado por este script — ver dev/CONVENCOES.md §4.4), e cresce
 * concatenando as frases comuns acima até passar do mínimo de caracteres
 * pedido, com uma margem de segurança de 10%.
 */
export const textoPlaceholderLongo = (dominio: string, minimoDeCaracteres: number): string => {
  const abertura =
    `Texto provisório sobre ${dominio}: este parágrafo existe apenas para satisfazer o piso de ` +
    `conteúdo de publicação (PR-057) em ambiente de desenvolvimento, enquanto o texto redigido ` +
    `pelo cliente sobre ${dominio} não existe (16.6).`

  const alvo = Math.ceil(minimoDeCaracteres * 1.1)
  let texto = abertura
  let indice = 0
  while (texto.length < alvo) {
    texto = `${texto} ${FRASES_PLACEHOLDER_COMUNS[indice % FRASES_PLACEHOLDER_COMUNS.length]}`
    indice += 1
  }
  return texto
}

/**
 * Frase curta (para `titulo`/`descricao` de funcionalidade, `texto` de
 * benefício, `resumoUmaLinha`, `publicoAlvo`): honesta, direto ao ponto,
 * cresce só o suficiente para passar do mínimo pedido.
 */
export const textoPlaceholderCurto = (
  assunto: string,
  minimoDeCaracteres = 0,
): string => {
  let texto = `Placeholder — ${assunto}: conteúdo real pendente do cliente (16.6).`
  let indice = 0
  while (texto.length < minimoDeCaracteres) {
    texto = `${texto} ${FRASES_PLACEHOLDER_COMUNS[indice % FRASES_PLACEHOLDER_COMUNS.length]}`
    indice += 1
  }
  return texto
}

// ---------------------------------------------------------------------------
// Conversão para o formato Lexical serializado que os campos `richText` do
// Payload gravam e leem (SerializedEditorState). Só os dois nós mais básicos
// do editor — parágrafo e texto — que são suportados por qualquer
// configuração de `lexicalEditor(...)` (não dependem de nenhuma feature
// opcional). `src/lib/validacao-publicacao.ts` (Onda 2b) já sabe contar
// caracteres exatamente nesta forma (ver `contarCaracteresDeTexto`).
// ---------------------------------------------------------------------------

const noDeTexto = (texto: string) => ({
  detail: 0,
  format: 0,
  mode: 'normal' as const,
  style: '',
  text: texto,
  type: 'text' as const,
  version: 1,
})

const noDeParagrafo = (texto: string) => ({
  children: [noDeTexto(texto)],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  type: 'paragraph' as const,
  version: 1,
})

/**
 * Constrói o documento Lexical mínimo para um ou mais parágrafos de texto
 * simples. `paragrafos` pode ser uma string única (um parágrafo) ou várias
 * (a regra do modelo permite de 1 a 3 parágrafos em `problemaQueResolve`).
 */
export const richTextDeParagrafos = (paragrafos: string | readonly string[]) => {
  const lista = typeof paragrafos === 'string' ? [paragrafos] : paragrafos
  return {
    root: {
      children: lista.map((paragrafo) => noDeParagrafo(paragrafo)),
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      type: 'root' as const,
      version: 1,
    },
  }
}
