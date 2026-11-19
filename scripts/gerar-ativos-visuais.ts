// Dono: Onda 5 (marca, capa e movimento — 2026-11-13)
//
// Gera TODOS os ativos visuais rasterizados do site a partir de duas fontes:
//   1. o logotipo oficial `Logo.png` (raiz do repositório). 2026-11-13: o
//      usuário pediu a volta ao logo antigo; o anexo da Onda 5
//      (`assets-fonte/logo-anexo-2026-11-13.png`) deixou de ser a fonte;
//   2. os tokens de cor de `src/styles/tokens.css` (nenhum hexadecimal aqui).
//
// Rodar: `npm run gerar:ativos`. Reexecutável: sobrescreve as saídas, nunca a
// fonte. Mesma entrada => mesmos arquivos (o gerador pseudoaleatório da capa
// tem semente fixa).
//
// Saídas:
//   public/marca/artzan-monograma.webp   monograma isolado, fundo transparente
//   public/marca/artzan-logo.webp        peça completa (monograma + wordmark)
//   public/marca/artzan-logo.png         peça completa, alta resolução (mestre)
//   src/app/icon.png, src/app/apple-icon.png   monograma sobre o fundo branco
//   src/app/opengraph-image.png          peça completa centrada no branco (11.16)
//   public/capa/capa-<orientacao>-<largura>.webp   imagem provisória da capa
//
// REGRAS QUE ESTE SCRIPT CUMPRE
//  - Não inventa versão da marca (11.13, Q-077/Q-078): o logotipo é recortado
//    e reamostrado, nunca recolorido, redesenhado nem invertido. O fundo do
//    anexo já é transparente; ícones e imagem de compartilhamento usam o
//    fundo BRANCO original da peça.
//  - Capa: facetas de cor SÓLIDA (11.15 proíbe gradiente e textura fora do
//    logotipo), na geometria angular do monograma (11.11), com os tons
//    `--az-capa-tom-*` de tokens.css. O pior caso de contraste do texto sobre
//    ela é verificado por `src/styles/verificar-contraste.mjs`; este script
//    confere, depois de rasterizar, que nenhum pixel passou desse pior caso.
//  - Teto de peso: RNF-012 (200 KB por imagem reprocessada). Falha se passar.

import { mkdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

import sharp from 'sharp'

import { ARQUIVO_DA_CAPA, LARGURAS_DA_CAPA, MARCA, PROPORCAO_DA_CAPA } from '../src/lib/ativos-visuais'

const RAIZ = process.cwd()
const FONTE_DO_LOGO = path.join(RAIZ, 'Logo.png')
const TETO_DE_PESO = 200 * 1024 // RNF-012

// ---------------------------------------------------------------------------
// Tokens
// ---------------------------------------------------------------------------

const TOKENS = readFileSync(path.join(RAIZ, 'src/styles/tokens.css'), 'utf8').replace(
  /\/\*[\s\S]*?\*\//g,
  '',
)

/** Primeiro valor declarado de `--az-<nome>` (o bloco `:root`). */
const token = (nome: string): string => {
  const achado = new RegExp(`--az-${nome}\\s*:\\s*([^;]+);`).exec(TOKENS)
  if (!achado) throw new Error(`Token ausente em tokens.css: --az-${nome}`)
  return achado[1]!.trim()
}

type Rgb = [number, number, number]

const paraRgb = (hex: string): Rgb => {
  const limpo = hex.replace('#', '')
  if (!/^[0-9a-fA-F]{6}$/.test(limpo)) throw new Error(`Cor não hexadecimal: ${hex}`)
  return [0, 2, 4].map((i) => Number.parseInt(limpo.slice(i, i + 2), 16)) as Rgb
}

const paraHex = ([r, g, b]: Rgb) =>
  `#${[r, g, b].map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')}`

const misturar = (a: Rgb, b: Rgb, t: number): Rgb => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
]

const luminancia = ([r, g, b]: Rgb) => {
  const canal = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b)
}

// ---------------------------------------------------------------------------
// Utilidades de arquivo
// ---------------------------------------------------------------------------

const garantirPasta = (arquivo: string) => mkdirSync(path.dirname(arquivo), { recursive: true })

const relatorio: Array<{ arquivo: string; bytes: number; dimensoes: string }> = []

