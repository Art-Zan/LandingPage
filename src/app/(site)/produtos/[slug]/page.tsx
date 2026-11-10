/**
 * P-04 — Página individual de software
 * Implementa: RF-060, RF-061, RF-062, RF-063, RF-064, RF-065, RF-066, RF-067,
 *   RF-068, RF-069, RF-140, RF-160, RF-161, RF-166
 * Modelo: 6.7 (Produto, ConfiguracaoDoSite)
 * Visual: 11.12, 11.14, 11.15, 11.17 (MolduraCaptura) · Conversão: 14.1
 * Premissas: PR-003 (soluções derivadas, N:N), PR-005 (sem preço), PR-008
 *   (template único), PR-014 (slug imutável), PR-063 (identificação sob 11.4)
 * Perguntas abertas que afetam este arquivo: Q-005 (nenhuma captura de tela
 *   real existe — imagem de destaque pode estar marcada como placeholder),
 *   Q-006 (soluções das quais participa: sempre omitido hoje, nenhum vínculo
 *   existe), Q-007 / Q-008 (modelo comercial sem preço), Q-084 (nome de três
 *   dos quatro produtos ainda a aprovar — ver src/lib/identificacao-de-produto.ts)
 * Dono: Onda 3b
 *
 * TEMPLATE ÚNICO E OBRIGATÓRIO (PR-008, RNF-071): onze seções, ordem fixa,
 * não editável por produto. Seção sem conteúdo é OMITIDA por completo — nunca
 * "em breve" (RF-063). Nenhuma página termina sem ação (princípio 6 de 2.8).
 */

import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'

import { CartaoDeProduto } from '@/components/catalogo/CartaoDeProduto'
import { TextoRico } from '@/components/catalogo/TextoRico'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import {
  Botao,
  Container,
  MarcaDePlaceholder,
  MolduraCaptura,
  Secao,
  Texto,
  Titulo,
} from '@/components/ui'
import { obterConfiguracaoDoSite, obterProdutoPorSlug } from '@/lib/consultas'
import { identificacaoPublicaDoProduto } from '@/lib/identificacao-de-produto'
import { ROTAS } from '@/lib/rotas'
import {
  ACOES,
  MODELOS_DE_CONTRATACAO,
  PARAMETRO_DE_PRODUTO_DE_ORIGEM,
  ROTULO_DE_CONTEUDO_PROVISORIO,
  ROTULO_DE_TIPO_SOFTWARE,
  ROTULO_NOME_PROPOSTO_A_APROVAR,
  ROTULO_PRODUTOS_RELACIONADOS,
  SECOES_DE_PRODUTO,
  TRILHA,
} from '@/lib/rotulos'
import { construirMetadados, jsonLdDeProduto, serializarDadosEstruturados } from '@/lib/seo'
import type { Categoria, Midia } from '@/payload-types'

type ParametrosDaRota = { slug: string }
type PropsDaPagina = { params: Promise<ParametrosDaRota> }

const ehCategoriaPopulada = (categoria: number | Categoria): categoria is Categoria =>
  typeof categoria === 'object'

const ehMidiaPopulada = (midia: number | Midia | null | undefined): midia is Midia =>
  typeof midia === 'object' && midia !== null

/** Registro relacionado populado (`depth` >= 1), nunca só o id numérico. */
const ehRegistroPopulado = <T,>(valor: number | T): valor is T =>
  typeof valor === 'object' && valor !== null

/** Contato pré-preenchido com o produto de origem (RF-068). Rota /contato é
 *  território da Onda 3c: o parâmetro é inerte até ela ler o mesmo nome. */
const contatoComOrigem = (slug: string): string =>
  `${ROTAS.contato()}?${PARAMETRO_DE_PRODUTO_DE_ORIGEM}=${encodeURIComponent(slug)}`

export async function generateMetadata({ params }: PropsDaPagina): Promise<Metadata> {
  const { slug } = await params
  const produto = await obterProdutoPorSlug(slug)
  if (!produto) return {}

  const imagem = ehMidiaPopulada(produto.imagemDestaque) && produto.imagemDestaque.url
    ? { url: produto.imagemDestaque.url, alt: produto.imagemDestaque.alt }
    : undefined

  return construirMetadados({
    registro: produto,
    segmentos: ['produtos', produto.slug],
    imagem,
  })
}

