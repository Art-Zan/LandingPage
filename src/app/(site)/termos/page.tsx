/**
 * P-14 — Termos de uso
 * Implementa: RF-140, RF-141, RF-146, RF-147, RF-164 (indexável)
 * Modelo: 6.7 (Página institucional), blocos de `src/lib/blocos-institucionais.ts`
 * Premissas: PR-019 (o texto jurídico é do cliente/setor jurídico, não desta
 *   implementação)
 * Perguntas abertas que afetam este arquivo: D-16 (o texto jurídico não
 *   existe — a página funciona e é publicável assim que o registro existir),
 *   Q-032 (histórico de versão é só interno)
 * Dono: Onda 3c
 *
 * MESMO TEMPLATE INSTITUCIONAL DE P-13 (7/P-14). NENHUM TEXTO JURÍDICO É
 * ESCRITO AQUI, pelas mesmas razões documentadas em `privacidade/page.tsx`.
 */

import type { Metadata } from 'next'

import { Container, Secao, Texto, Titulo, MarcaDePlaceholder } from '@/components/ui'
import { CorpoDaPaginaInstitucional } from '@/lib/renderizador-de-paginas-institucionais'
import { ROTAS } from '@/lib/rotas'
import { NOME_DA_MARCA } from '@/lib/rotulos'

export const dynamic = 'force-dynamic'

/** Slug do registro institucional (6.5): igual ao segmento da rota, como em toda página deste tipo. */
const SLUG_DA_PAGINA_DE_TERMOS = 'termos'

export const metadata: Metadata = {
  title: `Termos de uso — ${NOME_DA_MARCA}`,
  description: 'Condições de uso do site institucional da ArtZan.',
  alternates: { canonical: ROTAS.termos() },
}

const formatarData = (isoDeData: string): string =>
  new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(isoDeData))

export default async function PaginaDeTermos() {
  let pagina: Awaited<ReturnType<typeof carregarPagina>> | undefined
  try {
    pagina = await carregarPagina()
  } catch {
    pagina = undefined
  }

  return (
    <Container>
      <Secao rotuladaPor="titulo-termos">
        <Titulo nivel={1} id="titulo-termos">
          Termos de uso
        </Titulo>

        {pagina === undefined ? (
          <Texto tom="secundario">
            Não foi possível carregar esta página agora. Tente novamente em instantes.
          </Texto>
        ) : pagina === null ? (
          <>
            <Texto tom="secundario">Esta página ainda não foi publicada.</Texto>
            <MarcaDePlaceholder
              rotulo="Conteúdo pendente"
              detalhe="D-16 — texto jurídico de termos de uso pendente de validação."
            />
          </>
        ) : (
          <>
            <Texto tom="secundario">Atualizado em {formatarData(pagina.updatedAt)}.</Texto>
            {pagina.placeholder ? (
              <MarcaDePlaceholder
                rotulo="Conteúdo provisório"
                detalhe="D-16 — texto ainda não validado juridicamente."
              />
            ) : null}
            <CorpoDaPaginaInstitucional corpo={pagina.corpo} />
          </>
        )}
      </Secao>
    </Container>
  )
}

async function carregarPagina() {
  const { obterPaginaInstitucional } = await import('@/lib/consultas')
  return obterPaginaInstitucional(SLUG_DA_PAGINA_DE_TERMOS)
}
