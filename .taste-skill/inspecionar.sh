#!/usr/bin/env bash
# Inspeção visual da etapa 1 com os scripts da skill design-taste-frontend.
# Uso: bash .taste-skill/inspecionar.sh <before|after> [base-url]
# Roda um Chrome headless por vez, em sequência.
set -u
FASE="${1:?fase}"
BASE="${2:-http://localhost:3001}"
RAIZ="/c/Users/user/OneDrive/Documents/ArtZan/LandingPage"
SKILL=".agents/skills/design-taste-frontend"
OUT=".taste-skill/$FASE"
CAT="softwares de gestão e esportivos para clubes, parques e pequenas e médias empresas"
PRI="Falar com a equipe"
cd "$RAIZ" || exit 1
mkdir -p "$OUT"

ROTAS="inicial:/ sobre:/sobre produtos:/produtos produto-lara:/produtos/sistema-lara produto-quadras:/produtos/alocacao-de-quadras contato:/contato obrigado:/obrigado privacidade:/privacidade termos:/termos 404:/rota-que-nao-existe"

for par in $ROTAS; do
  nome="${par%%:*}"; caminho="${par#*:}"; url="$BASE$caminho"
  echo "### $nome $url $(date +%T)"
  curl -s "$url" -o "$OUT/$nome.html"
  node "$SKILL/scripts/copy-lint.mjs" "$OUT/$nome.html" --kind software > "$OUT/copylint-$nome.txt" 2>&1
  node "$SKILL/assets/layout/check.mjs" --url "$url" --profile .taste-skill/chrome-check \
    --sizes 1440x900,1024x768,768x1024,390x844,320x640 --shots "$OUT/layout-$nome" > "$OUT/layout-$nome.txt" 2>&1
  for w in 1440 1024 768 390 320; do
    node "$SKILL/scripts/shoot.mjs" --url "$url" --w $w --out "$OUT/shots/$nome-$w.png" --profile .taste-skill/chrome-shoot --no-tiles > /dev/null 2>&1
  done
  node "$SKILL/scripts/perf.mjs" "$url" --profile .taste-skill/chrome-perf --runs 1 > "$OUT/perf-$nome.txt" 2>&1
  if [ "$nome" != "inicial" ] || [ ! -f "$OUT/consistency-inicial.txt" ]; then
    node "$SKILL/scripts/consistency.mjs" "$url" --widths 1440,1024,768,390,320 --profile .taste-skill/chrome-check \
      --page software --category "$CAT" --primary "$PRI" --out "$OUT/consistency-$nome" > "$OUT/consistency-$nome.txt" 2>&1
  fi
done
echo "### fim $(date +%T)"