export default async function PaginaDeProduto({ params }: PropsDaPagina) {
  const { slug } = await params
  const produto = await obterProdutoPorSlug(slug)

  if (!produto) {
    notFound()
  }

  const identificacao = identificacaoPublicaDoProduto(produto)
  const configuracao = await obterConfiguracaoDoSite()

  const categoriaVisivel = produto.categorias
    .filter(ehCategoriaPopulada)
    .find((categoria) => categoria.visivelPublicamente)

  const galeria = produto.galeriaDeTelas?.filter(ehMidiaPopulada) ?? []
  const integracoes = produto.integracoes ?? []
  const solucoes = produto.solucoesQueParticipa?.docs ?? []
  const relacionados = (produto.produtosRelacionados ?? []).filter(ehRegistroPopulado)

  const urlCanonica = ROTAS.produto(produto.slug)
  const descricaoParaDados = produto.resumoUmaLinha

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializarDadosEstruturados(
            jsonLdDeProduto({
              titulo: identificacao.titulo,
              descricao: descricaoParaDados,
              urlCanonica,
              imagem:
                ehMidiaPopulada(produto.imagemDestaque) && produto.imagemDestaque.url
                  ? { url: produto.imagemDestaque.url, alt: produto.imagemDestaque.alt }
                  : undefined,
            }),
          ),
        }}
      />

      <Container>
        {/* Trilha — RF-069. Nunca inclui categoria (6.4). Migrada para o
            componente compartilhado (src/components/layout/Breadcrumb.tsx,
            Onda 3a): mesma marcação, agora reutilizável por P-06 e P-18
            quando existirem. */}
        <Breadcrumb
          className="pt-4"
          itens={[
            { rotulo: TRILHA.inicio, href: ROTAS.inicial() },
            { rotulo: TRILHA.softwares, href: ROTAS.catalogo() },
            { rotulo: identificacao.titulo },
          ]}
        />
      </Container>

      {/* 1. Nome, resumo, categoria, ação primária (RF-061) */}
      <Secao rotuladaPor="titulo-produto">
        <Container>
          <div className="flex flex-col gap-4">
            <Texto variante="apoio" tom="secundario" className="uppercase tracking-caixa-alta">
              {ROTULO_DE_TIPO_SOFTWARE}
            </Texto>
            <Titulo nivel={1} id="titulo-produto">
              {identificacao.titulo}
            </Titulo>
            {identificacao.nomePropostoAAprovar ? (
              <Texto variante="apoio" tom="secundario">
                {ROTULO_NOME_PROPOSTO_A_APROVAR}: {identificacao.nomePropostoAAprovar}
              </Texto>
            ) : null}
            <Texto variante="corpo">{produto.resumoUmaLinha}</Texto>
            {categoriaVisivel ? (
              <Texto
                como="span"
                variante="apoio"
                tom="secundario"
                className="inline-block w-fit rounded-controle border border-borda px-2 py-1"
              >
                {categoriaVisivel.nome}
              </Texto>
            ) : null}
            <div>
              <Botao href={contatoComOrigem(produto.slug)} variante="primaria">
                {ACOES.falarComEquipe}
              </Botao>
            </div>
          </div>
        </Container>
      </Secao>

      {/* 2. Problema que resolve (RF-062) */}
      <Secao rotuladaPor="titulo-problema" superficie="elevada">
        <Container>
          <div className="flex flex-col gap-4">
            <Titulo nivel={2} id="titulo-problema">
              {SECOES_DE_PRODUTO.problemaQueResolve}
            </Titulo>
            <TextoRico dados={produto.problemaQueResolve} nivelBase={3} />
          </div>
        </Container>
      </Secao>

      {/* Descrição completa — posição fixa dentro do template único, logo após
          "problema que resolve" (contradição interna do PRD registrada em
          src/lib/rotulos.ts: a tabela de onze seções de P-04 não lista esta
          seção, mas o campo é obrigatório no modelo e 11.3 fixa limites para
          "P-04, seção 'descrição completa'"). */}
      <Secao rotuladaPor="titulo-descricao-completa">
        <Container>
          <div className="flex flex-col gap-4">
            <Titulo nivel={2} id="titulo-descricao-completa">
              {SECOES_DE_PRODUTO.descricaoCompleta}
            </Titulo>
            <TextoRico dados={produto.descricaoCompleta} nivelBase={3} />
          </div>
        </Container>
      </Secao>

      {/* 3. Para quem é (RF-062) */}
      <Secao rotuladaPor="titulo-publico-alvo" superficie="elevada">
        <Container>
          <div className="flex flex-col gap-4">
            <Titulo nivel={2} id="titulo-publico-alvo">
              {SECOES_DE_PRODUTO.publicoAlvo}
            </Titulo>
            {produto.publicoAlvo.split('\n').filter(Boolean).map((linha, indice) => (
              <Texto key={indice}>{linha}</Texto>
            ))}
          </div>
        </Container>
      </Secao>

      {/* 4. Principais funcionalidades (RF-062, mínimo 3) */}
      <Secao rotuladaPor="titulo-funcionalidades">
        <Container>
          <div className="flex flex-col gap-6">
            <Titulo nivel={2} id="titulo-funcionalidades">
              {SECOES_DE_PRODUTO.funcionalidades}
            </Titulo>
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {produto.funcionalidades.map((item) => (
                <li key={item.id ?? item.titulo} className="flex flex-col gap-2">
                  <Titulo nivel={3}>{item.titulo}</Titulo>
                  <Texto tom="secundario">{item.descricao}</Texto>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Secao>

      {/* 5. Benefícios (RF-062, mínimo 3) */}
      <Secao rotuladaPor="titulo-beneficios-produto" superficie="elevada">
        <Container>
          <div className="flex flex-col gap-6">
            <Titulo nivel={2} id="titulo-beneficios-produto">
              {SECOES_DE_PRODUTO.beneficios}
            </Titulo>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {produto.beneficios.map((item) => (
                <li key={item.id ?? item.texto}>
                  <Texto>{item.texto}</Texto>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Secao>

      {/* 6. Imagens (RF-064). Imagem de destaque é obrigatória no modelo; ainda
          assim pode estar marcada como placeholder (Q-005 — nenhuma captura
          real existe hoje). Galeria e vídeo são condicionais (RF-063). */}
      <Secao rotuladaPor="titulo-imagens">
        <Container>
          <div className="flex flex-col gap-6">
            <Titulo nivel={2} id="titulo-imagens">
              {SECOES_DE_PRODUTO.imagens}
            </Titulo>

            {ehMidiaPopulada(produto.imagemDestaque) ? (
              <div className="flex flex-col gap-2">
                <MolduraCaptura>
                  {produto.imagemDestaque.url ? (
                    <Image
                      src={produto.imagemDestaque.url}
                      alt={produto.imagemDestaque.alt}
                      width={produto.imagemDestaque.width ?? 1600}
                      height={produto.imagemDestaque.height ?? 1000}
                      priority
                    />
                  ) : null}
                </MolduraCaptura>
                {produto.placeholder ? (
                  <MarcaDePlaceholder
                    rotulo={ROTULO_DE_CONTEUDO_PROVISORIO}
                    detalhe="Captura de tela real ainda não existe (Q-005)."
                  />
                ) : null}
              </div>
            ) : null}

            {galeria.length > 0 ? (
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {galeria.map((item) => (
                  <li key={item.id}>
                    <MolduraCaptura>
                      {item.url ? (
                        <Image
                          src={item.url}
                          alt={item.alt}
                          width={item.width ?? 800}
                          height={item.height ?? 500}
                          loading="lazy"
                        />
                      ) : null}
                    </MolduraCaptura>
                  </li>
                ))}
              </ul>
            ) : null}

            {produto.videoDemonstracao ? (
              <Texto>
                <a href={produto.videoDemonstracao} className="underline">
                  Ver demonstração em vídeo
                </a>
              </Texto>
            ) : null}
          </div>
        </Container>
      </Secao>

      {/* 7. Integrações — condicional (Q-070): omitida quando não há integração. */}
      {integracoes.length > 0 ? (
        <Secao rotuladaPor="titulo-integracoes" superficie="elevada">
          <Container>
            <div className="flex flex-col gap-4">
              <Titulo nivel={2} id="titulo-integracoes">
                {SECOES_DE_PRODUTO.integracoes}
              </Titulo>
              <ul className="flex flex-col gap-2">
                {integracoes.map((integracao) => (
                  <li key={integracao}>
                    <Texto>{integracao}</Texto>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </Secao>
      ) : null}

      {/* 8. Informações comerciais (RF-065). Texto padrão único do catálogo;
          vazio omite a frase, nunca a substitui por preço inventado (PR-005). */}
      <Secao rotuladaPor="titulo-comercial">
        <Container>
          <div className="flex flex-col gap-4">
            <Titulo nivel={2} id="titulo-comercial">
              {SECOES_DE_PRODUTO.informacoesComerciais}
            </Titulo>
            <ul className="flex flex-wrap gap-2">
              {produto.modeloDeContratacao.map((modelo) => (
                <li
                  key={modelo}
                  className="rounded-controle border border-borda px-2 py-1 text-apoio leading-corpo text-texto-secundario"
                >
                  {MODELOS_DE_CONTRATACAO[modelo] ?? modelo}
                </li>
              ))}
            </ul>
            {configuracao.textoPadraoDeContratacao ? (
              <Texto tom="secundario">{configuracao.textoPadraoDeContratacao}</Texto>
            ) : null}
            <div>
              <Botao href={contatoComOrigem(produto.slug)} variante="secundaria">
                {ACOES.falarComEquipe}
              </Botao>
            </div>
          </div>
        </Container>
      </Secao>

      {/* 9. Soluções das quais participa — derivada (RF-066). Omitida hoje:
          nenhum vínculo existe (Q-006). Some sozinha quando a primeira
          solução publicada incluir este produto — sem edição desta página. */}
      {solucoes.length > 0 ? (
        <Secao rotuladaPor="titulo-solucoes" superficie="elevada">
          <Container>
            <div className="flex flex-col gap-4">
              <Titulo nivel={2} id="titulo-solucoes">
                {SECOES_DE_PRODUTO.solucoesQueParticipa}
              </Titulo>
              {/* Sem página de solução construída nesta etapa (P-05/P-06 são
                  Futuro, Q-006): nenhum link é montado enquanto a rota não
                  existir. Lista apenas o nome, sem destino quebrado. */}
              <ul className="flex flex-col gap-2">
                {solucoes
                  .filter(ehRegistroPopulado)
                  .map((solucao) => (
                    <li key={solucao.id}>
                      <Texto>{solucao.nome}</Texto>
                    </li>
                  ))}
              </ul>
            </div>
          </Container>
        </Secao>
      ) : null}

      {/* 10. Produtos relacionados — opcional (RF-067). Nunca rotulado "solução". */}
      {relacionados.length > 0 ? (
        <Secao rotuladaPor="titulo-relacionados">
          <Container>
            <div className="flex flex-col gap-6">
              <Titulo nivel={2} id="titulo-relacionados">
                {ROTULO_PRODUTOS_RELACIONADOS}
              </Titulo>
              <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relacionados
                  .filter((relacionado) => relacionado._status === 'published')
                  .map((relacionado) => (
                    <li key={relacionado.id}>
                      <CartaoDeProduto produto={relacionado} nivelDeTitulo={3} />
                    </li>
                  ))}
              </ul>
            </div>
          </Container>
        </Secao>
      ) : null}

      {/* 11. Chamada para contato (RF-068). Nenhuma página termina sem ação
          (princípio 6 de 2.8). Avaliação gratuita (P-09) é etapa 2 — ver
          dev/CONVENCOES.md §4.2 — por isso a única ação aqui é contato. */}
      <Secao rotuladaPor="titulo-cta-final" superficie="elevada">
        <Container>
          <div className="flex flex-col items-start gap-4">
            <Titulo nivel={2} id="titulo-cta-final">
              {SECOES_DE_PRODUTO.chamadaFinal}
            </Titulo>
            <Botao href={contatoComOrigem(produto.slug)} variante="primaria">
              {ACOES.falarComEquipe}
            </Botao>
          </div>
        </Container>
      </Secao>
    </>
  )
}
