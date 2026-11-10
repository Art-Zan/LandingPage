# Convenções de construção — site institucional ArtZan

Documento fixado pela **Onda 1**. Toda onda seguinte lê este arquivo **antes de escrever a primeira linha de código**.

Fonte de verdade do produto é `PRD.md`. Este documento não repete o PRD: ele fixa **como** construir, para que agentes trabalhando em paralelo não colidam e para que a entrega possa ser conferida contra o PRD depois.

**Contexto de escopo fixado antes desta onda:**

- Stack: Next.js 15 (App Router) + TypeScript estrito + Payload CMS 3 embarcado no mesmo projeto + PostgreSQL + Tailwind CSS.
- **D-11 = Alternativa C (duas etapas).** Etapa 1 = piso inegociável de 16.9 + reserva estrutural de inglês. Etapa 2 = painel administrativo (P-19..P-22) e avaliação gratuita (P-09).
- **O modelo de dados de 6.7 entra inteiro na etapa 1**, mesmo com a interface do painel adiada. Adiar o modelo criaria exatamente o retrabalho que 16.9 proíbe.

---

## 1. Como rodar

```bash
npm run db:up        # sobe o PostgreSQL de desenvolvimento (docker-compose.yml)
cp .env.example .env # preencher DATABASE_URI e PAYLOAD_SECRET
npm install
npm run dev
```

`npm run typecheck` e `npm run lint` precisam passar **antes** de qualquer onda declarar trabalho concluído. Não existe entrega com typecheck vermelho.

> **Estado conhecido do scaffold:** `npm run dev` ainda **não sobe**, porque `payload.config.ts` tem `collections: []` e `admin.user` aponta para uma coleção que só a Onda 2b cria. Isso é esperado e é o primeiro sinal de que a Onda 2b terminou: `npm run dev` passa a abrir.

---

## 2. Mapa de propriedade de arquivo por onda

Regra dura: **nenhum diretório tem dois donos**. Um agente escreve apenas nos caminhos de que é dono. Se precisar de algo fora do seu território, ele **relata ao maestro** e não edita.

