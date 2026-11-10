Claude Opus atua apenas como maestro: lê o contexto, planeja, decompõe o trabalho, despacha subagentes, valida os resultados, mantém este arquivo e coordena os índices.
O maestro não redige PRD, arquitetura, código, testes ou tarefas diretamente. Todo trabalho substantivo é delegado a subagentes.
Exceções permitidas ao maestro: editar este Claude.md, registrar decisões de orquestração, copiar scripts de workflow para o scratchpad e responder ao usuário ou em tarefas que após 2x testes não foram concluídas com perfeição.
Testes devem ser executados apenas quando solicitados. Apenas testes prioritários devem ser feitos durante uma implementação.
---

## Índice de entregáveis

- `PRD.md` — PRD do site institucional. Documento de referência para design e desenvolvimento. **Versão 2.0**, revisada com as respostas do cliente. Aguarda a decisão de prazo (D-11).
- `PRD-v1-backup.md` — versão 1.0, anterior às respostas. Histórico; não usar como referência.
- `Logo.png` — logotipo oficial da ArtZan. Origem da paleta e do sistema visual da seção 11.
- `rev/` — arquivos de revisão da v2.0. Não são entregáveis.
- `PERGUNTAS-PENDENTES.md` — as 69 perguntas em aberto do PRD, compiladas como formulário para o cliente responder. Bloco 1 bloqueia o início do design. Derivado de `PRD.md`: se uma pergunta for respondida, atualizar também a premissa correspondente na seção 18.2 do PRD.
- `prd-parts/` — arquivos intermediários da redação. Não são entregáveis; `PRD.md` é a fonte de verdade. Alterações devem ser feitas em `PRD.md`.

## Log de orquestração

### 2026-09-07 — Elaboração do PRD do site institucional

Trabalho decomposto em quatro ondas, todas delegadas a subagentes.

| Onda | Escopo | Saída |
|---|---|---|
| 1 | Seções 1–8: resumo, visão, objetivos, público, proposta de valor, arquitetura de informação, páginas, jornadas | `prd-parts/01-fundacao.md` |
| 2a | Seções 9–10: requisitos funcionais e não funcionais | `prd-parts/02-requisitos.md` + `02b-cont.md` |
| 2b | Seções 11–15: conteúdo e marca, SEO, acessibilidade, conversão, métricas | `prd-parts/03-experiencia.md` |
| 3 | Seções 16–21: escopo do MVP, roadmap, riscos, critérios de aceite, perguntas, síntese | `prd-parts/04-escopo.md` |
| 4 | Reconciliação, sumário e limpeza | edições diretas em `PRD.md` |

Decisões de orquestração registradas:

- Convenções compartilhadas fixadas antes da primeira onda em `prd-parts/00-briefing.md`: placeholders `[EMPRESA]` e `[dominio]`, rótulos de prioridade `MVP` / `Fase 2` / `Futuro`, e faixas de identificadores por agente para evitar colisão de numeração entre ondas paralelas.
- Onda 2 executada em paralelo. A onda 2a foi interrompida por limite de sessão do Opus e retomada com Fable a partir de RNF-028, preservando o conteúdo já gravado.
- O paralelismo entre as ondas 2a e 3 gerou uma inconsistência prevista: a consolidação de premissas e perguntas foi escrita antes da criação de PR-027..035 e Q-037..047. Corrigida na onda 4.
- Nenhum dado de negócio foi inventado. Toda lacuna virou premissa `PR-xxx` ou pergunta `Q-xxx`, ambas consolidadas nas seções 18.2 e 20.

### Estado do PRD

56 premissas, 70 perguntas de validação, 109 requisitos funcionais, 82 requisitos não funcionais, 14 riscos, 10 decisões pendentes, 35 critérios gerais de aceite.

Próxima etapa quando o cliente responder as perguntas da seção 20: revisar as premissas afetadas, fechar as decisões `D-01..D-10` e só então iniciar design e desenvolvimento.

### 2026-09-07 (tarde) — Revisão do PRD para a versão 2.0

O cliente respondeu as 69 perguntas em `PERGUNTAS-PENDENTES.md`. O PRD foi revisado para refletir o negócio real.

| Onda | Escopo | Modelo |
|---|---|---|
| A | Sistema visual derivado do `Logo.png` e proposta de nomes de produto | Fable |
| B | Revisão das seções 1–8 e 9–10, em paralelo | Fable |
| C | Revisão das seções 11–15 e 16–21, em paralelo | Opus |
| D | Reconciliação da tabela de premissas e do sumário | Haiku |

Decisões de orquestração:

