/**
 * P-01 — Página inicial
 * Implementa: RF-020, RF-021, RF-022, RF-024, RF-025, RF-026, RF-027, RF-028 (parcial —
 *   rodapé é layout, Onda 3a), RF-140, RF-160, RF-161, RF-166
 * Modelo: 6.7 (PaginasInstitucionais slug "inicio", Produto, Parceiro)
 * Visual: 11.7, 11.12, 11.15 · Conversão: 14.1 (uma ação primária por seção)
 * Premissas: PR-007 (sem prova social), PR-011 (parceiros: estado vazio provável),
 *   PR-062 (azul exclusivo da ação primária)
 * Perguntas abertas que afetam este arquivo: Q-006 (nenhuma solução composta —
 *   bloco 4 omitido), Q-021 (sem prova social — bloco 7 vazio por decisão),
 *   Q-025 (nenhum parceiro autorizado — bloco 6 provavelmente omitido),
 *   Q-077 / Q-078 (imagem institucional de compartilhamento ainda não existe)
 * Dono: Onda 3b
 *
 * CONTRATO COM A ONDA 4, para o registro `PaginasInstitucionais` de slug
 * "inicio" (src/lib/consultas.ts, SLUG_DA_PAGINA_INICIAL): o `corpo` deve
 * conter, em qualquer ordem, no máximo UM `blocoDeChamada` (a proposta de
 * valor — título = frase principal/H1, texto = apoio, chamada = ação
 * primária), UM `blocoDeTexto` (apresentação da empresa) e UM `blocoDeLista`
 * (benefícios do modelo de portfólio, 3 a 6 itens, conforme 5.4). Este
 * template extrai cada seção PELO TIPO do bloco, não pela posição no array —
 * um segundo bloco do mesmo tipo é ignorado.
 *
 * SEÇÕES OMITIDAS POR DECISÃO DO PRD, não por falta de dado:
 *   - Apresentação de soluções (item 4 de 7/P-01): Q-006, nenhuma solução
 *     composta existe. Nem consultada.
 *   - Elementos de confiança (RF-026): PR-007/Q-021, sem prova social. O bloco
 *     é "previsto e vazio" — não renderiza nada enquanto não houver item
 *     verificável (nenhum hoje).
 *   - Rodapé (item 9 de 7/P-01): vive no layout compartilhado da Onda 3a
 *     (dev/CONVENCOES.md §2), não neste arquivo.
 */

import type { Metadata } from 'next'

import { CartaoDeProduto } from '@/components/catalogo/CartaoDeProduto'
import { TextoRico } from '@/components/catalogo/TextoRico'
import { Botao, Container, Secao, Texto, Titulo } from '@/components/ui'
import {
  listarParceirosPublicados,
  listarProdutosEmDestaque,
  obterPaginaInstitucional,
  SLUG_DA_PAGINA_INICIAL,
} from '@/lib/consultas'
import { ROTAS } from '@/lib/rotas'
import { ACOES, SECOES_DA_INICIAL } from '@/lib/rotulos'
import { construirMetadados, jsonLdOrganizacaoEWebsite, serializarDadosEstruturados } from '@/lib/seo'
import type { Midia, PaginasInstitucionai } from '@/payload-types'

type BlocoDaInicial = PaginasInstitucionai['corpo'][number]

const encontrarBloco = <T extends BlocoDaInicial['blockType']>(
  blocos: BlocoDaInicial[],
  tipo: T,
): Extract<BlocoDaInicial, { blockType: T }> | undefined =>
  blocos.find((bloco): bloco is Extract<BlocoDaInicial, { blockType: T }> => bloco.blockType === tipo)

const ehMidiaPopulada = (midia: number | Midia | null | undefined): midia is Midia =>
  typeof midia === 'object' && midia !== null

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await obterPaginaInstitucional(SLUG_DA_PAGINA_INICIAL)
  return construirMetadados({
    registro: pagina,
    segmentos: [],
    comSufixoDeMarca: false,
    imagem:
      ehMidiaPopulada(pagina?.imagemDestaque) && pagina.imagemDestaque.url
        ? { url: pagina.imagemDestaque.url, alt: pagina.imagemDestaque.alt }
        : undefined,
  })
}

