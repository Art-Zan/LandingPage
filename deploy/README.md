# Deploy na VPS compartilhada

Guia para colocar o site ArtZan (Next 15 + Payload 3 + Postgres 16) na VPS compartilhada da ArtZan. O domínio é o raiz, `artzan.tech`, e `www.artzan.tech` redireciona para ele.

O HTTPS, os certificados e o proxy reverso são do **edge**, o Caddy único da VPS (`/srv/edge`). Este projeto não tem Caddy, não publica portas e cumpre o contrato descrito em `CLAUDE-arquitetura-vps.md` (no kit `vps-edge` da VPS). Aqui não se repete o que o kit já documenta: instalação do edge, comandos do script `site` e regras gerais ficam lá.

> **Estado:** estes arquivos foram revisados por leitura e validados com `site verificar`, numa máquina **sem acesso ao Docker Hub**. Nenhuma imagem do projeto foi construída e nenhum container foi executado. A primeira subida na VPS é também o primeiro teste real. Veja "O que ainda não foi verificado" no fim.

## Visão geral

```
Internet ──80/443──> edge (Caddy da VPS) ──rede "edge", alias artzan-app──> app :3000 (Next + Payload)
                                                                              │
                                                       rede "privada" (internal) ──5432──> db (Postgres 16)

volumes do projeto: artzan_pgdata, artzan_midia, artzan_solicitacoes, artzan_next_cache
```

| Serviço | Imagem | Redes | Porta exposta ao host | Volumes |
|---|---|---|---|---|
| `app` | `artzan/app` (construída do `Dockerfile`) | `edge` (alias `artzan-app`) e `privada` | nenhuma | `artzan_midia`, `artzan_solicitacoes`, `artzan_next_cache` |
| `db` | `postgres:16-alpine` | só `privada` (`internal: true`) | nenhuma | `artzan_pgdata` |

O `app` precisa de internet (SMTP, fontes, webhook de alerta). Como a rede `privada` é `internal`, essa saída vem da rede `edge`.

Arquivos:

| Arquivo | Papel |
|---|---|
| `Dockerfile` | Imagem do app. Node 22 (Debian slim), usuário `node`, dependências completas. |
| `.dockerignore` | Mantém fora da imagem os segredos (inclusive o `.env`), os leads, a mídia local e a documentação. |
| `docker-compose.prod.yml` | `app` e `db`, com healthchecks, reinício automático e rotação de logs. |
| `.env.production.example` | Modelo de todas as variáveis (raiz do projeto). O `.env` real nasce dele e nunca vai para o git. |
| `deploy/deploy.conf` | Lido pelo script `site`: slug, domínios, variáveis obrigatórias, segredos, saúde e backup. |
| `deploy/site.caddy` | Blocos de site que o edge importa: o site em `${SITE_DOMAIN}` e o redirecionamento de `${WWW_DOMAIN}`. |
| `deploy/entrypoint.sh` | Sequência de subida: espera o banco, aplica migrations, builda e inicia. |
| `deploy/migrar.ts` | Aplica as migrations do Payload e encerra (`npm run db:migrate`). |
| `deploy/backup.sh` | Backup do banco, da mídia e dos leads (agendado pelo `site` via `BACKUP_CMD`). |

O `docker-compose.yml` da raiz **não muda**: continua sendo só o Postgres de desenvolvimento.

Sobre cabeçalhos de segurança: o `site.caddy` **não** usa o snippet `import seguranca` do edge. O Next já envia `Strict-Transport-Security` (`next.config.ts`), e o projeto decidiu não duplicar o cabeçalho com valores diferentes.

## Por que o build roda na subida do container

Quase todo o site é gerado estaticamente, e o `next build` lê o banco. Antes dele, o `prebuild` executa a guarda de placeholder (dev/CONVENCOES.md §7.4), que também precisa do banco real. Dentro de um `docker build` não existe o serviço `db`.

Por isso o `next build` acontece no `entrypoint.sh`, a cada subida do container:

1. confere as variáveis obrigatórias (`PAYLOAD_SECRET` com 64 caracteres ou mais, `NEXT_PUBLIC_SITE_URL` em https) e a permissão de escrita nos volumes;
2. espera o Postgres aceitar conexão;
3. aplica as migrations pendentes;
4. roda `npm run build`. O npm executa o `prebuild` antes, com a guarda 7.4 e o contraste, e não há como pular essa etapa;
5. inicia `next start`.

