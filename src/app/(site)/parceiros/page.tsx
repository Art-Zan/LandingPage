/**
 * P-07 — Parceiros
 * Implementa: RF-100 (listagem agrupada por tipo, com introdução), RF-101
 *   (ficha do parceiro), RF-104 (link externo sem transferir autoridade,
 *   sinalizado em nova aba), RF-105 (página ausente sem parceiro autorizado),
 *   RF-106 (vínculo com produto/solução, nos dois sentidos), RF-107 (bloco
 *   "seja um parceiro"), RF-160, RF-161
 * Modelo: 6.7 (Parceiro, TiposDeParceria; PaginasInstitucionais slug
 *   "parceiros" para a introdução opcional de RF-100)
 * Visual: 11.6 (como apresentar parceiros — regras 1, 2, 3, 6, 7), 11.12, 11.15
 * Premissas: PR-011 (lista vazia é estado admitido), PR-018 (nenhuma marca de
 *   terceiro sem autorização formal registrada)
 * Perguntas abertas que afetam este arquivo: Q-025 (parceiro em vista, ainda
 *   não confirmado), Q-054 (resolvida: nenhuma autorização de marca existe
 *   hoje — o estado esperado no lançamento é esta página INTEIRA ausente)
 * Dono: Onda 4b
 *
 * A EXISTÊNCIA DESTA PÁGINA É DECISÃO DE DADO, NUNCA DE CÓDIGO COMENTADO
 * (RF-105, dev/CONVENCOES.md §4.1 "Condicional"). Ela reaproveita a MESMA
 * `listarParceirosPublicados` (src/lib/consultas.ts) que `(site)/layout.tsx`
 * (Onda 3a) já usa para decidir o item de menu e a coluna do rodapé — uma
 * lista vazia aqui é exatamente a mesma lista vazia que já oculta o link em
 * todo o resto do site. Não há bandeira, não há comentário condicional: só
 * `notFound()` quando a consulta devolve zero registros, do mesmo jeito que
 * P-04 já faz quando o slug não existe.
 *
 * NENHUM PARCEIRO É CITADO NESTE ARQUIVO (16.6, dev/CONVENCOES.md §8 item 1).
 * Nome, logo, descrição, tipo e link de cada parceiro vêm inteiramente do
 * registro; despublicar ou retirar a autorização de um parceiro tira todo o
 * seu conteúdo da tela na mesma consulta, sem editar este arquivo (RF-103).
 * A introdução de RF-100 é igualmente opcional e editorial: vem do registro
 * institucional de slug "parceiros" (`PaginasInstitucionais`, biblioteca de
 * blocos de RF-146); sem registro ou sem bloco de texto, ela é omitida —
 * mesmo padrão de `(site)/produtos/page.tsx` (Onda 3b).
 *
 * "SEJA UM PARCEIRO" (RF-107) É RÓTULO ESTRUTURAL FIXO, NÃO DADO DE NEGÓCIO.
 * O convite abaixo não cita número, prazo, nome ou critério de aceite — é a
 * mesma categoria de texto que `ESTADO_VAZIO_DO_CATALOGO` (src/lib/rotulos.ts,
 * Onda 3b) já usa para o catálogo vazio. Existe sempre que esta página existe:
 * a condição de "interesse comercial em captar canal" que RF-107 exige para o
 * cenário sem nenhum parceiro publicado não se aplica aqui, porque esse
 * cenário está fora de escopo (ver parágrafo acima — a página nem chega a
 * renderizar sem ao menos um parceiro).
 *
 * LACUNA REGISTRADA, NÃO FECHADA POR ESTA ONDA: RF-107 exige que o envio ao
 * formulário chegue com o assunto "sou parceiro" pré-selecionado. `/contato`
 * (Onda 3c) só lê hoje o parâmetro de PRODUTO de origem
 * (`PARAMETRO_DE_PRODUTO_DE_ORIGEM`, src/lib/rotulos.ts) — não existe
 * mecanismo equivalente para ASSUNTO. O link abaixo já carrega
 * `?assunto=parceria` (valor de `ASSUNTOS`, src/lib/contato-contrato.ts,
 * Onda 3c, só importado — nunca reescrito aqui), do mesmo jeito que P-04
 * (Onda 3b) já fez com o produto de origem antes de `/contato` existir: o
 * link funciona hoje, só não vem pré-selecionado enquanto a leitura do
 * parâmetro não for implementada em `/contato`. Relatado ao maestro.
 */

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { TextoRico } from '@/components/catalogo/TextoRico'
import { Botao, Card, Container, Secao, Texto, Titulo } from '@/components/ui'
import {
  listarParceirosPublicados,
  obterPaginaInstitucional,
  SLUG_DA_PAGINA_DE_PARCEIROS,
} from '@/lib/consultas'
import type { Assunto } from '@/lib/contato-contrato'
import { identificacaoPublicaDoProduto } from '@/lib/identificacao-de-produto'
import { ROTAS } from '@/lib/rotas'
import { ACOES, SECOES_DA_INICIAL } from '@/lib/rotulos'
import { construirMetadados } from '@/lib/seo'
import type { Midia, Parceiro, Produto, Solucoe, TiposDeParceria } from '@/payload-types'

