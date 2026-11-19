/**
 * Trilha de navegação (breadcrumb), compartilhada por toda página que a
 * exige — hoje só P-04; ver comentário abaixo sobre P-06 e P-18.
 * Implementa: RF-069 (trilha de P-04, nunca inclui categoria)
 * Modelo: 6.4 (URL de produto/solução nunca inclui categoria)
 * Acessibilidade: 13.5 regra 6 ("Breadcrumb é uma região de navegação
 *   identificada, com o item atual marcado como atual"), 13.2 (navegação
 *   completa por teclado — a trilha é uma lista de links comuns, sem
 *   controle customizado, então herda o comportamento nativo do navegador)
 * Dono: Onda 3a
 *
 * MIGRAÇÃO DE `src/app/(site)/produtos/[slug]/page.tsx` (Onda 3b). Aquele
 * arquivo implementou a trilha inline porque este componente ainda não
 * existia; o comentário deixado lá pedia a migração assim que existisse.
 * Este arquivo reproduz exatamente a mesma marcação (região `nav` rotulada
 * "Trilha", lista ordenada, separador decorativo `aria-hidden`, último item
 * como `aria-current="page"` em vez de link) — a migração não muda
 * comportamento, só move o código para um lugar reutilizável.
 *
 * P-06 e P-18 (13.5 cita os três) são Futuro/Fase 2 (dev/CONVENCOES.md §4.3)
 * e não têm página nesta etapa — este componente já está pronto para as duas
 * quando existirem, sem precisar ser reescrito.
 *
 * SEM LÓGICA DE NEGÓCIO. Este componente não sabe o que é produto, solução
 * ou categoria: recebe a lista de itens já resolvida (rótulo e destino) e só
 * decide como desenhar a trilha. Nome de produto, de solução ou de página
 * nunca é texto fixo aqui (RNF-074) — quem chama é quem resolve o rótulo.
 */

import Link from 'next/link'

export type ItemDaTrilha = {
  rotulo: string
  /**
   * Destino do item. Ausente apenas no ÚLTIMO item da trilha — a página
   * atual nunca é um link para si mesma (13.5 regra 6: "item atual marcado
   * como atual", não como link).
   */
  href?: string
}

export type PropsDoBreadcrumb = {
  /** Do primeiro ao atual, nesta ordem. O último item não deve ter `href`. */
  itens: readonly ItemDaTrilha[]
  className?: string
}

export const Breadcrumb = ({ itens, className }: PropsDoBreadcrumb) => {
  if (itens.length === 0) return null

  // Restyle: cada item é um único <li> (antes o separador abria um <li>
  // dentro de outro, marcação inválida); links com alvo de 44 px (13.9) e o
  // traço desenhado na passagem; separador angular decorativo.
  return (
    <nav aria-label="Trilha" className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 text-apoio leading-corpo text-texto-secundario">
        {itens.map((item, indice) => {
          const ehUltimo = indice === itens.length - 1
          return (
            <li key={indice} className="inline-flex items-center gap-x-2">
              {indice > 0 ? (
                <span aria-hidden="true" className="text-borda">
                  /
                </span>
              ) : null}
              {item.href && !ehUltimo ? (
                <Link
                  href={item.href}
                  className="az-link-nav az-link-nav--rente inline-flex min-h-toque items-center text-texto-secundario transition-colors duration-padrao hover:text-texto-principal"
                >
                  {item.rotulo}
                </Link>
              ) : (
                <span aria-current={ehUltimo ? 'page' : undefined} className="text-texto-principal">
                  {item.rotulo}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
