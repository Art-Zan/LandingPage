/**
 * Card de produto do catálogo — os seis campos exatos de RF-041, nada além.
 * Implementa: RF-041, RF-042 (selo de solução, derivado, nunca digitado)
 * Modelo: 6.7 (Produto, Categoria)
 * Visual: 11.12, 11.15 (Card sem sombra) · Acessibilidade: 13.9 (card inteiro é o alvo)
 * Premissas: PR-005 (sem preço), PR-063 (identificação sob 11.4/CONVENCOES.md §4.4)
 * Perguntas abertas que afetam este arquivo: Q-005 (captura real ainda não existe),
 *   Q-084 (nome de três dos quatro produtos ainda a aprovar), Q-006 (selo de
 *   solução nunca aparece hoje — nenhum vínculo existe)
 * Dono: Onda 3b
 *
 * NADA ALÉM DOS SEIS CAMPOS DE RF-041: sem preço, sem lista de funcionalidades
 * — os dois destruiriam a comparabilidade da grade (P-03, J-06). O card
 * inteiro é o link (Card com `href`): não há "ver detalhes" como elemento
 * `<a>` menor dentro do card, só o rótulo acessível que o nomeia.
 */

import Image from 'next/image'

import { Card, MolduraCaptura, Texto, Titulo } from '@/components/ui'
import type { NivelDeTitulo } from '@/components/ui'
import { identificacaoPublicaDoProduto } from '@/lib/identificacao-de-produto'
import { ROTAS } from '@/lib/rotas'
import {
  ACOES,
  ROTULO_NOME_PROPOSTO_A_APROVAR,
  ROTULO_SELO_PARTICIPA_DE_SOLUCOES,
} from '@/lib/rotulos'
import type { Categoria, Midia, Produto } from '@/payload-types'

export type PropsDoCartaoDeProduto = {
  produto: Produto
  /**
   * Nível do título do card (13.5 — hierarquia sem salto). P-01 usa h3 sob o
   * H2 da seção de destaque; P-03 usa h3 sob o H1 fixo do catálogo.
   */
  nivelDeTitulo: NivelDeTitulo
}

const ehCategoriaPopulada = (
  categoria: number | Categoria,
): categoria is Categoria => typeof categoria === 'object'

const ehMidiaPopulada = (midia: number | Midia): midia is Midia => typeof midia === 'object'

export const CartaoDeProduto = ({ produto, nivelDeTitulo }: PropsDoCartaoDeProduto) => {
  const identificacao = identificacaoPublicaDoProduto(produto)
  const imagem = produto.imagemDestaque
  const categoriasVisiveis = produto.categorias
    .filter(ehCategoriaPopulada)
    .filter((categoria) => categoria.visivelPublicamente)
  const participaDeSolucao = Boolean(produto.solucoesQueParticipa?.docs?.length)

  return (
    <Card
      href={ROTAS.produto(produto.slug)}
      rotuloAcessivel={`${ACOES.verDetalhes}: ${identificacao.titulo}`}
      className="flex flex-col gap-4"
    >
      {ehMidiaPopulada(imagem) && imagem.url ? (
        <MolduraCaptura>
          <Image
            src={imagem.url}
            alt={imagem.alt}
            width={imagem.width ?? 800}
            height={imagem.height ?? 500}
            loading="lazy"
          />
        </MolduraCaptura>
      ) : null}

      <div className="flex flex-col gap-2">
        <Titulo nivel={nivelDeTitulo} visual="h3">
          {identificacao.titulo}
        </Titulo>

        {identificacao.nomePropostoAAprovar ? (
          <Texto variante="apoio" tom="secundario" limitarLargura={false}>
            {ROTULO_NOME_PROPOSTO_A_APROVAR}: {identificacao.nomePropostoAAprovar}
          </Texto>
        ) : null}

        <Texto tom="secundario" limitarLargura={false}>
          {produto.resumoUmaLinha}
        </Texto>

        {categoriasVisiveis.length > 0 || participaDeSolucao ? (
          <div className="flex flex-wrap gap-2">
            {categoriasVisiveis.map((categoria) => (
              <Texto
                key={categoria.id}
                como="span"
                variante="apoio"
                tom="secundario"
                limitarLargura={false}
                className="rounded-controle border border-borda px-2 py-1"
              >
                {categoria.nome}
              </Texto>
            ))}
            {participaDeSolucao ? (
              <Texto
                como="span"
                variante="apoio"
                tom="secundario"
                limitarLargura={false}
                className="rounded-controle border border-borda px-2 py-1"
              >
                {ROTULO_SELO_PARTICIPA_DE_SOLUCOES}
              </Texto>
            ) : null}
          </div>
        ) : null}
      </div>
    </Card>
  )
}
