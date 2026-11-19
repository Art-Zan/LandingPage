/**
 * Entrega de arquivo de mídia ao visitante — `/api/midia/file/<arquivo>`
 * Implementa: RNF-012 (a imagem reprocessada chega ao navegador), RF-187
 *   (mídia carregada uma vez e reutilizada por qualquer entidade)
 * Modelo: coleção `midia` (src/collections/Midia.ts, Onda 2b)
 * Dono: Onda 3c (território `src/app/api/**`) — acrescentado na verificação
 *   pós-Onda 4
 *
 * Por que este arquivo existe. O Payload grava a URL de toda mídia como
 * `/api/midia/file/<arquivo>`, mas essa rota só existe quando o manipulador
 * REST do Payload está montado — e ele vive em `src/app/(payload)/`, que é
 * etapa 2 e está vazio (dev/CONVENCOES.md §2, §4.2). Sem este arquivo, TODA
 * imagem do site respondia 404.
 *
 * Escopo deliberadamente estreito: só GET, só a coleção `midia`, só o
 * endpoint de arquivo. O caminho é montado aqui, não lido da URL, então
 * nenhum outro endpoint da API do Payload (login, listagem, escrita) fica
 * exposto por este atalho. O controle de acesso continua sendo o do Payload:
 * o manipulador aplica `access.read` da coleção (`leituraPublica`) e resolve
 * o arquivo no diretório de armazenamento configurado — este arquivo não lê
 * disco por conta própria.
 *
 * Quando a etapa 2 montar o REST completo em `(payload)/api/[...slug]`, este
 * arquivo pode ser removido sem efeito colateral: a URL gravada é a mesma.
 */

import config from '@payload-config'
import { REST_GET } from '@payloadcms/next/routes'

import { SLUG_MIDIA } from '@/lib/slugs'

const entregarArquivo = REST_GET(config)

type Contexto = { params: Promise<{ arquivo: string }> }

export async function GET(requisicao: Request, { params }: Contexto): Promise<Response> {
  const { arquivo } = await params
  return entregarArquivo(requisicao, {
    params: Promise.resolve({ slug: [SLUG_MIDIA, 'file', arquivo] }),
  })
}
