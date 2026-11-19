#!/bin/sh
# Dono: onda de deploy (Docker/VPS)
#
# Sequência de subida do container `app`:
#   1. confere variáveis obrigatórias e diretórios persistentes
#   2. espera o Postgres aceitar conexão
#   3. aplica migrations do Payload (src/migrations/)
#   4. `npm run build` — o `prebuild` roda a guarda de placeholder (7.4) contra
#      o banco REAL e a verificação de contraste; só então o `next build`
#   5. `next start`
#
# Por que o build acontece aqui e não no `docker build`: quase todo o site é
# gerado estaticamente e consulta o banco durante o build, e a guarda 7.4
# precisa do banco de verdade. Dentro do `docker build` não há rede para o
# serviço `db`. Ver deploy/README.md, seção "Por que o build roda na subida".
#
# Variáveis próprias deste script (todas opcionais):
#   BUILD_ON_START   always (padrão) | if-missing
#                    always: rebuild a cada subida — é o "rebuild por publicação".
#                    if-missing: reaproveita o .next do container se existir
#                    (só vale para `docker compose restart`, não para recriação).
#   ESPERA_DB_SEGUNDOS        tempo máximo esperando o Postgres (padrão 120)
#   ESPERA_APOS_FALHA_SEGUNDOS pausa antes de sair com erro, para o restart
#                    automático não virar um laço de builds (padrão 300)

set -eu

log() { printf '[entrypoint] %s\n' "$*"; }

falhar() {
  log "ERRO: $*"
  espera="${ESPERA_APOS_FALHA_SEGUNDOS:-300}"
  log "Aguardando ${espera}s antes de encerrar (evita laço de rebuild com restart automático)."
  sleep "$espera"
  exit 1
}

# --- 1. Pré-condições ---------------------------------------------------------
: "${DATABASE_URI:?DATABASE_URI ausente}"
: "${PAYLOAD_SECRET:?PAYLOAD_SECRET ausente}"
: "${NEXT_PUBLIC_SITE_URL:?NEXT_PUBLIC_SITE_URL ausente}"

if [ "${#PAYLOAD_SECRET}" -lt 64 ]; then
  falhar "PAYLOAD_SECRET tem ${#PAYLOAD_SECRET} caracteres; o mínimo é 64. Gere com: openssl rand -hex 48"
fi

case "$NEXT_PUBLIC_SITE_URL" in
  https://?*) ;;
  http://localhost*|http://127.0.0.1*) log "AVISO: NEXT_PUBLIC_SITE_URL local (${NEXT_PUBLIC_SITE_URL})." ;;
  *) falhar "NEXT_PUBLIC_SITE_URL precisa ser https://<domínio> (recebido: '${NEXT_PUBLIC_SITE_URL}')." ;;
esac

if [ "${DB_ADAPTER:-postgres}" != "postgres" ]; then
  falhar "DB_ADAPTER=${DB_ADAPTER} não é suportado no container. Use postgres."
fi

log "SITE_MODE=${SITE_MODE:-homolog} NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}"

for dir in /app/midia "${SOLICITACOES_DIR:-/app/var/solicitacoes}" /app/.next/cache; do
  mkdir -p "$dir" 2>/dev/null || true
  if ! touch "$dir/.escrita-ok" 2>/dev/null; then
    falhar "Sem permissão de escrita em $dir (volume com dono errado?). Ver deploy/README.md, 'Permissões dos volumes'."
  fi
  rm -f "$dir/.escrita-ok"
done

# --- 2. Espera do Postgres ----------------------------------------------------
log "Aguardando o Postgres…"
limite="${ESPERA_DB_SEGUNDOS:-120}"
inicio=$(date +%s)
until node -e '
  const u = new URL(process.env.DATABASE_URI);
  const s = require("net").connect(Number(u.port || 5432), u.hostname);
  s.setTimeout(3000);
  s.on("connect", () => { s.end(); process.exit(0); });
  s.on("error", () => process.exit(1));
  s.on("timeout", () => process.exit(1));
' 2>/dev/null; do
  if [ $(( $(date +%s) - inicio )) -ge "$limite" ]; then
    falhar "Postgres não respondeu em ${limite}s."
  fi
  sleep 2
done
log "Postgres acessível."

# --- 3. Migrations ------------------------------------------------------------
log "Aplicando migrations…"
npm run --silent db:migrate || falhar "Migrations falharam. Nada foi buildado."

# --- 4. Build -----------------------------------------------------------------
if [ "${BUILD_ON_START:-always}" = "if-missing" ] && [ -f /app/.next/BUILD_ID ]; then
  log "BUILD_ON_START=if-missing e .next existente — build reaproveitado."
else
  log "Build do Next (prebuild: guarda de placeholder + contraste). Pode levar minutos…"
  rm -rf /app/.next/server /app/.next/static /app/.next/BUILD_ID
  npm run build || falhar "Build recusado ou com erro. Se SITE_MODE=producao, confira acima a lista de registros provisórios publicados (guarda 7.4)."
fi

# --- 5. Servidor --------------------------------------------------------------
log "Iniciando o servidor na porta ${PORT:-3000}."
exec ./node_modules/.bin/next start -H 0.0.0.0 -p "${PORT:-3000}"
