// Dono: onda de deploy (Docker/VPS)
//
// Aplica as migrations pendentes do Payload (`src/migrations/`) e TERMINA o
// processo. Usado pelo entrypoint do container e por `npm run db:migrate`.
//
// Por que não `payload migrate` direto: o CLI do Payload 3.88 retorna de
// `migrate()` sem chamar `process.exit`, e o pool do `pg` pode manter o
// processo vivo. Num entrypoint isso trava a subida. Aqui a saída é explícita:
// 0 se tudo foi aplicado, 1 em qualquer erro.
//
// `PAYLOAD_MIGRATING=true` desliga o `push` do esquema também fora de
// produção — migration e push nunca podem rodar juntos no mesmo banco.

/* eslint-disable no-console -- script de linha de comando: o console é a saída. */

process.env.PAYLOAD_MIGRATING = 'true'

async function main(): Promise<void> {
  try {
    process.loadEnvFile('.env')
  } catch {
    // No container não há `.env`: as variáveis vêm do docker compose.
  }

  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config')

  const payload = await getPayload({ config })
  await payload.db.migrate()
  console.log('[migrar] Migrations aplicadas (ou nenhuma pendente).')
}

main().then(
  () => process.exit(0),
  (erro: unknown) => {
    console.error('[migrar] Falha ao aplicar migrations:', erro)
    process.exit(1)
  },
)