const registrar = async (arquivo: string) => {
  const { width, height } = await sharp(arquivo).metadata()
  const bytes = statSync(arquivo).size
  relatorio.push({ arquivo: path.relative(RAIZ, arquivo), bytes, dimensoes: `${width}x${height}` })
  if (bytes > TETO_DE_PESO) {
    throw new Error(`${arquivo} pesa ${(bytes / 1024).toFixed(1)} KB, acima do teto de RNF-012.`)
  }
}

const publico = (url: string) => path.join(RAIZ, 'public', url.replace(/^\//, ''))

// ---------------------------------------------------------------------------
// 1. Logotipo — recorte do monograma e da peça completa
// ---------------------------------------------------------------------------

type Caixa = { left: number; top: number; width: number; height: number }

const gerarMarca = async () => {
  // Alfa residual muito baixo (halo de remoção de fundo do anexo) é zerado
  // para que o recorte encontre a borda real da peça.
  const { data, info } = await sharp(FONTE_DO_LOGO)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width: L, height: A, channels: C } = info
  // Logo.png vem sobre BRANCO OPACO (não tem transparência). O branco do
  // fundo vira transparência: canal mínimo ≥ 250 some; ≤ 215 fica opaco;
  // rampa linear entre os dois para a borda antisserrilhada. A peça não tem
  // branco próprio, então nada da marca é apagado.
  for (let i = 0; i < data.length; i += C) {
    const minimo = Math.min(data[i]!, data[i + 1]!, data[i + 2]!)
    const alfa = Math.round(Math.max(0, Math.min(1, (250 - minimo) / 35)) * 255)
    data[i + 3] = Math.min(data[i + 3]!, alfa)
  }
  for (let i = 3; i < data.length; i += C) if (data[i]! < 32) data[i] = 0

  const linhaTemTinta = (y: number) => {
    for (let x = 0; x < L; x += 1) if (data[(y * L + x) * C + 3]! > 0) return true
    return false
  }
  const colunaTemTinta = (x: number, y0: number, y1: number) => {
    for (let y = y0; y <= y1; y += 1) if (data[(y * L + x) * C + 3]! > 0) return true
    return false
  }

  // Faixas verticais com tinta: a primeira é o monograma, a última o wordmark.
  const faixas: Array<[number, number]> = []
  let inicio = -1
  for (let y = 0; y < A; y += 1) {
    const tem = linhaTemTinta(y)
    if (tem && inicio === -1) inicio = y
    if (!tem && inicio !== -1) {
      faixas.push([inicio, y - 1])
      inicio = -1
    }
  }
  if (inicio !== -1) faixas.push([inicio, A - 1])
  // Descarta lascas de poucos pixels (serrilhado isolado).
  const faixasReais = faixas.filter(([a, b]) => b - a > 8)
  if (faixasReais.length < 2) throw new Error('Não foi possível separar monograma e wordmark.')

  const caixaDe = (y0: number, y1: number): Caixa => {
    let x0 = 0
    while (x0 < L && !colunaTemTinta(x0, y0, y1)) x0 += 1
    let x1 = L - 1
    while (x1 > x0 && !colunaTemTinta(x1, y0, y1)) x1 -= 1
    return { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 }
  }

  const monograma = caixaDe(faixasReais[0]![0], faixasReais[0]![1])
  const peca = caixaDe(faixasReais[0]![0], faixasReais[faixasReais.length - 1]![1])

  const limpo = () => sharp(data, { raw: { width: L, height: A, channels: C } })
  const recorteMonograma = await limpo().extract(monograma).png().toBuffer()
  const recortePeca = await limpo().extract(peca).png().toBuffer()

  const transparente = { r: 0, g: 0, b: 0, alpha: 0 }
  const branco = paraRgb(token('fundo-da-marca'))
  const fundoBranco = { r: branco[0], g: branco[1], b: branco[2], alpha: 1 }

  // Monograma e peça: caixa fixa em 2x da exibição, `contain`, transparente.
  const saidaMonograma = publico(MARCA.monograma.src)
  garantirPasta(saidaMonograma)
  await sharp(recorteMonograma)
    .resize(MARCA.monograma.largura * 2, MARCA.monograma.altura * 2, {
      fit: 'contain',
      background: transparente,
    })
    .webp({ quality: 90, alphaQuality: 100, effort: 6 })
    .toFile(saidaMonograma)
  await registrar(saidaMonograma)

  const saidaPeca = publico(MARCA.logo.src)
  await sharp(recortePeca)
    .resize(MARCA.logo.largura * 2, MARCA.logo.altura * 2, { fit: 'contain', background: transparente })
    .webp({ quality: 90, alphaQuality: 100, effort: 6 })
    .toFile(saidaPeca)
  await registrar(saidaPeca)

  const saidaMestre = publico(MARCA.logoMestre)
  await sharp(recortePeca)
    .resize({ width: 640, withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true, quality: 95, effort: 10 })
    .toFile(saidaMestre)
  await registrar(saidaMestre)

  // Ícones: monograma sobre o branco original, área de proteção de 15% (11.16).
  const icone = async (lado: number, destino: string) => {
    const util = Math.round(lado * 0.7)
    const miolo = await sharp(recorteMonograma)
      .resize(util, util, { fit: 'contain', background: transparente })
      .png()
      .toBuffer()
    await sharp({ create: { width: lado, height: lado, channels: 4, background: fundoBranco } })
      .composite([{ input: miolo, gravity: 'center' }])
      .flatten({ background: fundoBranco })
      .png({ compressionLevel: 9, palette: true, quality: 95, effort: 10 })
      .toFile(destino)
    await registrar(destino)
  }
  await icone(512, path.join(RAIZ, 'src/app/icon.png'))
  await icone(180, path.join(RAIZ, 'src/app/apple-icon.png'))

  // Compartilhamento (11.16): 1200 × 630, peça completa centrada sobre a
  // superfície clara, área de proteção ≥ 15% da altura da peça.
  const alturaDaPeca = 420
  const pecaOg = await sharp(recortePeca)
    .resize({ height: alturaDaPeca, fit: 'inside' })
    .png()
    .toBuffer()
  const destinoOg = path.join(RAIZ, 'src/app/opengraph-image.png')
  await sharp({ create: { width: 1200, height: 630, channels: 4, background: fundoBranco } })
    .composite([{ input: pecaOg, gravity: 'center' }])
    .flatten({ background: fundoBranco })
    .png({ compressionLevel: 9, palette: true, quality: 95, effort: 10 })
    .toFile(destinoOg)
  await registrar(destinoOg)

  return { monograma, peca }
}

// ---------------------------------------------------------------------------
// 2. Capa — facetas sólidas na geometria do monograma
// ---------------------------------------------------------------------------

/** Gerador pseudoaleatório com semente (mulberry32): mesma saída a cada execução. */
const criarAleatorio = (semente: number) => {
  let s = semente >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Ponto = [number, number]

/** Distância do ponto ao segmento ab (a perna termina no vértice). */
const distanciaASegmento = (p: Ponto, a: Ponto, b: Ponto) => {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const t = Math.min(1, Math.max(0, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy)))
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy))
}

