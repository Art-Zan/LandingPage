// Resume as saídas de .taste-skill/<fase>/ numa tabela por rota. Uso: node .taste-skill/resumir.mjs before|after
import fs from 'node:fs'
const fase = process.argv[2]
const dir = `.taste-skill/${fase}`
const rotas = ['inicial', 'sobre', 'produtos', 'produto-lara', 'produto-quadras', 'contato', 'obrigado', 'privacidade', 'termos', '404']
const ler = (f) => { try { return fs.readFileSync(`${dir}/${f}`, 'utf8') } catch { return '' } }
const linhas = []
for (const r of rotas) {
  const c = ler(`consistency-${r}.txt`)
  const tot = c.match(/total\s+(\d+) FAIL\s+(\d+) WARN/)
  // FAIL por largura: blocos "at <w>" não são padronizados; conta ids únicos de FAIL na grade de checks
  const grade = c.slice(c.lastIndexOf('\nchecks'))
  const idsFail = [...grade.matchAll(/FAIL ([a-z0-9-]+)/g)].map((m) => m[1])
  const l = ler(`layout-${r}.txt`)
  let lay
  if (/r\.sections is not iterable|no \.wrap/.test(l)) lay = 'não roda (sem .wrap)'
  else {
    const por = [...l.matchAll(/^(\d+x\d+)\s+lines[\s\S]*?(?=^\d+x\d+\s+lines|$(?![\s\S]))/gm)].map((m) => {
      const bloco = m[0]
      const n = bloco.includes('no findings') ? 0 : (bloco.match(/^  [a-z][a-z-]+ {2,}/gm) || []).filter((x) => !/^  (hero|section|stress)/.test(x)).length
      return `${m[1].split('x')[0]}:${n}`
    })
    lay = por.join(' ') || 'sem saída'
  }
  const p = ler(`perf-${r}.txt`)
  const peso = (p.match(/total transfer\s+([\d.]+ KiB)/) || [])[1] || '?'
  const cls = (p.match(/layout shift\s+([\d.]+)/) || [])[1] || '?'
  const perfRes = (p.match(/SUMMARY .*?: (\d+ FAIL.*)/) || [])[1] || '?'
  const perfFails = [...p.matchAll(/FAIL\s+([a-zA-Z ()/+.,-]+?)\s{2,}/g)].map((m) => m[1].trim())
  const cl = ler(`copylint-${r}.txt`)
  const clr = (cl.match(/(\d+ FAIL, \d+ WARN)/) || [])[1] || '?'
  linhas.push({ rota: r, consistency: tot ? `${tot[1]} FAIL / ${tot[2]} WARN` : '?', idsFail: [...new Set(idsFail)].join(','), layout: lay, peso, cls, perf: perfRes, perfFails: [...new Set(perfFails)].join(','), copylint: clr })
}
console.log(JSON.stringify(linhas, null, 1))