- O PRD foi dividido em quatro arquivos sob `rev/` para que os revisores trabalhassem em paralelo sem conflito de escrita no mesmo arquivo. A versão 1.0 ficou preservada em `PRD-v1-backup.md`.
- As respostas do cliente foram consolidadas em `prd-parts/10-respostas.md` antes de qualquer revisão, para que nenhum revisor precisasse reler o formulário.
- Limites de sessão interromperam revisores três vezes. Em todos os casos o conteúdo gravado foi preservado e o trabalho retomado com outro modelo, sem reiniciar do zero.
- O paralelismo voltou a gerar a mesma classe de inconsistência da v1: premissas criadas depois da montagem da tabela consolidada. Corrigido na onda D.

### Mudanças de escopo introduzidas pelas respostas

- **Entrou:** painel de administração operado pelos dois sócios; fluxo de avaliação gratuita em ambiente próprio; canais WhatsApp e e-mail; preparação estrutural para inglês.
- **Saiu do MVP:** páginas de solução composta, reclassificadas para Futuro, porque não haverá solução no lançamento. Filtro, busca, ordenação e paginação seguem desligados: quatro produtos ficam abaixo de todos os gatilhos.
- **Conflito aberto:** a data alvo declarada é setembro de 2026 e o escopo cresceu. A decisão D-11 entre cortar escopo e mover a data está com o cliente.

### Estado do PRD v2.0

118 requisitos funcionais, 86 não funcionais, 67 premissas, 22 riscos, 17 decisões, 48 critérios de aceite. 91 identificadores de pergunta, dos quais os abertos estão listados na seção 20.

Próxima etapa: decisão de prazo (D-11), aprovação dos nomes de produto e destrave dos cinco insumos que só o cliente produz.

### 2026-09-07 (noite) — Início da implementação

Três decisões tomadas pelo cliente antes de qualquer construção. As duas primeiras estavam registradas como pendentes no PRD; a terceira o PRD deliberadamente não decidia.

| Decisão | Escolha | Origem |
|---|---|---|
| Stack técnica | Next.js 15 (App Router) + TypeScript + Payload CMS 3 embarcado + PostgreSQL + Tailwind | Fora do PRD, que não define tecnologia |
| **D-11** — prazo vs. escopo | **Alternativa C — duas etapas.** Etapa 1: piso inegociável de 16.9 + reserva estrutural de inglês. Etapa 2: painel P-19..P-22 e avaliação gratuita P-09 | PRD 16.9, recomendação acatada |
| Insumos de conteúdo inexistentes | Placeholders explicitamente marcados, impossíveis de publicar por engano; substituição posterior pelo conteúdo real | 16.6 — cinco itens não existem em nenhuma forma |

Consequência de D-11=C sobre o que se constrói agora: o **modelo de conteúdo de 6.7 entra inteiro na etapa 1**, ainda que a interface do painel fique para a etapa 2. É a segunda condição que o PRD impõe à Alternativa C — enquanto o painel não existir, nenhuma publicação é feita fora do modelo de dados. Payload atende as duas etapas com o mesmo esquema: a etapa 1 usa o modelo, a etapa 2 libera a interface.

Três cortes vetados pelo PRD e mantidos na etapa 1, mesmo não sendo piso: reserva estrutural de inglês, validação de publicação com imagem obrigatória e alerta de falha de envio.

#### Ondas planejadas

| Onda | Escopo | Paralelismo |
|---|---|---|
| 1 | Scaffold, configuração e fixação das convenções em `dev/CONVENCOES.md` | Sequencial — bloqueia todas as demais |
| 2a | Sistema de design: tokens de 11.12, tipografia de 11.14, primitivos de interface | Paralela a 2b |
| 2b | Modelo de conteúdo de 6.7 em Payload: entidades, relações N:N, regras de slug de 6.5, publicação | Paralela a 2a |
| 3a | Shell público: layout, cabeçalho, rodapé, 404, tema, SEO técnico, reserva `/en/` | Paralela a 3b, 3c |
| 3b | Páginas P-01, P-02, P-03, P-04 | Paralela a 3a, 3c |
| 3c | Conversão: P-08, P-16, legais P-13/P-14, envio, alerta de falha, extensão de captcha | Paralela a 3a, 3b |
| 4 | Seed de placeholders, guarda de build e reconciliação | Sequencial |

Partição por propriedade de arquivo entre agentes paralelos, para não repetir a classe de conflito das ondas do PRD: cada agente escreve apenas dentro dos diretórios que lhe são atribuídos, e nenhum diretório tem dois donos.

#### Índice de entregáveis de código

- `dev/CONVENCOES.md` — convenções fixadas na onda 1. Leitura obrigatória de todo agente das ondas seguintes.

#### Onda 1 — concluída

Scaffold criado e compilando. `dev/CONVENCOES.md` é o contrato de leitura obrigatória das ondas seguintes.

