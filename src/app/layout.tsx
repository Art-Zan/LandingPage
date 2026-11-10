/**
 * Layout raiz — casco HTML comum a QUALQUER rota do projeto.
 * Implementa: RF-011 (idioma declarado do documento), RNF-014 (fontes locais,
 *   texto legível antes do carregamento), RF-164 (homologação bloqueia
 *   integralmente a indexação — aplicado aqui como padrão herdável por toda
 *   página; quem precisa de exceção, como `/obrigado`, sobrescreve o próprio
 *   `metadata.robots`)
 * Visual: 11.13 (mecanismo de troca de tema, sem lampejo do valor errado),
 *   11.14 (as duas famílias tipográficas)
 * Perguntas abertas que afetam este arquivo: Q-002 (domínio, via
 *   `NEXT_PUBLIC_SITE_URL`, nunca literal), Q-011 (quando o inglês for
 *   ativado, `lang` passa a ser função do idioma da rota, não mais uma
 *   constante única)
 * Dono: Onda 3a
 *
 * ESTE ARQUIVO NÃO RENDERIZA CABEÇALHO NEM RODAPÉ, DE PROPÓSITO. O shell
 * público — cabeçalho, salto para o conteúdo, rodapé — vive em
 * `(site)/layout.tsx`. Se estivesse aqui, o grupo `(dev)` herdaria os dois, o
 * que o comentário de topo de `GaleriaDePrimitivos.tsx` proíbe explicitamente
 * ("não pode virar rota pública indexada... viver FORA de `(site)`... para
 * não herdar o shell público"). Aqui só existe o que é comum a QUALQUER
 * rota do projeto: `<html>`, fontes, script síncrono de tema e a folha de
 * estilo única.
 *
 * `IDIOMA_PADRAO` (de `src/lib/rotas.ts`) é usado em vez do literal
 * `"pt-BR"`: quando o inglês for ativado, `lang` passa a vir do segmento de
 * rota, não deste arquivo — mas hoje, com um único idioma publicado
 * (dev/CONVENCOES.md §5.1), a constante e o literal têm o mesmo valor por
 * definição.
 *
 * `@/styles/globals.css` é a ÚNICA folha de estilo importada (regra fixada
 * pela Onda 2a no próprio arquivo): os tokens entram pelo `@import` interno
 * dele, e nenhum outro arquivo de estilo é referenciado por esta onda.
 */

import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import '@/styles/globals.css'
import { CLASSES_DE_FONTE } from '@/components/layout/fontes'
import { SCRIPT_DE_TEMA } from '@/components/layout/tema'
import { permiteIndexacao, SITE_URL } from '@/lib/env'
import { IDIOMA_PADRAO } from '@/lib/rotas'
import { NOME_DA_MARCA } from '@/lib/rotulos'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: NOME_DA_MARCA,
    // RF-160 — padrão automático: nome da entidade + nome da ArtZan.
    template: `%s — ${NOME_DA_MARCA}`,
  },
  // RF-164 — bloqueio íntegro de indexação em homologação, sem depender de
  // que cada página lembre de declará-lo. Em produção, o padrão é indexável;
  // páginas utilitárias (`/obrigado`, `/busca`, a rota de revisão) sobrescrevem
  // este campo com o próprio `metadata`, o que o Next mescla por página.
  robots: permiteIndexacao()
    ? { index: true, follow: true }
    : { index: false, follow: false },
}

export default function LayoutRaiz({ children }: { children: ReactNode }) {
  return (
    <html lang={IDIOMA_PADRAO} className={CLASSES_DE_FONTE}>
      <head>
        {/* 11.13 — script síncrono, executado antes do primeiro pintar
            (src/components/layout/tema.ts, Onda 3a). Sem ele há lampejo do
            tema errado entre a pintura inicial e a hidratação do React. */}
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_DE_TEMA }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
