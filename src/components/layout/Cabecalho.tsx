'use client'

/**
 * Cabeçalho persistente do shell público — NAV 2026-11-13.
 * Refeito com a skill ux-navigation, na linguagem do rebrand MarQGol.
 * Implementa: RF-001 (cabeçalho persistente, logo leva à inicial, ação de
 *   contato sempre visível), RF-002 (itens fixos de 6.1), RF-003 (menu em tela
 *   pequena: controle único, estado anunciado, foco retido e devolvido)
 * Acessibilidade: 13.2 (foco não obscurecido — mede a própria altura e
 *   redefine `--az-deslocamento-rolagem`), 13.5 (regiões `nav` rotuladas),
 *   13.9 (alvos de 44 px), 13.10 (movimento desligado sob preferência)
 * Dono: Onda 3a (monograma e placa: Onda 5; painel de softwares: nav 2026-11-13)
 *
 * DECISÕES (skill ux-navigation):
 *  · IA rasa e estável (3–4 seções): barra superior, nunca sidebar. Os itens
 *    principais ficam SEMPRE visíveis em tela larga; o menu recolhido só
 *    existe abaixo de 768 px, e a ação de contato fica fora dele.
 *  · "Softwares" abre um PAINEL por CLIQUE (nunca só por hover — hover falha
 *    em toque e teclado). Padrão de divulgação: botão com `aria-expanded` e
 *    `aria-controls`; o painel vem logo depois no DOM, então o Tab segue a
 *    ordem natural. Fecha com Esc (foco volta ao botão), clique fora, foco
 *    saindo do cabeçalho e troca de rota. Caret indica o submenu.
 *  · O painel agrupa os produtos por categoria (dado do cadastro), numera
 *    cada um e mostra o resumo de uma linha; "Todos os softwares" leva ao
 *    catálogo — o painel acrescenta, não substitui o destino.
 *  · "Onde estou": o item da seção atual (inclusive subpáginas, como
 *    /produtos/[slug] → Softwares) leva barra de 2 px e `aria-current`.
 *  · Barra de progresso de leitura sob o cabeçalho: só CSS (linha do tempo
 *    de rolagem), decorativa, ausente onde o navegador não suporta.
 *  · DIVERGÊNCIA DE 6.2 registrada em navegacao.ts e Claude.md.
 */

import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react'

import { Botao, Container, Seta } from '@/components/ui'
import { MARCA } from '@/lib/ativos-visuais'
import { ACOES, NOME_DA_MARCA } from '@/lib/rotulos'
import { ROTAS, type Idioma } from '@/lib/rotas'
import { partirWordmark } from '@/lib/wordmark'

import { ROTULOS, type GrupoDeSoftwares, type ItemDeMenu } from './navegacao'

export type PropsDoCabecalho = {
  /** Primeiro elemento focável do cabeçalho (link de salto, RF-009). */
  primeiro?: ReactNode
  itens: ItemDeMenu[]
  /** Produtos publicados, agrupados por categoria, para o painel. */
  gruposDeSoftwares?: GrupoDeSoftwares[]
  idioma?: Idioma
}

const LINK_DE_NAVEGACAO =
  'az-nav-item inline-flex min-h-toque items-center gap-2 px-3 font-titulo text-rotulo font-rotulo ' +
  'uppercase tracking-sobretitulo text-texto-secundario no-underline transition-colors duration-padrao ' +
  'hover:text-texto-principal aria-[current=page]:text-texto-principal aria-[expanded=true]:text-texto-principal'

const numerar = (n: number) => String(n).padStart(2, '0')

/** Caret do submenu: gira 180° quando aberto. Decorativo. */
const Caret = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 12 12"
    className="az-caret h-3 w-3"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="square"
  >
    <path d="M2.5 4.5 6 8l3.5-3.5" />
  </svg>
)

