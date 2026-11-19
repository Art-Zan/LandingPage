/**
 * P-02 — Sobre a empresa
 * Implementa: RF-021 (formulação institucional espelhada), RF-140, RF-141,
 *   RF-146, RF-160, RF-161
 * Modelo: 6.7 (PaginasInstitucionais slug "sobre")
 * Visual: 11.5 (como apresentar a empresa sem cases), 11.20 (serviço de integrações)
 * Conversão: 14.1
 * Premissas: PR-007 (sem tempo de mercado, cases ou equipe), PR-040 (voz única)
 * Perguntas abertas que afetam este arquivo: nenhuma pergunta aberta específica —
 *   o conteúdo é inteiramente do registro; ausência do registro é tratada como
 *   página não encontrada, nunca com texto fixo substituto.
 * Dono: Onda 3b
 *
 * NUNCA TEXTO FIXO NO TEMPLATE. Toda a página é a biblioteca finita de blocos
 * (texto, lista, imagem, chamada) do registro `PaginasInstitucionais` de slug
 * "sobre" — inclusive o bloco do serviço de desenvolvimento de integrações
 * (11.20): ele é um `blocoDeChamada` como outro qualquer, com ação própria de
 * contato, cadastrado pela Onda 4. Este arquivo não sabe distinguir "o bloco
 * de integrações" de qualquer outro bloco de chamada — a distinção é editorial.
 */

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { BlocosInstitucionais } from '@/components/catalogo/BlocosInstitucionais'
import { MarcaDeRegistroProvisorio } from '@/components/catalogo/MarcaDeRegistroProvisorio'
import { ROTULOS } from '@/components/layout/navegacao'
import { Container, Secao, TextoDeEntrada, Titulo } from '@/components/ui'
import { obterPaginaInstitucional, SLUG_DA_PAGINA_SOBRE } from '@/lib/consultas'
import { construirMetadados, jsonLdDePaginaSobre, serializarDadosEstruturados } from '@/lib/seo'
import { ROTAS } from '@/lib/rotas'
import type { Midia } from '@/payload-types'

const ehMidiaPopulada = (midia: number | Midia | null | undefined): midia is Midia =>
  typeof midia === 'object' && midia !== null

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await obterPaginaInstitucional(SLUG_DA_PAGINA_SOBRE)
  return construirMetadados({
    registro: pagina,
    segmentos: ['sobre'],
    imagem:
      ehMidiaPopulada(pagina?.imagemDestaque) && pagina.imagemDestaque.url
        ? { url: pagina.imagemDestaque.url, alt: pagina.imagemDestaque.alt }
        : undefined,
  })
}

export default async function PaginaSobre() {
  const pagina = await obterPaginaInstitucional(SLUG_DA_PAGINA_SOBRE)

  if (!pagina) {
    notFound()
  }

  const urlCanonica = ROTAS.sobre()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializarDadosEstruturados(jsonLdDePaginaSobre(urlCanonica)),
        }}
      />
      {/* Restyle — primeira dobra própria (sobretítulo, H1, marca de registro
          provisório) e os blocos institucionais numa segunda seção, cada um
          na divisão título/corpo da página. */}
      <Secao rotuladaPor="titulo-sobre" primeiraDobra>
        <Container>
          <div className="flex flex-col items-start gap-6">
            <p className="az-sobretitulo">{ROTULOS.sobre}</p>
            <Titulo nivel={1} id="titulo-sobre" className="max-w-titulo">
              <TextoDeEntrada>{pagina.titulo}</TextoDeEntrada>
            </Titulo>
            <MarcaDeRegistroProvisorio registro={pagina} className="az-entrada-apoio" />
          </div>
        </Container>
      </Secao>
      <Secao rotulo={pagina.titulo} className="pt-0 lg:pt-0">
        <Container>
          <BlocosInstitucionais blocos={pagina.corpo} nivelDeTituloDeBloco={2} />
        </Container>
      </Secao>
    </>
  )
}