Versões resolvidas: Next **15.4.11**, Payload 3.88.0, React 19.2.8, Tailwind 3.4.19, TypeScript 5.9.3.

Achados que exigiram decisão do maestro:

- **Next travado em 15.4.11.** Payload 3.88 rejeita a faixa 15.5.x por peer dependency. Não é defeito do scaffold, é a matriz de compatibilidade do Payload. **Registrar como risco de manutenção**: atualização de Next fica presa até o Payload liberar a faixa.
- **CSP não implementada.** Depende de duas coisas que ainda não existem: a lista final de origens de terceiro (D-08, ferramenta de medição) e o painel Payload, que precisa de diretivas mais permissivas que o site público. Os demais cabeçalhos de segurança estão ativos. **Atribuída a uma onda de deploy e hardening**, posterior à onda 4 e dependente de D-08 e D-15.
- **Correção aplicada pelo maestro em `dev/CONVENCOES.md`:** o agente escreveu que D-12 impede a publicação dos quatro produtos. É mais forte que o PRD. `sistema-lara` tem nome confirmado (Q-001, 6.4) e é justamente ele que satisfaz o piso de 16.9 — "ao menos um produto completo". Só os outros três dependem de D-12. O piso de lançamento não está bloqueado por D-12; segue bloqueado pelos prints (Q-005).
- **Correção aplicada pelo maestro:** `src/app/(site)/` tinha dono único (3b), mas a onda 3c também escreve rotas ali. Partição refeita por rota, não por diretório, para preservar a regra de nenhum diretório com dois donos.

Convenções relevantes fixadas pela onda 1: `localization` com `pt-BR` e `en` e **`fallback: false`**, de modo que campo em inglês vazio nunca herde o português; reserva de idioma por centralização de construção de URL, não por diretório de rota; `SITE_MODE` ausente cai em `homolog`, porque tratar homologação como produção publicaria placeholder; Postgres de desenvolvimento na porta 5433.

#### Onda 2a — concluída

Sistema de design derivado da seção 11. `src/styles/tokens.css` é a referência única; `src/components/ui/` traz dez primitivos, todos de servidor exceto a galeria de revisão.

**Contraste verificado por medição, não por confiança.** O agente escreveu `src/styles/verificar-contraste.mjs`, que lê os hexadecimais do próprio `tokens.css` — não uma cópia — e recalcula a tabela de 11.12 pela fórmula WCAG 2.x. Reexecutado pelo maestro: 15 pares, todos aprovados, zero divergência. Os quatro pares que 11.12 marca "—" no tema oposto ocorrem na tela e foram medidos mesmo assim. Auditoria confirma zero hexadecimais fora de `tokens.css`.

Escolhas declaradas como escolha, todas trocáveis por um token: Space Grotesk e Inter conforme 11.14, com pilha de alternativa de sistema; escala tipográfica na ponta baixa em mobile; largura de linha 68ch; proporção de captura 16/10; indicador de foco no tom de texto principal, para que o par medido seja sempre contorno × superfície e o contorno nunca encoste no azul.

PR-062 respeitada por construção: o azul é exclusivo da ação primária, a secundária usa o texto principal em rótulo e contorno. A sombra de sobreposição existe como token isolado, mas não foi registrada no Tailwind — usá-la exige escrever o nome da variável, o que torna a violação visível em revisão.

**Herda para a onda 3a** (dona do layout raiz): criar a rota da galeria em `src/app/(dev)/revisao/primitivos/`, fora do grupo `(site)`, não indexada, fora do sitemap e inexistente em produção; hospedar os arquivos de fonte respeitando o teto de RNF-014; importar apenas `@/styles/globals.css`; redefinir `--az-deslocamento-rolagem` se houver cabeçalho fixo.

**Pendente do maestro:** acrescentar ao `package.json` o script `verificar:contraste`, para que a verificação vire portão de build. Adiado até a onda 2b terminar, porque `package.json` é território da onda 1 e não se escreve em arquivo alheio com agente em execução.

#### Contradições do PRD levantadas pela onda 2a

Registradas aqui, não corrigidas — correção de PRD é trabalho a delegar, não do maestro.

| # | Contradição | Encaminhamento |
|---|---|---|
| 1 | 13.8 exige refluxo a 320 px; 10.1 declara largura de referência mínima de 360 px | Piso real é 320 px, foi o implementado. Fixar explicitamente, senão 360 vira o único valor testado |
| 2 | 11.15 proíbe sombra e, quatro linhas depois, exige "uma única sombra padrão" para camadas sobrepostas | A exceção é real e nomeada; o texto da proibição precisa ressalvá-la |
| 3 | **11.17 exige "mesma proporção" para toda captura sem dizer qual** | Requisito de uniformidade sem valor não é verificável. 16/10 escolhido e declarado. **Precisa entrar no PRD antes da primeira captura existir**, senão a primeira captura produzida vira o padrão por acidente. Q-081 aprova enquadramento, não proporção |
| 4 | 13.9 fixa alvo de 44 px; 11.14 permite rótulo de botão de 14 px | Não conflita, mas fica no limite. Rótulo adotado em 16 px, topo da mesma faixa |

