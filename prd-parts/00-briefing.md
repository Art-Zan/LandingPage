# Briefing de orquestração — PRD do site institucional

> Documento de CONVENÇÕES para os subagentes redatores. Não faz parte do PRD final.

## Contexto de negócio (única fonte de verdade fornecida pelo cliente)

- O cliente está iniciando uma empresa de software que terá um **ecossistema de produtos digitais**.
- A empresa desenvolverá **diversos softwares menores**, cada um com sua finalidade, que poderão ser:
  - vendidos individualmente;
  - contratados em conjunto;
  - apresentados como soluções complementares;
  - expandidos futuramente com novos produtos.
- O site será o **ponto central de exposição da empresa**: identidade, produtos, soluções, empresas parceiras e demais informações relevantes para clientes, potenciais clientes e interessados.
- **Nada além disso foi informado.** Não existem: nome confirmado da empresa, identidade visual, lista de produtos, nomes de produtos, preços, modelo comercial, clientes, parceiros, canais de contato, equipe, localização, idiomas.

## Regras invioláveis

1. **Não inventar fatos do negócio.** Nenhum nome de produto, parceiro, cliente, preço, número, depoimento, prazo, palavra-chave específica ou diferencial competitivo pode ser afirmado como real.
2. Quando um dado for necessário e ausente: registrar **premissa** (PR-xxx) ou **pergunta** (Q-xxx) com identificador, nunca preencher com invenção.
3. Exemplos ilustrativos são permitidos **apenas** se marcados explicitamente como fictícios/placeholder (ex.: `[Produto A]`, `Software Alfa (exemplo fictício)`).
4. **Não escrever código, HTML, CSS, componentes ou telas.** O entregável é exclusivamente documentação de requisitos. Diagramas Mermaid e tabelas são permitidos.
5. **Agnóstico à tecnologia.** Não nomear frameworks, CMS, provedores ou bibliotecas, salvo quando a decisão for indispensável ao requisito — e nesse caso registrar como decisão pendente (D-xxx), não como escolha feita.
6. **Não propor funcionalidade por ser comum em outros sites.** Toda funcionalidade relevante deve vir acompanhada da justificativa ("por que existe").
7. Nada de PRD genérico: cada requisito deve refletir o problema real de um catálogo de softwares pequenos, vendidos isolados ou combinados, com crescimento contínuo do portfólio.
8. Um mesmo software poderá participar de **várias soluções compostas**. A arquitetura de informação e o modelo de conteúdo não podem exigir mudança estrutural para adicionar produto, categoria, solução ou parceiro.

## Idioma e estilo

- Português do Brasil.
- Linguagem profissional, objetiva, sem marketing vazio.
- Markdown, com títulos hierárquicos, tabelas quando comparativo e listas quando paralelo.
- Todo requisito numerado. Toda seção legível por produto, design e desenvolvimento.

## Placeholders obrigatórios

- Nome da empresa: usar `[EMPRESA]` em todo o documento.
- Domínio: usar `[dominio]` (ex.: `https://[dominio]/produtos`).
- Nunca escrever um nome comercial real. Observação de contexto: o diretório do projeto chama-se `ArtZan` — isso **não** é confirmação do nome da empresa e deve virar pergunta de validação.

## Taxonomia de prioridade (usar exatamente estes rótulos)

- `MVP` — essencial para o lançamento.
- `Fase 2` — importante, mas posterior ao lançamento.
- `Futuro` — opcional ou dependente de evolução do negócio.

## Faixas de identificadores (não invadir faixa de outro agente)

| Prefixo | Significado | Dono |
|---|---|---|
| `OB-xx` | Objetivo de negócio | Agente 1 |
| `PU-xx` | Perfil de público / persona | Agente 1 |
| `P-xx` | Página | Agente 1 |
| `J-xx` | Jornada do usuário | Agente 1 |
| `RF-001..019` | Navegação e estrutura global | Agente 2 |
| `RF-020..039` | Página inicial | Agente 2 |
| `RF-040..059` | Catálogo de softwares | Agente 2 |
| `RF-060..079` | Página individual de software | Agente 2 |
| `RF-080..099` | Soluções compostas | Agente 2 |
| `RF-100..119` | Parceiros | Agente 2 |
| `RF-120..139` | Formulários e contato comercial | Agente 2 |
| `RF-140..159` | Conteúdo e páginas institucionais | Agente 2 |
| `RF-160..179` | SEO, compartilhamento e dados estruturados | Agente 2 |
| `RF-180..199` | Gestão de conteúdo / administração | Agente 2 |
| `RF-200..219` | Analytics e medição | Agente 2 |
| `RNF-001..009` | Responsividade | Agente 2 |
| `RNF-010..019` | Performance | Agente 2 |
| `RNF-020..029` | Acessibilidade | Agente 2 |
| `RNF-030..039` | SEO técnico | Agente 2 |
| `RNF-040..049` | Segurança | Agente 2 |
| `RNF-050..059` | Privacidade e proteção de dados | Agente 2 |
| `RNF-060..069` | Compatibilidade | Agente 2 |
| `RNF-070..079` | Manutenibilidade e modelo de conteúdo | Agente 2 |
| `RNF-080..089` | Escalabilidade | Agente 2 |
| `RNF-090..099` | Disponibilidade e monitoramento | Agente 2 |
| `RNF-100..109` | Qualidade da futura implementação | Agente 2 |
| `PR-001..019` | Premissas | Agente 1 |
| `PR-020..039` | Premissas | Agente 2 |
| `PR-040..059` | Premissas | Agente 3 |
| `PR-060..079` | Premissas | Agente 4 |
| `Q-001..029` | Perguntas de validação | Agente 1 |
| `Q-030..049` | Perguntas de validação | Agente 2 |
| `Q-050..069` | Perguntas de validação | Agente 3 |
| `Q-070..099` | Perguntas de validação | Agente 4 |
| `R-xx` | Riscos | Agente 4 |
| `D-xx` | Decisões necessárias antes do desenvolvimento | Agente 4 |
| `CA-xx` | Critérios gerais de aceite | Agente 4 |

Critérios de aceite por página/requisito são escritos inline (lista de verificação), sem numeração global.

## Montagem final

Os arquivos serão concatenados nesta ordem para formar `PRD.md`:

1. `01-fundacao.md` — seções 1 a 8
2. `02-requisitos.md` — seções 9 a 10
3. `03-experiencia.md` — seções 11 a 15
4. `04-escopo.md` — seções 16 a 21

Cada arquivo começa direto no seu primeiro título de seção `## N. Título`. Não repetir cabeçalho do documento, não repetir sumário, não repetir conteúdo de outro arquivo. Referenciar itens de outros agentes por identificador (ex.: "conforme RF-045").