| Caminho | Dono | Etapa | O que vive ali |
|---|---|---|---|
| `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `.prettierrc`, `.gitignore`, `docker-compose.yml`, `.env.example`, `postcss.config.mjs` | **Onda 1** | 1 | Configuração de projeto. Alteração por outra onda exige pedido ao maestro. |
| `tailwind.config.ts` | **Onda 1** (estrutura) / **Onda 2a** (só acrescentar tokens novos) | 1 | Nomes de token. **Nunca valores.** |
| `src/styles/**` | **Onda 2a** | 1 | `tokens.css` (valores de 11.12/11.14/11.15) e `globals.css`. Referência única de RNF-072. |
| `src/components/ui/**` | **Onda 2a** | 1 | Primitivos: botão, campo, card, tipografia, ícone, marca de placeholder. |
| `src/collections/**` | **Onda 2b** | 1 | Uma coleção por entidade de 6.7. |
| `src/payload.config.ts` | **Onda 1** (esqueleto) / **Onda 2b** (apenas a lista `collections`/`globals` e os imports correspondentes) | 1 | Nenhuma outra onda toca este arquivo. |
| `src/components/layout/**` | **Onda 3a** | 1 | Cabeçalho, rodapé, navegação, pular para o conteúdo. |
| `src/components/layout/Breadcrumb.tsx` | **Onda 3a** | 1 | Trilha de navegação compartilhada (13.5 regra 6). Criado pela Onda 3a; consumido pela primeira vez por P-04 na migração da Onda 4b (Tarefa 2), que substituiu a marcação inline provisória sem alterar comportamento. |
| `src/app/(site)/page.tsx`, `sobre/`, `produtos/page.tsx`, `produtos/[slug]/` | **Onda 3b** | 1 | P-01, P-02, P-03, P-04. |
| `src/app/(site)/parceiros/` | **Onda 4b** | 1 | P-07. Lacuna de partição da onda 3 (não tinha dono); fechada pela Onda 4b, Tarefa 1. Rota condicional — ver seção 4.1. |
| `src/app/(site)/contato/`, `obrigado/`, `privacidade/`, `termos/`, `src/app/api/**` | **Onda 3c** | 1 | P-08, P-16, P-13, P-14 e o recebimento de formulário. |
| `src/app/(site)/layout.tsx`, `not-found.tsx`, `sitemap.ts`, `robots.ts`, `opengraph-image` | **Onda 3a** | 1 | Shell, P-15 e SEO técnico de nível de site. |
| `src/components/catalogo/**` | **Onda 3b** | 1 | Renderização de conteúdo do Payload no site público: card de produto, texto rico, biblioteca de blocos institucionais. |
| `src/components/formulario/**` | **Onda 3c** | 1 | Campos e composição do formulário de contato (P-08). |
| `src/globals/**` | **Onda 2b** (`ConfiguracaoDoSite.textoPadraoDeContratacao`) / **Onda 4a** (grupo `identificacaoDaEmpresa`, acrescentado na Tarefa 2 para fechar a lacuna de modelo relatada pela Onda 3a — razão social, CNPJ, endereço de 16.6) | 1 | Configuração de site que não é entidade de 6.7 (RF-065, RF-028). |
| `src/lib/**` | **Onda 1** (base) — depois **uma onda por arquivo**, declarada no topo do arquivo | 1 | Utilidades. Ver regra de conflito abaixo. |
| `src/app/(payload)/**` | **Etapa 2** | 2 | Painel administrativo. Vazio na etapa 1. |
| `content/_PLACEHOLDER/**` | **Onda 4** | 1 | Conteúdo provisório. |
| `scripts/**` | **Onda 4** | 1 | Verificação de placeholder no build. |
| `dev/CONVENCOES.md` | **Onda 1** | — | Só o maestro autoriza alteração. |
| `PRD.md`, `Claude.md`, `PERGUNTAS-PENDENTES.md`, `PRD-v1-backup.md`, `prd-parts/`, `rev/`, `Logo.png` | **Ninguém.** Somente leitura para todo agente de desenvolvimento. | — | Documentação. |

**Regra de conflito em `src/lib/`.** É o único diretório com mais de um autor ao longo do tempo, e por isso o único com risco real de colisão. Mitigação: **um arquivo tem um dono só**, declarado na primeira linha (`// Dono: Onda 3a`). Ninguém edita arquivo de outra onda em `src/lib/`; cria um novo. Arquivos já reservados:

| Arquivo | Dono | Papel |
|---|---|---|
| `src/lib/env.ts` | Onda 1 | Leitura tipada de ambiente e `SITE_MODE`. Único ponto do código que lê `process.env` para configuração. |
| `src/lib/rotas.ts` | Onda 3a | Construção de **toda** URL interna. Ver seção 5. |
| `src/lib/auditoria.ts` | Onda 2b | Trilha de auditoria no nível de ação (RF-192, RNF-046, RF-186). |
| `src/lib/blocos-institucionais.ts` | Onda 2b | Biblioteca finita de blocos das páginas institucionais (RF-146, RF-140, RF-141). |
| `src/lib/campos-payload.ts` | Onda 2b | Fábricas de campo reutilizadas pelas coleções de 6.7. |
| `src/lib/seo-automatico.ts` | Onda 2b | Derivação de título/descrição de SEO a partir de nome e resumo (6.7). |
| `src/lib/slugs.ts` | Onda 2b | Slugs de coleção e regras de slug de conteúdo (6.5, PR-014, RNF-083). |
| `src/lib/validacao-publicacao.ts` | Onda 2b | Regras que só valem na transição para publicado. |
| `src/lib/consultas.ts` | Onda 3b | Único ponto de leitura do Payload pelo site público (`locale: 'pt-BR'` explícito). Acrescido pela Onda 4b (Tarefa 1) com `SLUG_DA_PAGINA_DE_PARCEIROS`, autorizado pelo maestro sem trocar o dono do arquivo. |
| `src/lib/identificacao-de-produto.ts` | Onda 3b | Identificação pública do produto sob PR-063 (nome aprovado × proposto). |
| `src/lib/rotulos.ts` | Onda 3b | Rótulos de interface fixados pelo PRD (14.1, 6.4, seções de template). |
| `src/lib/seo.ts` | Onda 3b | Título, descrição, canônico, dados estruturados. |
| `src/lib/alerta.ts` | Onda 3c | Alerta operacional de falha de formulário (RNF-092). |
| `src/lib/antispam.ts` | Onda 3c | Proteção contra spam do formulário de contato (14.6, camadas 1–6). |
| `src/lib/configuracao-contato.ts` | Onda 3c | Leitura tipada das variáveis de ambiente do fluxo de contato. |
| `src/lib/contato-contrato.ts` | Onda 3c | Contrato único do formulário de contato: campos, opções, validação, redação. |
| `src/lib/correio.ts` | Onda 3c | Envio de e-mail por SMTP. |
| `src/lib/registro-de-solicitacoes.ts` | Onda 3c | Registro durável de solicitações, gravado antes de qualquer tentativa de entrega (RNF-092). |
| `src/lib/token-de-formulario.ts` | Onda 3c | Token de origem do formulário (14.6, camada 3). |
| `src/lib/placeholder.ts` | Onda 4c | Detecção e marcação de registro provisório publicado. |

---

## 3. Nomenclatura

| Coisa | Convenção | Exemplo |
|---|---|---|
| Arquivo de rota | Convenção do App Router, minúsculas | `page.tsx`, `layout.tsx`, `not-found.tsx` |
| Segmento de rota | O **slug real em português**, minúsculo, com hífen | `produtos/[slug]/page.tsx` |
| Arquivo de componente React | `PascalCase.tsx`, um componente exportado por arquivo | `CartaoDeProduto.tsx` |
| Nome de componente React | `PascalCase`, **em português** | `CartaoDeProduto`, `BotaoPrimario` |
| Arquivo de coleção Payload | `PascalCase.ts`, nome da entidade no plural | `Produtos.ts`, `PaginasInstitucionais.ts` |
| `slug` de coleção Payload | minúsculo, plural, **sem acento**, em português | `produtos`, `paginas-institucionais`, `itens-de-conteudo` |
| Nome de campo Payload | `camelCase`, **sem acento**, em português | `resumoUmaLinha`, `problemaQueResolve`, `imagemDestaque` |
| Utilidade / função | `camelCase`, em português | `montarCaminho`, `ehPlaceholder` |
| Tipo / interface | `PascalCase` | `SiteMode`, `ProdutoResumo` |
| Constante de módulo | `SCREAMING_SNAKE_CASE` | `ADMIN_USER_SLUG`, `LOCALE_PADRAO` |
| Variável CSS de token | **prefixo `--az-`**, minúscula, com hífen, nomeada **por função** | `--az-acao-primaria`, `--az-texto-secundario` |
| Classe utilitária Tailwind de token | o nome do token sem o prefixo | `bg-superficie`, `text-texto-secundario`, `rounded-bloco` |

**Sem acento em identificador de código** (slug, nome de campo, nome de arquivo, nome de variável). Acento vive em **conteúdo**, nunca em identificador — evita divergência de codificação entre Windows, banco e URL.

**Token nomeado por função, nunca por cor.** `--az-acao-primaria`, jamais `--az-azul`. É o que torna a troca de tema (11.13) uma troca de coluna em vez de uma redecoração.

---

## 4. Rotas da etapa 1

Padrão canônico de 6.4. Domínio declarado `artzan.com.br`, sujeito a Q-002 — **nenhum código escreve o domínio literal**; ele vem de `NEXT_PUBLIC_SITE_URL`.

### 4.1 Construir na etapa 1

| Rota | Página | Arquivo | Indexável | Observação |
|---|---|---|---|---|
| `/` | P-01 Inicial | `(site)/page.tsx` | Sim | 9 seções fixas |
| `/sobre` | P-02 Sobre | `(site)/sobre/page.tsx` | Sim | Inclui o bloco do serviço de integrações (11.20), que **não é card de catálogo** |
| `/produtos` | P-03 Catálogo | `(site)/produtos/page.tsx` | Sim | **Grade simples.** Sem filtro, busca, ordenação, agrupamento ou paginação (RNF-082, 6.6) |
| `/produtos/[slug]` | P-04 Produto | `(site)/produtos/[slug]/page.tsx` | Sim | Template único (RNF-071). A URL **nunca** inclui a categoria |
| `/contato` | P-08 Contato | `(site)/contato/page.tsx` | Sim | Conversão ponta a ponta é piso inegociável |
| `/obrigado` | P-16 Confirmação | `(site)/obrigado/page.tsx` | **Não** | `noindex` obrigatório |
| `/privacidade` | P-13 | `(site)/privacidade/page.tsx` | Sim | Depende de texto jurídico que não existe (D-16). Placeholder até existir |
| `/termos` | P-14 | `(site)/termos/page.tsx` | Sim | Idem |
| (qualquer) | P-15 404 | `(site)/not-found.tsx` | **Não** | Caminhos de retorno em lista de links |

**Condicional — construída (Onda 4b).** `/parceiros` (P-07) em `src/app/(site)/parceiros/page.tsx`. Só existe se houver parceiro **com autorização de marca registrada** (PR-018, Q-025 / D-05). Cenário provável é ausência. A rota reaproveita a mesma `listarParceirosPublicados` (`src/lib/consultas.ts`) que `(site)/layout.tsx` já usa para o menu e o rodapé, e chama `notFound()` quando a lista vem vazia — **não é publicada nem entra no menu enquanto não houver ao menos um registro autorizado e publicado**, e a decisão é de dado, consultada em execução, nunca condição comentada no código.

### 4.2 Etapa 2 — não construir agora

| Rota | Página | Por quê |
|---|---|---|
| `/avaliacao-gratuita` | P-09 | Depende do ambiente de avaliação existir (D-17). Publicar a página sem o ambiente é pior do que não tê-la: o site receberia pedidos que ninguém atende em 2 dias úteis |
| Painel administrativo | P-19..P-22 | Endereço **não divulgado**, não indexável, não rastreável (RNF-110) |

O diretório `src/app/(payload)/` já existe e fica **vazio** na etapa 1. Nenhuma onda da etapa 1 escreve ali.

### 4.3 Futuro e Fase 2 — não construir, nem "só o esqueleto"

| Rota | Página | Classificação |
|---|---|---|
| `/solucoes` | P-05 | **Futuro** — nenhuma solução existe no lançamento (Q-006) |
| `/solucoes/[slug]` | P-06 | **Futuro** — idem |
| `/busca` | P-17 | **Futuro** — gatilho de 6.6 não atingido |
| `/conteudo` | P-10 | Fase 2 |
| `/conteudo/[slug]` | P-11 | Fase 2 |
| `/faq` | P-12 | Fase 2 |
| `/produtos/categoria/[slug]` | P-18 | Fase 2 — ativa junto com as categorias públicas |

**Atenção, e é a distinção que mais gera erro:** rota fora do escopo **não significa modelo fora do escopo**. As coleções `Solucoes`, `ItensDeConteudo` e `Categorias`, e os vínculos N:N entre elas, **entram inteiros na etapa 1** (6.7, RNF-082). O que fica de fora é a página, não a tabela. Uma solução cadastrada simplesmente não tem onde ser exibida ainda — e é assim que se pretende.

### 4.4 Slugs de produto

| Produto | Slug | Estado |
|---|---|---|
| Gestão geral de empresa | `sistema-lara` | Nome **confirmado** |
| Alocação de quadras | `alocacao-de-quadras` | **Provisório** — nome proposto Theo, a aprovar (Q-084 / D-12) |
| Scout para partidas esportivas | `scout-esportivo` | **Provisório** — nome proposto Iago |
| Placar esportivo | `placar-esportivo` | **Provisório** — nome proposto Nina |

Slug é **imutável após a primeira publicação** (PR-014). `sistema-lara` tem nome confirmado (Q-001, 6.4) e **pode ser publicado** — é ele que satisfaz o piso de 16.9, "ao menos um produto completo". Os **outros três** não podem ser publicados em produção enquanto D-12 não fechar: publicar congela um endereço provisório e obriga a redirecionamento permanente depois. Slugs são gerados a partir do nome e editáveis **apenas antes da primeira publicação**; conflito de slug **bloqueia a publicação** e exige resolução manual — nunca sufixo numérico automático (6.5).

Desenvolvimento de integrações **não é rota de catálogo**: sem slug, sem card, sem página. Aparece como bloco em `/sobre`, com ação própria de contato (P-04, 11.20).

---

## 5. Reserva de inglês, sem ativar o idioma

Requisito RNF-083 / Q-011. O ponto exato onde um segundo idioma entraria precisa estar reservado desde o lançamento, **sem que uma única palavra em inglês seja publicada ou indexada**.

Três camadas, e as três são obrigatórias.

### 5.1 Camada de rota

O português **não ganha prefixo**: `/produtos/sistema-lara` continua sendo o endereço publicado, e permanece assim quando o inglês for ligado. O inglês entra como prefixo `/en/...`.

A reserva é feita **por centralização, não por criação de rota**. Regras:

1. **Nenhum arquivo de rota é criado sob `/en` na etapa 1.** O endereço responde 404, que é o comportamento correto para um idioma que não existe.
2. **Nenhum template, componente ou metadado escreve um caminho literal.** Todo link interno, todo canônico e toda entrada do sitemap são construídos por `src/lib/rotas.ts` (Onda 3a), com assinatura no formato `montarCaminho(idioma, ...segmentos)`.
3. Esse construtor **já recebe o idioma como parâmetro na etapa 1** e emite prefixo vazio para `pt-BR`. Ligar o inglês depois é acrescentar um segmento dinâmico de rota e passar outro idioma — não é reescrever template nem endereço já publicado.
4. `/en` fica **reservado como segmento**: nenhuma outra rota, categoria, produto ou página institucional pode usar `en` como slug. Isso vale como regra de validação na coleção correspondente.

### 5.2 Camada de conteúdo

`src/payload.config.ts` já declara a localização com dois idiomas: `pt-BR` (padrão) e `en` (reservado). Regras:

1. Recebem valor localizado, em **todas** as entidades de 6.7: **nome, resumo, descrição e título/descrição de SEO**. Os demais campos não são localizados na etapa 1 — localizar tudo encarece o painel sem ganho.
2. **`fallback: false`.** Um campo em inglês vazio permanece vazio: **nunca herda o português**. Herança silenciosa é exatamente como conteúdo em português vazaria para uma página anunciada como inglesa.
3. O rótulo do idioma no painel diz `English (reservado — não publicado)`. É um lembrete de operação, não decoração.

### 5.3 O que garante que nada em inglês seja publicado ou indexado no MVP

Quatro travas independentes. Nenhuma depende de disciplina humana:

1. **Não há rota.** Sem arquivo sob `/en`, qualquer endereço em inglês retorna 404 — mesmo que o campo esteja preenchido no banco.
2. **A leitura é fixada no idioma padrão.** Toda consulta ao Payload feita pelo site público passa `locale: 'pt-BR'` explicitamente. Nenhuma consulta usa `locale: 'all'` fora do painel.
3. **O sitemap é gerado só a partir do idioma padrão** (RF-163), e **nenhum `hreflang` alternativo é emitido** enquanto o inglês estiver desligado. Anunciar alternativa que responde 404 é pior que não anunciar.
4. **O canônico (RF-161) sai do mesmo construtor de rotas**, com o idioma da página. Não existe caminho pelo qual um canônico aponte para um endereço em inglês na etapa 1.

Critério de aceite, verificável: preencher um campo em inglês em homologação e confirmar que ele **não aparece em nenhuma página, no sitemap, no canônico ou em qualquer metadado**, e que `/en/produtos/sistema-lara` responde 404.

---

## 6. Rastreabilidade obrigatória

Todo arquivo de **página**, **componente de conversão** e **coleção** carrega no topo um bloco de comentário citando os identificadores do PRD que implementa. É isso, e só isso, que permite validar a entrega contra o PRD depois — e conferir que nada foi implementado por conta própria.

Formato exato:

```ts
/**
 * P-04 — Página individual de software
 * Implementa: RF-060..070, RNF-070, RNF-071
 * Modelo: 6.7 (Produto)
 * Visual: 11.12, 11.14, 11.15 · Conversão: 14.1
 * Premissas: PR-004, PR-014
 * Perguntas abertas que afetam este arquivo: Q-005 (prints), Q-084 (nomes)
 * Dono: Onda 3b
 */
