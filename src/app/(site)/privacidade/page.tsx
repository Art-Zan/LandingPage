/**
 * P-13 — Política de privacidade
 * Implementa: RF-140, RF-141, RF-146, RF-147, RF-164 (indexável — diferente
 *   de `/obrigado`), RF-127 (é o destino do link do aviso de tratamento)
 * Modelo: 6.7 (Página institucional), blocos de `src/lib/blocos-institucionais.ts`
 * Premissas: PR-019 (o texto jurídico é do cliente/setor jurídico, não desta
 *   implementação)
 * Perguntas abertas que afetam este arquivo: D-16 (o texto jurídico não
 *   existe — a página funciona e é publicável assim que o registro existir),
 *   Q-040 (a política precisa declarar transferência internacional como
 *   cenário possível — texto do redator jurídico, não deste código),
 *   Q-032 (histórico de versão é só interno; esta página mostra apenas a
 *   data da última atualização)
 * Dono: Onda 3c
 *
 * NENHUM TEXTO JURÍDICO É ESCRITO AQUI. Esta página só sabe renderizar o que
 * o registro trouxer, pela biblioteca de blocos — nunca texto fixo no
 * template (dev/CONVENCOES.md §8.6). Enquanto o registro não existir ou
 * estiver marcado como provisório, a página diz isso com honestidade, sem
 * simular texto jurídico "de exemplo": um texto jurídico inventado que
 * chegasse a produção seria pior do que a página ausente.
 */

import type { Metadata } from 'next'

import {
  Container,
  Secao,
  Texto,
  TextoDeEntrada,
  Titulo,
  MarcaDePlaceholder,
} from '@/components/ui'
import { CorpoDaPaginaInstitucional } from '@/lib/renderizador-de-paginas-institucionais'
import { ROTAS } from '@/lib/rotas'
import { NOME_DA_MARCA } from '@/lib/rotulos'

export const dynamic = 'force-dynamic'

/** Slug do registro institucional (6.5): igual ao segmento da rota, como em toda página deste tipo. */
const SLUG_DA_PAGINA_DE_PRIVACIDADE = 'privacidade'

export const metadata: Metadata = {
  title: `Política de privacidade | ${NOME_DA_MARCA}`, // 12.2: [Nome do documento] | ArtZan
  description: 'Como a ArtZan trata os dados pessoais coletados pelo site.',
  alternates: { canonical: ROTAS.privacidade() },
}

const formatarData = (isoDeData: string): string =>
  new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(isoDeData))

export default async function PaginaDePrivacidade() {
  let pagina: Awaited<ReturnType<typeof carregarPagina>> | undefined
  try {
    pagina = await carregarPagina()
  } catch {
    // Banco indisponível neste ambiente (sem Postgres/Docker) — distinguido
    // de ausência de conteúdo: aqui é falha de infraestrutura, não de dado.
    pagina = undefined
  }

  return (
    // Restyle: primeira dobra com entrada única; a coluna de leitura fica
    // na medida de 68 caracteres (13.8).
    <Secao rotuladaPor="titulo-privacidade" primeiraDobra>
      <Container className="flex max-w-none flex-col items-start gap-6">
        <Titulo nivel={1} id="titulo-privacidade" className="max-w-titulo">
          <TextoDeEntrada>Política de privacidade</TextoDeEntrada>
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
              detalhe="D-16 — texto jurídico de privacidade pendente de validação; ao redigir, tratar transferência internacional de dados como cenário possível (Q-040)."
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
            <div className="max-w-texto pt-4">
              <CorpoDaPaginaInstitucional corpo={pagina.corpo} />
            </div>
          </>
        )}
      </Container>
    </Secao>
  )
}

async function carregarPagina() {
  const { obterPaginaInstitucional } = await import('@/lib/consultas')
  return obterPaginaInstitucional(SLUG_DA_PAGINA_DE_PRIVACIDADE)
}