export const Cabecalho = ({ primeiro, itens, gruposDeSoftwares = [], idioma }: PropsDoCabecalho) => {
  const wordmark = partirWordmark(NOME_DA_MARCA)
  const caminhoAtual = usePathname() ?? ''
  const idPainel = useId()

  const [menuAberto, setMenuAberto] = useState(false)
  const [painelAberto, setPainelAberto] = useState(false)

  const refCabecalho = useRef<HTMLElement>(null)
  const refFolha = useRef<HTMLDivElement>(null)
  const refBotaoMenu = useRef<HTMLButtonElement>(null)
  const refBotaoPainel = useRef<HTMLButtonElement>(null)

  const catalogo = ROTAS.catalogo(idioma)
  const temPainel = gruposDeSoftwares.some((grupo) => grupo.itens.length > 0)
  const totalDeSoftwares = gruposDeSoftwares.reduce((soma, grupo) => soma + grupo.itens.length, 0)
  const itensPrincipais = itens.filter((item) => !item.destacado)
  const itemDeContato = itens.find((item) => item.destacado)

  /** Seção atual: a própria rota ou qualquer subpágina dela. */
  const ehAtivo = (href: string) =>
    href === ROTAS.inicial(idioma)
      ? caminhoAtual === href
      : caminhoAtual === href || caminhoAtual.startsWith(`${href}/`)

  // 13.2 regra 6 — a altura real do cabeçalho vira o deslocamento de rolagem.
  useEffect(() => {
    const elemento = refCabecalho.current
    if (!elemento) return
    const raiz = document.documentElement
    const atualizar = () =>
      raiz.style.setProperty('--az-deslocamento-rolagem', `${elemento.offsetHeight}px`)
    atualizar()
    const observador = new ResizeObserver(atualizar)
    observador.observe(elemento)
    return () => observador.disconnect()
  }, [])

  // Cabeçalho compacto depois de rolar: só muda borda e fundo (sem sombra, 11.15).
  useEffect(() => {
    const elemento = refCabecalho.current
    if (!elemento) return
    const aoRolar = () => elemento.toggleAttribute('data-rolado', window.scrollY > 8)
    aoRolar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  // Troca de rota fecha tudo.
  useEffect(() => {
    setPainelAberto(false)
    setMenuAberto(false)
  }, [caminhoAtual])

  // ---------------------------------------------------------------- painel
  const fecharPainel = useCallback((devolverFoco: boolean) => {
    setPainelAberto(false)
    if (devolverFoco) refBotaoPainel.current?.focus()
  }, [])

  useEffect(() => {
    if (!painelAberto) return
    const cabecalho = refCabecalho.current

    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') {
        evento.preventDefault()
        fecharPainel(true)
      }
    }
    const aoClicarFora = (evento: MouseEvent) => {
      if (!cabecalho?.contains(evento.target as Node)) fecharPainel(false)
    }
    const aoSairOFoco = (evento: FocusEvent) => {
      const destino = evento.relatedTarget as Node | null
      if (destino && !cabecalho?.contains(destino)) fecharPainel(false)
    }

    document.addEventListener('keydown', aoTeclar)
    document.addEventListener('mousedown', aoClicarFora)
    cabecalho?.addEventListener('focusout', aoSairOFoco)
    return () => {
      document.removeEventListener('keydown', aoTeclar)
      document.removeEventListener('mousedown', aoClicarFora)
      cabecalho?.removeEventListener('focusout', aoSairOFoco)
    }
  }, [painelAberto, fecharPainel])

  // ------------------------------------------------- folha de tela pequena
  const fecharMenu = useCallback(() => {
    setMenuAberto(false)
    refBotaoMenu.current?.focus()
  }, [])

  useEffect(() => {
    if (!menuAberto) return
    const folha = refFolha.current
    const focaveis = () =>
      Array.from(folha?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [])

    focaveis()[0]?.focus()

    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') {
        evento.preventDefault()
        fecharMenu()
        return
      }
      if (evento.key !== 'Tab') return
      // Foco retido entre o botão de fechar e o último link da folha.
      const elementos = [refBotaoMenu.current, ...focaveis()].filter(Boolean) as HTMLElement[]
      const primeiroFocavel = elementos[0]!
      const ultimo = elementos[elementos.length - 1]!
      if (evento.shiftKey && document.activeElement === primeiroFocavel) {
        evento.preventDefault()
        ultimo.focus()
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault()
        primeiroFocavel.focus()
      }
    }

    const raiz = document.documentElement
    const overflowAnterior = raiz.style.overflow
    raiz.style.overflow = 'hidden'
    document.addEventListener('keydown', aoTeclar)
    return () => {
      raiz.style.overflow = overflowAnterior
      document.removeEventListener('keydown', aoTeclar)
    }
  }, [menuAberto, fecharMenu])

  // Folha aberta e a tela cresce além de 768 px: fecha (ela não existe lá).
  useEffect(() => {
    const largo = window.matchMedia('(min-width: 48rem)')
    const aoMudar = () => largo.matches && setMenuAberto(false)
    largo.addEventListener('change', aoMudar)
    return () => largo.removeEventListener('change', aoMudar)
  }, [])

  return (
    <header
      ref={refCabecalho}
      data-painel-aberto={painelAberto ? '' : undefined}
      className="nav az-cabecalho az-faixa-escura sticky top-0 z-40 border-b border-borda"
    >
      {primeiro}
      <Container className="flex h-cabecalho items-center justify-between gap-4">
        {/* Logo à esquerda, sempre clicável, sempre leva à inicial. */}
        <a
          href={ROTAS.inicial(idioma)}
          className="inline-flex min-h-toque shrink-0 items-center gap-2 no-underline md:gap-3"
        >
          <span className="az-placa-da-marca">
            <Image
              src={MARCA.monograma.src}
              width={MARCA.monograma.largura}
              height={MARCA.monograma.altura}
              alt=""
              unoptimized
              loading="eager"
              className="az-monograma"
            />
          </span>
          {/* Abaixo de 380 px o nome sai da tela (fica para leitor de tela,
              como nome do link) e o monograma segura a marca: é o que deixa
              Contato e Menu inteiros a 320 px. */}
          <span className="font-titulo text-h3 font-h1 uppercase tracking-caixa-alta text-texto-principal max-[379px]:sr-only">
            {wordmark.antes}
            <span className="text-marca-z">{wordmark.z}</span>
            {wordmark.depois}
          </span>
        </a>

        {/* Navegação global — tela larga: todos os itens visíveis. */}
        <nav aria-label="Navegação principal" className="hidden flex-1 md:block">
          <ul className="flex items-center gap-1 lg:ml-6">
            {itensPrincipais.map((item) =>
              item.href === catalogo && temPainel ? (
                <li key={item.href}>
                  <button
                    ref={refBotaoPainel}
                    type="button"
                    className={LINK_DE_NAVEGACAO}
                    aria-expanded={painelAberto}
                    aria-controls={idPainel}
                    // Seção atual também no botão (não é link: data, não aria-current).
                    data-atual={ehAtivo(item.href) ? '' : undefined}
                    onClick={() => setPainelAberto((aberto) => !aberto)}
                  >
                    {item.rotulo}
                    <Caret />
                  </button>
                </li>
              ) : (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={ehAtivo(item.href) ? 'page' : undefined}
                    className={LINK_DE_NAVEGACAO}
                  >
                    {item.rotulo}
                  </a>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {/* RF-001 / RF-003 — contato sempre visível, fora do menu recolhido. */}
          {itemDeContato ? (
            <Botao
              href={itemDeContato.href}
              variante="primaria"
              className="px-4 md:px-card"
              aria-current={ehAtivo(itemDeContato.href) ? 'page' : undefined}
            >
              {itemDeContato.rotulo}
            </Botao>
          ) : null}

          <button
            ref={refBotaoMenu}
            type="button"
            className="az-botao inline-flex min-h-toque min-w-toque items-center justify-center gap-2 rounded-controle border border-borda bg-transparent px-3 font-titulo text-rotulo font-h1 uppercase tracking-caixa-alta text-texto-principal md:hidden"
            aria-expanded={menuAberto}
            aria-controls="az-painel-menu-principal"
            onClick={() => setMenuAberto((valor) => !valor)}
          >
            {/* Ícone acompanha o rótulo, nunca o substitui. */}
            <svg
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 20 20"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="square"
            >
              {menuAberto ? (
                <path d="M5 5l10 10M15 5L5 15" />
              ) : (
                <path d="M3 6h14M3 10h14M3 14h9" />
              )}
            </svg>
            {menuAberto ? 'Fechar' : 'Menu'}
          </button>
        </div>
      </Container>

      {/* Barra de progresso de leitura (decorativa, só CSS). */}
      <span aria-hidden="true" className="az-progresso-de-leitura" />

      {/* ------------------------------------------------------------------
          PAINEL DE SOFTWARES — tela larga. `hidden` nativo quando fechado:
          fora do fluxo, do Tab e da árvore de acessibilidade.
          ------------------------------------------------------------------ */}
      {temPainel ? (
        <div
          id={idPainel}
          hidden={!painelAberto}
          className="az-painel-nav absolute inset-x-0 top-full border-b border-borda bg-superficie"
        >
          <Container className="grid grid-cols-12 gap-6 py-8 lg:gap-10 lg:py-10">
            <div className="col-span-12 grid gap-8 lg:col-span-9 lg:grid-cols-2">
              {gruposDeSoftwares.map((grupo, indiceDoGrupo) => {
                const deslocamento = gruposDeSoftwares
                  .slice(0, indiceDoGrupo)
                  .reduce((soma, anterior) => soma + anterior.itens.length, 0)
                return (
                  <section key={grupo.titulo} aria-labelledby={`${idPainel}-g${indiceDoGrupo}`}>
                    <h2
                      id={`${idPainel}-g${indiceDoGrupo}`}
                      className="flex w-full items-center justify-between border-b border-borda pb-3"
                    >
                      <span className="az-sobretitulo">{grupo.titulo}</span>
                      <span className="az-rotulo-coluna">{numerar(grupo.itens.length)}</span>
                    </h2>
                    <ul className="mt-2 flex flex-col">
                      {grupo.itens.map((software, indice) => (
                        <li key={software.href}>
                          <a
                            href={software.href}
                            aria-current={caminhoAtual === software.href ? 'page' : undefined}
                            className="az-painel-item group grid grid-cols-[auto_1fr_auto] items-start gap-x-4 rounded-controle px-3 py-3 no-underline"
                          >
                            <span className="az-ordinal pt-0.5 !text-rotulo" aria-hidden="true">
                              {numerar(deslocamento + indice + 1)}
                            </span>
                            <span className="flex flex-col gap-1">
                              <span className="font-titulo text-h3 font-h3 uppercase leading-titulo text-texto-principal">
                                {software.titulo}
                              </span>
                              <span className="line-clamp-2 text-apoio leading-corpo text-texto-secundario">
                                {software.resumo}
                              </span>
                            </span>
                            <Seta className="mt-1 text-texto-secundario group-hover:text-texto-principal" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </section>
                )
              })}
            </div>

            {/* Coluna de atalhos: o destino do item e a próxima ação. */}
            <div className="col-span-12 flex flex-col gap-3 lg:col-span-3">
              <a
                href={catalogo}
                aria-current={caminhoAtual === catalogo ? 'page' : undefined}
                className="az-card-link flex flex-col gap-3 rounded-bloco border border-borda bg-superficie-elevada p-card no-underline hover:border-texto-principal"
              >
                <span className="az-sobretitulo az-sobretitulo--sem-ponto">
                  {numerar(totalDeSoftwares)} {ROTULOS.softwares}
                </span>
                <span className="flex items-center justify-between gap-3 font-titulo text-h3 font-h3 uppercase leading-titulo text-texto-principal">
                  Todos os softwares
                  <Seta />
                </span>
              </a>
              <a
                href={ROTAS.contato(idioma)}
                className="az-card-link flex items-center justify-between gap-3 rounded-bloco bg-texto-principal p-card font-titulo text-h3 font-h3 uppercase leading-titulo text-superficie no-underline"
              >
                {ACOES.falarComEquipe}
                <Seta className="text-acao-primaria" />
              </a>
              <p className="az-rotulo-coluna mt-2 hidden lg:block">
                <kbd className="rounded-controle border border-borda px-1.5">Esc</kbd> fecha
              </p>
            </div>
          </Container>
        </div>
      ) : null}

      {/* ------------------------------------------------------------------
          FOLHA DE TELA PEQUENA (RF-003) — tela cheia abaixo do cabeçalho.
          Os softwares aparecem já expostos, agrupados; nada fica atrás de
          um segundo nível de toque.
          ------------------------------------------------------------------ */}
      <div
        id="az-painel-menu-principal"
        ref={refFolha}
        hidden={!menuAberto}
        className="az-folha-de-menu fixed inset-x-0 bottom-0 top-cabecalho overflow-y-auto border-t border-borda bg-superficie md:hidden"
      >
        <nav aria-label="Navegação principal, tela pequena">
          <Container como="div" className="flex flex-col gap-8 pb-respiro pt-6">
            {temPainel ? (
              <div className="flex flex-col gap-6">
                {gruposDeSoftwares.map((grupo) => (
                  <section key={grupo.titulo} className="flex flex-col">
                    <h2 className="az-sobretitulo border-b border-borda pb-2">{grupo.titulo}</h2>
                    <ul className="flex flex-col">
                      {grupo.itens.map((software) => (
                        <li key={software.href} className="border-b border-borda">
                          <a
                            href={software.href}
                            aria-current={caminhoAtual === software.href ? 'page' : undefined}
                            className="flex min-h-14 items-center justify-between gap-4 py-3 font-titulo text-h3 font-h3 uppercase leading-titulo text-texto-principal no-underline aria-[current=page]:text-destaque"
                            onClick={fecharMenu}
                          >
                            {software.titulo}
                            <Seta />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            ) : null}

            <ul className="flex flex-col border-t-traco border-t-texto-principal">
              {itensPrincipais.map((item) => (
                <li key={item.href} className="border-b border-borda">
                  <a
                    href={item.href}
                    aria-current={ehAtivo(item.href) ? 'page' : undefined}
                    className="flex min-h-14 w-full items-center justify-between gap-card-compacto font-titulo text-h2 font-h2 uppercase leading-titulo text-texto-principal no-underline aria-[current=page]:text-destaque"
                    onClick={fecharMenu}
                  >
                    {item.href === catalogo && temPainel ? 'Todos os softwares' : item.rotulo}
                    <Seta />
                  </a>
                </li>
              ))}
            </ul>
          </Container>
        </nav>
      </div>
    </header>
  )
}