export default async function PaginaInicial() {
  const [pagina, produtosEmDestaque, parceiros] = await Promise.all([
    obterPaginaInstitucional(SLUG_DA_PAGINA_INICIAL),
    listarProdutosEmDestaque(6),
    listarParceirosPublicados(),
  ])

  const blocos = pagina?.corpo ?? []
  const blocoDeHero = encontrarBloco(blocos, 'blocoDeChamada')
  const blocoDeApresentacao = encontrarBloco(blocos, 'blocoDeTexto')
  const blocoDeBeneficios = encontrarBloco(blocos, 'blocoDeLista')

  return (
    <>
      <script
        type="application/ld+json"
        // Gerado por src/lib/seo.ts a partir de constantes fixas — nenhum
        // texto de visitante passa por aqui.
        dangerouslySetInnerHTML={{ __html: serializarDadosEstruturados(jsonLdOrganizacaoEWebsite()) }}
      />

      {/* 1. Proposta de valor (RF-020) — H1 da página. Sem bloco cadastrado,
          a seção inteira é omitida: nenhuma frase é inventada aqui. */}
      {blocoDeHero ? (
        <Secao id="proposta-de-valor" rotuladaPor="titulo-proposta-de-valor">
          <Container>
            <div className="flex flex-col gap-4">
              <Titulo nivel={1} id="titulo-proposta-de-valor">
                {blocoDeHero.titulo}
              </Titulo>
              {blocoDeHero.texto ? <Texto variante="corpo">{blocoDeHero.texto}</Texto> : null}
              <div>
                <Botao href={blocoDeHero.destino} variante="primaria">
                  {blocoDeHero.rotuloDaAcao}
                </Botao>
              </div>
            </div>
          </Container>
        </Secao>
      ) : null}

      {/* 2. Apresentação da empresa (RF-021) */}
      {blocoDeApresentacao ? (
        <Secao id="apresentacao-da-empresa" rotuladaPor="titulo-apresentacao-da-empresa">
          <Container>
            <div className="flex flex-col gap-4">
              <Titulo nivel={2} id="titulo-apresentacao-da-empresa">
                {blocoDeApresentacao.titulo ?? SECOES_DA_INICIAL.apresentacaoDaEmpresa}
              </Titulo>
              <TextoRico dados={blocoDeApresentacao.corpo} nivelBase={3} />
              <div>
                <Botao href={ROTAS.sobre()} variante="secundaria">
                  {ACOES.sobreAMarca}
                </Botao>
              </div>
            </div>
          </Container>
        </Secao>
      ) : null}

      {/* 3. Destaque dos softwares (RF-022) */}
      {produtosEmDestaque.length > 0 ? (
        <Secao id="destaque-de-softwares" rotuladaPor="titulo-destaque-de-softwares" superficie="elevada">
          <Container>
            <div className="flex flex-col gap-6">
              <Titulo nivel={2} id="titulo-destaque-de-softwares">
                {SECOES_DA_INICIAL.destaqueDeSoftwares}
              </Titulo>
              <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {produtosEmDestaque.map((produto) => (
                  <li key={produto.id}>
                    <CartaoDeProduto produto={produto} nivelDeTitulo={3} />
                  </li>
                ))}
              </ul>
              <div>
                <Botao href={ROTAS.catalogo()} variante="secundaria">
                  {ACOES.verSoftwares}
                </Botao>
              </div>
            </div>
          </Container>
        </Secao>
      ) : null}

      {/* 4. Apresentação de soluções — OMITIDA (Q-006): nenhuma solução composta
          existe no lançamento. Nada é consultado nem renderizado aqui. */}

      {/* 5. Benefícios (RF-024) — conteúdo de 5.4, sem número de apoio. O
          template só renderiza o que o bloco de lista trouxer. */}
      {blocoDeBeneficios ? (
        <Secao id="beneficios" rotuladaPor="titulo-beneficios">
          <Container>
            <div className="flex flex-col gap-6">
              <Titulo nivel={2} id="titulo-beneficios">
                {blocoDeBeneficios.titulo ?? SECOES_DA_INICIAL.beneficios}
              </Titulo>
              <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {blocoDeBeneficios.itens.map((item) => (
                  <li key={item.id} className="flex flex-col gap-2">
                    <Titulo nivel={3}>{item.titulo}</Titulo>
                    {item.texto ? <Texto tom="secundario">{item.texto}</Texto> : null}
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </Secao>
      ) : null}

      {/* 6. Empresas parceiras (RF-025) — condicional. Cenário provável é
          ausência (Q-025): sem parceiro publicado e autorizado, a seção
          inteira é omitida, nunca substituída por logo genérico. */}
      {parceiros.length > 0 ? (
        <Secao id="parceiros" rotuladaPor="titulo-parceiros">
          <Container>
            <div className="flex flex-col gap-6">
              <Titulo nivel={2} id="titulo-parceiros">
                {SECOES_DA_INICIAL.parceiros}
              </Titulo>
              <ul className="flex flex-wrap items-center gap-8">
                {parceiros
                  .filter((parceiro) => ehMidiaPopulada(parceiro.logo) && parceiro.logo.url)
                  .map((parceiro) => {
                    const logo = parceiro.logo as Midia
                    return (
                      <li key={parceiro.id}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={logo.url ?? ''} alt={logo.alt} className="h-12 w-auto" />
                      </li>
                    )
                  })}
              </ul>
            </div>
          </Container>
        </Secao>
      ) : null}

      {/* 7. Elementos de confiança (RF-026) — previsto e vazio (PR-007, Q-021).
          Nenhum item verificável existe hoje: nada é renderizado, de propósito. */}

      {/* 8. Chamada para ação final (RF-027) — repete a ação primária e oferece
          a alternativa de menor compromisso. Rótulos fixos de 14.1 (rotulos.ts),
          nenhum texto de negócio. */}
      <Secao id="chamada-final" rotuladaPor="titulo-chamada-final" superficie="elevada">
        <Container>
          <div className="flex flex-col items-start gap-4">
            <Titulo nivel={2} id="titulo-chamada-final">
              {SECOES_DA_INICIAL.chamadaFinal}
            </Titulo>
            <div className="flex flex-wrap gap-4">
              <Botao href={ROTAS.contato()} variante="primaria">
                {ACOES.falarComEquipe}
              </Botao>
              <Botao href={ROTAS.catalogo()} variante="secundaria">
                {ACOES.verSoftwares}
              </Botao>
            </div>
          </div>
        </Container>
      </Secao>

      {/* 9. Rodapé — layout compartilhado da Onda 3a, não deste arquivo. */}
    </>
  )
}