const dentroDoTriangulo = (p: Ponto, a: Ponto, b: Ponto, c: Ponto) => {
  const lado = (u: Ponto, v: Ponto) => (v[0] - u[0]) * (p[1] - u[1]) - (v[1] - u[1]) * (p[0] - u[0])
  const s1 = lado(a, b)
  const s2 = lado(b, c)
  const s3 = lado(c, a)
  return (s1 >= 0 && s2 >= 0 && s3 >= 0) || (s1 <= 0 && s2 <= 0 && s3 <= 0)
}

const suave = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

type Composicao = {
  /** Vértice do "A" e o pé de cada perna, em fração da largura/altura. */
  apice: Ponto
  pernaEsquerda: Ponto
  pernaDireita: Ponto
  /** Diagonal do "Z", paralela à perna direita do A. */
  diagonalZ: [Ponto, Ponto]
  /** Peso da claridade de base: canto escuro onde o texto assenta. */
  escuroEm: Ponto
}

const COMPOSICOES: Record<'paisagem' | 'retrato', Composicao> = {
  // Texto embaixo à esquerda; a geometria clara sobe pela direita.
  paisagem: {
    apice: [0.7, -0.08],
    pernaEsquerda: [0.36, 1.12],
    pernaDireita: [1.08, 0.86],
    diagonalZ: [
      [0.98, 0.18],
      [0.62, 1.06],
    ],
    escuroEm: [0, 1],
  },
  // Texto embaixo; a geometria ocupa o terço de cima.
  retrato: {
    apice: [0.62, -0.04],
    pernaEsquerda: [-0.1, 0.62],
    pernaDireita: [1.12, 0.5],
    diagonalZ: [
      [1.04, 0.12],
      [0.3, 0.7],
    ],
    escuroEm: [0.2, 1],
  },
}

