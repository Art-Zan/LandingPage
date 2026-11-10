'use client'

/**
 * Cabeçalho persistente do shell público.
 * Implementa: RF-001 (cabeçalho persistente, identificação leva à inicial,
 *   ação de contato sempre visível), RF-002 (menu de cinco itens fixos, sem
 *   submenu abaixo do gatilho de 6.6), RF-003 (menu em tela pequena: controle
 *   único, estado anunciado, ordem preservada, foco retido e devolvido)
 * Modelo: 6.1 (menu e justificativa), 6.2 (regras de submenu)
 * Visual: 11.11 (leitura do wordmark), 11.12 (o azul só no "Z", PR-062),
 *   11.14 (caixa alta e espaçamento só no wordmark)
 * Acessibilidade: 13.2 (foco não obscurecido — redefine
 *   `--az-deslocamento-rolagem` pela altura real do cabeçalho), 13.5 (região
 *   `nav` rotulada), 13.9 (alvo de toque de 44 px)
 * Perguntas abertas que afetam este arquivo: Q-077 (não existe arquivo
 *   vetorial do logotipo), Q-078 (versões derivadas não existem) — por isso a
 *   identificação é texto tratado pelos tokens, nunca a imagem de
 *   `Logo.png` (fora do território desta onda: nenhum arquivo novo entra em
 *   `public/` além de `public/fonts/**`), o que também evita reproduzir 11.13
 *   ("o logotipo no tema escuro não pode ser o mesmo arquivo") sem precisar
 *   de uma segunda versão que não existe.
 * Dono: Onda 3a
 *
 * POR QUE `use client`. Duas razões, nenhuma decorativa:
 *  1. o menu de tela pequena (RF-003) precisa de estado, foco programático,
 *     captura de tecla de escape e clique fora — comportamento de interação;
 *  2. o cabeçalho é fixo (`sticky`), e por isso é quem MEDE a própria altura
 *     e redefine `--az-deslocamento-rolagem` (tokens.css, Onda 2a: "zero
 *     enquanto não houver elemento fixo... quem construir o cabeçalho fixo
 *     redefine esta variável e nada mais"). O valor vem de `ResizeObserver`
 *     sobre o próprio elemento — medido, nunca um pixel adivinhado.
 *
 * `itens` chega PRONTO de `(site)/layout.tsx`, já filtrado por
 * `montarItensDoMenu` (dev/CONVENCOES.md §4, "Parceiros" condicionado a dado
 * publicado). Este arquivo não decide o que aparece no menu — só como o menu
 * se comporta.
 */

import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Botao, Container } from '@/components/ui'
import { NOME_DA_MARCA } from '@/lib/rotulos'
import { ROTAS, type Idioma } from '@/lib/rotas'

import type { ItemDeMenu } from './navegacao'

export type PropsDoCabecalho = {
  itens: ItemDeMenu[]
  idioma?: Idioma
}

const juntar = (...partes: Array<string | false | undefined>): string =>
  partes.filter(Boolean).join(' ')

const LINK_DE_NAVEGACAO =
  'inline-flex min-h-toque items-center rounded-controle px-2 text-rotulo font-rotulo ' +
  'text-texto-principal no-underline transition-colors duration-padrao hover:bg-superficie-elevada'

const LINK_ATIVO = 'bg-superficie-elevada'

/**
 * 11.11 — o wordmark trata a marca em caixa alta com uma única letra em
 * destaque ("Z"). Derivado de `NOME_DA_MARCA` (src/lib/rotulos.ts) em vez de
 * um literal "ARTZAN": se o nome mudar de fonte um dia, o cabeçalho segue
 * junto sem exigir uma segunda edição (RNF-074).
 */
const partirWordmark = (nome: string) => {
  const emCaixaAlta = nome.toUpperCase()
  const indiceDoZ = emCaixaAlta.indexOf('Z')
  if (indiceDoZ === -1) return { antes: emCaixaAlta, z: '', depois: '' }
  return {
    antes: emCaixaAlta.slice(0, indiceDoZ),
    z: emCaixaAlta.slice(indiceDoZ, indiceDoZ + 1),
    depois: emCaixaAlta.slice(indiceDoZ + 1),
  }
}

