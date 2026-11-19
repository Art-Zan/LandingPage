/**
 * P-16 — Confirmação de envio
 * Implementa: RF-125 (confirmação, prazo, próximo passo, sem reexibir o
 *   formulário), RF-164 (não indexável)
 * Conversão: 14.1 (sem ação primária — "a conversão já ocorreu"; secundárias
 *   "Ver softwares" e "Ver detalhes" do produto de origem), 14.3 (passo 5),
 *   14.10 (canais diretos deliberadamente ausentes: "não são momentos de contato")
 * Dono: Onda 3c
 *
 * NÃO INDEXÁVEL, sem exceção (dev/CONVENCOES.md §4.1; RF-164). A página não
 * lê nem reexibe nada do que foi digitado (RF-125) — o único dado que ela
 * aceita é o slug do produto de origem, para oferecer "Ver detalhes" dele.
 */

import type { Metadata } from 'next'

import { Botao, Container, Secao, Texto, TextoDeEntrada, Titulo } from '@/components/ui'
import { PRAZO_DE_RESPOSTA } from '@/lib/contato-contrato'
import { ROTAS } from '@/lib/rotas'
import { ACOES, NOME_DA_MARCA, PARAMETRO_DE_PRODUTO_DE_ORIGEM } from '@/lib/rotulos'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: `Recebemos sua mensagem | ${NOME_DA_MARCA}`,
  robots: { index: false, follow: false },
}

type PropsDaPagina = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

const carregarNomeDoProduto = async (slug: string | undefined): Promise<string | undefined> => {
  if (!slug) return undefined
  try {
    const { obterProdutoPorSlug } = await import('@/lib/consultas')
    const produto = await obterProdutoPorSlug(slug)
    return produto?.nome
  } catch {
    return undefined
  }
}

export default async function PaginaDeObrigado({ searchParams }: PropsDaPagina) {
  const parametros = await searchParams
  const parametroDeProduto = parametros[PARAMETRO_DE_PRODUTO_DE_ORIGEM]
  const slugDeProduto = typeof parametroDeProduto === 'string' ? parametroDeProduto : undefined
  const nomeDoProduto = await carregarNomeDoProduto(slugDeProduto)

  return (
    // Restyle: primeira dobra com entrada única; a coluna de leitura fica
    // na medida de 68 caracteres (13.8).
    <Secao rotuladaPor="titulo-obrigado" primeiraDobra>
      <Container className="flex max-w-none flex-col items-start gap-6">
        {/* RF-125/13.6 regra 8: sem troca de página após o envio, este título
            é o primeiro conteúdo lido — aqui ele É a própria página de destino. */}
        <Titulo nivel={1} id="titulo-obrigado" className="max-w-titulo">
          <TextoDeEntrada>Recebemos sua mensagem</TextoDeEntrada>
        </Titulo>
        <Texto>
          Um de nós responde em {PRAZO_DE_RESPOSTA} por e-mail. Enviamos uma confirmação para o
          endereço informado.
        </Texto>

        <div className="az-entrada-apoio flex w-full flex-col gap-4 pt-2 [--az-ordem:2] sm:w-auto sm:flex-row sm:flex-wrap">
          {slugDeProduto ? (
            <Botao href={ROTAS.produto(slugDeProduto)} variante="secundaria">
              {ACOES.verDetalhes}
              {nomeDoProduto ? ` — ${nomeDoProduto}` : ''}
            </Botao>
          ) : null}
          <Botao href={ROTAS.catalogo()} variante="secundaria">
            {ACOES.verSoftwares}
          </Botao>
          <Botao href={ROTAS.inicial()} variante="discreta">
            Ir para a página inicial
          </Botao>
        </div>
      </Container>
    </Secao>
  )
}