#### Onda 2b — concluída

Modelo de conteúdo de 6.7 implementado em Payload: dez coleções e um global. Campos localizados exatamente onde 6.7 manda — nome/título, resumo, descrição e título/descrição de SEO — e em nenhum outro lugar.

Três entidades existem **além** de 6.7, cada uma por exigência explícita de requisito, e todas nascem vazias: `TiposDeParceria` (RF-102 manda acrescentar tipo sem alterar código, o que um campo de seleção fixo não atende), `RegistrosDeAuditoria` (RF-192, que 6.7 não modela) e o global `ConfiguracaoDoSite` (RF-065: o texto de contratação é definido uma vez e não é editável por produto; sem esse lugar a onda 3b só teria a opção proibida de escrevê-lo no template).

**As cinco travas do PRD são mecânicas, não convenções.** O vínculo derivado produto→solução é campo `join` virtual: não tem coluna e não aparece em nenhum caminho de escrita, então escrevê-lo é impossível, não desaconselhado. O piso de PR-057 é validado no `beforeChange` apenas na transição para publicado, medindo sobre o documento já mesclado — gravação parcial não simula pendência — e recusa listando todas as pendências de uma vez (RF-193). Parceiro sem autorização de marca é barrado por duas travas independentes, uma delas ativa também por API. Slug fecha para edição quando existe data de publicação, por acesso de campo e por hook. Não existe código capaz de gerar sufixo numérico: conflito recusa com 409 e exige resolução manual.

Decisões do agente acatadas pelo maestro:

- `ItensDeConteudo` em vez de `Conteudos` — duas fontes internas contra uma.
- **RF-182 contra PR-003.** RF-182 pede vínculo editável dos dois lados com o mesmo efeito; PR-003 e RF-066 declaram o lado do produto derivado, nunca digitado. Não podem valer ao mesmo tempo. Seguiu PR-003, que o próprio PRD chama de decisão estrutural central. Entrega "visível dos dois lados, gravado por um".
- SEO automático **resolvido na leitura, não gravado**: gravar o valor derivado congelaria o texto quando o nome mudasse. Campo vazio significa automático. A onda 3b deve chamar `tituloSeoDe`/`descricaoSeoDe`, nunca ler os campos crus.
- Sem campo próprio de data de atualização: é o `updatedAt` do Payload. Campo duplicado divergiria.
- Constantes de `payload.config.ts` não puderam ser importadas nas coleções — fecha ciclo de importação e lança `ReferenceError` por TDZ em ESM. Slugs espelhados em `src/lib/slugs.ts`.

#### Estado de verificação da onda 2b

| Passo | Resultado real |
|---|---|
| `generate:types` | Falhou por defeito do scaffold, não do modelo. Causa comprovada e isolada; correção de uma linha em `package.json`, despachada ao agente da onda 1 |
| `typecheck` / `lint` | Passam, zero erro e zero aviso |
| `docker compose up` | **Impossível: não há Docker nesta máquina.** Nada foi simulado |
| `npm run dev` | Sobe em 2,6 s. O agente registrou que isso prova pouco enquanto não houver rota pública |
| Prova substituta | `getPayload({ config })` sanitiza a configuração inteira e avança até o adaptador, morrendo em `ECONNREFUSED` na porta 5433 — o banco ausente, não erro de coleção, campo ou relação |

#### Lacunas e perguntas abertas pela onda 2b

- **Não há banco de dados nesta máquina.** Sem Docker, sem Postgres local, sem WSL. Nenhuma verificação ponta a ponta é possível até isso mudar. Liga-se a **D-15** (hospedagem), ainda aberta.
- **Biblioteca de blocos institucionais não é enumerada pelo PRD.** RF-146 exige biblioteca finita e não lista os blocos. O agente definiu quatro — texto, lista, imagem e chamada — o mínimo que cobre P-02, P-13 e P-14. É decisão de produto embutida numa lacuna do PRD e **precisa de confirmação**.
- **RF-083, cascata reversa não implementada:** despublicar produto que deixe uma solução com menos de dois produtos deveria marcá-la pendente de revisão. Exigiria campo que 6.7 não prevê e sinalização de painel, que é etapa 2. A publicação de solução inválida já está bloqueada; só a cascata reversa falta. Sem solução no lançamento (Q-006), é inerte hoje.
- **RF-048** (avisar que um gatilho de 6.6 foi cruzado) é tela de painel, etapa 2. O dado que ela leria já existe.
- **Efeito colateral de `required` + `localized` + `fallback: false`:** salvar com o painel em inglês exigirá os obrigatórios em inglês. No MVP é trava a favor — nada em inglês publica —, mas vira atrito real quando o idioma for ativado.

