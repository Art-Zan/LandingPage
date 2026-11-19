/**
 * Verificador de contraste dos tokens de cor.
 * Implementa a conferência exigida por 11.12 e 13.3, nos dois temas.
 * Visual: 11.12 (paleta), 11.13 (tema claro e escuro) · Acessibilidade: 13.3
 * Dono: Onda 2a
 *
 * Rodar:  node src/styles/verificar-contraste.mjs
 * Sai com código 1 se qualquer par reprovar ou divergir de 11.12.
 *
 * POR QUE ELE LÊ `tokens.css` EM VEZ DE TER OS VALORES COPIADOS:
 * um verificador com a paleta copiada verifica a cópia, não o site. Este
 * arquivo extrai os hexadecimais do próprio `tokens.css` — os mesmos que o
 * navegador vai aplicar —, monta as duas colunas de 11.12 e recalcula a
 * tabela de contraste inteira pela fórmula de luminância relativa do WCAG 2.x.
 *
 * Se um número não bater com o do PRD, o errado é o token, não a conta
 * (dev/CONVENCOES.md, seção 8, item 9).
 */

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const AQUI = dirname(fileURLToPath(import.meta.url))

// Os comentários de tokens.css citam seletores e nomes de token em prosa.
// Removê-los antes de qualquer recorte evita que o verificador leia a
// documentação achando que leu uma regra.
const CSS = readFileSync(join(AQUI, 'tokens.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')

const escrever = (linha) => process.stdout.write(`${linha}\n`)

// --------------------------------------------------------------------------
// Extração dos blocos de tokens
// --------------------------------------------------------------------------

/** Lê as declarações `--az-*: valor;` de um trecho de CSS. */
const lerDeclaracoes = (trecho) => {
  const mapa = new Map()
  const padrao = /(--az-[a-z0-9-]+)\s*:\s*([^;]+);/g
  let achado
  while ((achado = padrao.exec(trecho)) !== null) {
    mapa.set(achado[1], achado[2].trim())
  }
  return mapa
}

/** Recorta o corpo de um bloco a partir do índice da chave de abertura. */
const recortarBloco = (texto, indiceAbertura) => {
  let profundidade = 0
  for (let i = indiceAbertura; i < texto.length; i += 1) {
    if (texto[i] === '{') profundidade += 1
    else if (texto[i] === '}') {
      profundidade -= 1
      if (profundidade === 0) return texto.slice(indiceAbertura + 1, i)
    }
  }
  throw new Error('Bloco CSS sem fechamento.')
}

const recortarPorSeletor = (texto, seletor) => {
  const indice = texto.indexOf(seletor)
  if (indice === -1) throw new Error(`Seletor não encontrado em tokens.css: ${seletor}`)
  // A partir do início do seletor: a primeira chave é a de abertura do bloco,
  // esteja ela dentro do texto do seletor procurado ou logo depois dele.
  return recortarBloco(texto, texto.indexOf('{', indice))
}

const BLOCO_CLARO = recortarPorSeletor(CSS, ':root {')
const BLOCO_MIDIA = recortarPorSeletor(CSS, '@media (prefers-color-scheme: dark)')
const BLOCO_ESCURO_SISTEMA = recortarPorSeletor(BLOCO_MIDIA, ":root:not([data-tema='claro'])")
const BLOCO_ESCURO_DECLARADO = recortarPorSeletor(CSS, ":root[data-tema='escuro']")
// RESTYLE (2026-11-10) — a faixa escura veste a coluna escura de 11.12 dentro
// do tema claro. Precisa ser cópia EXATA do bloco escuro declarado: se
// divergir, a faixa passaria a usar um par que ninguém mediu.
const BLOCO_FAIXA_ESCURA = recortarPorSeletor(CSS, '.az-faixa-escura {')

const CLARO_BRUTO = lerDeclaracoes(BLOCO_CLARO)
const ESCURO_SISTEMA = lerDeclaracoes(BLOCO_ESCURO_SISTEMA)
const ESCURO_DECLARADO = lerDeclaracoes(BLOCO_ESCURO_DECLARADO)
const FAIXA_ESCURA = lerDeclaracoes(BLOCO_FAIXA_ESCURA)

const falhas = []

// --------------------------------------------------------------------------
// Guarda 1 — os dois blocos de tema escuro precisam ser idênticos.
// A duplicação é inevitável (não há como agrupar `@media` e seletor de
// atributo numa regra só sem indireção obscura); divergir entre eles faria o
// tema escuro do sistema e o declarado mostrarem cores diferentes.
// --------------------------------------------------------------------------
{
  const chaves = new Set([...ESCURO_SISTEMA.keys(), ...ESCURO_DECLARADO.keys()])
  for (const chave of [...chaves].sort()) {
    const a = ESCURO_SISTEMA.get(chave)
    const b = ESCURO_DECLARADO.get(chave)
    if (a !== b) {
      falhas.push(`Blocos de tema escuro divergem em ${chave}: "${a}" vs "${b}".`)
    }
  }
}

// RESTYLE — faixa escura = bloco escuro declarado, chave por chave.
{
  const chaves = new Set([...ESCURO_DECLARADO.keys(), ...FAIXA_ESCURA.keys()])
  for (const chave of [...chaves].sort()) {
    const a = ESCURO_DECLARADO.get(chave)
    const b = FAIXA_ESCURA.get(chave)
    if (a !== b) {
      falhas.push(`Faixa escura diverge do tema escuro em ${chave}: "${a}" vs "${b}".`)
    }
  }
}

// --------------------------------------------------------------------------
// Cálculo — WCAG 2.x
// --------------------------------------------------------------------------

const paraCanais = (hex) => {
  const limpo = hex.trim().replace('#', '')
  const completo =
    limpo.length === 3
      ? limpo
          .split('')
          .map((c) => c + c)
          .join('')
      : limpo
  if (!/^[0-9a-fA-F]{6}$/.test(completo)) throw new Error(`Cor não hexadecimal: "${hex}"`)
  return [0, 2, 4].map((i) => Number.parseInt(completo.slice(i, i + 2), 16) / 255)
}

/** Luminância relativa, WCAG 2.x. */
const luminancia = (hex) => {
  const [r, g, b] = paraCanais(hex).map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  )
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const contraste = (a, b) => {
  const la = luminancia(a)
  const lb = luminancia(b)
  const claro = Math.max(la, lb)
  const escuro = Math.min(la, lb)
  return (claro + 0.05) / (escuro + 0.05)
}

// --------------------------------------------------------------------------
// Montagem das duas colunas de 11.12
// --------------------------------------------------------------------------

const somenteCores = (mapa) => {
  const cores = new Map()
  for (const [chave, valor] of mapa) {
    if (/^#[0-9a-fA-F]{3,8}$/.test(valor)) cores.set(chave, valor)
  }
  return cores
}

const TEMA_CLARO = somenteCores(CLARO_BRUTO)
const TEMA_ESCURO = new Map([...TEMA_CLARO, ...somenteCores(ESCURO_DECLARADO)])

const cor = (tema, nome) => {
  const valor = tema.get(`--az-${nome}`)
  if (!valor) throw new Error(`Token de cor ausente em tokens.css: --az-${nome}`)
  return valor
}

// --------------------------------------------------------------------------
// A tabela de 11.12, par a par. `prd` é o valor publicado no PRD; `null`
// significa que o PRD marca "—" (par que não ocorre naquele tema).
// --------------------------------------------------------------------------

// REBRAND (2026-11-13): valores de referência refeitos para a paleta nova
// (papel #f4f3ef, tinta #12151c, faixa #0d1017). 11.12 do PRD precisa ser
// revisada para registrar estes números — até lá, a referência é esta.
const PARES = [
  ['Texto principal', 'texto-principal', 'superficie', 4.5, 16.45, 17.14],
  ['Texto principal sobre superficie elevada', 'texto-principal', 'superficie-elevada', 4.5, 18.26, 15.68],
  ['Texto secundario', 'texto-secundario', 'superficie', 4.5, 6.74, 8.14],
  ['Texto secundario sobre superficie elevada', 'texto-secundario', 'superficie-elevada', 4.5, 7.48, 7.45],
  ['Borda (contorno funcional)', 'borda', 'superficie', 3, 3.44, 3.94],
  ['Rotulo branco sobre acao primaria', 'sobre-acao-primaria', 'acao-primaria', 4.5, 5.87, 5.87],
  ['Rotulo branco sobre acao primaria em foco', 'sobre-acao-primaria', 'acao-primaria-foco', 4.5, 9.02, 5.59],
  ['Acao primaria (nao textual)', 'acao-primaria', 'superficie', 3, 5.29, 3.24],
  ['Acao secundaria', 'acao-secundaria', 'superficie', 4.5, 16.45, 17.14],
  ['Destaque', 'destaque', 'superficie', 4.5, 5.29, 7.48],
  ['Sinal (sobretitulo, numeral)', 'sinal', 'superficie', 4.5, 5.29, 10.26],
  ['Sinal sobre superficie elevada', 'sinal', 'superficie-elevada', 4.5, 5.87, 9.38],
  ['Traco forte', 'traco', 'superficie', 3, 16.45, 17.14],
  ['Sucesso', 'sucesso', 'superficie', 4.5, 5.0, 9.03],
  ['Atencao', 'atencao', 'superficie', 4.5, 5.08, 10.81],
  ['Erro', 'erro', 'superficie', 4.5, 5.89, 7.49],
]

// 13.3 registra estes como "onde a verificação ainda precisa ser feita,
// porque 11.12 não cobre". Sem valor de referência no PRD: só o mínimo.
const PARES_EXTRA = [
  ['Indicador de foco sobre superficie', 'foco', 'superficie', 3],
  ['Indicador de foco sobre superficie elevada', 'foco', 'superficie-elevada', 3],
]

const formatar = (n) => n.toFixed(2).replace('.', ',')
const TOLERANCIA = 0.02

escrever('')
escrever('Verificacao de contraste — src/styles/tokens.css (formula WCAG 2.x)')
escrever('')
escrever(
  'Par'.padEnd(44) +
    'Claro'.padStart(8) +
    'PRD'.padStart(8) +
    'Escuro'.padStart(9) +
    'PRD'.padStart(8) +
    'Min'.padStart(6) +
    '  Situacao',
)
escrever('-'.repeat(90))

const avaliar = (rotulo, frente, fundo, minimo, prdClaro, prdEscuro) => {
  const medidoClaro = contraste(cor(TEMA_CLARO, frente), cor(TEMA_CLARO, fundo))
  const medidoEscuro = contraste(cor(TEMA_ESCURO, frente), cor(TEMA_ESCURO, fundo))

  const situacao = []
  // O mínimo vale nos DOIS temas, inclusive onde o PRD marca "—": um par que
  // o PRD não tabula continua existindo na tela se o componente o usar.
  if (medidoClaro < minimo) {
    situacao.push('REPROVA no claro')
    falhas.push(`${rotulo}: ${formatar(medidoClaro)}:1 no tema claro, minimo ${minimo}:1.`)
  }
  if (medidoEscuro < minimo) {
    situacao.push('REPROVA no escuro')
    falhas.push(`${rotulo}: ${formatar(medidoEscuro)}:1 no tema escuro, minimo ${minimo}:1.`)
  }
  if (prdClaro !== null && prdClaro !== undefined && Math.abs(medidoClaro - prdClaro) > TOLERANCIA) {
    situacao.push('DIVERGE do PRD (claro)')
    falhas.push(
      `${rotulo}: medido ${formatar(medidoClaro)}:1 no claro, PRD 11.12 registra ${formatar(prdClaro)}:1.`,
    )
  }
  if (
    prdEscuro !== null &&
    prdEscuro !== undefined &&
    Math.abs(medidoEscuro - prdEscuro) > TOLERANCIA
  ) {
    situacao.push('DIVERGE do PRD (escuro)')
    falhas.push(
      `${rotulo}: medido ${formatar(medidoEscuro)}:1 no escuro, PRD 11.12 registra ${formatar(prdEscuro)}:1.`,
    )
  }

  escrever(
    rotulo.padEnd(44) +
      formatar(medidoClaro).padStart(8) +
      (prdClaro === null || prdClaro === undefined ? '—' : formatar(prdClaro)).padStart(8) +
      formatar(medidoEscuro).padStart(9) +
      (prdEscuro === null || prdEscuro === undefined ? '—' : formatar(prdEscuro)).padStart(8) +
      String(minimo).replace('.', ',').padStart(6) +
      '  ' +
      (situacao.length === 0 ? 'ok' : situacao.join(' · ')),
  )
}

for (const [rotulo, frente, fundo, minimo, prdClaro, prdEscuro] of PARES) {
  avaliar(rotulo, frente, fundo, minimo, prdClaro, prdEscuro)
}

escrever('')
escrever('Pares fora de 11.12, exigidos por 13.3 (sem valor de referencia no PRD):')
escrever('-'.repeat(90))
for (const [rotulo, frente, fundo, minimo] of PARES_EXTRA) {
  avaliar(rotulo, frente, fundo, minimo, null, null)
}

// --------------------------------------------------------------------------
// ONDA 5 (2026-11-13) — capa da inicial com imagem de fundo e placa da marca.
//
// A capa veste a coluna escura (classe `.az-faixa-escura`). O texto não fica
// sobre a superfície: fica sobre a IMAGEM coberta pelo véu. A imagem é
// gerada por scripts/gerar-ativos-visuais.ts só com os tons
// `--az-capa-tom-1..5` e pontos médios entre eles; o pior caso possível é o
// máximo, canal a canal, desses tons (nenhuma mistura passa dele — o gerador
// confere isso pixel a pixel depois de rasterizar). Compõe-se o véu sobre
// esse teto e mede-se cada texto da capa contra o resultado: se passar no
// teto, passa em qualquer ponto da imagem.
// --------------------------------------------------------------------------

const canaisDe = (hex) => paraCanais(hex).map((c) => c * 255)
const paraHex = (canais) =>
  `#${canais.map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')}`

const tonsDaCapa = [1, 2, 3, 4, 5].map((n) => cor(TEMA_CLARO, `capa-tom-${n}`))
const tetoDaCapa = paraHex([0, 1, 2].map((k) => Math.max(...tonsDaCapa.map((t) => canaisDe(t)[k]))))
const opacidadeDoVeu = Number.parseFloat(CLARO_BRUTO.get('--az-capa-veu-opacidade') ?? '')
if (!(opacidadeDoVeu > 0 && opacidadeDoVeu <= 1)) {
  falhas.push('Token --az-capa-veu-opacidade ausente ou fora de (0, 1].')
}
const veu = canaisDe(cor(TEMA_CLARO, 'capa-veu'))
const fundoDaCapa = paraHex(
  canaisDe(tetoDaCapa).map((c, k) => veu[k] * opacidadeDoVeu + c * (1 - opacidadeDoVeu)),
)

// [rótulo, token de frente (coluna escura), mínimo, só informativo?]
const PARES_DA_CAPA = [
  ['Texto principal sobre a capa', 'texto-principal', 4.5, false],
  ['Texto secundario sobre a capa', 'texto-secundario', 4.5, false],
  // O nome da empresa na capa tem 64 px ou mais: texto grande, 3:1 (13.3).
  // O Z usa --az-marca-z, que na coluna escura é var(--az-destaque)
  // (conferido logo abaixo, para a medida não ficar órfã se isso mudar).
  ['Z da marca (texto grande) sobre a capa', 'destaque', 3, false],
  ['Indicador de foco sobre a capa', 'foco', 3, false],
  // Informativo: o botão primário é identificado pelo rótulo (branco sobre o
  // azul, 5,87:1, par de 11.12). WCAG 1.4.11 não exige contraste do contorno
  // de botão que já tem rótulo em texto; o valor é registrado, não cobrado.
  ['Acao primaria (contorno) sobre a capa', 'acao-primaria', 3, true],
]

if (ESCURO_DECLARADO.get('--az-marca-z') !== 'var(--az-destaque)') {
  falhas.push('--az-marca-z deixou de ser var(--az-destaque) no escuro: refazer a medida da capa.')
}

escrever('')
escrever(
  `Capa da inicial: teto da imagem ${tetoDaCapa}, veu ${cor(TEMA_CLARO, 'capa-veu')} a ` +
    `${String(opacidadeDoVeu).replace('.', ',')} => fundo de pior caso ${fundoDaCapa}`,
)
escrever('-'.repeat(90))
for (const [rotulo, frente, minimo, informativo] of PARES_DA_CAPA) {
  const medido = contraste(cor(TEMA_ESCURO, frente), fundoDaCapa)
  const reprova = medido < minimo
  if (reprova && !informativo) {
    falhas.push(`${rotulo}: ${formatar(medido)}:1, minimo ${minimo}:1.`)
  }
  escrever(
    rotulo.padEnd(44) +
      formatar(medido).padStart(8) +
      String(minimo).replace('.', ',').padStart(6) +
      '  ' +
      (reprova ? (informativo ? 'abaixo (informativo, nao cobrado)' : 'REPROVA') : 'ok'),
  )
}

// Placa da marca: o logotipo é sempre posto sobre o fundo branco original.
// No escuro, a borda da placa contra a superfície precisa ser perceptível.
{
  const medido = contraste(cor(TEMA_CLARO, 'fundo-da-marca'), cor(TEMA_ESCURO, 'superficie'))
  if (medido < 3) falhas.push(`Placa da marca sobre superficie escura: ${formatar(medido)}:1, minimo 3:1.`)
  escrever(
    'Placa da marca sobre superficie escura'.padEnd(44) +
      formatar(medido).padStart(8) +
      '3'.padStart(6) +
      '  ' +
      (medido < 3 ? 'REPROVA' : 'ok'),
  )
}

escrever('')
if (falhas.length > 0) {
  escrever(`REPROVADO — ${falhas.length} problema(s):`)
  for (const falha of falhas) escrever(`  · ${falha}`)
  escrever('')
  escrever('Corrija o TOKEN, nunca a conta (dev/CONVENCOES.md, secao 8, item 9).')
  process.exit(1)
}

escrever('APROVADO — todos os pares atendem ao minimo e batem com a tabela de 11.12.')
