/**
 * P-08 — Contato comercial
 * Implementa: RF-068 (interesse pré-preenchido pela origem), RF-120, RF-127,
 *   RF-128, RF-220 (canais diretos com o mesmo destaque do formulário)
 * Conversão: 14.1 (ação única "Enviar solicitação"), 14.2, 14.3, 14.7, 14.10
 * Modelo: 6.7 (Produto) — usado apenas para exibir o nome do produto de
 *   origem e a lista de interesse; nenhum dado de produto é editado aqui.
 * Perguntas abertas que afetam este arquivo: Q-091 (WhatsApp e e-mail
 *   publicados ainda não existem — ver `src/lib/configuracao-contato.ts`)
 * Dono: Onda 3c
 *
 * PISO INEGOCIÁVEL DE 16.9: esta é a página que fecha o fluxo de contato
 * ponta a ponta. Renderizada dinamicamente (nunca em build) porque depende
 * de `searchParams` (o produto de origem) e, opcionalmente, do banco — que
 * pode não estar disponível neste ambiente; qualquer falha de leitura do
 * catálogo é absorvida e a página continua funcionando sem o produto.
 */

import type { Metadata } from 'next'

import { Container, Secao, Texto, Titulo } from '@/components/ui'
import { FormularioDeContato } from '@/components/formulario/FormularioDeContato'
import type { OpcaoDeSelecao } from '@/components/formulario/CampoDeSelecao'
import { emailPublicado, whatsappPublicado } from '@/lib/configuracao-contato'
import { CONTEXTO_PADRAO, type ContextoDeOrigem } from '@/lib/contato-contrato'
import { ROTAS } from '@/lib/rotas'
import { NOME_DA_MARCA, PARAMETRO_DE_PRODUTO_DE_ORIGEM } from '@/lib/rotulos'
import { emitirToken } from '@/lib/token-de-formulario'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: `Contato — ${NOME_DA_MARCA}`,
  description: 'Fale com a equipe da ArtZan por formulário, WhatsApp ou e-mail.',
  alternates: { canonical: ROTAS.contato() },
}

type PropsDaPagina = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

/** Lê o produto de origem sem derrubar a página se o banco não responder. */
const carregarProdutoDeOrigem = async (
  slug: string | undefined,
): Promise<{ slug: string; nome: string } | undefined> => {
  if (!slug) return undefined
  try {
    const { obterProdutoPorSlug } = await import('@/lib/consultas')
    const produto = await obterProdutoPorSlug(slug)
    return produto ? { slug: produto.slug, nome: produto.nome } : undefined
  } catch {
    // Banco indisponível ou produto inexistente: o formulário continua
    // utilizável, só sem o contexto visível de produto (RF-068 degradado,
    // nunca a página inteira).
    return undefined
  }
}

/** Lista de produtos para o campo "interesse". Vazia se o banco não responder. */
const carregarOpcoesDeInteresse = async (): Promise<OpcaoDeSelecao[]> => {
  try {
    const { listarProdutosPublicados } = await import('@/lib/consultas')
    const produtos = await listarProdutosPublicados()
    return produtos.map((produto) => ({ valor: produto.slug, rotulo: produto.nome }))
  } catch {
    return []
  }
}

export default async function PaginaDeContato({ searchParams }: PropsDaPagina) {
  const parametros = await searchParams
  const parametroDeProduto = parametros[PARAMETRO_DE_PRODUTO_DE_ORIGEM]
  const slugDeProduto = typeof parametroDeProduto === 'string' ? parametroDeProduto : undefined

  const [produtoDeOrigem, opcoesDeInteresse] = await Promise.all([
    carregarProdutoDeOrigem(slugDeProduto),
    carregarOpcoesDeInteresse(),
  ])

  const contexto: ContextoDeOrigem = produtoDeOrigem
    ? {
        paginaDeOrigem: ROTAS.contato(),
        tipoDeEntidade: 'produto',
        entidade: produtoDeOrigem.slug,
        acao: 'direta',
      }
    : CONTEXTO_PADRAO

  const token = emitirToken()

  return (
    // Sem `<main>` próprio: a região principal é fornecida por
    // `(site)/layout.tsx` (Onda 3a), único lugar que deve declará-la (13.5
    // regra 2). Esta página só contribui o CONTEÚDO daquela região.
    <Container>
      <Secao rotuladaPor="titulo-contato">
        <Titulo nivel={1} id="titulo-contato">
          Contato
        </Titulo>
        <Texto>
          Preencha o formulário abaixo ou fale diretamente com a gente. Respondemos em até 2
          dias úteis.
        </Texto>

        <div className="mt-6 max-w-texto">
          <FormularioDeContato
            token={token}
            contexto={contexto}
            opcoesDeInteresse={opcoesDeInteresse}
            interesseInicial={produtoDeOrigem?.slug}
            produtoDeOrigem={produtoDeOrigem}
            estadoDoWhatsapp={whatsappPublicado()}
            estadoDoEmail={emailPublicado()}
          />
        </div>
      </Secao>
    </Container>
  )
}
