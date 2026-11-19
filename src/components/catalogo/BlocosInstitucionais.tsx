/**
 * Renderizador genérico da biblioteca finita de blocos institucionais
 * (RF-146, RF-140, RF-141 — src/lib/blocos-institucionais.ts, Onda 2b).
 * Visual: 11.7 (uma ideia por bloco), 11.15 · Acessibilidade: 13.5 (hierarquia)
 * Dono: Onda 3b
 *
 * NUNCA TEXTO FIXO NO TEMPLATE. Este componente só sabe desenhar os QUATRO
 * tipos de bloco que a biblioteca declara — texto, lista, imagem, chamada —
 * e não decide o que cada bloco diz. O bloco do serviço de integrações
 * (11.20) não recebe tratamento especial aqui: ele é, estruturalmente, um
 * `blocoDeChamada` como outro qualquer, cadastrado pela Onda 4 com o destino
 * `/contato` e um rótulo de ação próprio — é o CONTEÚDO do registro que o
 * distingue, não o template.
 */

import Image from 'next/image'

import { Botao, Texto, Titulo } from '@/components/ui'
import type { NivelDeTitulo } from '@/components/ui'
import type { PaginasInstitucionai } from '@/payload-types'

import { TextoRico } from './TextoRico'

export type PropsDosBlocosInstitucionais = {
  blocos: PaginasInstitucionai['corpo']
  /** Nível do título de CADA bloco (13.5). Um nível abaixo do H1 da página. */
  nivelDeTituloDeBloco: NivelDeTitulo
}

// Restyle — cada bloco é uma faixa separada por filete de 1 px; blocos de
// texto e de lista usam a mesma divisão da página (título nas 5 primeiras
// colunas, conteúdo a partir da 7.ª, a partir de 1024 px); o bloco de
// chamada vira um painel na superfície elevada com a ação primária.
const DIVIDIDO =
  'grid grid-cols-1 gap-6 border-t border-borda pt-10 lg:grid-cols-12 lg:gap-6 lg:pt-12'
const TITULO_DIVIDIDO = 'lg:col-span-6'
const CORPO_DIVIDIDO = 'flex flex-col gap-6 lg:col-span-6 lg:col-start-7'

export const BlocosInstitucionais = ({
  blocos,
  nivelDeTituloDeBloco,
}: PropsDosBlocosInstitucionais) => (
  <div className="flex flex-col gap-16 lg:gap-24">
    {blocos.map((bloco) => {
      switch (bloco.blockType) {
        case 'blocoDeTexto':
          return (
            <div key={bloco.id} className={DIVIDIDO}>
              {bloco.titulo ? (
                <Titulo nivel={nivelDeTituloDeBloco} className={TITULO_DIVIDIDO}>
                  {bloco.titulo}
                </Titulo>
              ) : null}
              <div className={bloco.titulo ? CORPO_DIVIDIDO : 'flex flex-col gap-6 lg:col-span-8'}>
                <TextoRico
                  dados={bloco.corpo}
                  nivelBase={Math.min(6, nivelDeTituloDeBloco + 1) as NivelDeTitulo}
                />
              </div>
            </div>
          )

        case 'blocoDeLista':
          return (
            <div key={bloco.id} className={DIVIDIDO}>
              {bloco.titulo ? (
                <Titulo nivel={nivelDeTituloDeBloco} className={TITULO_DIVIDIDO}>
                  {bloco.titulo}
                </Titulo>
              ) : null}
              <ol className={bloco.titulo ? CORPO_DIVIDIDO : 'flex flex-col gap-6 lg:col-span-8'}>
                {bloco.itens.map((item, indice) => (
                  <li key={item.id} className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                    <span className="az-ordinal pt-1" aria-hidden="true">
                      {String(indice + 1).padStart(2, '0')}
                    </span>
                    <Titulo
                      nivel={Math.min(6, nivelDeTituloDeBloco + 1) as NivelDeTitulo}
                      visual="h3"
                    >
                      {item.titulo}
                    </Titulo>
                    {item.texto ? (
                      <Texto tom="secundario" className="col-start-2">
                        {item.texto}
                      </Texto>
                    ) : null}
                  </li>
                ))}
              </ol>
            </div>
          )

        case 'blocoDeImagem':
          return (
            <figure key={bloco.id} className="m-0 flex flex-col gap-3">
              {typeof bloco.imagem === 'object' && bloco.imagem.url ? (
                <Image
                  src={bloco.imagem.url}
                  alt={bloco.imagem.alt}
                  width={bloco.imagem.width ?? 1200}
                  height={bloco.imagem.height ?? 675}
                  className="w-full rounded-bloco border border-borda"
                />
              ) : null}
              {bloco.legenda ? (
                <figcaption className="text-apoio leading-corpo text-texto-secundario">
                  {bloco.legenda}
                </figcaption>
              ) : null}
            </figure>
          )

        case 'blocoDeChamada':
          return (
            <div
              key={bloco.id}
              className="grid grid-cols-1 gap-6 rounded-bloco border border-borda bg-superficie-elevada p-card-compacto md:p-card lg:grid-cols-12 lg:items-end lg:gap-6 lg:p-12"
            >
              <div className="flex flex-col items-start gap-4 lg:col-span-7">
                <span aria-hidden="true" className="az-vertice" />
                <Titulo nivel={nivelDeTituloDeBloco}>{bloco.titulo}</Titulo>
                {bloco.texto ? <Texto tom="secundario">{bloco.texto}</Texto> : null}
              </div>
              <div className="w-full lg:col-span-4 lg:col-start-9 lg:flex lg:justify-end">
                <Botao
                  href={bloco.destino}
                  variante="primaria"
                  comSeta
                  className="w-full sm:w-auto"
                >
                  {bloco.rotuloDaAcao}
                </Botao>
              </div>
            </div>
          )

        default:
          return null
      }
    })}
  </div>
)