```

Regras:

- `Implementa:` lista apenas o que o arquivo **de fato** implementa. Citação decorativa é pior que ausência: cria falsa cobertura na conferência.
- `Perguntas abertas` existe para que a conferência final saiba onde olhar quando o cliente responder. **Se um arquivo depende de dado que não existe, a pergunta aberta é obrigatória.**
- Componentes puramente visuais (`src/components/ui/`) citam as seções de 11 que aplicam; não precisam de `RF-`.
- Arquivos de utilidade não precisam do bloco, mas precisam da linha `// Dono: Onda X`.

---

## 7. Contrato de placeholder

**Cinco insumos do lançamento não existem hoje** (16.6): capturas de tela reais, e-mail institucional, textos legais entregues, versões derivadas do logotipo e ambiente de avaliação. Construir esperando que apareçam é o caminho garantido para publicar um rascunho.

Contrato, em quatro partes. A **Onda 4 implementa**; as demais ondas apenas o respeitam.

### 7.1 Onde vive

Conteúdo provisório vive **apenas** em `content/_PLACEHOLDER/`. Nenhuma outra pasta, nenhum literal em componente, nenhum "texto de exemplo" solto em template. Um texto provisório dentro de um `.tsx` é indistinguível de conteúdo real na revisão, e é assim que rascunho vai ao ar.