const ehMidiaPopulada = (midia: number | Midia | null | undefined): midia is Midia =>
  typeof midia === 'object' && midia !== null

const ehTipoPopulado = (tipo: number | TiposDeParceria): tipo is TiposDeParceria =>
  typeof tipo === 'object'

/** Registro relacionado populado (`depth` >= 1) e publicado — nunca id cru nem rascunho. */
const ehRegistroPublicado = <T extends { _status?: ('draft' | 'published') | null }>(
  valor: number | T,
): valor is T => typeof valor === 'object' && valor !== null && valor._status === 'published'

type GrupoDeParceiros = { tipo: TiposDeParceria; parceiros: Parceiro[] }

/**
 * RF-100 — agrupa por tipo de parceria, ordena grupos por `ordemDeExibicao`
 * (menor primeiro) e omite grupo sem parceiro por construção: só existe
 * grupo para tipo que ao menos um parceiro carrega. Um parceiro com mais de
 * um tipo aparece em cada grupo pertinente.
 */
const agruparPorTipoDeParceria = (parceiros: readonly Parceiro[]): GrupoDeParceiros[] => {
  const grupos = new Map<number, GrupoDeParceiros>()

  for (const parceiro of parceiros) {
    for (const tipo of parceiro.tiposDeParceria.filter(ehTipoPopulado)) {
      const grupo = grupos.get(tipo.id)
      if (grupo) grupo.parceiros.push(parceiro)
      else grupos.set(tipo.id, { tipo, parceiros: [parceiro] })
    }
  }

  return Array.from(grupos.values()).sort((a, b) => {
    const ordemA = a.tipo.ordemDeExibicao ?? Number.MAX_SAFE_INTEGER
    const ordemB = b.tipo.ordemDeExibicao ?? Number.MAX_SAFE_INTEGER
    return ordemA !== ordemB ? ordemA - ordemB : a.tipo.nome.localeCompare(b.tipo.nome, 'pt-BR')
  })
}

/** RF-107, inerte até `/contato` ler o parâmetro (ver comentário de topo do arquivo). */
const ASSUNTO_DE_PARCERIA: Assunto = 'parceria'
const LINK_SEJA_PARCEIRO = `${ROTAS.contato()}?assunto=${ASSUNTO_DE_PARCERIA}`

/**
 * RF-107 — convite estrutural fixo (ver comentário de topo do arquivo: não é
 * dado de negócio, é a mesma categoria de `ESTADO_VAZIO_DO_CATALOGO`).
 */
const SEJA_PARCEIRO = {
  titulo: 'Seja um parceiro',
  texto:
    'Sua empresa atua com tecnologia, implantação, revenda ou indicação e quer somar forças com a ArtZan? Fale com a equipe.',
} as const

