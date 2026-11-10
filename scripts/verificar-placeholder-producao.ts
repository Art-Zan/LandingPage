// Dono: Onda 4c
//
// Trava de build — dev/CONVENCOES.md §7.4, parte 1.
//
// "Com SITE_MODE=producao: o build FALHA se existir qualquer registro com
// placeholder: true E estado publicado. A verificação roda em `prebuild`,
// consulta o banco, e sai com código diferente de zero listando cada registro
// ofensor por coleção e identificador. Falha silenciosa não serve."
//
// Este script É a parte 1. A parte 2 (recusar a publicação na origem) já
// existe em `src/lib/validacao-publicacao.ts` (Onda 2b) — as duas juntas são
// o contrato; uma sozinha não bastaria (alguém poderia ter publicado um
// registro provisório antes de a trava de origem existir, ou tê-lo importado
// direto no banco).
//
// Registrado em `package.json` como o script `prebuild`: o npm o executa
// sozinho, sempre, antes de `npm run build` — não depende de disciplina de
// quem builda.
//
// FORA DE PRODUÇÃO, ESTE SCRIPT NÃO CONSULTA NADA. Em homologação e
// desenvolvimento, placeholder publicado é o estado NORMAL e esperado (é
// como o site sobe populado nesta máquina sem os cinco insumos de 16.6) —
// barrar o build nesses modos seria confundir a rede de segurança de produção
// com uma trava geral.

import './lib/carregar-env' // precisa ser o primeiro import — ver o arquivo

import { getPayload } from 'payload'

import config from '../src/payload.config'
import { ehProducao, SITE_MODE } from '../src/lib/env'
import { encontrarPlaceholdersPublicados } from '../src/lib/placeholder'

const linhaDeSeparacao = '-'.repeat(78)

async function main(): Promise<void> {
  if (!ehProducao()) {
    console.log(
      `[verificar-placeholder] SITE_MODE="${SITE_MODE}" (não é "producao") — ` +
        'trava de placeholder não se aplica. Nada verificado, build liberado.',
    )
    return
  }

  console.log('[verificar-placeholder] SITE_MODE="producao" — consultando o banco…')

  const payload = await getPayload({ config })
  const ofensores = await encontrarPlaceholdersPublicados(payload)

  if (ofensores.length === 0) {
    console.log(
      '[verificar-placeholder] Nenhum registro provisório publicado encontrado. Build liberado.',
    )
    return
  }

  console.error(linhaDeSeparacao)
  console.error(
    `BUILD RECUSADO (dev/CONVENCOES.md §7.4): ${ofensores.length} registro(s) provisório(s) ` +
      'estão PUBLICADOS em um ambiente de produção. Isso não é permitido — corrija cada um antes ' +
      'de tentar o build de novo.',
  )
  console.error(linhaDeSeparacao)
  for (const ofensor of ofensores) {
    console.error(`  - [${ofensor.colecao}] id=${ofensor.id} — "${ofensor.identificador}"`)
  }
  console.error(linhaDeSeparacao)
  console.error(
    'Para cada registro acima: substitua o conteúdo provisório pelo conteúdo real e desmarque ' +
      '"placeholder" (a rota preferida), OU volte o registro para rascunho no painel. Nenhuma das ' +
      'duas correções é feita por este script — ele só recusa e relata.',
  )

  process.exitCode = 1
}

main().catch((erro: unknown) => {
  console.error('[verificar-placeholder] Falha ao executar a verificação:', erro)
  process.exitCode = 1
})