### 7.2 Como é marcado no dado

Toda entidade de 6.7 recebe um campo booleano `placeholder`, padrão `false`, visível no painel com descrição explícita. Marcar `placeholder: true` declara: *este registro contém texto ou imagem provisória e não representa o negócio real*.

### 7.3 O que acontece em homologação

Com `SITE_MODE=homolog`, todo campo ou registro com `placeholder: true` é **marcado visualmente** — etiqueta persistente, legível, com contraste próprio, impossível de confundir com conteúdo real. A marca é um primitivo de `src/components/ui/` (Onda 2a), usado pela Onda 4. Homologação inteira é declarada não indexável (RF-164).

### 7.4 O que acontece em produção — a trava

Com `SITE_MODE=producao`:

1. **O build falha** se existir qualquer registro com `placeholder: true` **e** estado publicado. A verificação roda em `prebuild`, consulta o banco, e sai com código diferente de zero **listando cada registro ofensor por coleção e identificador**. Falha silenciosa não serve: quem quebrou o build precisa saber o que corrigir sem investigar.
2. **A publicação é recusada na origem:** um `beforeChange` na coleção impede mudar um registro placeholder para publicado em produção. A trava de build é a rede de segurança; esta é a porta.

Consequência aceita e desejada: **enquanto os cinco insumos de 16.6 não existirem, o site não sobe em produção.** Isso não é defeito da implementação — é o requisito. O PRD é explícito: a data é definida pelo conteúdo, não pelo código.

