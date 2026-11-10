// Dono: Onda 4c
//
// Gera, em memória, a imagem de marcação usada pelo seed (scripts/seed.ts)
// onde o modelo exige upload obrigatório (imagem de destaque de Produto).
//
// dev/CONVENCOES.md, seção 8, item 5: "nenhum hexadecimal... em componente,
// template ou tailwind.config.ts". Este arquivo não é nenhum dos três — é um
// script de seed, fora da árvore que roda no navegador — mas mesmo assim NÃO
// declara cor própria: toda cor vem de uma leitura de `src/styles/tokens.css`
// em tempo de execução (mesma técnica de `src/styles/verificar-contraste.mjs`,
// Onda 2a), para que trocar um token não deixe uma cópia divergente aqui.
//
// A IMAGEM PRECISA SER IMPOSSÍVEL DE CONFUNDIR COM CAPTURA DE TELA REAL
// (despacho da onda, Tarefa 3): listras diagonais na cor de atenção do
// sistema (nunca usada em conteúdo real) mais um rótulo em caixa alta muito
// grande. Nenhuma tela de produto real se pareceria com isto por acidente.

import { readFileSync } from 'node:fs'
import path from 'node:path'

import sharp from 'sharp'

const CAMINHO_DOS_TOKENS = path.resolve(process.cwd(), 'src/styles/tokens.css')

/**
 * Lê o PRIMEIRO valor de `--az-<nome>` do arquivo de tokens (o bloco `:root`
 * do tema claro, que é o primeiro do arquivo). Uma imagem rasterizada não
 * troca de tema sozinha, então uma leitura fixa é a única que faz sentido
 * aqui — o objetivo é honestidade de origem (não duplicar o hexadecimal à
 * mão), não paridade de tema.
 */
const lerToken = (cssTexto: string, nome: string): string => {
  const correspondencia = cssTexto.match(new RegExp(`--az-${nome}:\\s*([^;]+);`))
  if (!correspondencia || correspondencia[1] === undefined) {
    throw new Error(
      `Token "--az-${nome}" não encontrado em src/styles/tokens.css. A imagem de placeholder ` +
        'depende deste arquivo por construção (dev/CONVENCOES.md §8, item 5) — se o nome do ' +
        'token mudou, atualize scripts/lib/imagem-placeholder.ts.',
    )
  }
  return correspondencia[1].trim()
}

const lerProporcaoDeCaptura = (cssTexto: string): number => {
  const bruto = lerToken(cssTexto, 'proporcao-captura') // formato "16 / 10"
  const [largura, altura] = bruto.split('/').map((parte) => Number(parte.trim()))
  if (!largura || !altura) {
    throw new Error(`Token "--az-proporcao-captura" com formato inesperado: "${bruto}".`)
  }
  return largura / altura
}

type CoresDaMarcacao = {
  atencao: string
  superficieElevada: string
  borda: string
  textoPrincipal: string
}

const lerCoresDaMarcacao = (): { cores: CoresDaMarcacao; proporcao: number } => {
  const cssTexto = readFileSync(CAMINHO_DOS_TOKENS, 'utf8')
  return {
    cores: {
      atencao: lerToken(cssTexto, 'atencao'),
      superficieElevada: lerToken(cssTexto, 'superficie-elevada'),
      borda: lerToken(cssTexto, 'borda'),
      textoPrincipal: lerToken(cssTexto, 'texto-principal'),
    },
    proporcao: lerProporcaoDeCaptura(cssTexto),
  }
}

const escaparXml = (texto: string): string =>
  texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/**
 * Monta o SVG da marcação: fundo de listras diagonais (atenção × superfície
 * elevada — nunca combinação usada em conteúdo real), moldura na cor de
 * borda, e duas linhas de texto: o rótulo fixo "IMAGEM PLACEHOLDER" e uma
 * frase que nomeia o domínio do produto (para quem revisa saber do que se
 * trata sem abrir o painel).
 */
const construirSvg = (
  larguraPx: number,
  alturaPx: number,
  dominio: string,
  cores: CoresDaMarcacao,
): string => {
  const idPadrao = 'listras-de-placeholder'
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${larguraPx}" height="${alturaPx}" viewBox="0 0 ${larguraPx} ${alturaPx}">
  <defs>
    <pattern id="${idPadrao}" width="64" height="64" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
      <rect width="64" height="64" fill="${cores.superficieElevada}" />
      <rect width="32" height="64" fill="${cores.atencao}" fill-opacity="0.55" />
    </pattern>
  </defs>
  <rect x="0" y="0" width="${larguraPx}" height="${alturaPx}" fill="url(#${idPadrao})" />
  <rect x="6" y="6" width="${larguraPx - 12}" height="${alturaPx - 12}" fill="none" stroke="${cores.borda}" stroke-width="6" />
  <rect x="0" y="${alturaPx / 2 - 96}" width="${larguraPx}" height="192" fill="${cores.superficieElevada}" fill-opacity="0.92" />
  <text x="${larguraPx / 2}" y="${alturaPx / 2 - 24}" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="72" letter-spacing="4" fill="${cores.textoPrincipal}">IMAGEM PLACEHOLDER</text>
  <text x="${larguraPx / 2}" y="${alturaPx / 2 + 32}" text-anchor="middle" font-family="sans-serif" font-weight="400" font-size="34" fill="${cores.textoPrincipal}">Não é captura de tela real do produto — ${escaparXml(dominio)}</text>
  <text x="${larguraPx / 2}" y="${alturaPx / 2 + 78}" text-anchor="middle" font-family="sans-serif" font-weight="400" font-size="26" fill="${cores.textoPrincipal}">Gerada por scripts/seed.ts a partir de src/styles/tokens.css (Q-005, dev/CONVENCOES.md §7)</text>
</svg>`.trim()
}

/**
 * Gera o PNG da imagem de marcação. Largura fixa em 1600 px, altura derivada
 * de `--az-proporcao-captura` (16/10 hoje) — a mesma proporção que
 * `MolduraCaptura` exige de toda captura de produto (11.17).
 */
export const gerarImagemDePlaceholder = async (dominio: string): Promise<Buffer> => {
  const { cores, proporcao } = lerCoresDaMarcacao()
  const largura = 1600
  const altura = Math.round(largura / proporcao)
  const svg = construirSvg(largura, altura, dominio, cores)
  return sharp(Buffer.from(svg)).png().toBuffer()
}