const gerarSvgDaCapa = (orientacao: 'paisagem' | 'retrato') => {
  const { largura: pl, altura: pa } = PROPORCAO_DA_CAPA[orientacao]
  const W = orientacao === 'paisagem' ? 1600 : 900
  const H = Math.round((W * pa) / pl)
  const c = COMPOSICOES[orientacao]
  const aleatorio = criarAleatorio(orientacao === 'paisagem' ? 20261113 : 11132026)

  // Rampa de tons: tokens (`--az-capa-tom-1..5`) e pontos médios entre
  // vizinhos. O pior caso de contraste é o máximo canal a canal dos tokens.
  // O último token (`tom-5`) é o TETO e não entra puro: a rampa para no
  // ponto médio entre `tom-4` e `tom-5`. A folga entre o tom mais claro
  // usado e o teto medido absorve o desvio da compressão webp (subamostragem
  // de croma na aresta azul × escuro), que de outro modo passaria do teto.
  const tons = [1, 2, 3, 4, 5].map((n) => paraRgb(token(`capa-tom-${n}`)))
  const rampa: Rgb[] = []
  tons.forEach((tom, i) => {
    if (i < tons.length - 1) {
      rampa.push(tom)
      rampa.push(misturar(tom, tons[i + 1]!, 0.5))
    }
  })

  const abs = ([fx, fy]: Ponto): Ponto => [fx * W, fy * H]
  const apice = abs(c.apice)
  const pe1 = abs(c.pernaEsquerda)
  const pe2 = abs(c.pernaDireita)
  const z0 = abs(c.diagonalZ[0])
  const z1 = abs(c.diagonalZ[1])
  const escuro = abs(c.escuroEm)
  const diagonal = Math.hypot(W, H)

  // Claridade em [0, 1] no centro de uma faceta.
  const claridade = (p: Ponto) => {
    const base = 0.3 * Math.min(1, (Math.hypot(p[0] - escuro[0], p[1] - escuro[1]) / diagonal) * 1.4)
    const faixa = 0.035 * diagonal
    const perna1 = 1 - suave(0, faixa, distanciaASegmento(p, apice, pe1))
    const perna2 = 1 - suave(0, faixa * 0.75, distanciaASegmento(p, apice, pe2))
    const z = 1 - suave(0, faixa * 0.6, distanciaASegmento(p, z0, z1))
    // O miolo do "A" é um plano um degrau acima do fundo (fusão, não contorno).
    const miolo = dentroDoTriangulo(p, apice, pe1, pe2) ? 0.12 : 0
    return Math.min(1, base + miolo + 0.66 * perna1 + 0.5 * perna2 + 0.4 * z)
  }

  // Malha de pontos com deslocamento; bordas presas para não abrir fresta.
  const passo = orientacao === 'paisagem' ? 58 : 52
  const colunas = Math.ceil(W / passo)
  const linhas = Math.ceil(H / passo)
  const pontos: Ponto[][] = []
  for (let j = 0; j <= linhas; j += 1) {
    const linha: Ponto[] = []
    for (let i = 0; i <= colunas; i += 1) {
      const borda = i === 0 || j === 0 || i === colunas || j === linhas
      const dx = borda ? 0 : (aleatorio() - 0.5) * passo * 0.7
      const dy = borda ? 0 : (aleatorio() - 0.5) * passo * 0.7
      linha.push([Math.min(W, i * passo + dx), Math.min(H, j * passo + dy)])
    }
    pontos.push(linha)
  }

  const poligonos: string[] = []
  const desenhar = (tri: Ponto[]) => {
    const centro: Ponto = [
      (tri[0]![0] + tri[1]![0] + tri[2]![0]) / 3,
      (tri[0]![1] + tri[1]![1] + tri[2]![1]) / 3,
    ]
    const v = Math.min(0.999, Math.max(0, claridade(centro) + (aleatorio() - 0.5) * 0.12))
    const cor = paraHex(rampa[Math.floor(v * rampa.length)]!)
    const pts = tri.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
    // O traço na mesma cor fecha a fresta de serrilhado entre facetas.
    poligonos.push(`<polygon points="${pts}" fill="${cor}" stroke="${cor}" stroke-width="1.2" stroke-linejoin="round"/>`)
  }

  for (let j = 0; j < linhas; j += 1) {
    for (let i = 0; i < colunas; i += 1) {
      const a = pontos[j]![i]!
      const b = pontos[j]![i + 1]!
      const d = pontos[j + 1]![i]!
      const e = pontos[j + 1]![i + 1]!
      if (aleatorio() < 0.5) {
        desenhar([a, b, e])
        desenhar([a, e, d])
      } else {
        desenhar([a, b, d])
        desenhar([b, e, d])
      }
    }
  }

  const fundo = paraHex(tons[0]!)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="${fundo}"/>${poligonos.join('')}</svg>`

  const limite: Rgb = [0, 1, 2].map((k) => Math.max(...tons.map((t) => t[k]!))) as Rgb
  return { svg, W, H, limite }
}

const aneis: string[] = []

const gerarCapa = async () => {
  for (const orientacao of ['paisagem', 'retrato'] as const) {
    const { svg, W, limite } = gerarSvgDaCapa(orientacao)
    const lumLimite = luminancia(limite)
    for (const largura of LARGURAS_DA_CAPA[orientacao]) {
      const destino = publico(ARQUIVO_DA_CAPA(orientacao, largura))
      garantirPasta(destino)
      await sharp(Buffer.from(svg), { density: (72 * largura) / W })
        .resize({ width: largura })
        .webp({ quality: 78, effort: 6, smartSubsample: true })
        .toFile(destino)
      await registrar(destino)

      // Conferência pós-rasterização: nenhuma ÁREA mais clara que o pior caso
      // que verificar-contraste.mjs mede. A compressão com perda do webp
      // deixa pixels isolados de "anel" na aresta entre facetas de tons
      // distantes (dezenas num quadro de meio milhão); um filtro de mediana
      // 3×3 descarta esses pixels isolados — nenhum traço de letra tem 1 px —
      // sem esconder uma faceta clara de verdade. Os isolados são contados e
      // relatados, não escondidos.
      const lerLuminancias = async (imagem: sharp.Sharp) => {
        const { data, info } = await imagem.raw().toBuffer({ resolveWithObject: true })
        let maxima = 0
        let acima = 0
        for (let i = 0; i < data.length; i += info.channels) {
          const l = luminancia([data[i]!, data[i + 1]!, data[i + 2]!])
          if (l > maxima) maxima = l
          if (l > lumLimite) acima += 1
        }
        return { maxima, acima, total: data.length / info.channels }
      }
      const bruto = await lerLuminancias(sharp(destino))
      const filtrado = await lerLuminancias(sharp(destino).median(3))
      aneis.push(`${path.basename(destino)}: ${bruto.acima} de ${bruto.total} pixels isolados acima do pior caso`)
      if (filtrado.maxima > lumLimite * 1.02) {
        throw new Error(
          `${destino}: área com luminância ${filtrado.maxima.toFixed(4)} acima do pior caso ${lumLimite.toFixed(4)}.`,
        )
      }
    }
  }
}

// ---------------------------------------------------------------------------

const principal = async () => {
  const { monograma, peca } = await gerarMarca()
  await gerarCapa()

  process.stdout.write(
    `\nRecorte no anexo: monograma ${monograma.width}x${monograma.height} @ (${monograma.left},${monograma.top}); ` +
      `peça ${peca.width}x${peca.height} @ (${peca.left},${peca.top})\n\n`,
  )
  for (const { arquivo, bytes, dimensoes } of relatorio) {
    process.stdout.write(`${arquivo.padEnd(48)} ${dimensoes.padStart(10)} ${(bytes / 1024).toFixed(1).padStart(7)} KB\n`)
  }
  process.stdout.write(`\nTodos abaixo do teto de ${TETO_DE_PESO / 1024} KB (RNF-012).\n`)
  process.stdout.write(`\nAnéis de compressão da capa (descartados pela mediana 3x3):\n`)
  for (const linha of aneis) process.stdout.write(`  ${linha}\n`)
}

principal().catch((erro: unknown) => {
  process.stderr.write(`${erro instanceof Error ? erro.message : String(erro)}\n`)
  process.exit(1)
})
