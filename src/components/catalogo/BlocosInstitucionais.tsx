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

export const BlocosInstitucionais = ({ blocos, nivelDeTituloDeBloco }: PropsDosBlocosInstitucionais) => (
  <div className="flex flex-col gap-8">
    {blocos.map((bloco) => {
      switch (bloco.blockType) {
        case 'blocoDeTexto':
          return (
            <div key={bloco.id} className="flex flex-col gap-4">
              {bloco.titulo ? (
                <Titulo nivel={nivelDeTituloDeBloco}>{bloco.titulo}</Titulo>
              ) : null}
              <TextoRico dados={bloco.corpo} nivelBase={Math.min(6, nivelDeTituloDeBloco + 1) as NivelDeTitulo} />
            </div>
          )

        case 'blocoDeLista':
          return (
            <div key={bloco.id} className="flex flex-col gap-4">
              {bloco.titulo ? (
                <Titulo nivel={nivelDeTituloDeBloco}>{bloco.titulo}</Titulo>
              ) : null}
              <ul className="flex flex-col gap-4">
                {bloco.itens.map((item) => (
                  <li key={item.id} className="flex flex-col gap-1">
                    <Titulo nivel={Math.min(6, nivelDeTituloDeBloco + 1) as NivelDeTitulo} visual="h3">
                      {item.titulo}
                    </Titulo>
                    {item.texto ? <Texto tom="secundario">{item.texto}</Texto> : null}
                  </li>
                ))}
              </ul>
            </div>
          )

        case 'blocoDeImagem':
          return (
            <figure key={bloco.id} className="m-0">
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
                <figcaption className="mt-2 text-apoio leading-corpo text-texto-secundario">
                  {bloco.legenda}
                </figcaption>
              ) : null}
            </figure>
          )

        case 'blocoDeChamada':
          return (
            <div
              key={bloco.id}
              className="flex flex-col gap-4 rounded-bloco border border-borda bg-superficie-elevada p-card-compacto md:p-card"
            >
              <Titulo nivel={nivelDeTituloDeBloco}>{bloco.titulo}</Titulo>
              {bloco.texto ? <Texto tom="secundario">{bloco.texto}</Texto> : null}
              <div>
                <Botao href={bloco.destino} variante="primaria">
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