Consequências:

- **Publicar conteúdo é reiniciar o app.** É o modelo "rebuild por publicação" já registrado no projeto (contradição 15). Comando: `docker compose restart app` (ou `site atualizar artzan`, que também puxa o código novo).
- **As variáveis `NEXT_PUBLIC_*` são lidas no build.** Ao mudá-las no `.env`, recrie o app com `docker compose up -d app`.
- **O site fica fora do ar durante o build.** O edge responde 502 por alguns minutos.
- **Em produção, um placeholder publicado impede a subida.** O build é recusado e o log lista cada registro. O container espera `ESPERA_APOS_FALHA_SEGUNDOS` (padrão 300 s) antes de sair, para o reinício automático não virar um laço de builds.

A alternativa, buildar a imagem com acesso de rede ao banco, exigiria expor o Postgres ao host durante o `docker build`. Também exigiria rebuildar a imagem a cada publicação e manter a guarda fora do fluxo do container. Por isso foi descartada.

## Requisitos da VPS

| Recurso | Mínimo | Recomendado |
|---|---|---|
| RAM | 2 GB **com 2–4 GB de swap** e `NODE_OPTIONS=--max-old-space-size=1536` | 4 GB |
| CPU | 1 vCPU (build lento, ~8–15 min) | 2 vCPU (build ~3–6 min) |
| Disco | 20 GB | 40 GB (imagem ~1,5 GB, cache do Next, backups locais) |
| Sistema | Ubuntu 22.04/24.04 ou Debian 12, x86_64 ou arm64 | |

Os números de tempo e memória são **estimativas**: o build nunca foi medido em container. O pico esperado do `next build` com Payload fica entre 1,5 e 3 GB.

## 1. Preparar a VPS

A VPS, o Docker, o firewall (UFW), o swap e o edge já são preparados pelo kit `vps-edge` (`setup-vps.sh` / README do kit). Não se repete aqui. Para este site, confira só:

- **Swap de 2–4 GB** presente (`swapon --show`), por causa do build na subida.
- **Rede `edge`** criada (`docker network create edge`, feito uma vez pelo kit) e o edge no ar (`site status`).
- **Firewall:** nada a abrir. O compose não publica portas, e o `db` e o `app` não têm `ports`. **Não acrescente `ports` ao `db`**: o Docker publica por fora do UFW.

## 2. DNS

Na Hostinger (hPanel, Domínios, `artzan.tech`, DNS), crie dois registros **A**, TTL 300, para o IP da VPS:

| Tipo | Nome | Valor |
|---|---|---|
| A | `@` | IP da VPS |
| A | `www` | IP da VPS |

**Não crie AAAA**: a VPS não usa IPv6 no Docker. Espere propagar **antes** do `site novo` (`dig +short artzan.tech` e `dig +short www.artzan.tech`). Sem DNS, o Let's Encrypt recusa o certificado, e tentativas repetidas esbarram no limite de emissão.

## 3. Registrar o site e subir

```bash
# Clona em /srv/sites/artzan, prepara o .env, publica o site.caddy no edge e sobe
site novo https://github.com/Art-Zan/LandingPage.git

# ou, se o repositório já estiver clonado:
site registrar /srv/sites/artzan
```

O script cria o `.env` da raiz a partir de `.env.production.example`, gera `POSTGRES_PASSWORD` e `PAYLOAD_SECRET` (`openssl rand -hex 32` = 64 caracteres, o mínimo que o entrypoint aceita) e pede o que faltar. Os valores padrão já são `SITE_DOMAIN=artzan.tech`, `WWW_DOMAIN=www.artzan.tech` e `NEXT_PUBLIC_SITE_URL=https://artzan.tech`. Mantenha `SITE_MODE=homolog` até o conteúdo real existir. Preencha também `SMTP_*`, `EMAIL_FROM_*`, `LEAD_INBOX_ADDRESS` e `ALERT_*` quando for testar o formulário.

**O `site novo` espera o app ficar `healthy`, o que pode levar até ~15 minutos**, porque o `next build` roda na subida do container (seção anterior). Não interrompa: o healthcheck do compose tem `start_period` de 15 min. Para acompanhar em outro terminal:

```bash
site logs artzan      # migrations -> prebuild -> next build -> "Iniciando o servidor"
```

