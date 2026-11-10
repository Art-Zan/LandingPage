/**
 * Renderizador de texto rico (Lexical/Payload) sob o vocabulário visual do
 * sistema — nenhum `<h1>`..`<h6>` ou `<p>` cru sai daqui sem passar pelos
 * primitivos `Titulo`/`Texto` (RNF-072, 13.5, 13.8).
 * Visual: 11.14, 11.7 (densidade) · Acessibilidade: 13.5 (hierarquia sem salto),
 *         13.8 (largura de linha, altura de linha, alinhamento à esquerda)
 * Dono: Onda 3b
 *
 * POR QUE UM CONVERSOR PRÓPRIO EM VEZ DO PADRÃO DA BIBLIOTECA. O conversor
 * `defaultJSXConverters` de `@payloadcms/richtext-lexical/react` emite `<h1>`,
 * `<p>` etc. crus, sem as classes de token. Usá-lo sem sobrescrever título e
 * parágrafo violaria RNF-072 (valor visual só em `tokens.css`) e a hierarquia
 * de `nivelBase` (13.5): o título do bloco pode não ser sempre um H2. Os
 * demais nós (lista, link, texto) reaproveitam o conversor padrão porque já
 * emitem HTML semântico neutro (`<ul>`, `<a>`), sem tamanho ou cor embutidos.
 */

import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from 'lexical'

import { Texto, Titulo } from '@/components/ui'
import type { NivelDeTitulo } from '@/components/ui'

export type PropsDoTextoRico = {
  /** Estrutura Lexical de um campo `richText` do Payload. */
  dados: SerializedEditorState
  /**
   * Nível do PRIMEIRO título que o corpo pode conter (13.5 — sem salto de
   * nível). Um título Lexical de nível 1 dentro do editor vira este nível;
   * os demais avançam a partir dele.
   */
  nivelBase?: NivelDeTitulo
  className?: string
}

const TAG_PARA_NIVEL: Record<string, number> = { h1: 1, h2: 2, h3: 3, h4: 4, h5: 5, h6: 6 }

export const TextoRico = ({ dados, nivelBase = 2, className }: PropsDoTextoRico) => (
  <div className={className}>
    <RichText
      data={dados}
      disableContainer
      converters={({ defaultConverters }) => ({
        ...defaultConverters,
        paragraph: ({ node, nodesToJSX }) => (
          <Texto como="p">{nodesToJSX({ nodes: node.children })}</Texto>
        ),
        heading: ({ node, nodesToJSX }) => {
          const deslocamento = (TAG_PARA_NIVEL[node.tag] ?? 1) - 1
          const nivelResolvido = Math.min(6, nivelBase + deslocamento) as NivelDeTitulo
          return (
            <Titulo nivel={nivelResolvido}>{nodesToJSX({ nodes: node.children })}</Titulo>
          )
        },
      })}
    />
  </div>
)
