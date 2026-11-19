/**
 * Shell público — comum a toda página de `(site)`.
 * Implementa: RF-001 (cabeçalho persistente), RF-002 (menu de cinco itens
 *   fixos), RF-003 (menu em tela pequena), RF-004 (rodapé de quatro
 *   colunas), RF-009 (salto para o conteúdo, região `main` identificada)
 * Modelo: 6.1 (menu principal), 6.2 (regras de submenu — nenhum ativo hoje)
 * Perguntas abertas que afetam este arquivo: Q-025 / D-05 ("Parceiros" só
 *   aparece com ao menos um parceiro publicado E autorizado — decisão de
 *   dado consultada em execução, nunca condição comentada no código)
 * Dono: Onda 3a
 *
 * ÚNICA CONSULTA AO PAYLOAD DESTA ONDA. `listarParceirosPublicados` vem de
 * `src/lib/consultas.ts` (Onda 3b) e já fixa `locale: 'pt-BR'` explícito —
 * trava 2 de dev/CONVENCOES.md §5.3. Reaproveitar a função existente evita
 * abrir uma segunda leitura da mesma coleção com risco de divergir da regra
 * de autorização de marca (PR-018) aplicada em `/parceiros`.
 *
 * `(dev)` e `(payload)` são grupos IRMÃOS deste, não filhos: nenhum dos dois
 * herda este shell, porque cada um tem seu próprio `layout.tsx` (ou nenhum,
 * caindo direto no layout raiz) — é assim que a rota de revisão de
 * primitivos permanece fora do cabeçalho e do rodapé públicos.
 */

import type { ReactNode } from 'react'

import { Cabecalho } from '@/components/layout/Cabecalho'
import { montarGruposDeSoftwares, montarItensDoMenu } from '@/components/layout/navegacao'
import { PularParaConteudo } from '@/components/layout/PularParaConteudo'
import { RevelarAoRolar } from '@/components/layout/RevelarAoRolar'
import { Rodape } from '@/components/layout/Rodape'
import { listarParceirosPublicados, listarProdutosPublicados } from '@/lib/consultas'
import { IDIOMA_PADRAO } from '@/lib/rotas'

const ID_DO_CONTEUDO_PRINCIPAL = 'conteudo-principal'

export default async function LayoutDoSite({ children }: { children: ReactNode }) {
  const [parceiros, produtos] = await Promise.all([
    listarParceirosPublicados(),
    listarProdutosPublicados(),
  ])
  // Nav 2026-11-13 — painel de softwares do cabeçalho.
  const gruposDeSoftwares = montarGruposDeSoftwares(produtos, IDIOMA_PADRAO)
  const haParceirosPublicados = parceiros.length > 0

  const itens = montarItensDoMenu({ haParceirosPublicados, idioma: IDIOMA_PADRAO })

  return (
    <>
      {/* Restyle: o link de salto continua o primeiro elemento focável, agora
          dentro do marco do cabeçalho. */}
      <Cabecalho
        primeiro={<PularParaConteudo destino={ID_DO_CONTEUDO_PRINCIPAL} />}
        itens={itens}
        gruposDeSoftwares={gruposDeSoftwares}
        idioma={IDIOMA_PADRAO}
      />
      {/* `tabIndex={-1}` — alvo programático do link de salto (13.2 regra 4):
          `main` não é focável por padrão, e sem isso alguns navegadores não
          movem o foco ao ativar o link, mesmo rolando até a âncora. */}
      <main id={ID_DO_CONTEUDO_PRINCIPAL} tabIndex={-1}>
        {children}
      </main>
      {/* Onda 5 — revelação ao rolar das seções de todas as páginas (13.10).
          Não renderiza nada; sem script, nada é escondido. */}
      <RevelarAoRolar />
      <Rodape haParceirosPublicados={haParceirosPublicados} idioma={IDIOMA_PADRAO} />
    </>
  )
}