---

## 8. O que nenhum agente pode fazer

Lista fechada. Violação aqui invalida a entrega da onda, independentemente da qualidade do resto.

1. **Inventar dado de negócio.** Nenhum número, prazo em dias, preço, faixa de preço, quantidade de clientes, nome de cliente, depoimento, caso de sucesso, percentual, métrica de resultado, ano de fundação, tamanho de equipe ou número de telefone. Se o dado não está no PRD ou no cadastro, ele **não existe** — vira placeholder marcado ou pergunta ao maestro. Nunca um valor plausível.
2. **Publicar afirmação não verificável.** "Líder de mercado", "referência no setor", "milhares de usuários", "o mais completo". A empresa não tem prova social hoje (Q-021); a única promessa verificável é a avaliação gratuita (Q-022) — e ela está na etapa 2.
3. **Usar nome de produto não aprovado como identificação principal.** Apenas **Sistema Lara** está confirmado. Os outros três são identificados **pela descrição funcional** — "alocação de quadras", "scout para partidas esportivas", "placar esportivo" — com o nome proposto (Theo, Iago, Nina) apenas como complemento explicitamente marcado como a aprovar (Q-084 / D-12). Título de página, `<h1>`, item de menu e rótulo de card usam a descrição funcional.
4. **Alterar documentação.** `PRD.md`, `Claude.md`, `PERGUNTAS-PENDENTES.md`, `PRD-v1-backup.md`, `prd-parts/`, `rev/` e `Logo.png` são somente leitura para todo agente de desenvolvimento. Divergência entre PRD e implementação vira relato ao maestro, nunca edição do PRD.
5. **Escrever valor visual fora de `src/styles/tokens.css`** (RNF-072). Nenhum hexadecimal, `rgb()`, tamanho de fonte literal, raio ou espessura de borda em componente, template ou `tailwind.config.ts`. Um valor solto quebra o tema escuro e a tabela de contraste ao mesmo tempo.
6. **Escrever texto de negócio fixo em código** (RNF-074). Nome de produto, solução ou parceiro vem sempre do registro. Remover um registro não pode deixar vestígio de texto no código.
7. **Escrever em diretório de outra onda.** Ver seção 2.
8. **Colocar segredo em código entregue ao navegador** (RNF-045). Nenhuma chave, token ou credencial. Chamada que exija segredo é sempre intermediada pelo servidor. Só variável com prefixo `NEXT_PUBLIC_` chega ao navegador, e ela nunca é secreta.
9. **Alterar a paleta "para ficar mais bonita".** Os valores de 11.12 passaram por verificação de contraste par a par, e três deles foram corrigidos justamente por reprovarem. O azul aprovado é o valor exato, não "um azul parecido": azuis levemente mais claros testados caem de 5,87:1 para cerca de 3,7:1 e reprovam. Qualquer alteração de cor exige refazer a conta antes de entrar em texto, ícone ou rótulo.
10. **Ligar filtro, busca, ordenação, agrupamento ou paginação no catálogo.** Quatro produtos ficam abaixo de **todos** os gatilhos de 6.6. O mecanismo existe no modelo (RNF-082); ligado, ele mente sobre o tamanho do portfólio.

