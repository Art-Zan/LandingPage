# Deploy em VPS com Docker

Guia para colocar o site ArtZan (Next 15 + Payload 3 + Postgres 16) numa VPS Linux, atrás do Caddy com HTTPS automático.

> **Estado:** estes arquivos foram escritos e revisados por leitura numa máquina Windows **sem Docker**. Nenhuma imagem foi construída e nenhum container foi executado. A primeira subida na VPS é também o primeiro teste real. Veja "O que ainda não foi verificado" no fim.

## Visão geral

```
Internet ──80/443──> caddy ──3000──> app (Next + Payload) ──5432──> db (Postgres 16)
                      │                │                              │
                 caddy-data       midia, solicitacoes,              pgdata
                 (certificados)   next-cache
```

| Serviço | Imagem | Porta exposta ao host | Volumes |
|---|---|---|---|
| `caddy` | `caddy:2-alpine` | 80, 443, 443/udp | `artzan_caddy_data`, `artzan_caddy_config` |
| `app` | construída do `Dockerfile` | nenhuma | `artzan_midia`, `artzan_solicitacoes`, `artzan_next_cache` |
| `db` | `postgres:16-alpine` | nenhuma | `artzan_pgdata` |

Arquivos:

| Arquivo | Papel |
|---|---|
| `Dockerfile` | Imagem do app. Node 22 (Debian slim), usuário `node`, dependências completas. |
| `.dockerignore` | Mantém fora da imagem os segredos, os leads, a mídia local e a documentação. |
| `docker-compose.prod.yml` | Os três serviços, com healthchecks, reinício automático e rotação de logs. |
| `deploy/entrypoint.sh` | Sequência de subida: espera o banco, aplica migrations, builda e inicia. |
| `deploy/migrar.ts` | Aplica as migrations do Payload e encerra (`npm run db:migrate`). |
| `deploy/caddy/Caddyfile` | Proxy reverso e TLS. |
| `deploy/caddy/sites/www.caddy.example` | Redirecionamento opcional de `www`. |
| `deploy/.env.production.example` | Modelo de todas as variáveis. |
| `deploy/backup.sh` | Backup do banco, da mídia e dos leads. |

O `docker-compose.yml` da raiz **não muda**: continua sendo só o Postgres de desenvolvimento.

## Por que o build roda na subida do container

Quase todo o site é gerado estaticamente, e o `next build` lê o banco. Antes dele, o `prebuild` executa a guarda de placeholder (dev/CONVENCOES.md §7.4), que também precisa do banco real. Dentro de um `docker build` não existe o serviço `db`.

Por isso o `next build` acontece no `entrypoint.sh`, a cada subida do container:

1. confere as variáveis obrigatórias (`PAYLOAD_SECRET` com 64 caracteres ou mais, `NEXT_PUBLIC_SITE_URL` em https) e a permissão de escrita nos volumes;
2. espera o Postgres aceitar conexão;
3. aplica as migrations pendentes;
4. roda `npm run build`. O npm executa o `prebuild` antes, com a guarda 7.4 e o contraste, e não há como pular essa etapa;
5. inicia `next start`.

Consequências:

- **Publicar conteúdo é reiniciar o app.** É o modelo "rebuild por publicação" já registrado no projeto (contradição 15). Comando: `dc restart app`.
- **As variáveis `NEXT_PUBLIC_*` são lidas no build.** Ao mudá-las no `.env.production`, recrie o app com `dc up -d app`.
- **O site fica fora do ar durante o build.** O Caddy responde 502 por alguns minutos.
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

Como root ou com `sudo`:

