'use client'

/**
 * Troca declarada de tema claro / escuro.
 * Visual: 11.13 (os dois temas), 11.15 (sem sombra, sem gradiente)
 * Acessibilidade: 13.2 (foco visível herdado de globals.css), 13.3 (o estado
 *   atual é anunciado em texto, não só por cor), 13.9 (alvo de 44 px)
 * Movimento (Onda 5, 13.10): troca por ponteiro esmaece de um tema para o
 *   outro em 240 ms (View Transitions API, só opacidade — globals.css).
 *   Troca por teclado é instantânea (skill de movimento: ação iniciada
 *   por teclado nunca anima), e sob movimento reduzido também. Navegador
 *   sem a API troca na hora, como antes.
 * Dono: Onda 3a (transição: Onda 5)
 *
 * TRÊS ESTADOS, E O PRIMEIRO É O PADRÃO: seguir o sistema, claro, escuro.
 * "Seguir o sistema" não é um tema: é a ausência de preferência declarada, e
 * por isso remove o atributo em vez de escrever um valor.
 *
 * É um grupo de rádio, não um interruptor. Interruptor de dois estados não
 * consegue representar "seguir o sistema" sem mentir sobre o estado atual
 * quando o sistema muda com a página aberta.
 *
 * Renderiza no servidor com o valor `sistema` e corrige no cliente após a
 * hidratação. O conteúdo VISÍVEL da página não depende disso: o tema já foi
 * aplicado pelo script síncrono do layout raiz antes do primeiro pintar.
 */

import { useEffect, useRef, useState } from 'react'

import {
  ATRIBUTO_DE_TEMA,
  CHAVE_DE_TEMA,
  ehPreferenciaDeTema,
  type PreferenciaDeTema,
} from './tema'

type PropsDoControleDeTema = {
  /** Rótulo do grupo. A redação vem de quem usa o controle (RNF-074). */
  rotulo: string
  opcoes: ReadonlyArray<{ valor: PreferenciaDeTema; rotulo: string }>
  className?: string
}

const lerPreferenciaSalva = (): PreferenciaDeTema => {
  try {
    const bruto = localStorage.getItem(CHAVE_DE_TEMA)
    return ehPreferenciaDeTema(bruto) ? bruto : 'sistema'
  } catch {
    return 'sistema'
  }
}

export const ControleDeTema = ({ rotulo, opcoes, className }: PropsDoControleDeTema) => {
  const [preferencia, definirPreferencia] = useState<PreferenciaDeTema>('sistema')
  const [hidratado, definirHidratado] = useState(false)

  // Alinha o controle ao que o script síncrono já aplicou ao documento.
  useEffect(() => {
    definirPreferencia(lerPreferenciaSalva())
    definirHidratado(true)
  }, [])

  // Onda 5 — a última interação foi de ponteiro? Só então a troca anima.
  const porPonteiro = useRef(false)

  const aplicar = (escolha: PreferenciaDeTema) => {
    definirPreferencia(escolha)
    const raiz = document.documentElement
    const trocar = () => {
      if (escolha === 'sistema') raiz.removeAttribute(ATRIBUTO_DE_TEMA)
      else raiz.setAttribute(ATRIBUTO_DE_TEMA, escolha)
    }
    const animar =
      porPonteiro.current &&
      typeof document.startViewTransition === 'function' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    porPonteiro.current = false
    if (animar) document.startViewTransition(trocar)
    else trocar()
    try {
      if (escolha === 'sistema') localStorage.removeItem(CHAVE_DE_TEMA)
      else localStorage.setItem(CHAVE_DE_TEMA, escolha)
    } catch {
      // Preferência não persistida (armazenamento bloqueado). A troca desta
      // sessão continua valendo; falhar em silêncio aqui é o comportamento
      // correto — não há nada que o visitante possa fazer a respeito.
    }
  }

  return (
    <fieldset
      className={className}
      disabled={!hidratado}
      onPointerDown={() => {
        porPonteiro.current = true
      }}
      onKeyDown={() => {
        porPonteiro.current = false
      }}
    >
      <legend className="az-apenas-leitor-de-tela">{rotulo}</legend>
      {/* Restyle — controle segmentado: três opções coladas numa moldura de
          1 px; a escolhida ganha a superfície elevada e borda na tinta. O
          rádio nativo continua visível e recebe o contorno de foco global. */}
      <div className="inline-flex flex-wrap items-center gap-1 rounded-controle border border-borda p-1">
        {opcoes.map((opcao) => {
          const selecionada = opcao.valor === preferencia
          return (
            <label
              key={opcao.valor}
              className={[
                'inline-flex min-h-toque cursor-pointer items-center gap-2 rounded-controle border px-card-compacto',
                'text-apoio font-rotulo leading-corpo transition-colors duration-padrao',
                selecionada
                  ? 'border-acao-secundaria bg-superficie-elevada text-texto-principal'
                  : 'border-transparent text-texto-secundario hover:text-texto-principal',
              ].join(' ')}
            >
              <input
                type="radio"
                name="az-preferencia-de-tema"
                value={opcao.valor}
                checked={selecionada}
                onChange={() => aplicar(opcao.valor)}
                className="h-4 w-4 accent-acao-primaria"
              />
              {/* 13.3 — o estado atual é legível em texto e por borda, não só por cor. */}
              <span>{opcao.rotulo}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