export const Cabecalho = ({ itens, idioma }: PropsDoCabecalho) => {
  const wordmark = partirWordmark(NOME_DA_MARCA)
  const caminhoAtual = usePathname()
  const [aberto, setAberto] = useState(false)

  const refCabecalho = useRef<HTMLElement>(null)
  const refPainel = useRef<HTMLDivElement>(null)
  const refBotaoAlternar = useRef<HTMLButtonElement>(null)

  const itensPrincipais = itens.filter((item) => !item.destacado)
  const itemDeContato = itens.find((item) => item.destacado)

  // 13.2 regra 6 — o cabeçalho é fixo; o deslocamento de rolagem passa a ser
  // a altura REAL dele, medida, para que nenhum elemento focado fique
  // escondido por baixo (tokens.css, Onda 2a).
  useEffect(() => {
    const elemento = refCabecalho.current
    if (!elemento) return

    const raiz = document.documentElement
    const atualizarDeslocamento = () => {
      raiz.style.setProperty('--az-deslocamento-rolagem', `${elemento.offsetHeight}px`)
    }

    atualizarDeslocamento()
    const observador = new ResizeObserver(atualizarDeslocamento)
    observador.observe(elemento)
    return () => observador.disconnect()
  }, [])

  const fechar = useCallback(() => {
    setAberto(false)
    refBotaoAlternar.current?.focus()
  }, [])

  // RF-003 — foco vai para o primeiro item ao abrir; teclado não escapa do
  // painel (armadilha controlada, não acidental); escape fecha e devolve o
  // foco ao controle; clique fora fecha.
  useEffect(() => {
    if (!aberto) return

    const painel = refPainel.current
    const focaveis = () =>
      Array.from(painel?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [])

    focaveis()[0]?.focus()

    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') {
        evento.preventDefault()
        fechar()
        return
      }
      if (evento.key !== 'Tab') return
      const elementos = focaveis()
      if (elementos.length === 0) return
      const primeiro = elementos[0]!
      const ultimo = elementos[elementos.length - 1]!
      if (evento.shiftKey && document.activeElement === primeiro) {
        evento.preventDefault()
        ultimo.focus()
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault()
        primeiro.focus()
      }
    }

    const aoClicarFora = (evento: MouseEvent) => {
      const alvo = evento.target as Node
      if (painel?.contains(alvo) || refBotaoAlternar.current?.contains(alvo)) return
      fechar()
    }

    document.addEventListener('keydown', aoTeclar)
    document.addEventListener('mousedown', aoClicarFora)
    return () => {
      document.removeEventListener('keydown', aoTeclar)
      document.removeEventListener('mousedown', aoClicarFora)
    }
  }, [aberto, fechar])

  const ehAtivo = (href: string) => caminhoAtual === href

  return (
    <header
      ref={refCabecalho}
      className="sticky top-0 z-40 border-b border-borda bg-superficie"
    >
      <Container className="flex items-center justify-between gap-card-compacto py-2">
        {/* 11.11 — wordmark tratado em texto: caixa alta, espaçamento de
            +4% e o "Z" no azul de ação primária. Nunca a imagem do
            logotipo: a versão para tema escuro não existe (11.13, Q-077/78). */}
        <a
          href={ROTAS.inicial(idioma)}
          className="inline-flex shrink-0 items-center no-underline"
        >
          <span className="font-titulo text-h3 uppercase tracking-caixa-alta text-texto-principal">
            {wordmark.antes}
            <span className="text-acao-primaria">{wordmark.z}</span>
            {wordmark.depois}
          </span>
        </a>

        <div className="flex items-center gap-entre-alvos md:gap-card">
          <nav aria-label="Navegação principal" className="hidden md:block">
            <ul className="flex items-center gap-2">
              {itensPrincipais.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={ehAtivo(item.href) ? 'page' : undefined}
                    className={juntar(LINK_DE_NAVEGACAO, ehAtivo(item.href) && LINK_ATIVO)}
                  >
                    {item.rotulo}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* RF-001 / RF-003 — a ação de contato permanece visível em
              qualquer largura, inclusive com o menu recolhido: fica FORA
              do painel que o controle abaixo abre e fecha. */}
          {itemDeContato ? (
            <Botao href={itemDeContato.href} variante="primaria">
              {itemDeContato.rotulo}
            </Botao>
          ) : null}

          <button
            ref={refBotaoAlternar}
            type="button"
            className="inline-flex min-h-toque min-w-toque items-center justify-center rounded-controle border border-borda bg-superficie md:hidden"
            aria-expanded={aberto}
            aria-controls="az-painel-menu-principal"
            onClick={() => setAberto((valor) => !valor)}
          >
            <span className="az-apenas-leitor-de-tela">
              {aberto ? 'Fechar menu' : 'Abrir menu'}
            </span>
            {/* Ícone decorativo (13.4): o rótulo acessível já está no texto acima. */}
            <svg
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 20 20"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {aberto ? (
                <path d="M5 5l10 10M15 5L5 15" />
              ) : (
                <path d="M3 5h14M3 10h14M3 15h14" />
              )}
            </svg>
          </button>
        </div>
      </Container>

      {/* RF-003 — painel de tela pequena. `hidden` (nativo) remove do fluxo
          e da árvore de acessibilidade quando fechado; `md:hidden` impede
          que ele apareça em tela larga mesmo que `aberto` continue true
          após um redimensionamento. */}
      <div
        id="az-painel-menu-principal"
        ref={refPainel}
        hidden={!aberto}
        className="border-t border-borda bg-superficie md:hidden"
      >
        <nav aria-label="Navegação principal, tela pequena">
          <Container como="div" className="py-card-compacto">
            <ul className="flex flex-col gap-1">
              {itensPrincipais.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={ehAtivo(item.href) ? 'page' : undefined}
                    className={juntar(
                      LINK_DE_NAVEGACAO,
                      'w-full',
                      ehAtivo(item.href) && LINK_ATIVO,
                    )}
                    onClick={fechar}
                  >
                    {item.rotulo}
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
