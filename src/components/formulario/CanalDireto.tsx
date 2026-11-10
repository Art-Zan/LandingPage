/**
 * Canal direto — WhatsApp e e-mail institucional, com o MESMO destaque do
 * formulário (P-08, RF-220, Q-012).
 * Implementa: RF-220 (acionamento sem falha silenciosa em desktop/móvel)
 * Visual: 11.12, 11.15 · Acessibilidade: 13.9 (alvo de 44 px)
 * Perguntas abertas: Q-091 (número de WhatsApp e endereço de e-mail
 *   publicados ainda não existem)
 * Dono: Onda 3c
 *
 * NENHUM VALOR É INVENTADO AQUI. Quando o canal não está configurado
 * (`src/lib/configuracao-contato.ts`), este componente NUNCA renderiza um
 * número ou endereço plausível — em homologação mostra a marca de
 * placeholder com a pergunta aberta; em produção não renderiza nada
 * (dev/CONVENCOES.md §7.3/7.4), porque a trava de build de placeholder da
 * Onda 4 não cobre variável de ambiente, só registro do Payload — omitir é a
 * única alternativa segura enquanto o dado real não existir.
 */

import { MarcaDePlaceholder } from '@/components/ui'
import type { EstadoDoCanal } from '@/lib/configuracao-contato'
import { ehHomologacao } from '@/lib/env'

export type PropsDoCanalDireto = {
  tipo: 'whatsapp' | 'email'
  rotulo: string
  estado: EstadoDoCanal
}

const construirHref = (tipo: PropsDoCanalDireto['tipo'], valor: string): string =>
  tipo === 'whatsapp' ? `https://wa.me/${valor}` : `mailto:${valor}`

export const CanalDireto = ({ tipo, rotulo, estado }: PropsDoCanalDireto) => {
  if (!estado.configurado) {
    // Em produção, nem o item da lista é renderizado — um `<li>` vazio seria
    // anunciado por leitor de tela sem conteúdo. Em homologação, mostra a
    // marca de placeholder com a pergunta aberta, para o revisor humano ver
    // exatamente o que falta (dev/CONVENCOES.md §7.3/7.4).
    if (!ehHomologacao()) return null
    return (
      <li>
        <MarcaDePlaceholder rotulo={rotulo} detalhe={estado.perguntaAberta} />
      </li>
    )
  }

  return (
    <li>
      <a
        href={construirHref(tipo, estado.valor)}
        target={tipo === 'whatsapp' ? '_blank' : undefined}
        rel={tipo === 'whatsapp' ? 'noopener noreferrer' : undefined}
        className={
          'inline-flex min-h-toque items-center gap-entre-alvos text-rotulo font-rotulo ' +
          'text-acao-secundaria underline'
        }
      >
        {rotulo}
      </a>
    </li>
  )
}
