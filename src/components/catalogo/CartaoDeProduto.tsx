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
import type { CSSProperties } from 'react'

import { Card, MolduraCaptura, Seta, Texto, Titulo } from '@/components/ui'
import type { NivelDeTitulo } from '@/components/ui'
import { identificacaoPublicaDoProduto } from '@/lib/identificacao-de-produto'
import { ROTAS } from '@/lib/rotas'
import {
  ACOES,
  ROTULO_NOME_PROPOSTO_A_APROVAR,
  ROTULO_SELO_PARTICIPA_DE_SOLUCOES,
} from '@/lib/rotulos'
import type { Categoria, Midia, Produto } from '@/payload-types'

import { MarcaDeRegistroProvisorio } from './MarcaDeRegistroProvisorio'

export type PropsDoCartaoDeProduto = {
  produto: Produto
  /**
   * Nível do título do card (13.5 — hierarquia sem salto). P-01 usa h3 sob o
   * H2 da seção de destaque; P-03 usa h3 sob o H1 fixo do catálogo.
   */
  nivelDeTitulo: NivelDeTitulo
}

const ehCategoriaPopulada = (categoria: number | Categoria): categoria is Categoria =>
  typeof categoria === 'object'

const ehMidiaPopulada = (midia: number | Midia): midia is Midia => typeof midia === 'object'

export const CartaoDeProduto = ({ produto, nivelDeTitulo }: PropsDoCartaoDeProduto) => {
  const identificacao = identificacaoPublicaDoProduto(produto)
  const imagem = produto.imagemDestaque
  const categoriasVisiveis = produto.categorias
    .filter(ehCategoriaPopulada)
    .filter((categoria) => categoria.visivelPublicamente)
  const participaDeSolucao = Boolean(produto.solucoesQueParticipa?.docs?.length)
  // Rebrand — a cor da faixa segue a família do produto: âmbar para esporte,
  // azul da marca para gestão. Lida da categoria, nunca do nome.
  const ehEsporte = produto.categorias
    .filter(ehCategoriaPopulada)
    .some((categoria) => categoria.slug === 'esporte')

  return (
    <Card
      href={ROTAS.produto(produto.slug)}
      // Rebrand (2026-11-13): cartão escuro de placar com faixa de cor no
      // topo, como os cartões FUTSAL / BASQUETE / VÔLEI do MarQGol. Escuro em
      // qualquer página (az-faixa-escura no próprio cartão).
      superficie="elevada"
      rotuloAcessivel={`${ACOES.verDetalhes}: ${identificacao.titulo}`}
      // Restyle: o card ocupa a altura da linha da grade; o rodapé do card
      // (Ver detalhes + seta) fica sempre no pé, alinhado entre vizinhos.
      className="az-faixa-escura az-cartao-faixa flex h-full w-full flex-col gap-6"
      estilo={
        {
          '--az-cor-faixa': ehEsporte ? 'var(--az-sinal)' : 'var(--az-destaque)',
        } as CSSProperties
      }
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

      <div className="flex flex-1 flex-col gap-3">
        <Titulo nivel={nivelDeTitulo} visual="h3">
          {identificacao.titulo}
        </Titulo>

        <MarcaDeRegistroProvisorio registro={produto} className="self-start" />

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
                className="rounded-pilula border border-borda px-3 py-1 font-titulo font-rotulo uppercase tracking-caixa-alta"
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
                className="rounded-pilula border border-borda px-3 py-1 font-titulo font-rotulo uppercase tracking-caixa-alta"
              >
                {ROTULO_SELO_PARTICIPA_DE_SOLUCOES}
              </Texto>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Restyle — afordância visível do card inteiro acionável (13.9). O
          rótulo acessível do link já diz o mesmo; isto é para quem vê. */}
      <span
        aria-hidden="true"
        className="inline-flex items-center gap-2 border-t border-borda pt-4 font-titulo text-rotulo font-h1 uppercase tracking-caixa-alta text-texto-principal"
      >
        {ACOES.verDetalhes}
        <Seta />
      </span>
    </Card>
  )
}
