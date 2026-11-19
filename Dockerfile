# syntax=docker/dockerfile:1.7
# Dono: onda de deploy (Docker/VPS). Guia: deploy/README.md.
#
# Imagem do site ArtZan (Next 15 + Payload 3 embarcado).
#
# ATENÇÃO — o `next build` NÃO roda aqui. Ele roda na subida do container
# (deploy/entrypoint.sh), porque o build consulta o Postgres (páginas estáticas
# e a guarda de placeholder 7.4) e o `docker build` não tem acesso ao serviço
# `db`. Por isso a imagem final carrega as dependências de desenvolvimento
# (TypeScript, Tailwind, ESLint): o build precisa delas.
#
# Base Debian slim (glibc), não Alpine: `sharp`, `@next/swc` e `@libsql` têm
# binários prontos para glibc no package-lock e dispensam compilação nativa.

ARG NODE_VERSION=22

# ---------------------------------------------------------------------------
# Estágio 1 — dependências (cache isolado do código-fonte)
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION}-bookworm-slim AS deps
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
# Inclui devDependencies de propósito (o build acontece em runtime).
RUN --mount=type=cache,target=/root/.npm \
    npm ci --include=dev --no-audit --no-fund

# ---------------------------------------------------------------------------
# Estágio 2 — imagem final
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION}-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    SOLICITACOES_DIR=/app/var/solicitacoes

# Diretórios persistentes criados com o dono certo ANTES de virarem volume:
# um volume nomeado vazio herda o dono do diretório da imagem na 1ª montagem.
RUN mkdir -p /app/midia /app/var/solicitacoes /app/.next/cache \
 && chown -R node:node /app

COPY --chown=node:node --from=deps /app/node_modules ./node_modules
COPY --chown=node:node . .

# Garante LF e bit de execução mesmo se o arquivo vier de um checkout Windows.
RUN sed -i 's/\r$//' deploy/entrypoint.sh && chmod 0755 deploy/entrypoint.sh

USER node

EXPOSE 3000

ENTRYPOINT ["/app/deploy/entrypoint.sh"]
