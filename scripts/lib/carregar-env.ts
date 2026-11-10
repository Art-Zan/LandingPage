// Dono: Onda 4c
//
// Efeito colateral de importação: carrega `.env` para `process.env` ANTES de
// qualquer outro módulo do script importar `src/payload.config.ts`.
//
// Por quê isto precisa ser o PRIMEIRO import de cada script (seed.ts,
// verificar-placeholder-producao.ts): `payload.config.ts` chama
// `buildConfig({...})` no topo do módulo, e essa chamada já lê `DATABASE_URI`
// / `PAYLOAD_SECRET` / `DB_ADAPTER` via `process.env` no MOMENTO da
// importação — não depois. Em ESM, imports estáticos irmãos são avaliados na
// ordem em que aparecem no arquivo que importa; por isso um script escreve
//   import '../scripts/lib/carregar-env'   // primeiro
//   import config from '../src/payload.config'  // só depois
// e nunca o inverso.
//
// Usa `process.loadEnvFile`, nativo do Node (estável desde a 20.6) — sem
// dependência nova só para isto. Silencioso quando `.env` não existe (ex.:
// variáveis já exportadas no shell ou em CI).
try {
  process.loadEnvFile('.env')
} catch {
  // Sem `.env` neste diretório — segue sem falhar; quem chamou o script pode
  // ter exportado as variáveis de outra forma.
}