---

## 9. Acessibilidade e responsividade — critério de aceite de todo componente

Não é etapa final nem revisão de fim de projeto: é **sobretaxa embutida em cada bloco**. Nenhum componente é dado por pronto sem estes itens, o painel administrativo inclusive.

**Acessibilidade — nível AA (10.3, 13.x):**

- Contraste mínimo **4,5:1** para texto normal e **3:1** para texto grande e elemento de interface, **nos dois temas**. Os pares de 11.12 já estão verificados; qualquer combinação nova é verificada antes de entrar.
- **Foco visível sempre**, em todo elemento interativo, com contraste próprio de ao menos 3:1 contra o que está ao redor. Remover contorno de foco é proibido, mesmo "temporariamente".
- **Navegação completa por teclado**, na ordem visual, sem armadilha de foco. Todo diálogo, menu e sobreposição devolve o foco ao elemento que o abriu.
- **HTML semântico**: um `<h1>` por página, hierarquia de título sem salto de nível, marcos de página (`header`, `nav`, `main`, `footer`), link "pular para o conteúdo" como primeiro elemento focável.
- **Texto alternativo obrigatório** em toda imagem de conteúdo; imagem decorativa recebe alternativo vazio.
- **Formulário**: rótulo visível associado ao campo (nunca só *placeholder*), erro descrito em texto **e** associado programaticamente ao campo, erro nunca comunicado apenas por cor.
- **Alvo de toque mínimo de 44×44 px.**
- **Respeitar `prefers-reduced-motion`**: movimento não essencial é desligado.
- **Nada depende só de cor** para transmitir estado ou significado.
- **Caixa alta proibida em bloco de texto**; espaçamento de letra só em elemento curto em caixa alta (+4%).