/** Rótulos estruturais desta página — nenhum é fato de negócio (RNF-074, §8 item 1/6). */
const ROTULO_VISITAR_SITE = 'Visitar site'
const SUFIXO_NOVA_ABA = ' (abre em nova aba, site externo)'
const ROTULO_PRODUTOS_DO_PARCEIRO = 'Produtos relacionados'
const ROTULO_SOLUCOES_DO_PARCEIRO = 'Soluções relacionadas'
const ROTULO_NATUREZA_DA_RELACAO = 'Natureza da relação'

export async function generateMetadata(): Promise<Metadata> {
  const parceiros = await listarParceirosPublicados()
  if (parceiros.length === 0) return {}

  const pagina = await obterPaginaInstitucional(SLUG_DA_PAGINA_DE_PARCEIROS)
  return construirMetadados({ registro: pagina, segmentos: ['parceiros'] })
}

const CartaoDeParceiro = ({ parceiro }: { parceiro: Parceiro }) => {
  const tipos = parceiro.tiposDeParceria.filter(ehTipoPopulado)
  const produtos = (parceiro.produtosRelacionados ?? []).filter(
    (valor): valor is Produto => ehRegistroPublicado<Produto>(valor),
  )
  const solucoes = (parceiro.solucoesRelacionadas ?? []).filter(
    (valor): valor is Solucoe => ehRegistroPublicado<Solucoe>(valor),
  )

  return (
    <Card como="li" className="flex flex-col gap-4">
      {ehMidiaPopulada(parceiro.logo) && parceiro.logo.url ? (
        <div className="flex h-16 items-center justify-center rounded-controle border border-borda bg-superficie p-2">
          <Image
            src={parceiro.logo.url}
            alt={parceiro.logo.alt}
            width={parceiro.logo.width ?? 320}
            height={parceiro.logo.height ?? 160}
            className="h-full w-auto object-contain"
          />
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <Titulo nivel={3}>{parceiro.nome}</Titulo>

        {tipos.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tipos.map((tipo) => (
              <Texto
                key={tipo.id}
                como="span"
                variante="apoio"
                tom="secundario"
                limitarLargura={false}
                className="rounded-controle border border-borda px-2 py-1"
              >
                {tipo.nome}
              </Texto>
            ))}
          </div>
        ) : null}

        <Texto tom="secundario" limitarLargura={false}>
          {parceiro.descricaoCurta}
        </Texto>
      </div>

      <div className="flex flex-col gap-1">
        <Texto
          variante="apoio"
          tom="secundario"
          limitarLargura={false}
          className="uppercase tracking-caixa-alta"
        >
          {ROTULO_NATUREZA_DA_RELACAO}
        </Texto>
        <Texto tom="secundario" limitarLargura={false}>
          {parceiro.naturezaDaRelacao}
        </Texto>
      </div>

      {/* RF-106 — vínculo com produto: link real (P-04 existe). Título nunca
          lê `produto.nome` cru (PR-063): passa pela mesma resolução do card
          de catálogo. */}
      {produtos.length > 0 ? (
        <div className="flex flex-col gap-1">
          <Texto
            variante="apoio"
            tom="secundario"
            limitarLargura={false}
            className="uppercase tracking-caixa-alta"
          >
            {ROTULO_PRODUTOS_DO_PARCEIRO}
          </Texto>
          <ul className="flex flex-col gap-1">
            {produtos.map((produto) => (
              <li key={produto.id}>
                <Link href={ROTAS.produto(produto.slug)} className="underline">
                  {identificacaoPublicaDoProduto(produto).titulo}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* RF-106 — vínculo com solução: SEM link, porque P-06 é Futuro (Q-006,
          dev/CONVENCOES.md §4.3) e nenhuma rota existe para apontar. Lista só
          o nome, do mesmo jeito que P-04 já faz para "soluções das quais
          participa". */}
      {solucoes.length > 0 ? (
        <div className="flex flex-col gap-1">
          <Texto
            variante="apoio"
            tom="secundario"
            limitarLargura={false}
            className="uppercase tracking-caixa-alta"
          >
            {ROTULO_SOLUCOES_DO_PARCEIRO}
          </Texto>
          <ul className="flex flex-col gap-1">
            {solucoes.map((solucao) => (
              <li key={solucao.id}>
                <Texto tom="secundario" limitarLargura={false}>
                  {solucao.nome}
                </Texto>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* RF-104 — nova aba sinalizada visualmente (texto) e para tecnologia
          assistiva (mesmo texto, sem depender só do ícone); `nofollow` +
          `noopener noreferrer` impedem transferir autoridade de busca e
          expor a janela de origem. */}
      {parceiro.linkExterno ? (
        <div>
          <Botao
            href={parceiro.linkExterno}
            variante="discreta"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            {ROTULO_VISITAR_SITE}
            <span aria-hidden="true"> ↗</span>
            <span className="az-apenas-leitor-de-tela">{SUFIXO_NOVA_ABA}</span>
          </Botao>
        </div>
      ) : null}
    </Card>
  )
}

export default async function PaginaDeParceiros() {
  const parceiros = await listarParceirosPublicados()

  // RF-105 — decisão de dado, consultada em execução: zero parceiro
  // autorizado e publicado, e a rota inteira responde como inexistente.
  // Mesma lista que já esconde o item de menu e a coluna do rodapé
  // ((site)/layout.tsx, Onda 3a) — nunca uma segunda condição divergente.
  if (parceiros.length === 0) {
    notFound()
  }

  const pagina = await obterPaginaInstitucional(SLUG_DA_PAGINA_DE_PARCEIROS)

  // RF-100 — introdução opcional sobre o papel das parcerias, do registro
  // institucional. Sem registro ou sem bloco de texto, a introdução é
  // omitida: a listagem não depende dela para funcionar.
  const blocoDeIntroducao = pagina?.corpo.find((bloco) => bloco.blockType === 'blocoDeTexto')

  const grupos = agruparPorTipoDeParceria(parceiros)

  return (
    <Secao rotuladaPor="titulo-parceiros">
      <Container>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            {/* H1 — 11.6 regra 1: "toda listagem de parceiro leva título que
                declara a natureza". Mesmo rótulo fixo usado na faixa da
                inicial (`SECOES_DA_INICIAL.parceiros`, Onda 3b): nunca
                "Parceiros" sozinho, que não deixa a relação explícita. */}
            <Titulo nivel={1} id="titulo-parceiros">
              {SECOES_DA_INICIAL.parceiros}
            </Titulo>
            {blocoDeIntroducao && blocoDeIntroducao.blockType === 'blocoDeTexto' ? (
              <TextoRico dados={blocoDeIntroducao.corpo} nivelBase={2} />
            ) : null}
          </div>

          {grupos.map(({ tipo, parceiros: parceirosDoTipo }) => (
            <div key={tipo.id} className="flex flex-col gap-4">
              <Titulo nivel={2}>{tipo.nome}</Titulo>
              <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {parceirosDoTipo.map((parceiro) => (
                  <CartaoDeParceiro key={parceiro.id} parceiro={parceiro} />
                ))}
              </ul>
            </div>
          ))}

          {/* RF-107 — "seja um parceiro". Ver comentário de topo do arquivo:
              rótulo estrutural fixo, com link já preparado para o assunto de
              parceria (inerte até `/contato` ler o parâmetro). */}
          <div className="flex flex-col items-start gap-4 rounded-bloco border border-borda bg-superficie-elevada p-card-compacto md:p-card">
            <Titulo nivel={2}>{SEJA_PARCEIRO.titulo}</Titulo>
            <Texto tom="secundario">{SEJA_PARCEIRO.texto}</Texto>
            <Botao href={LINK_SEJA_PARCEIRO} variante="primaria">
              {ACOES.falarComEquipe}
            </Botao>
          </div>
        </div>
      </Container>
    </Secao>
  )
}
