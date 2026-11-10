/**
 * Diretrizes de rastreamento (robots.txt).
 * Implementa: RF-164 (libera o conteúdo público; restringe `/busca` e
 *   variantes de busca interna; homologação bloqueia integralmente a
 *   indexação; referencia o mapa do site)
 * Modelo: 12.5 ("Diretrizes de rastreamento")
 * Dono: Onda 3a
 *
 * O PAINEL ADMINISTRATIVO NÃO APARECE AQUI, NEM PARA BLOQUEAR — 12.5, regra 6
 * do bloco de diretrizes de rastreamento do PRD, é explícito: "não se
 * acrescenta o caminho ao arquivo de diretrizes", porque o arquivo é público
 * e listar o endereço equivaleria a anunciá-lo para quem procura exatamente
 * por ele. A proteção do painel é autenticação mais ausência de link a
 * partir de qualquer página pública — nunca uma linha de `Disallow` aqui.
 *
 * `/busca` (P-17) é Futuro e não tem rota construída nesta etapa
 * (dev/CONVENCOES.md §4.3); o bloqueio é preparado mesmo assim, porque
 * 12.5 pede a diretriz independentemente de a página já existir, e o
 * caminho é inofensivo enquanto não responder a nada.
 *
 * NENHUM BLOQUEIO DE FOLHA DE ESTILO, SCRIPT OU IMAGEM (12.5, regra 1): a
 * regra abaixo libera tudo por padrão e só restringe o caminho utilitário.
 */

import type { MetadataRoute } from 'next'

import { permiteIndexacao, SITE_URL } from '@/lib/env'

export default function robots(): MetadataRoute.Robots {
  if (!permiteIndexacao()) {
    // RF-164 — homologação bloqueia integralmente a indexação. Diretriz de
    // rastreamento sozinha não impede indexação por link externo (12.5,
    // regra 4): o ambiente também precisa estar protegido por autenticação,
    // o que é responsabilidade de hospedagem/infraestrutura, fora deste
    // arquivo.
    return { rules: { userAgent: '*', disallow: '/' } }
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/busca'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