**Responsividade — mobile-first (10.1):**

- Construir a partir da tela pequena e ampliar. **Nunca** desenhar para desktop e espremer depois.
- Largura de referência mínima: **360 px**, sem rolagem horizontal em nenhuma página.
- **Corpo de texto de 16 px é piso absoluto**, sem exceção — inclusive em campo de formulário, onde texto menor provoca zoom automático em navegador móvel justamente na única conversão do site.
- Espaçamento na escala de 8 px (8/16/24/32/48/64/96): preenchimento interno de card de 16 px em tela pequena e 24 px em tela grande; 64 px entre seções.
- Dois raios de canto, e apenas dois: 4 px em controle pequeno, 8 px em card, container e imagem. Espessura de borda única de 1 px.
- **Sombra difusa, gradiente fora do logotipo e qualquer efeito de profundidade são proibidos** (11.15). Elevação se resolve com `superficie-elevada` + `borda`.
- Imagem abaixo da dobra é carregada sob demanda; a imagem principal da primeira tela **nunca** é diferida.
- Orçamento por página (RNF-011): 1.200 KB na inicial, 1.000 KB em produto, 600 KB em institucional e legal; máximo de 50 requisições e 150 KB de script. No máximo 2 famílias e 4 arquivos de fonte, somando até 150 KB, com texto legível antes do carregamento da fonte (RNF-014).

**Definição de pronto, por componente:** typecheck e lint limpos · bloco de rastreabilidade no topo · nenhum valor visual fora dos tokens · nenhum dado de negócio fixo · navegável por teclado com foco visível · legível a 360 px · contraste verificado nos dois temas.