Depois da subida, o `site` confere `https://artzan.tech/` direto no edge. Na primeira subida o banco está vazio: o entrypoint aplica a migration inicial (`src/migrations/`) e o build passa com o site sem conteúdo. Para popular a homologação, veja a seção 5.

Comandos do dia a dia (na pasta do projeto, `COMPOSE_FILE` já vem do `.env`, então não precisa de `-f` nem de alias):

```bash
cd /srv/sites/artzan
docker compose ps
docker compose logs -f app
docker compose logs --tail=200 db
```

A rotação de logs é automática: 3 arquivos de 10 MB por serviço. Os acessos HTTP ficam no log do edge (`site logs edge`).

## 4. Atualizar

**Código novo:**

```bash
site atualizar artzan     # git pull, republica o site.caddy, reconstrói a imagem e espera o app ficar healthy
```

Faz o equivalente a `git pull && docker compose up -d --build --wait`: o app aplica as migrations e rebuilda ao subir.

**Conteúdo novo** (publicado no banco):

```bash
docker compose restart app     # ou: site atualizar artzan
```

Com `BUILD_ON_START=if-missing`, o `restart` reaproveita o build anterior. Use essa opção só para reinícios sem mudança de conteúdo.

## 5. Seed de homologação (opcional, nunca automático)

O seed cria o administrador e o conteúdo provisório de `content/_PLACEHOLDER/`. Ele **recusa rodar com `SITE_MODE=producao`** e não recria nada se o conteúdo já existir.

1. Preencha `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` e `SEED_ADMIN_NOME` no `.env`.
2. Com o banco e o app já no ar (as migrations precisam ter rodado):

```bash
docker compose run --rm --no-deps --entrypoint npm app run seed
docker compose restart app            # rebuild para o conteúdo aparecer no site
```

## 6. Migrations (esquema do banco)

Com `NODE_ENV=production`, o Payload **não** cria tabelas sozinho (`push`). O esquema vem só das migrations em `src/migrations/`.

| Comando | Onde | O que faz |
|---|---|---|
| `npm run db:migrate` | container (automático no entrypoint) | Aplica as pendentes e encerra. |
| `npm run db:migrate:status` | container ou dev | Lista as aplicadas e as pendentes. |
| `npm run db:migrate:create <nome>` | máquina de desenvolvimento | Gera uma migration a partir das coleções. |

**Quando uma coleção mudar**, na máquina de desenvolvimento:

```bash
DB_ADAPTER=postgres DATABASE_URI=postgres://x:x@127.0.0.1:1/x npm run db:migrate:create nome-da-mudanca
```

Use Git Bash ou outro shell POSIX, porque o prefixo `VAR=valor comando` não funciona no PowerShell. O `migrate:create` **não conecta no banco**: ele compara as coleções com o snapshot `.json` da migration anterior. A URI acima é só um valor de preenchimento. Depois de gerar:

1. Remova `payload, req` da assinatura de `up`/`down` (deixe `({ db })`). O gerador os inclui sem uso, o ESLint do projeto acusa erro e **o `next build` falha**.
2. Versione os arquivos `.ts`, `.json` e `src/migrations/index.ts`.
3. Faça o deploy: o entrypoint aplica a migration na subida.

Para ver o estado no servidor:

```bash
docker compose exec app npm run db:migrate:status
```

**Nunca rode `npm run dev` apontando para o banco da VPS.** Em modo de desenvolvimento o Payload faz `push` do esquema e marca o banco. Depois disso, o `migrate` pede confirmação interativa e, sem terminal, encerra sem aplicar nada.

## 7. Backup

```bash
deploy/backup.sh          # de qualquer pasta; também funciona com `sh deploy/backup.sh`
```

O script gera em `deploy/backups/` (permissão 700):

- `db-<data>.dump`: `pg_dump` em formato custom;
- `arquivos-<data>.tar.gz`: os volumes de mídia **e de leads**.

O volume `artzan_solicitacoes` é a rede de segurança de RNF-092: todo lead é gravado ali antes de qualquer tentativa de envio. **Perder esse volume é perder leads.** Ele contém dado pessoal.

O agendamento é do script `site`: o `BACKUP_CMD="deploy/backup.sh"` do `deploy.conf` vira um cron do root, que entra na pasta do projeto antes de rodar (padrão: todo dia às 03:00; mude com `BACKUP_CRON` no `deploy.conf`; o log fica em `/var/log/site-artzan-backup.log`, e o cron em `/etc/cron.d/site-artzan`).

