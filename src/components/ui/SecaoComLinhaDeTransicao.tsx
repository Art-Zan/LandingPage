'use client'

/**
 * Seção com linha de transição — o "momento" da página.
 * Visual: 11.15 (cor sólida de token, linha de 1 px, nenhum gradiente,
 *   nenhuma sombra), 11.12 (a faixa escura veste a coluna escura já medida)
 * Acessibilidade: 13.10 (movimento só acompanha a rolagem nativa, nunca a
 *   sequestra; desligado sob prefers-reduced-motion e em tela pequena;
 *   conteúdo legível sem script — regra 5), 13.5 (região rotulada)
 * Dono: Restyle (2026-11-10), território de src/components/ui
 *
 * Porte, em React e tokens, do momento `line-carries-colour` da skill de
 * design (o arquivo do kit não é carregado). A seção fica sobre a faixa
 * escura; dentro dela, um painel recuado com a superfície da página anterior
 * cobre o conteúdo, e uma linha de 1 px sobe do pé ao topo levando a capa
 * junto, acompanhando a barra de rolagem (e voltando ao rolar para cima).
 * (Versão sem esmaecimento por bloco: a capa opaca é o único véu, e ela
 * abre de saída quando a página não rola o bastante ou quando o foco de
 * teclado entra na seção.) Os marcadores `data-bloco` ficam como gancho.
 * Antes: cada bloco marcado com `data-bloco` só aparecia, inteiro, depois que a
 * linha passou acima dele — nenhuma palavra é cortada.
 *
 * Sem script, em tela abaixo de 640 px e sob movimento reduzido: não existe
 * painel nem linha; a seção aparece como escrita.
 */

import { useEffect, useRef, useState, type ReactNode } from 'react'

import { juntarClasses } from './juntarClasses'

export type PropsDaSecaoComLinhaDeTransicao = {
  /** `id` do título da seção (13.5). */
  rotuladaPor: string
  id?: string
  /** Fundo da seção anterior: o que a capa imita. */
  fundoAnterior?: 'base' | 'elevada'
  children: ReactNode
  className?: string
}

const limitar = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))
const suave = (a: number, b: number, v: number) => {
  const t = limitar((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}

export const SecaoComLinhaDeTransicao = ({
  rotuladaPor,
  id,
  fundoAnterior = 'base',
  children,
  className,
}: PropsDaSecaoComLinhaDeTransicao) => {
  const refSecao = useRef<HTMLElement>(null)
  const refPalco = useRef<HTMLDivElement>(null)
  const [ativo, definirAtivo] = useState(false)

  useEffect(() => {
    const largura = window.matchMedia('(min-width: 640px)')
    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)')
    const avaliar = () => definirAtivo(largura.matches && !reduzido.matches)
    avaliar()
    largura.addEventListener('change', avaliar)
    reduzido.addEventListener('change', avaliar)
    return () => {
      largura.removeEventListener('change', avaliar)
      reduzido.removeEventListener('change', avaliar)
    }
  }, [])

  useEffect(() => {
    const secao = refSecao.current
    const palco = refPalco.current
    if (!ativo || !secao || !palco) return

    let quadro = 0
    // Foco de teclado dentro da seção abre o momento na hora: nada focado
    // pode ficar invisível sob a capa (13.2 regra 6).
    let forcado = false

    const atualizar = () => {
      quadro = 0
      const r = secao.getBoundingClientRect()
      const alturaTela = window.innerHeight
      // 0: topo da seção no pé da tela; 1: topo da seção a um quinto da tela.
      const subida = limitar((alturaTela * 0.98 - r.top) / (alturaTela * 0.78))
      // Se a página não rola o bastante para a seção chegar a um quinto da
      // tela, o momento abre de saída: nada pode ficar sob a capa em repouso.
      const rolagemMaxima = document.documentElement.scrollHeight - alturaTela
      const topoNoFim = r.top + window.scrollY - rolagemMaxima
      const inalcancavel = topoNoFim > alturaTela * 0.2
      const k = forcado || inalcancavel ? 1 : suave(0.35, 1, subida)
      const pr = palco.getBoundingClientRect()
      const corte = (1 - k) * pr.height
      secao.style.setProperty('--az-linha-corte', `${corte.toFixed(1)}px`)
      secao.style.setProperty('--az-linha-abaixo', `${(pr.height - corte).toFixed(1)}px`)
      const aberto = k >= 0.999
      secao.toggleAttribute('data-momento-aberto', aberto)
    }

    const agendar = () => {
      if (!quadro) quadro = window.requestAnimationFrame(atualizar)
    }

    const aoFocar = () => {
      forcado = true
      atualizar()
    }
    secao.addEventListener('focusin', aoFocar)

    atualizar()
    window.addEventListener('scroll', agendar, { passive: true })
    window.addEventListener('resize', agendar)
    return () => {
      window.removeEventListener('scroll', agendar)
      window.removeEventListener('resize', agendar)
      secao.removeEventListener('focusin', aoFocar)
      if (quadro) window.cancelAnimationFrame(quadro)
      secao.removeAttribute('data-momento-aberto')
    }
  }, [ativo])

  return (
    <section
      ref={refSecao}
      id={id}
      aria-labelledby={rotuladaPor}
      data-moment="line-carries-colour"
      data-moment-opts={JSON.stringify({ from: fundoAnterior === 'base' ? 'base' : 'surface' })}
      data-moment-mounted={ativo ? '' : undefined}
      className={juntarClasses('az-momento-linha az-faixa-escura relative py-respiro', className)}
      style={{ overflowX: 'clip' }}
    >
      {children}
      {ativo ? (
        <div
          ref={refPalco}
          aria-hidden="true"
          className="az-momento-linha__palco pointer-events-none absolute inset-4 z-20 overflow-hidden rounded-bloco"
        >
          <div
            className={juntarClasses(
              'az-momento-linha__capa absolute inset-0',
              fundoAnterior === 'base' ? 'az-capa-base' : 'az-capa-elevada',
            )}
          />
          <div className="az-momento-linha__linha absolute inset-x-0 h-px bg-borda" />
        </div>
      ) : null}
    </section>
  )
}
