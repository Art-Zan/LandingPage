/**
 * P-01 — Página inicial
 * Implementa: RF-020, RF-021, RF-022, RF-024, RF-025, RF-026, RF-027, RF-028 (parcial —
 *   rodapé é layout, Onda 3a), RF-140, RF-160, RF-161, RF-166
 * Modelo: 6.7 (PaginasInstitucionais slug "inicio", Produto, Parceiro)
 * Visual: 11.7, 11.12, 11.13, 11.15 · Conversão: 14.1 (uma ação primária por seção)
 * Movimento: 13.10 (entrada da capa, paralaxe e revelação ao rolar — Onda 5)
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
import type { CSSProperties } from 'react'

import { CartaoDeProduto } from '@/components/catalogo/CartaoDeProduto'
import { MarcaDeRegistroProvisorio } from '@/components/catalogo/MarcaDeRegistroProvisorio'
import { TextoRico } from '@/components/catalogo/TextoRico'
import { ROTULOS } from '@/components/layout/navegacao'
import {
  Botao,
  Container,
  Seta,
  FundoDeCapa,
  Secao,
  SecaoComLinhaDeTransicao,
  Texto,
  Titulo,
} from '@/components/ui'
import {
  listarParceirosPublicados,
  listarProdutosEmDestaque,
  obterPaginaInstitucional,
  SLUG_DA_PAGINA_INICIAL,
} from '@/lib/consultas'
import { ROTAS } from '@/lib/rotas'
import { ACOES, NOME_DA_MARCA, SECOES_DA_INICIAL } from '@/lib/rotulos'
import { partirWordmark } from '@/lib/wordmark'
import { ZFragmentado } from '@/components/ui/ZFragmentado'
import { identificacaoPublicaDoProduto } from '@/lib/identificacao-de-produto'
import {
  construirMetadados,
  jsonLdOrganizacaoEWebsite,
  serializarDadosEstruturados,
} from '@/lib/seo'
import type { Categoria, Midia, PaginasInstitucionai, Produto } from '@/payload-types'

type BlocoDaInicial = PaginasInstitucionai['corpo'][number]

const encontrarBloco = <T extends BlocoDaInicial['blockType']>(
  blocos: BlocoDaInicial[],
  tipo: T,
): Extract<BlocoDaInicial, { blockType: T }> | undefined =>
  blocos.find(
    (bloco): bloco is Extract<BlocoDaInicial, { blockType: T }> => bloco.blockType === tipo,
  )

/** Rebrand — primeira categoria visível do produto (rótulo da faixa da capa). */
const categoriaVisivelDe = (produto: Produto): Categoria | undefined =>
  produto.categorias.find(
    (categoria): categoria is Categoria =>
      typeof categoria === 'object' && categoria.visivelPublicamente === true,
  )