```bash
apt update && apt upgrade -y
apt install -y git ufw

# Docker Engine + plugin compose (script oficial)
curl -fsSL https://get.docker.com | sh

# Usuário de deploy sem root
adduser --disabled-password --gecos "" deploy
usermod -aG docker deploy

# Swap (obrigatório com 2 GB de RAM; recomendado sempre)
fallocate -l 4G /swapfile && chmod 600 /swapfile
mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

## 2. Firewall

Só SSH, HTTP e HTTPS:

```bash
ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 443/udp     # HTTP/3
ufw enable
```

O Docker publica portas por fora do `ufw`. Aqui isso não abre nada extra, porque só o `caddy` publica portas: `db` e `app` não têm `ports` no compose. **Não acrescente `ports` ao `db`.**

## 3. DNS

No provedor do domínio, crie um registro **A** (e **AAAA**, se a VPS tiver IPv6) de `SITE_DOMAIN` para o IP da VPS. Para usar `www`, crie também o registro de `www` e veja o passo 6.

Espere o DNS propagar **antes** da primeira subida. Confira com `dig +short <domínio>`. Sem isso o Let's Encrypt recusa o certificado, e tentativas repetidas esbarram no limite de emissão.

## 4. Copiar o projeto

Como o usuário `deploy`:

```bash
git clone <url-do-repositorio> ~/artzan
cd ~/artzan
```

Use o git, e não uma cópia da pasta do OneDrive. A cópia leva `node_modules`, `.next` e `var/` do Windows, e o OneDrive já corrompeu `.next` neste projeto. O `.gitattributes` garante LF em `deploy/*.sh`, e o `Dockerfile` remove CR do entrypoint por segurança.

## 5. Variáveis de ambiente

```bash
cp deploy/.env.production.example deploy/.env.production
chmod 600 deploy/.env.production
openssl rand -hex 32   # -> POSTGRES_PASSWORD
openssl rand -hex 48   # -> PAYLOAD_SECRET
nano deploy/.env.production
```

Obrigatórias: `SITE_DOMAIN`, `ACME_EMAIL`, `NEXT_PUBLIC_SITE_URL=https://<SITE_DOMAIN>`, `POSTGRES_PASSWORD` e `PAYLOAD_SECRET`. Mantenha `SITE_MODE=homolog` até o conteúdo real existir.

Para encurtar os comandos, defina um alias (acrescente ao `~/.bashrc`):

```bash
alias dc='docker compose --env-file deploy/.env.production -f docker-compose.prod.yml'
```

Todos os comandos abaixo usam `dc` e rodam na raiz do projeto.

## 6. Subir

```bash
dc up -d --build
dc logs -f app        # acompanhe: migrations -> prebuild -> next build -> "Iniciando o servidor"
dc ps                 # app fica "healthy" quando o build termina
```

Na primeira subida o banco está vazio. O entrypoint aplica a migration inicial (`src/migrations/`), e o build passa com o site sem conteúdo. Para popular a homologação, veja o passo 8.

Para ativar o redirecionamento de `www`:

```bash
cp deploy/caddy/sites/www.caddy.example deploy/caddy/sites/www.caddy
dc restart caddy
```

### Logs

```bash
dc logs -f app            # aplicação (build e execução)
dc logs -f caddy          # certificados e acessos
dc logs --tail=200 db
```

A rotação é automática: 5 arquivos de 10 MB por serviço.

## 7. Atualizar

**Código novo:**

```bash
git pull
dc up -d --build          # reconstrói a imagem; o app aplica migrations e rebuilda ao subir
```

**Conteúdo novo** (publicado no banco):

```bash
dc restart app
```

Com `BUILD_ON_START=if-missing`, o `restart` reaproveita o build anterior. Use essa opção só para reinícios sem mudança de conteúdo.

## 8. Seed de homologação (opcional, nunca automático)

O seed cria o administrador e o conteúdo provisório de `content/_PLACEHOLDER/`. Ele **recusa rodar com `SITE_MODE=producao`** e não recria nada se o conteúdo já existir.

1. Preencha `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` e `SEED_ADMIN_NOME` em `deploy/.env.production`.
2. Com o banco e o app já no ar (as migrations precisam ter rodado):

```bash
dc run --rm --no-deps --entrypoint npm app run seed
dc restart app            # rebuild para o conteúdo aparecer no site
```

## 9. Migrations (esquema do banco)

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
dc exec app npm run db:migrate:status
```

**Nunca rode `npm run dev` apontando para o banco da VPS.** Em modo de desenvolvimento o Payload faz `push` do esquema e marca o banco. Depois disso, o `migrate` pede confirmação interativa e, sem terminal, encerra sem aplicar nada.

## 10. Backup

```bash
sh deploy/backup.sh
```

O script gera em `deploy/backups/` (permissão 700):

- `db-<data>.dump`: `pg_dump` em formato custom;
- `arquivos-<data>.tar.gz`: os volumes de mídia **e de leads**.

O volume `artzan_solicitacoes` é a rede de segurança de RNF-092: todo lead é gravado ali antes de qualquer tentativa de envio. **Perder esse volume é perder leads.** Ele contém dado pessoal.

Agendamento diário (crontab do usuário `deploy`):

```cron
30 3 * * * cd /home/deploy/artzan && sh deploy/backup.sh >> deploy/backups/backup.log 2>&1
```

Backup só na própria VPS não protege contra a perda da VPS. Copie para fora, por canal cifrado:

```bash
# na sua máquina
scp -r deploy@<ip>:artzan/deploy/backups ./backups-artzan
```

A retenção local é de 14 dias (`BACKUP_RETENCAO_DIAS`).

### Restauração

```bash
dc stop app

# Banco
dc exec -T db sh -c 'pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists --no-owner' \
  < deploy/backups/db-<data>.dump

# Mídia e leads
docker run --rm \
  -v artzan_midia:/backup/midia -v artzan_solicitacoes:/backup/solicitacoes \
  -v "$PWD/deploy/backups":/in:ro \
  --entrypoint tar postgres:16-alpine xzf /in/arquivos-<data>.tar.gz -C /backup

# Dono dos arquivos restaurados = usuário do app
dc run --rm --no-deps --user root --entrypoint chown app -R node:node /app/midia /app/var/solicitacoes

dc start app
```

## 11. Passar para produção

Só depois que os insumos de 16.6 existirem e nenhum registro provisório estiver publicado:

1. `SITE_MODE=producao` em `deploy/.env.production`.
2. `dc up -d app` (recria o container com o novo ambiente).
3. `dc logs -f app`. Se a guarda 7.4 recusar o build, o log lista cada registro por coleção e id. Corrija no banco e rode `dc restart app`.

Em produção, o site passa a ser indexável. Em homologação, ele nunca é.

## Permissões dos volumes

O app roda como `node` (uid 1000). Na primeira montagem, os volumes nomeados herdam o dono da imagem. Se o entrypoint acusar falta de permissão de escrita (por exemplo, após uma restauração manual):

```bash
dc run --rm --no-deps --user root --entrypoint chown app -R node:node /app/midia /app/var/solicitacoes /app/.next/cache
```

## Problemas comuns

| Sintoma | Causa provável | O que fazer |
|---|---|---|
| `app` reinicia, com `Killed` ou `heap out of memory` no build | RAM insuficiente | Swap de 4 GB e `NODE_OPTIONS=--max-old-space-size=1536` |
| Caddy em loop de erro ACME | DNS ainda não aponta para a VPS, ou porta 80 fechada | Conferir `dig` e o `ufw`. Não reinicie em loop: há limite de emissão |
| 502 logo após `restart` | Build em andamento | Esperar e acompanhar `dc logs -f app` |
| `BUILD RECUSADO (dev/CONVENCOES.md §7.4)` | Placeholder publicado com `SITE_MODE=producao` | É a guarda funcionando. Despublique ou substitua os registros listados |
| `migrate` encerra sem aplicar nada | O banco foi tocado em modo dev (`push`) | Ver a seção 9. Restaurar de backup ou tratar manualmente |
| Formulário grava, mas o e-mail não sai | SMTP vazio | Preencher `SMTP_*`. Os leads continuam no volume `artzan_solicitacoes` |

## O que ainda não foi verificado

Nada disto foi executado em Docker. Na primeira subida, confira em especial:

- **`docker build`:** `npm ci` em Linux a partir do `package-lock.json` gerado no Windows. O lockfile traz os binários Linux de `sharp`, `@next/swc`, `@libsql` e `esbuild`, mas a instalação não foi testada.
- **Migration inicial contra Postgres real:** foi gerada sem banco, a partir das coleções. Nunca foi aplicada. Se falhar, o entrypoint para antes do build.
- **`deploy/migrar.ts` com Postgres no ar:** testado só contra banco inacessível, onde carrega a configuração e sai com código 1 como esperado.
- **Guarda 7.4 de ponta a ponta em Postgres:** pendência antiga do projeto, que a primeira subida em `producao` exercita.
- **Tempo de build, consumo de memória** e a emissão real de certificado pelo Caddy.
- **Healthchecks:** os de `app`, `db` e `caddy` foram escritos e nunca executados.