#### Contradições do PRD levantadas pela onda 2b

| # | Contradição | Encaminhamento |
|---|---|---|
| 5 | 6.5 regra 4 exige slug de 2 a 5 palavras; 6.4 publica `/sobre`, `/contato`, `/termos`, `/busca`, `/faq`, todos de uma palavra | Máximo de 5 palavras e 60 caracteres aplicados; mínimo de 2 **não** aplicado, senão nenhuma página institucional seria publicável |
| 6 | Categoria não tem estado de publicação em 6.7, mas PR-014 fala de slug imutável após a publicação para todo slug | Categoria ficou sem rascunho/publicado, regida por `visivelPublicamente` como manda PR-013. Inofensivo sem página de categoria; exige decisão quando P-18 entrar |
| 7 | RF-182 pede vínculo editável dos dois lados; PR-003 e RF-066 declaram o lado do produto derivado | Resolvido a favor de PR-003. **O PRD precisa escolher um dos dois** |

#### Correção do bloqueio da onda 2b

`"type": "module"` acrescentado ao `package.json` pelo agente dono do arquivo. Causa confirmada: sem ele o tsx compilava `payload.config.ts` como CommonJS e o `require()` de `@payloadcms/richtext-lexical`, que tem top-level await, quebrava no Node 24. Script `verificar:contraste` acrescentado como portão de build. Teto de upload reconciliado por comentário: 5 MB medem o arquivo bruto de entrada, os 200 KB de RNF-012 medem o arquivo já reprocessado em webp a 1600 px.

Resultado real: `generate:types`, `typecheck`, `lint`, `verificar:contraste` e `build` todos com saída 0. Os tipos regerados do zero saíram byte a byte idênticos aos da 2b.

**Ressalva registrada pelo agente, e ela importa:** o build passou mas prova pouco. A única rota da saída é o `/404` do Pages Router, porque `src/app/(site)/` ainda estava vazio. Nenhuma etapa do build consultou o banco. Não é falha por ausência de banco, não é defeito de configuração, e **também não é evidência de que a configuração do Postgres funciona**. O primeiro build que exercita `DATABASE_URI` é o da onda 3b.

Efeito colateral de âmbito global a lembrar: com `"type": "module"`, todo `.js` solto no repositório passa a ser ESM. Quem precisar de CommonJS usa `.cjs`.

#### Decisões do cliente — 2026-09-07, durante a onda 3

- **Banco de dados:** Postgres gerenciado gratuito (Neon ou Supabase) em vez de Docker local. Resolve a verificação ponta a ponta sem instalar nada e já informa **D-15**. Pendente: o cliente criar a instância e fornecer a string de conexão.
- **Biblioteca de blocos institucionais (RF-146):** confirmados os quatro definidos pela onda 2b — texto, lista, imagem e chamada. Cobrem P-02, P-13 e P-14. Biblioteca pequena é o que sustenta o princípio 8 de 2.8.

#### Onda 3 — despachada

Três agentes em paralelo, territórios disjuntos dentro de `src/app/(site)/`, partição por rota e não por diretório.

`src/lib/rotas.ts` é dependência cruzada das três ondas. Resolvida fixando a assinatura como **contrato fechado** nos três despachos, com a 3a instruída a criar o arquivo como primeira ação e as outras duas proibidas de improvisar um substituto. É a mesma classe de risco que o paralelismo das ondas do PRD produziu duas vezes; desta vez o contrato veio antes do trabalho, não depois.

#### Onda 3 — interrupção por limite de sessão e retomada

As três ondas paralelas caíram simultaneamente por limite de sessão do Opus. É a quarta vez que o projeto encontra essa falha: o log das ondas do PRD registra três interrupções equivalentes. O procedimento já estabelecido foi aplicado — **preservar o que foi gravado e retomar com outro modelo, sem reiniciar do zero**.

Levantamento do que chegou ao disco antes da queda:

| Onda | Salvo | Faltando |
|---|---|---|
| 3a | **`src/lib/rotas.ts` completo**, `layout/{fontes,tema,navegacao,ControleDeTema}`, duas fontes em `public/fonts/`, `icon.png`, `apple-icon.png`, `opengraph-image.png` | Layouts, cabeçalho, rodapé, 404, sitemap, robots, rota de revisão |
| 3b | `src/lib/consultas.ts` | Todas as páginas |
| 3c | `configuracao-contato.ts`, `rotulos.ts`, `contato-contrato.ts` **truncado na linha 170** | Todas as páginas e a rota de API |

