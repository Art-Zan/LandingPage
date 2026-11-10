// Dono: Onda 3c
//
// Renderização das páginas institucionais legais (P-13, P-14) a partir da
// biblioteca finita de blocos — RF-146, RF-140, RF-141: "montada a partir da
// biblioteca finita de blocos [...] nenhum bloco permite inserir estrutura
// arbitrária que quebre o padrão visual ou a hierarquia de cabeçalhos".
//
// Implementa: RF-140, RF-141, RF-146, RF-147 (via `PaginasInstitucionais`,
//   Onda 2b), 13.4 (texto alternativo), 13.5 (hierarquia sem salto de nível)
// Perguntas abertas: nenhuma própria — o texto de cada bloco é dado do
//   registro (Payload), nunca deste arquivo (RNF-074).
//
// SÓ RENDERIZA O QUE JÁ ESTÁ NA BIBLIOTECA DE `src/lib/blocos-institucionais.ts`
// (Onda 2b). Um `blockType` fora dos quatro conhecidos não é inventado aqui —
// vira um comentário visível apenas em homologação, nunca texto fantasioso.
//
// Não vive em `src/components/` porque o território desta onda em
// `src/components/` está restrito a `formulario/**`; esta renderização só é
// usada por `privacidade/page.tsx` e `termos/page.tsx`, ambos meus.

import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'

import { Botao, Texto, Titulo } from '@/components/ui'
import type { PaginasInstitucionai } from '@/payload-types'

type Bloco = PaginasInstitucionai['corpo'][number]

/**
 * Nível de título de cada bloco: o `<h1>` da página é o título do registro
 * (renderizado por quem chama), então todo bloco começa em `<h2>` — sem
 * salto de nível (13.5).
 */
const NIVEL_DO_SUBTITULO = 2

const BlocoDeTextoRenderizado = ({ bloco }: { bloco: Extract<Bloco, { blockType: 'blocoDeTexto' }> }) => (
  <div className="flex flex-col gap-4">
    {bloco.titulo ? <Titulo nivel={NIVEL_DO_SUBTITULO}>{bloco.titulo}</Titulo> : null}
    <RichText data={bloco.corpo} />
  </div>
)

const BlocoDeListaRenderizado = ({ bloco }: { bloco: Extract<Bloco, { blockType: 'blocoDeLista' }> }) => (
  <div className="flex flex-col gap-4">
    {bloco.titulo ? <Titulo nivel={NIVEL_DO_SUBTITULO}>{bloco.titulo}</Titulo> : null}
    <ul className="flex flex-col gap-4">
      {bloco.itens.map((item) => (
        <li key={item.id ?? item.titulo} className="flex flex-col gap-1">
          <Texto variante="corpo" className="font-rotulo">
            {item.titulo}
          </Texto>
          {item.texto ? <Texto tom="secundario">{item.texto}</Texto> : null}
        </li>
      ))}
    </ul>
  </div>
)

const BlocoDeImagemRenderizado = ({ bloco }: { bloco: Extract<Bloco, { blockType: 'blocoDeImagem' }> }) => {
  const imagem = bloco.imagem
  if (typeof imagem !== 'object' || !imagem.url) return null

  const proporcao = imagem.width && imagem.height ? `${imagem.width} / ${imagem.height}` : '16 / 9'

  return (
    <figure className="m-0 flex flex-col gap-2">
      <div
        className="relative overflow-hidden rounded-bloco border border-borda bg-superficie-elevada"
        style={{ aspectRatio: proporcao }}
      >
        <Image src={imagem.url} alt={imagem.alt} fill className="object-cover" />
      </div>
      {bloco.legenda ? (
        <figcaption className="text-apoio leading-corpo text-texto-secundario">{bloco.legenda}</figcaption>
      ) : null}
    </figure>
  )
}

const BlocoDeChamadaRenderizado = ({ bloco }: { bloco: Extract<Bloco, { blockType: 'blocoDeChamada' }> }) => (
  <div className="flex flex-col gap-4 rounded-bloco border border-borda bg-superficie-elevada p-card">
    <Titulo nivel={NIVEL_DO_SUBTITULO}>{bloco.titulo}</Titulo>
    {bloco.texto ? <Texto tom="secundario">{bloco.texto}</Texto> : null}
    <div>
      <Botao href={bloco.destino} variante="secundaria">
        {bloco.rotuloDaAcao}
      </Botao>
    </div>
  </div>
)

export type PropsDoCorpoDaPaginaInstitucional = {
  corpo: PaginasInstitucionai['corpo']
}

/**
 * Renderiza o corpo em blocos de uma página institucional (P-13, P-14).
 * Componente de servidor: `RichText` do Lexical é compatível com RSC.
 */
export const CorpoDaPaginaInstitucional = ({ corpo }: PropsDoCorpoDaPaginaInstitucional) => (
  <div className="flex flex-col gap-secao-meio">
    {corpo.map((bloco) => {
      switch (bloco.blockType) {
        case 'blocoDeTexto':
          return <BlocoDeTextoRenderizado key={bloco.id ?? bloco.blockType} bloco={bloco} />
        case 'blocoDeLista':
          return <BlocoDeListaRenderizado key={bloco.id ?? bloco.blockType} bloco={bloco} />
        case 'blocoDeImagem':
          return <BlocoDeImagemRenderizado key={bloco.id ?? bloco.blockType} bloco={bloco} />
        case 'blocoDeChamada':
          return <BlocoDeChamadaRenderizado key={bloco.id ?? bloco.blockType} bloco={bloco} />
        default:
          // Biblioteca finita (RF-146): nenhum outro `blockType` existe. Se
          // aparecer, é registro de uma versão futura do modelo ainda não
          // coberta por este renderizador — nunca texto inventado.
          return null
      }
    })}
  </div>
)
