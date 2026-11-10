/**
 * P-03 — Catálogo de softwares
 * Implementa: RF-040, RF-041, RF-042, RF-048, RF-049, RF-140, RF-160, RF-161
 * Modelo: 6.7 (Produto, PaginasInstitucionais slug "catalogo")
 * Visual: 12.3 (H1 fixo "Softwares") · Conversão: 14.1
 * Premissas: PR-002 (2 a 5 produtos no lançamento), PR-005 (sem preço)
 * Perguntas abertas que afetam este arquivo: Q-023 (gatilhos de agrupamento,
 *   filtro, ordenação e busca de 6.6 — nenhum atingido com 4 produtos; nada
 *   disso existe nesta página, nem como código desligado)
 * Dono: Onda 3b
 *
 * GRADE SIMPLES, E SÓ (RNF-082, dev/CONVENCOES.md §8 item 10). Esta página não
 * importa, não declara e não deixa comentado nenhum mecanismo de filtro,
 * busca, ordenação, agrupamento ou paginação: o único controle de exibição é
 * o `sort` estável de `listarProdutosPublicados` (src/lib/consultas.ts), que
 * é ORDEM PADRÃO exigida por RF-040, não um controle do visitante.
 */

import type { Metadata } from 'next'

import { CartaoDeProduto } from '@/components/catalogo/CartaoDeProduto'
import { TextoRico } from '@/components/catalogo/TextoRico'
import { Botao, Container, Secao, Texto, Titulo } from '@/components/ui'
import {
  listarProdutosPublicados,
  obterPaginaInstitucional,
  SLUG_DA_PAGINA_DO_CATALOGO,
} from '@/lib/consultas'
import { ROTAS } from '@/lib/rotas'
import { ACOES, ESTADO_VAZIO_DO_CATALOGO, TITULOS_FIXOS } from '@/lib/rotulos'
import { construirMetadados } from '@/lib/seo'
import type { Midia } from '@/payload-types'

const ehMidiaPopulada = (midia: number | Midia | null | undefined): midia is Midia =>
  typeof midia === 'object' && midia !== null

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await obterPaginaInstitucional(SLUG_DA_PAGINA_DO_CATALOGO)
  return construirMetadados({
    registro: pagina,
    segmentos: ['produtos'],
    imagem:
      ehMidiaPopulada(pagina?.imagemDestaque) && pagina.imagemDestaque.url
        ? { url: pagina.imagemDestaque.url, alt: pagina.imagemDestaque.alt }
        : undefined,
  })
}

export default async function PaginaDeCatalogo() {
  const [pagina, produtos] = await Promise.all([
    obterPaginaInstitucional(SLUG_DA_PAGINA_DO_CATALOGO),
    listarProdutosPublicados(),
  ])

  // Primeiro bloco de texto do registro "catalogo": introdução curta sobre o
  // portfólio (7/P-03). Sem registro ou sem bloco, a introdução é omitida —
  // a grade continua funcionando por si só, ela não depende deste texto.
  const blocoDeIntroducao = pagina?.corpo.find((bloco) => bloco.blockType === 'blocoDeTexto')

  return (
    <Secao rotuladaPor="titulo-catalogo">
      <Container>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            {/* H1 fixo por 12.3 — não vem do registro, é estrutura de template. */}
            <Titulo nivel={1} id="titulo-catalogo">
              {TITULOS_FIXOS.catalogo}
            </Titulo>
            {blocoDeIntroducao && blocoDeIntroducao.blockType === 'blocoDeTexto' ? (
              <TextoRico dados={blocoDeIntroducao.corpo} nivelBase={2} />
            ) : null}
          </div>

          {produtos.length > 0 ? (
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {produtos.map((produto) => (
                <li key={produto.id}>
                  <CartaoDeProduto produto={produto} nivelDeTitulo={2} />
                </li>
              ))}
            </ul>
          ) : (
            // RF-049 — catálogo vazio: mensagem objetiva e chamada para
            // contato, nunca card falso ou item "em breve".
            <div className="flex flex-col gap-2">
              <Titulo nivel={2}>{ESTADO_VAZIO_DO_CATALOGO.titulo}</Titulo>
              <Texto tom="secundario">{ESTADO_VAZIO_DO_CATALOGO.apoio}</Texto>
            </div>
          )}

          <div>
            <Botao href={ROTAS.contato()} variante="primaria">
              {ACOES.falarComEquipe}
            </Botao>
          </div>
        </div>
      </Container>
    </Secao>
  )
}