Backup só na própria VPS não protege contra a perda da VPS. Copie para fora, por canal cifrado:

```bash
# na sua máquina
scp -r root@<ip>:/srv/sites/artzan/deploy/backups ./backups-artzan
```

A retenção local é de 14 dias (`BACKUP_RETENCAO_DIAS`).

### Restauração

```bash
docker compose stop app

# Banco
docker compose exec -T db sh -c 'pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists --no-owner' \
  < deploy/backups/db-<data>.dump

# Mídia e leads
docker run --rm \
  -v artzan_midia:/backup/midia -v artzan_solicitacoes:/backup/solicitacoes \
  -v "$PWD/deploy/backups":/in:ro \
  --entrypoint tar postgres:16-alpine xzf /in/arquivos-<data>.tar.gz -C /backup

# Dono dos arquivos restaurados = usuário do app
docker compose run --rm --no-deps --user root --entrypoint chown app -R node:node /app/midia /app/var/solicitacoes

docker compose start app
```

## 8. Passar para produção

Só depois que os insumos de 16.6 existirem e nenhum registro provisório estiver publicado:

1. `SITE_MODE=producao` no `.env`.
2. `docker compose up -d app` (recria o container com o novo ambiente).
3. `docker compose logs -f app`. Se a guarda 7.4 recusar o build, o log lista cada registro por coleção e id. Corrija no banco e rode `docker compose restart app`.

Em produção, o site passa a ser indexável. Em homologação, ele nunca é.

## Permissões dos volumes

O app roda como `node` (uid 1000). Na primeira montagem, os volumes nomeados herdam o dono da imagem. Se o entrypoint acusar falta de permissão de escrita (por exemplo, após uma restauração manual):

```bash
docker compose run --rm --no-deps --user root --entrypoint chown app -R node:node /app/midia /app/var/solicitacoes /app/.next/cache
```

## Problemas comuns

| Sintoma | Causa provável | O que fazer |
|---|---|---|
| `app` reinicia, com `Killed` ou `heap out of memory` no build | RAM insuficiente | Swap de 4 GB e `NODE_OPTIONS=--max-old-space-size=1536` |
| Certificado não sai (erro ACME nos logs do edge) | DNS de `@` ou `www` ainda não aponta para a VPS, ou existe AAAA | Conferir `dig`, remover o AAAA e ver `site logs edge`. Não repita em loop: há limite de emissão |
| 502 logo após `restart` | Build em andamento | Esperar e acompanhar `docker compose logs -f app` |
| `BUILD RECUSADO (dev/CONVENCOES.md §7.4)` | Placeholder publicado com `SITE_MODE=producao` | É a guarda funcionando. Despublique ou substitua os registros listados |
| `migrate` encerra sem aplicar nada | O banco foi tocado em modo dev (`push`) | Ver a seção 6. Restaurar de backup ou tratar manualmente |
| Formulário grava, mas o e-mail não sai | SMTP vazio | Preencher `SMTP_*`. Os leads continuam no volume `artzan_solicitacoes` |

## O que ainda não foi verificado

Nada disto foi executado em Docker. Na primeira subida, confira em especial:

- **`docker build`:** `npm ci` em Linux a partir do `package-lock.json` gerado no Windows. O lockfile traz os binários Linux de `sharp`, `@next/swc`, `@libsql` e `esbuild`, mas a instalação não foi testada.
- **Migration inicial contra Postgres real:** foi gerada sem banco, a partir das coleções. Nunca foi aplicada. Se falhar, o entrypoint para antes do build.
- **`deploy/migrar.ts` com Postgres no ar:** testado só contra banco inacessível, onde carrega a configuração e sai com código 1 como esperado.
- **Guarda 7.4 de ponta a ponta em Postgres:** pendência antiga do projeto, que a primeira subida em `producao` exercita.
- **Tempo de build, consumo de memória** e a emissão real de certificado pelo edge para `artzan.tech` e `www.artzan.tech`.
- **Healthchecks:** os de `app` e `db` foram escritos e nunca executados. O do `app` consulta `/`, que renderiza a home inteira (barato o bastante a cada 30 s; o contrato aceita). Não há rota de saúde dedicada, porque `src/` não foi alterado nesta mudança.
- **`site novo`/`site atualizar` de ponta a ponta** com este projeto, e o cron de `deploy/backup.sh` (confira `/var/log/site-artzan-backup.log` no dia seguinte).
