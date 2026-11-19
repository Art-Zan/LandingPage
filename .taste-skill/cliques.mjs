// Teste de cliques da etapa 1 (restyle 2026-11-10). Chrome headless via CDP, sem dependências.
// Uso: node .taste-skill/cliques.mjs <base-url> <arquivo-de-saida.json>
import { spawn, execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const BASE = process.argv[2] || 'http://localhost:3001'
const SAIDA = process.argv[3] || '.taste-skill/cliques.json'
const PERFIL = path.resolve('.taste-skill/chrome-cliques')
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find((p) => fs.existsSync(p))
const dormir = (ms) => new Promise((r) => setTimeout(r, ms))

fs.rmSync(PERFIL, { recursive: true, force: true })
fs.mkdirSync(PERFIL, { recursive: true })
const filho = spawn(CHROME, ['--headless=new', `--user-data-dir=${PERFIL}`, '--remote-debugging-port=0', '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--disable-gpu', '--window-size=1440,900', 'about:blank'], { stdio: 'ignore', windowsHide: true })
const matar = () => { try { execFileSync('taskkill', ['/PID', String(filho.pid), '/T', '/F'], { stdio: 'ignore' }) } catch { /* já saiu */ } }
const guarda = setTimeout(() => { console.error('tempo esgotado'); matar(); process.exit(2) }, 480000)

const resultado = { base: BASE, quando: new Date().toISOString(), links: [], cliques: [] }
const registrar = (nome, ok, detalhe = '') => { resultado.cliques.push({ nome, ok, detalhe }); console.log(`${ok ? 'OK  ' : 'FALHA'} ${nome}${detalhe ? ' — ' + detalhe : ''}`) }

try {
  let porta = null
  for (let i = 0; i < 150 && !porta; i++) { await dormir(100); try { porta = parseInt(fs.readFileSync(path.join(PERFIL, 'DevToolsActivePort'), 'utf8'), 10) || null } catch { /* ainda não */ } }
  const ver = await (await fetch(`http://127.0.0.1:${porta}/json/version`)).json()
  const ws = new WebSocket(ver.webSocketDebuggerUrl)
  await new Promise((r, j) => { ws.addEventListener('open', r, { once: true }); ws.addEventListener('error', j, { once: true }) })
  let id = 0
  const pend = new Map(); const ouvintes = []
  ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id) } else ouvintes.forEach((f) => f(m)) })
  const enviar = (method, params = {}, sessionId) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params, sessionId })) })
  const { result: { targetId } } = await enviar('Target.createTarget', { url: 'about:blank' })
  const { result: { sessionId } } = await enviar('Target.attachToTarget', { targetId, flatten: true })
  const S = async (m, p) => { const r = await enviar(m, p, sessionId); if (r.error) throw new Error(`${m}: ${r.error.message}`); return r.result }
  await S('Page.enable'); await S('Runtime.enable')
  const avaliar = async (expr) => { const r = await S('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); return r.result.value }
  const largura = async (w, h) => S('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 768 })
  const ir = async (url) => {
    const carregou = new Promise((r) => { const f = (m) => { if (m.method === 'Page.loadEventFired') { ouvintes.splice(ouvintes.indexOf(f), 1); r() } }; ouvintes.push(f) })
    await S('Page.navigate', { url }); await Promise.race([carregou, dormir(15000)]); await dormir(900)
  }
  const esperarCaminho = async (pred, ms = 10000) => { const t = Date.now(); while (Date.now() - t < ms) { const p = await avaliar('location.pathname + location.search'); if (pred(p)) return p; await dormir(200) } return avaliar('location.pathname + location.search') }
  const clicarSeletor = async (sel) => {
    const caixa = await avaliar(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e) return null; e.scrollIntoView({block:'center'}); const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, h: r.height } })()`)
    if (!caixa || !caixa.w) return false
    for (const type of ['mousePressed', 'mouseReleased']) await S('Input.dispatchMouseEvent', { type, x: caixa.x, y: caixa.y, button: 'left', clickCount: 1 })
    return true
  }
  const tecla = async (key, code = key, vk = 0) => { for (const type of ['keyDown', 'keyUp']) await S('Input.dispatchKeyEvent', { type, key, code, windowsVirtualKeyCode: vk }) }

  // 1. Todos os links de cabeçalho, rodapé e conteúdo, em cada rota: status HTTP do destino.
  const ROTAS = ['/', '/sobre', '/produtos', '/produtos/sistema-lara', '/produtos/alocacao-de-quadras', '/contato', '/obrigado', '/privacidade', '/termos', '/rota-que-nao-existe']
  const vistos = new Map()
  await largura(1440, 900)
  for (const rota of ROTAS) {
    await ir(BASE + rota)
    const links = await avaliar(`[...document.querySelectorAll('a[href]')].map(a => ({ href: a.getAttribute('href'), texto: (a.textContent||'').trim().slice(0,60), regiao: a.closest('header') ? 'cabecalho' : a.closest('footer') ? 'rodape' : 'conteudo' }))`)
    for (const l of links) {
      if (!l.href || l.href.startsWith('#') || l.href.startsWith('mailto:') || l.href.startsWith('https://wa.me')) continue
      const url = new URL(l.href, BASE + rota).toString()
      if (!vistos.has(url)) { const r = await fetch(url, { redirect: 'manual' }); vistos.set(url, r.status) }
      resultado.links.push({ pagina: rota, ...l, status: vistos.get(url) })
    }
  }
  const quebrados = resultado.links.filter((l) => l.status >= 400)
  registrar('links (status HTTP de todos os destinos)', quebrados.length === 0, `${resultado.links.length} links, ${vistos.size} destinos únicos, ${quebrados.length} com erro`)

  // 2. Clique real nos itens do cabeçalho (1440).
  for (const [sel, esperado] of [['header nav a[href="/produtos"]', '/produtos'], ['header nav a[href="/sobre"]', '/sobre'], ['header a[href="/contato"]', '/contato'], ['header a[href="/"]', '/']]) {
    await ir(BASE + '/sobre')
    const ok = await clicarSeletor(sel)
    const p = await esperarCaminho((x) => x.split('?')[0] === esperado)
    registrar(`cabeçalho: ${sel}`, ok && p.split('?')[0] === esperado, `chegou em ${p}`)
  }
  // 3. Rodapé: cada link por clique.
  await ir(BASE + '/')
  const doRodape = await avaliar(`[...document.querySelectorAll('footer a[href^="/"]')].map(a => a.getAttribute('href'))`)
  for (const href of doRodape) {
    await ir(BASE + '/')
    const ok = await clicarSeletor(`footer a[href="${href}"]`)
    const p = await esperarCaminho((x) => x.split('?')[0] === href)
    registrar(`rodapé: ${href}`, ok && p.split('?')[0] === href, `chegou em ${p}`)
  }
  // 4. Cartões do catálogo e trilha.
  await ir(BASE + '/produtos')
  const cartoes = await avaliar(`[...document.querySelectorAll('main ul a[href^="/produtos/"]')].map(a => a.getAttribute('href'))`)
  for (const href of cartoes) {
    await ir(BASE + '/produtos')
    const ok = await clicarSeletor(`main a[href="${href}"]`)
    const p = await esperarCaminho((x) => x === href)
    registrar(`cartão: ${href}`, ok && p === href, `chegou em ${p}`)
  }
  for (const [sel, esperado] of [['nav[aria-label="Trilha"] a[href="/"]', '/'], ['nav[aria-label="Trilha"] a[href="/produtos"]', '/produtos']]) {
    await ir(BASE + '/produtos/sistema-lara')
    const ok = await clicarSeletor(sel)
    const p = await esperarCaminho((x) => x === esperado)
    registrar(`trilha: ${sel}`, ok && p === esperado, `chegou em ${p}`)
  }
  // 5. Alternância de tema (rodapé).
  await ir(BASE + '/')
  const temControle = await avaliar(`!!document.querySelector('input[name="az-preferencia-de-tema"]')`)
  if (!temControle) registrar('tema: controle presente na página', false, 'nenhum controle de tema renderizado')
  else {
    for (const [valor, esperado] of [['escuro', 'escuro'], ['claro', 'claro'], ['sistema', null]]) {
      await clicarSeletor(`input[name="az-preferencia-de-tema"][value="${valor}"]`)
      await avaliar(`(() => { const i = document.querySelector('input[name="az-preferencia-de-tema"][value="${valor}"]'); if (i && !i.checked) i.closest('label').click() })()`)
      await dormir(300)
      const atual = await avaliar(`document.documentElement.getAttribute('data-tema')`)
      registrar(`tema: ${valor}`, atual === esperado, `data-tema=${atual}`)
    }
    await ir(BASE + '/'); // persistência: após recarregar, sistema = sem atributo
  }
  // 6. Menu móvel (390): abre, Esc fecha e devolve o foco, link navega.
  await largura(390, 844)
  await ir(BASE + '/')
  let ok = await clicarSeletor('button[aria-controls="az-painel-menu-principal"]')
  await dormir(400)
  let estado = await avaliar(`({ exp: document.querySelector('button[aria-controls="az-painel-menu-principal"]').getAttribute('aria-expanded'), visivel: !document.getElementById('az-painel-menu-principal').hidden, altura: document.getElementById('az-painel-menu-principal').getBoundingClientRect().height, foco: document.activeElement && document.activeElement.textContent.trim() })`)
  registrar('menu móvel: abre', ok && estado.exp === 'true' && estado.visivel, `aria-expanded=${estado.exp}, altura do painel ${Math.round(estado.altura)} px, foco em "${estado.foco}"`)
  await tecla('Escape', 'Escape', 27); await dormir(300)
  estado = await avaliar(`({ exp: document.querySelector('button[aria-controls="az-painel-menu-principal"]').getAttribute('aria-expanded'), visivel: !document.getElementById('az-painel-menu-principal').hidden, focoNoBotao: document.activeElement === document.querySelector('button[aria-controls="az-painel-menu-principal"]') })`)
  registrar('menu móvel: Esc fecha e devolve o foco', estado.exp === 'false' && !estado.visivel && estado.focoNoBotao, JSON.stringify(estado))
  await clicarSeletor('button[aria-controls="az-painel-menu-principal"]'); await dormir(400)
  ok = await clicarSeletor('#az-painel-menu-principal a[href="/sobre"]')
  let p = await esperarCaminho((x) => x === '/sobre')
  registrar('menu móvel: link navega', ok && p === '/sobre', `chegou em ${p}`)
  await ir(BASE + '/')
  await clicarSeletor('button[aria-controls="az-painel-menu-principal"]'); await dormir(300)
  await clicarSeletor('button[aria-controls="az-painel-menu-principal"]'); await dormir(300)
  estado = await avaliar(`document.getElementById('az-painel-menu-principal').hidden`)
  registrar('menu móvel: botão fecha', estado === true, `hidden=${estado}`)

  // 7. Formulário de contato (1440).
  await largura(1440, 900)
  await ir(BASE + '/contato')
  await clicarSeletor('form button[type="submit"]'); await dormir(600)
  const erros = await avaliar(`({ resumo: (document.querySelector('form [role="alert"]')||{}).textContent || '', invalidos: [...document.querySelectorAll('form [aria-invalid="true"]')].map(e => e.id.split('-').pop()), foco: document.activeElement && document.activeElement.id.split('-').pop() })`)
  registrar('formulário: erros por campo no envio vazio', erros.invalidos.length >= 3, `resumo="${erros.resumo.trim()}", inválidos=${erros.invalidos.join(',')}, foco em ${erros.foco}`)
  const preencher = `(() => {
    const set = (el, v) => { const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : el.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, v); el.dispatchEvent(new Event(el.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true })) };
    const f = document.querySelector('form');
    set(f.querySelector('input[autocomplete="name"]'), 'Teste de restyle');
    set(f.querySelector('input[type="email"]'), 'teste.restyle@exemplo.dev');
    const sel = f.querySelectorAll('select')[0]; set(sel, 'comercial');
    set(f.querySelector('textarea'), 'Mensagem de teste automatizado do restyle visual ' + Date.now() + '.');
    const c = f.querySelector('input[type="checkbox"][required]'); if (!c.checked) c.click();
    return true })()`
  // 7a. RNF-092 — falha de rede preserva o que foi digitado.
  await ir(BASE + '/contato'); await dormir(3500)
  await avaliar(preencher)
  await S('Fetch.enable', { patterns: [{ urlPattern: '*/api/contato*' }] })
  const interceptar = (m) => { if (m.method === 'Fetch.requestPaused') enviar('Fetch.failRequest', { requestId: m.params.requestId, errorReason: 'ConnectionFailed' }, sessionId) }
  ouvintes.push(interceptar)
  await clicarSeletor('form button[type="submit"]'); await dormir(1500)
  const aposFalha = await avaliar(`({ caminho: location.pathname, nome: document.querySelector('input[autocomplete="name"]').value, email: document.querySelector('input[type="email"]').value, msg: document.querySelector('textarea').value.slice(0, 20), alerta: [...document.querySelectorAll('form p[role="alert"]')].map(e => e.textContent.trim()).join(' | ') })`)
  ouvintes.splice(ouvintes.indexOf(interceptar), 1)
  await S('Fetch.disable')
  registrar('formulário: falha de envio preserva os dados (RNF-092)', aposFalha.caminho === '/contato' && aposFalha.nome === 'Teste de restyle' && aposFalha.email.length > 0 && aposFalha.alerta.length > 0, JSON.stringify(aposFalha))
  // 7b. Envio válido chega a /obrigado.
  await ir(BASE + '/contato'); await dormir(3500)
  await avaliar(preencher)
  await clicarSeletor('form button[type="submit"]')
  p = await esperarCaminho((x) => x.startsWith('/obrigado'), 20000)
  const alertaEnvio = p.startsWith('/obrigado') ? '' : await avaliar("[...document.querySelectorAll('form [role=alert]')].map(e => e.textContent.trim()).join(' | ')")
  registrar('formulário: envio válido chega a /obrigado', p.startsWith('/obrigado'), `chegou em ${p}${alertaEnvio ? ' — alerta: ' + alertaEnvio : ''}`)
} catch (e) {
  registrar('execução', false, String(e && e.stack || e))
} finally {
  clearTimeout(guarda)
  fs.writeFileSync(SAIDA, JSON.stringify(resultado, null, 2))
  matar()
  process.exit(0)
}
