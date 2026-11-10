'use client'

/**
 * Troca declarada de tema claro / escuro.
 * Visual: 11.13 (os dois temas), 11.15 (sem sombra, sem gradiente)
 * Acessibilidade: 13.2 (foco visível herdado de globals.css), 13.3 (o estado
 *   atual é anunciado em texto, não só por cor), 13.9 (alvo de 44 px)
 * Dono: Onda 3a
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

import { useEffect, useState } from 'react'

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

  const aplicar = (escolha: PreferenciaDeTema) => {
    definirPreferencia(escolha)
    const raiz = document.documentElement
    if (escolha === 'sistema') raiz.removeAttribute(ATRIBUTO_DE_TEMA)
    else raiz.setAttribute(ATRIBUTO_DE_TEMA, escolha)
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
    <fieldset className={className} disabled={!hidratado}>
      <legend className="az-apenas-leitor-de-tela">{rotulo}</legend>
      <div className="flex flex-wrap items-center gap-entre-alvos">
        {opcoes.map((opcao) => {
          const selecionada = opcao.valor === preferencia
          return (
            <label
              key={opcao.valor}
              className={[
                'inline-flex min-h-toque cursor-pointer items-center gap-entre-alvos',
                'rounded-controle border px-card-compacto',
                'text-apoio leading-corpo',
                selecionada
                  ? 'border-acao-secundaria bg-superficie-elevada text-texto-principal'
                  : 'border-borda bg-superficie text-texto-secundario',
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
              {/* 13.3 — o estado atual é legível em texto, não inferido da cor. */}
              <span>{opcao.rotulo}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