**O contrato de `rotas.ts` sobreviveu e foi conferido pelo maestro contra a assinatura despachada: confere exatamente.** Era a dependência cruzada das três ondas e o único ponto onde a queda simultânea poderia ter custado retrabalho nas três. Fixar o contrato antes do trabalho, e não depois, foi o que evitou isso.

`contato-contrato.ts` truncado era o **único** erro de compilação do projeto. As ondas 3a e 3b foram instruídas a ignorá-lo por ser alheio, e a 3c a corrigi-lo como primeira ação.

Retomada despachada com **Sonnet**, cada agente informado do que já existe no disco e proibido de reescrever o que está íntegro.

#### Onda 3a — concluída na retomada

Shell público, navegação, 404, SEO técnico e rota de revisão entregues. Nada do que sobreviveu à queda foi reescrito.

Fontes: 68,9 KB somados em 2 arquivos, dentro do teto de RNF-014 (máx. 4 arquivos, 150 KB). Cálculo refeito e conferido.

**Quatro travas contra vazamento de inglês, todas mecânicas:** toda URL sai de `montarCaminho`/`ROTAS`, nunca literal; o sitemap itera só sobre `IDIOMAS_PUBLICADOS`, que tem um elemento, e não emite `hreflang`; toda leitura ao Payload passa `locale: 'pt-BR'` explícito; e `/en/...` responde 404 por ausência de arquivo de rota, sem depender de teste manual. `robots.ts` e `sitemap.ts` sequer conhecem o segmento.

**Solução elegante para o logotipo no tema escuro.** 11.13 proíbe usar o mesmo arquivo sobre fundo escuro, e a versão reversa não existe (Q-077, Q-078). Em vez de inventar uma versão ou publicar o arquivo claro sobre fundo escuro, o agente renderizou o wordmark em texto tratado pelos tokens — caixa alta, "Z" em `--az-acao-primaria`. Resolve o problema de contraste sem criar ativo de marca que ninguém aprovou.

**Lacuna do modelo levantada e não resolvida, porque é território alheio:** razão social, CNPJ e endereço (Q-053) **não têm onde morar** — nem campo em `ConfiguracaoDoSite`, nem variável de ambiente. O rodapé exibe só "ArtZan" e uma marca de placeholder. Precisa de campo no modelo antes de o dado existir. **Fica para a onda 4 ou para uma retomada curta da 2b.**

Placeholders deixados pela 3a: dados de rodapé (Q-053), e-mail institucional (Q-031, Q-063), WhatsApp e horário de atendimento (Q-012), logotipo em tema escuro (Q-077, Q-078). `/privacidade` e `/termos` só entram no sitemap quando o registro institucional estiver publicado com `indexavel: true` — sem texto jurídico (D-16), não aparecem, e esse é o comportamento correto.

Contradição confirmada por dois agentes independentes: **14.1 atribui "Solicitar avaliação gratuita" como ação primária de P-01, P-03 e P-04, mas P-09 é etapa 2 por D-11**. Resolvida com uma ação alternativa de contato. O PRD precisa reconciliar isso quando D-17 fechar.

#### Onda 3b — concluída na retomada

P-01, P-02, P-03 e P-04 entregues. `typecheck` e `lint` limpos. `build` compila e tipa com sucesso e **falha apenas na geração estática de `/sobre`, com `ECONNREFUSED` na porta 5433** — ausência de Postgres, não defeito de código. O agente não contornou com dado embutido, que era a saída errada disponível.

Este é o primeiro build que de fato exercitou `DATABASE_URI`, como a onda 1 havia previsto.

As omissões do PRD foram implementadas como omissão de verdade, não como espaço vazio: o bloco de soluções não é sequer consultado (Q-006); o bloco de confiança não renderiza nada de propósito (PR-007, Q-021); a faixa de parceiros é condicional a dado. Filtro, busca, ordenação e paginação não existem nem como código morto — nenhum import, função ou comentário-esqueleto.

Nomenclatura resolvida por `identificacao-de-produto.ts`, mapeando por slug: só `sistema-lara` usa o nome como identificação principal; os outros três exibem a descrição funcional com o nome proposto rotulado "a aprovar".

#### Dívidas herdadas pela onda 3b — viram trabalho da onda 4

