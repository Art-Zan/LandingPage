'use client'

/**
 * Revelação ao rolar — um único componente cliente para o site inteiro.
 * Acessibilidade: 13.10 regras 1 e 5 (desligada sob movimento reduzido;
 *   conteúdo presente e legível sem a animação e sem script), 13.2 regra 6
 *   (foco de teclado num bloco ainda oculto o revela na hora)
 * Visual: receita e tempos em globals.css (Onda 5) e tokens.css
 * Dono: Onda 5 (2026-11-13), território de src/components/layout
 *
 * Não renderiza nada. Ao montar, procura os blocos marcados com
 * `data-revelar` (a `Secao`, menos a primeira dobra) e só esconde os que
 * ainda estão ABAIXO da tela: o que o visitante já vê nunca pisca. Cada um é
 * revelado uma vez, ao entrar na tela, e deixa de ser observado.
 *
 * O estado oculto nunca vem do servidor. Sem script, com o script quebrado,
 * sem IntersectionObserver ou sob movimento reduzido, nada é escondido.
 * IntersectionObserver em vez de biblioteca de animação: zero dependência e
 * o navegador decide quando o bloco entrou — sem ouvir a rolagem a cada
 * quadro.
 */

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const SELETOR = '[data-revelar]'
const PENDENTE = 'pendente'
const VISTO = 'visto'
/** Degraus de cascata por lista; o resto entra junto com o último. */
const MAXIMO_DE_DEGRAUS = 6

export const RevelarAoRolar = () => {
  const caminho = usePathname()

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const revelar = (alvo: Element) => alvo.setAttribute('data-revelar', VISTO)

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue
          revelar(entrada.target)
          observador.unobserve(entrada.target)
        }
      },
      // Revela quando o topo do bloco passa de 92% da altura da tela.
      { rootMargin: '0px 0px -8% 0px', threshold: 0 },
    )

    const pendentes: HTMLElement[] = []
    for (const alvo of document.querySelectorAll<HTMLElement>(SELETOR)) {
      if (alvo.getAttribute('data-revelar') === VISTO) continue
      if (alvo.getBoundingClientRect().top < window.innerHeight) continue
      alvo.querySelectorAll<HTMLElement>('[data-revelar-item]').forEach((item, indice) => {
        item.style.setProperty('--az-ordem-revelar', String(Math.min(indice, MAXIMO_DE_DEGRAUS)))
      })
      alvo.setAttribute('data-revelar', PENDENTE)
      pendentes.push(alvo)
      observador.observe(alvo)
    }

    const revelarTudo = () => {
      for (const alvo of pendentes) {
        revelar(alvo)
        observador.unobserve(alvo)
      }
    }

    // Foco de teclado nunca cai em conteúdo invisível.
    const aoFocar = (evento: FocusEvent) => {
      const alvo = (evento.target as Element | null)?.closest?.(`[data-revelar="${PENDENTE}"]`)
      if (!alvo) return
      revelar(alvo)
      observador.unobserve(alvo)
    }

    // No pé da página, um bloco curto pode nunca cruzar a margem de 8%:
    // chegar ao fim revela o que restou.
    const aoRolar = () => {
      const raiz = document.documentElement
      if (window.scrollY + window.innerHeight >= raiz.scrollHeight - 2) revelarTudo()
    }

    document.addEventListener('focusin', aoFocar)
    window.addEventListener('scroll', aoRolar, { passive: true })
    window.addEventListener('beforeprint', revelarTudo)
    return () => {
      observador.disconnect()
      document.removeEventListener('focusin', aoFocar)
      window.removeEventListener('scroll', aoRolar)
      window.removeEventListener('beforeprint', revelarTudo)
    }
  }, [caminho])

  return null
}
