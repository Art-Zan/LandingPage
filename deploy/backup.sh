#!/bin/sh
# Dono: onda de deploy (Docker/VPS)
#
# Backup completo do site na VPS. Rodar a partir da raiz do projeto:
#   sh deploy/backup.sh
#
# Gera, em deploy/backups/ (ou BACKUP_DIR):
#   db-<data>.dump          pg_dump em formato custom (restaurar com pg_restore)
#   arquivos-<data>.tar.gz  volumes de mídia (artzan_midia) e de leads
#                           (artzan_solicitacoes — rede de segurança de RNF-092)
#
# Os leads contêm DADO PESSOAL. O diretório de backup é criado com permissão
# 700; copie-o para fora da VPS (ver deploy/README.md) por canal cifrado.
#
# Variáveis opcionais:
#   BACKUP_DIR            destino (padrão: deploy/backups)
#   BACKUP_RETENCAO_DIAS  apaga backups locais mais antigos (padrão: 14; 0 = nunca)

set -eu

RAIZ=$(cd "$(dirname "$0")/.." && pwd)
cd "$RAIZ"

ENV_FILE=deploy/.env.production
COMPOSE="docker compose --env-file $ENV_FILE -f docker-compose.prod.yml"
DESTINO="${BACKUP_DIR:-$RAIZ/deploy/backups}"
RETENCAO="${BACKUP_RETENCAO_DIAS:-14}"
CARIMBO=$(date -u +%Y%m%dT%H%M%SZ)

[ -f "$ENV_FILE" ] || { echo "Arquivo $ENV_FILE não encontrado." >&2; exit 1; }

umask 077
mkdir -p "$DESTINO"
chmod 700 "$DESTINO"

echo "[backup] Banco -> $DESTINO/db-$CARIMBO.dump"
$COMPOSE exec -T db sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc --no-owner' \
  > "$DESTINO/db-$CARIMBO.dump.parcial"
mv "$DESTINO/db-$CARIMBO.dump.parcial" "$DESTINO/db-$CARIMBO.dump"

# Os volumes são lidos por um container descartável (somente leitura), então o
# backup de arquivos funciona mesmo com o app parado ou em build.
echo "[backup] Mídia e leads -> $DESTINO/arquivos-$CARIMBO.tar.gz"
docker run --rm \
  -v artzan_midia:/backup/midia:ro \
  -v artzan_solicitacoes:/backup/solicitacoes:ro \
  --entrypoint tar postgres:16-alpine \
  czf - -C /backup midia solicitacoes \
  > "$DESTINO/arquivos-$CARIMBO.tar.gz.parcial"
mv "$DESTINO/arquivos-$CARIMBO.tar.gz.parcial" "$DESTINO/arquivos-$CARIMBO.tar.gz"

if [ "$RETENCAO" -gt 0 ]; then
  find "$DESTINO" -maxdepth 1 -type f \( -name 'db-*.dump' -o -name 'arquivos-*.tar.gz' \) \
    -mtime "+$RETENCAO" -print -delete
fi

ls -lh "$DESTINO/db-$CARIMBO.dump" "$DESTINO/arquivos-$CARIMBO.tar.gz"
echo "[backup] Concluído."