1. **Vazamento de nome não aprovado no título de busca.** `tituloSeoDe`/`descricaoSeoDe` (onda 2b) têm cadeia de fallback que lê `produto.nome` cru. Para os três produtos provisórios isso publica Theo, Iago e Nina no título de busca — exatamente o que PR-063 e 11.4 proíbem. Hoje só um `seoTitulo` preenchido à mão evita. **É defeito real, não preferência: precisa ser corrigido na função, não contornado no dado.**
2. **`/parceiros` (P-07) não tem dono.** Nem em `dev/CONVENCOES.md` §2, nem em nenhum escopo despachado. Lacuna minha na partição. A rota é condicional a parceiro autorizado (Q-025, D-05) e o cenário provável é ausência, mas o código precisa existir.
3. **Trilha de navegação de P-04 está inline**, porque `src/components/layout/Breadcrumb` não existia quando a 3b escreveu. Migrar para o componente da 3a.
4. **Campos de identificação da empresa não existem no modelo** (herdado da 3a): razão social, CNPJ e endereço (Q-053) não têm onde morar. Bloqueio de lançamento por 16.6.

#### Contradições do PRD levantadas pela onda 3b

| # | Contradição | Encaminhamento |
|---|---|---|
| 8 | "Descrição completa" é campo obrigatório do modelo com limites em 11.3, mas **está ausente da tabela de onze seções de P-04** | Posicionada logo após "problema que resolve" e registrada no código. O PRD precisa incluí-la na tabela |
| 9 | **PR-063 não tem campo de modelo que o sustente**: `Produtos.nome` não distingue nome aprovado de proposto, e não existe campo de descrição funcional | Resolvido por mapeamento de slug em `identificacao-de-produto.ts`. Quando D-12 fechar, o mapeamento sai e o campo volta a bastar |
| 10 | 14.1 atribui "Solicitar avaliação gratuita" como ação primária de P-01, P-03 e P-04, mas P-09 é etapa 2 | Já registrada pela 3a. **Confirmada de forma independente por dois agentes** |

#### Onda 3c — concluída na retomada

`contato-contrato.ts` estava cortado no meio da declaração de `LIMITES`; completado. Conversão ponta a ponta, páginas legais e recebimento de envio entregues. `typecheck` e `lint` limpos. `build` falha só na prerenderização de `/sobre` (arquivo da 3b) por `ECONNREFUSED` — as quatro rotas da 3c usam `force-dynamic` justamente para não depender de banco em build.

**RNF-092 foi provado, não afirmado.** O agente rodou um teste real contra o `.env` deste ambiente, com SMTP vazio: `enviarEmail` retornou `{"entregue":false,"motivo":"nao-configurado"}`; a solicitação foi gravada **antes** de qualquer tentativa de entrega; o alerta registrou `{"local":"gravado","webhook":"nao-configurado","email":"nao-configurado"}`. No cliente, o formulário nunca limpa o estado em caso de falha. As duas metades do requisito — alerta interno e preservação dos dados digitados — verificadas de fato. Arquivos de teste removidos ao final.

Ponto de extensão do captcha (PR-050): a verificação está isolada em `verificarDesafio()`, que hoje só retorna `true`. Ativar depois é reescrever o corpo dessa função; validação, tipos, rota e mensagens de erro não mudam. É configuração, não reconstrução, como o PRD exige.

RF-221: consentimento de tratamento (obrigatório) e aceite de comunicações (opcional, nunca pré-marcado) são campos distintos, validados e registrados em separado — o segundo nunca bloqueia o envio. Na tela, dois blocos visuais separados com textos diferentes.

Canais sem valor real **omitem o item em produção**, em vez de renderizar entrada vazia. Páginas legais sem registro publicado mostram aviso e marca de placeholder citando D-16, sem uma linha de texto jurídico inventado.

#### Dívida crítica levantada pela onda 3c

**A persistência de lead é um arquivo de log local.** `registro-de-solicitacoes.ts` grava em `var/solicitacoes/*.log` antes de tentar entregar. É a escolha certa para garantir RNF-092 sem serviço externo, mas **não sobrevive a hospedagem sem sistema de arquivos persistente** — que é o caso de quase toda plataforma serverless. Se o destino de D-15 for desse tipo, a rede de segurança de "nada se perde em silêncio" **desaparece justamente no ambiente em que ela é necessária**. Precisa ser decidido junto com D-15, não depois.

#### Contradições do PRD levantadas pela onda 3c

| # | Contradição | Encaminhamento |
|---|---|---|
| 11 | RF-120 declara obrigatórios apenas nome, e-mail e mensagem; a seção 7/P-08 e a tabela de 14.2 leem como se empresa, assunto e interesse também fossem | Resolvido a favor de RF-120, único texto com "Comportamento esperado" normativo |
| 12 | 14.2 lista telefone e cargo como campos opcionais; a seção 7/P-08 diz "campos mínimos, sem qualificação adicional" | Resolvido a favor de "mínimo": os dois campos não existem |
| 13 | 14.1 lista a ação primária de P-08 como o próprio envio, mas a ação alternativa criada para contornar a ausência de P-09 competia com ela | Rótulo de envio próprio, sem competir. Relacionada à contradição 10 |