/** Rebrand — cor do ponto da pílula, em rodízio de tokens (nunca hexadecimal). */
const CORES_DE_PONTO = ['var(--az-sinal)', 'var(--az-destaque)', 'var(--az-sucesso)'] as const

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

  const wordmark = partirWordmark(NOME_DA_MARCA)
  const blocos = pagina?.corpo ?? []
  const blocoDeHero = encontrarBloco(blocos, 'blocoDeChamada')
  const blocoDeApresentacao = encontrarBloco(blocos, 'blocoDeTexto')
  const blocoDeBeneficios = encontrarBloco(blocos, 'blocoDeLista')

  // Rebrand — insumos da capa, todos do cadastro.
  const produtosDaCapa = produtosEmDestaque.slice(0, 3)
  const categoriasDaCapa = [
    ...new Map(
      produtosEmDestaque
        .map(categoriaVisivelDe)
        .filter((categoria): categoria is Categoria => Boolean(categoria))
        .map((categoria) => [categoria.id, categoria] as const),
    ).values(),
  ]

  // Restyle — a capa do momento imita o fundo da seção imediatamente acima
  // da chamada final (benefícios ou parceiros na base; destaque na elevada).
  const fundoAntesDaChamada: 'base' | 'elevada' =
    blocoDeBeneficios || parceiros.length > 0 || produtosEmDestaque.length === 0
      ? 'base'
      : 'elevada'

  return (
    <>
      <script
        type="application/ld+json"
        // Gerado por src/lib/seo.ts a partir de constantes fixas — nenhum
        // texto de visitante passa por aqui.
        dangerouslySetInnerHTML={{
          __html: serializarDadosEstruturados(jsonLdOrganizacaoEWebsite()),
        }}
      />

      {/* 1. Proposta de valor (RF-020) — H1 da página. Sem bloco cadastrado,
          a seção inteira é omitida: nenhuma frase é inventada aqui.
          Restyle: a primeira dobra ocupa a tela (menos o cabeçalho) e entra
          uma vez na carga (`data-enter`, globals.css). 11.7 mantido: um
          título, um apoio, uma ação; a figura angular é decorativa e não
          compete com a ação. */}
      {/* Onda 5 — capa com imagem cheia ao fundo e o nome da empresa na
          frente. A seção veste a coluna escura (az-faixa-escura): o texto
          fica sobre a imagem coberta pelo véu, com contraste medido no pior
          caso (verificar-contraste.mjs). O H1 continua sendo a proposta de
          valor (RF-020); o nome da empresa é marca em texto, não título.
          Entrada: o nome sobe da máscara; H1, apoio e ação sobem em cascata
          (globals.css). A figura angular saiu daqui: a imagem ocupa o papel
          dela. */}
      {blocoDeHero ? (
        <section
          id="proposta-de-valor"
          aria-labelledby="titulo-proposta-de-valor"
          data-enter=""
          className="hero az-capa az-faixa-escura flex flex-col pb-respiro pt-16 md:pt-20"
        >
          <FundoDeCapa />
          {/* Rebrand (2026-11-13) — o "00" do placar do MarQGol, aqui como o
              monograma AZ vazado e gigante. Decorativo. */}
          <span aria-hidden="true" className="az-numeral-vazado -right-6 top-10 md:-right-10 md:top-6">
            AZ
          </span>
          <Container className="relative flex flex-1 flex-col justify-end">
            <div className="flex flex-col items-start gap-6 md:gap-8">
              <p className="az-sobretitulo az-entrada-apoio">{ROTULOS.softwares}</p>
              <p className="az-marca-capa">
                <span className="az-entrada-mascara">
                  <span className="az-entrada-titulo">
                    {wordmark.antes}
                    {/* "Z" que se fragmenta, se desfaz e volta. */}
                    <ZFragmentado letra={wordmark.z} />
                    {wordmark.depois}
                  </span>
                </span>
              </p>
              <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
                <div className="flex flex-col items-start gap-6 lg:col-span-7">
                  <Titulo
                    nivel={1}
                    visual="h2"
                    id="titulo-proposta-de-valor"
                    className="az-entrada-apoio max-w-titulo"
                  >
                    {blocoDeHero.titulo}
                  </Titulo>
                  <MarcaDeRegistroProvisorio
                    registro={pagina}
                    className="az-entrada-apoio [--az-ordem:1]"
                  />
                </div>
                <div className="flex flex-col items-start gap-6 lg:col-span-5">
                  {blocoDeHero.texto ? (
                    <Texto
                      variante="destaque"
                      tom="secundario"
                      className="hero__lead az-entrada-apoio [--az-ordem:2]"
                    >
                      {blocoDeHero.texto}
                    </Texto>
                  ) : null}
                  <div className="az-entrada-apoio w-full [--az-ordem:3] sm:w-auto">
                    <Botao
                      href={blocoDeHero.destino}
                      variante="primaria"
                      comSeta
                      className="w-full sm:w-auto"
                    >
                      {blocoDeHero.rotuloDaAcao}
                    </Botao>
                  </div>
                </div>
              </div>

              {/* Pílulas com ponto de cor: as categorias públicas do portfólio
                  (dado do cadastro, nunca texto inventado). */}
              {categoriasDaCapa.length > 0 ? (
                <ul className="az-entrada-apoio flex flex-wrap gap-3 [--az-ordem:4]">
                  {categoriasDaCapa.map((categoria, indice) => (
                    <li
                      key={categoria.id}
                      className="az-pilula"
                      style={
                        {
                          '--az-cor-ponto': CORES_DE_PONTO[indice % CORES_DE_PONTO.length],
                        } as CSSProperties
                      }
                    >
                      {categoria.nome}
                    </li>
                  ))}
                </ul>
              ) : null}

              {/* Faixa de três colunas sob régua, como "TEMPO REAL · SÚMULA
                  DIGITAL · SUA MARCA": categoria em sinal, produto em tinta. */}
              {produtosDaCapa.length > 0 ? (
                <ul className="az-entrada-apoio mt-4 grid w-full grid-cols-1 gap-6 border-t border-borda pt-8 [--az-ordem:5] sm:grid-cols-3">
                  {produtosDaCapa.map((produto) => (
                    <li key={produto.id}>
                      <a
                        href={ROTAS.produto(produto.slug)}
                        className="flex flex-col gap-1 no-underline"
                      >
                        <span className="az-rotulo-coluna text-sinal">
                          {categoriaVisivelDe(produto)?.nome ?? ROTULOS.softwares}
                        </span>
                        <span className="az-link-nav az-link-nav--rente self-start text-lead font-h3 text-texto-principal">
                          {identificacaoPublicaDoProduto(produto).titulo}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </Container>
        </section>
      ) : null}

      {/* 2. Apresentação da empresa (RF-021). Restyle: título à esquerda,
          corpo à direita a partir de 1024 px (mesma linha de divisão em toda
          divisão da página). */}
      {blocoDeApresentacao ? (
        <Secao
          id="apresentacao-da-empresa"
          rotuladaPor="titulo-apresentacao-da-empresa"
        >
          <Container className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-6">
            <div className="flex flex-col gap-4 lg:col-span-6">
              <p className="az-sobretitulo">{NOME_DA_MARCA}</p>
              <Titulo nivel={2} id="titulo-apresentacao-da-empresa">
                {blocoDeApresentacao.titulo ?? SECOES_DA_INICIAL.apresentacaoDaEmpresa}
              </Titulo>
            </div>
            <div className="flex flex-col items-start gap-8 lg:col-span-6 lg:col-start-7">
              <TextoRico dados={blocoDeApresentacao.corpo} nivelBase={3} />
              <Botao
                href={ROTAS.sobre()}
                variante="secundaria"
                comSeta
                className="w-full sm:w-auto"
              >
                {ACOES.sobreAMarca}
              </Botao>
            </div>
          </Container>
        </Secao>
      ) : null}

      {/* 3. Destaque dos softwares (RF-022) */}
      {produtosEmDestaque.length > 0 ? (
        <Secao
          id="destaque-de-softwares"
          rotuladaPor="titulo-destaque-de-softwares"
          superficie="escura"
        >
          <Container>
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-4">
                <p className="az-sobretitulo">{ROTULOS.softwares}</p>
                <Titulo nivel={2} id="titulo-destaque-de-softwares">
                  {SECOES_DA_INICIAL.destaqueDeSoftwares}
                </Titulo>
              </div>
              <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {produtosEmDestaque.map((produto) => (
                  <li key={produto.id} data-revelar-item="" className="flex">
                    <CartaoDeProduto produto={produto} nivelDeTitulo={3} />
                  </li>
                ))}
              </ul>
              <div>
                <Botao
                  href={ROTAS.catalogo()}
                  variante="secundaria"
                  comSeta
                  className="w-full sm:w-auto"
                >
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
          template só renderiza o que o bloco de lista trouxer. Restyle: o
          numeral 01, 02, 03 é a posição do item na lista, não dado. */}
      {blocoDeBeneficios ? (
        <Secao id="beneficios" rotuladaPor="titulo-beneficios">
          <Container>
            <div className="flex flex-col gap-10 lg:gap-12">
              <div className="flex flex-col gap-4">
                <p className="az-sobretitulo">{SECOES_DA_INICIAL.beneficios}</p>
                <Titulo nivel={2} id="titulo-beneficios" className="max-w-titulo">
                  {blocoDeBeneficios.titulo ?? SECOES_DA_INICIAL.beneficios}
                </Titulo>
              </div>
              <ol className="grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2">
                {blocoDeBeneficios.itens.map((item, indice) => (
                  <li
                    key={item.id}
                    data-revelar-item=""
                    className="az-item-regrado flex flex-col gap-3"
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="az-ordinal" aria-hidden="true">
                        {String(indice + 1).padStart(2, '0')}
                      </span>
                      <Titulo nivel={3}>{item.titulo}</Titulo>
                    </div>
                    {item.texto ? <Texto tom="secundario">{item.texto}</Texto> : null}
                  </li>
                ))}
              </ol>
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
            <div className="flex flex-col gap-8">
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
          nenhum texto de negócio. Restyle: abre a faixa escura que continua
          no rodapé, com o momento da página (linha de transição). */}
      <SecaoComLinhaDeTransicao
        id="chamada-final"
        rotuladaPor="titulo-chamada-final"
        fundoAnterior={fundoAntesDaChamada}
      >
        <Container className="relative z-10 flex flex-col gap-8">
          <p data-bloco="" className="az-sobretitulo">
            {SECOES_DA_INICIAL.chamadaFinal}
          </p>
          {/* Rebrand — cartão claro com seta, como "QUER VER O MARQGOL EM
              AÇÃO?". Cores invertidas por token: fundo = tinta da faixa
              (papel), texto = superfície da faixa. O cartão inteiro é a ação
              primária; a secundária fica abaixo, sem competir. */}
          <a
            data-bloco=""
            href={ROTAS.contato()}
            className="az-card-link flex items-center justify-between gap-6 rounded-bloco bg-texto-principal p-card text-superficie no-underline md:p-10"
          >
            <Titulo nivel={2} id="titulo-chamada-final" className="!text-superficie">
              {ACOES.falarComEquipe}
            </Titulo>
            <Seta className="!h-10 !w-10 shrink-0 text-acao-primaria" />
          </a>
          <div data-bloco="">
            <Botao
              href={ROTAS.catalogo()}
              variante="secundaria"
              comSeta
              className="w-full sm:w-auto"
            >
              {ACOES.verSoftwares}
            </Botao>
          </div>
        </Container>
      </SecaoComLinhaDeTransicao>

      {/* 9. Rodapé — layout compartilhado da Onda 3a, não deste arquivo. */}
    </>
  )
}
