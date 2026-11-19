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
import { MarcaDeRegistroProvisorio } from '@/components/catalogo/MarcaDeRegistroProvisorio'
import { TextoRico } from '@/components/catalogo/TextoRico'
import { ROTULOS } from '@/components/layout/navegacao'
import {
  Botao,
  Container,
  Secao,
  SecaoComLinhaDeTransicao,
  Texto,
  TextoDeEntrada,
  Titulo,
} from '@/components/ui'
import {
  listarProdutosPublicados,
  obterPaginaInstitucional,
  SLUG_DA_PAGINA_DO_CATALOGO,
} from '@/lib/consultas'
import { ROTAS } from '@/lib/rotas'
import { ACOES, ESTADO_VAZIO_DO_CATALOGO, SECOES_DE_PRODUTO, TITULOS_FIXOS } from '@/lib/rotulos'
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
    <>
      {/* Restyle — cabeçalho da página em seção própria (sobretítulo, H1,
          introdução), grade de cards na superfície elevada e chamada final
          na faixa escura com o momento da página. Nenhuma consulta nova. */}
      <Secao rotuladaPor="titulo-catalogo" primeiraDobra>
        <Container>
          <div className="flex max-w-texto flex-col items-start gap-6">
            <p className="az-sobretitulo">{ROTULOS.softwares}</p>
            {/* H1 fixo por 12.3 — não vem do registro, é estrutura de template. */}
            <Titulo nivel={1} id="titulo-catalogo" className="max-w-titulo">
              <TextoDeEntrada>{TITULOS_FIXOS.catalogo}</TextoDeEntrada>
            </Titulo>
            <MarcaDeRegistroProvisorio registro={pagina} className="az-entrada-apoio" />
            {blocoDeIntroducao && blocoDeIntroducao.blockType === 'blocoDeTexto' ? (
              <TextoRico dados={blocoDeIntroducao.corpo} nivelBase={2} />
            ) : null}
          </div>
        </Container>
      </Secao>

      <Secao rotulo={TITULOS_FIXOS.catalogo} superficie="elevada">
        <Container>
          {produtos.length > 0 ? (
            <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {produtos.map((produto) => (
                <li key={produto.id} data-revelar-item="" className="flex">
                  <CartaoDeProduto produto={produto} nivelDeTitulo={2} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col gap-2">
              <Titulo nivel={2}>{ESTADO_VAZIO_DO_CATALOGO.titulo}</Titulo>
              <Texto tom="secundario">{ESTADO_VAZIO_DO_CATALOGO.apoio}</Texto>
            </div>
          )}
        </Container>
      </Secao>

      <SecaoComLinhaDeTransicao rotuladaPor="titulo-catalogo-proximo-passo" fundoAnterior="elevada">
        <Container className="relative z-10">
          <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
            <Titulo nivel={2} id="titulo-catalogo-proximo-passo" className="max-w-titulo">
              <span data-bloco="">{SECOES_DE_PRODUTO.chamadaFinal}</span>
            </Titulo>
            <div data-bloco="" className="w-full sm:w-auto">
              <Botao
                href={ROTAS.contato()}
                variante="primaria"
                comSeta
                className="w-full sm:w-auto"
              >
                {ACOES.falarComEquipe}
              </Botao>
            </div>
          </div>
        </Container>
      </SecaoComLinhaDeTransicao>
    </>
  )
}