### 2026-09-07 (noite) — Onda 4 despachada com contorno de banco local

Quatro decisões do maestro antes de despachar a onda 4.

| Decisão | Escolha | Origem |
|---|---|---|
| Banco para a onda 4 | **SQLite local** via `@payloadcms/db-sqlite`, ativado por `DB_ADAPTER=sqlite` no `.env`. Build verificável ponta a ponta sem Docker nem Postgres gerenciado | Resposta do usuário em 2026-10-19; contorno já preparado pela onda 4c registrada em `dev/CONVENCOES.md` §2 |
| Correção do vazamento de SEO dos três produtos provisórios | **Aplicar agora**, em `src/lib/seo-automatico.ts`, fazendo `tituloSeoDe` passar por `identificacaoPublicaDoProduto` antes de tocar em `nome` | Resposta do usuário em 2026-10-19; defeito real registrado pela onda 3b |
| Campos institucionais no modelo (Q-053) | **Adiar** — fica como pendência de bloco 16.6 | Resposta do usuário em 2026-10-19 |
| Migrations no SQLite | Primeiro start aplica o esquema automaticamente (dev/conv). Não há `db:push` formal nem versionamento — é aceitável porque o contorno é descartável | Decisão do mestre |

A onda 4c (registrada em `dev/CONVENCOES.md` §2 mas não no log) já tinha preparado o SQLite e o `src/lib/placeholder.ts`. A onda 4a (correção do SEO) estava parcialmente escrita — `seo-automatico.ts` já importa `identificacao-de-produto` mas ainda cita a onda 4a como dona no comentário; a 4b (seed, P-07, migração do Breadcrumb) e a 4c (guarda de build) seguem faltando.

#### Plano da onda 4

| Tarefa | Escopo | Território | Modelo |
|---|---|---|---|
| 4a — fechar SEO | Aplicar a correção de `tituloSeoDe`/`descricaoSeoDe` de fato; ajustar o bloco de comentário do arquivo para refletir a nova autoria | `src/lib/seo-automatico.ts` (único arquivo) | Opus |
| 4b — seed e P-07 | Seed de placeholders das 10 coleções + global; rota `/parceiros` condicional (lacuna de partição da onda 3); migração do Breadcrumb inline de P-04 para o componente da 3a | `content/_PLACEHOLDER/**`, `src/app/(site)/parceiros/`, `src/app/(site)/produtos/[slug]/page.tsx`, acréscimo a `src/lib/consultas.ts` (autorizado pelo maestro) | Opus |
| 4c — guarda de build | Porta de 7.4 (recusa de build com placeholder publicado em produção) + porta de 7.3 (marcador visual em homolog); conserta `prebuild` para rodar a verificação contra o banco SQLite | `scripts/**` (autoria do diretório é da onda 4), `src/components/ui/MarcaDePlaceholder.tsx` (já existe — revisar uso), `package.json` (autorizado) | Opus |

**Três agentes em paralelo, territórios disjuntos.** Partição:
- 4a: `src/lib/seo-automatico.ts` — único arquivo
- 4b: `content/_PLACEHOLDER/**`, `src/app/(site)/parceiros/`, `src/app/(site)/produtos/[slug]/page.tsx`, `src/lib/consultas.ts` (acréscimo)
- 4c: `scripts/**`, `package.json` (acréscimo), revisão do uso de `MarcaDePlaceholder`

`src/lib/rotas.ts` não é tocado por nenhuma das três — o contrato da onda 3 segue válido.

#### Convenção a lembrar para a onda 4

`dev/CONVENCOES.md` §2 já lista `scripts/**` e `content/_PLACEHOLDER/**` como território da onda 4. A onda 4c adicionou `src/lib/placeholder.ts` (dono declarado no topo) e o contorno de SQLite no `.env`. A onda 4b vai trabalhar a partir desse contorno.

#### Próxima etapa após a onda 4

1. Cliente criar a instância gerenciada (Neon ou Supabase) e fornecer `DATABASE_URI` real — D-15 fecha
2. Migrar o `.env` para o destino definitivo e validar build ponta a ponta
3. Resolver D-12 (aprovação dos nomes) para liberar os três produtos provisórios
4. Receber os cinco insumos de 16.6 (prints, imagens, jurídico, dados cadastrais, contatos)

Estado no início da onda 4: build compila e tipa, mas `/sobre` falha em prerenderização por `ECONNREFUSED` na 5433. Com SQLite local, a onda 4 fecha a primeira verificação ponta a ponta de verdade.
