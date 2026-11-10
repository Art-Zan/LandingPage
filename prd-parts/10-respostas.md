# Digesto das respostas do cliente — insumo para a revisão do PRD

> Documento de ORQUESTRAÇÃO. Consolida as 69 respostas dadas em `PERGUNTAS-PENDENTES.md` em 2026-09-07.
> Não é PRD. Serve para que os redatores apliquem as decisões sem reler o formulário inteiro.
> Fonte de verdade das respostas: `PERGUNTAS-PENDENTES.md`. Em caso de divergência, vale o formulário.

## 1. Identidade confirmada

| Item | Decisão |
|---|---|
| Nome da empresa | **ArtZan**. O placeholder `[EMPRESA]` deixa de existir no PRD. |
| Domínio | **artzan.com.br**, sujeito a alteração. Substituir `[dominio]`, mantendo nota de provisoriedade. |
| Logotipo | Existe: `Logo.png` na raiz do projeto. Monograma "AZ" angular sobre wordmark "ARTZAN" em caixa alta com espaçamento largo. |
| Paleta | Azul e tons escuros, derivados do logotipo. Azul-marinho quase preto no "A" e no wordmark; azul médio saturado no "Z", com leve gradiente. |
| Estilo | **Flat e clean.** Sem sombras pesadas, sem skeuomorfismo, sem ornamento. |
| Produção da identidade | Será produzida no próprio projeto, a partir do logotipo existente. Não há agência nem manual de marca externo. |
| Manual de marca | Não existe (Q-055). O PRD passa a ser a referência de marca. |
| Tom de voz | **Aprovado** conforme a seção 11 do PRD (Q-050). Sem restrição de vocabulário setorial (Q-059). |

## 2. Portfólio de lançamento

Cinco itens confirmados (Q-004). Nomes comerciais ainda não definidos, exceto o primeiro.

| # | Produto | Nome |
|---|---|---|
| 1 | Gestão geral de empresa | **Sistema Lara** (nome confirmado) |
| 2 | Alocação de quadras | a nomear |
| 3 | Scout para partidas esportivas | a nomear |
| 4 | Placar esportivo | a nomear |
| 5 | Desenvolvimento de integrações entre sistemas | a nomear; ver observação abaixo |

- **Nomenclatura (Q-051):** nomes independentes entre si, sem família de marca no início. Propor sugestões, não decidir.
- **Registro de marca (Q-052):** a definir. Nenhum nome pode ser tratado como registrado.
- **Material visual (Q-005):** haverá prints de tela. Reservar o espaço no template; não publicar produto sem imagem definida.
- **Observação de modelagem:** o item 5 é serviço, não software de prateleira. Os redatores devem decidir se ele é um produto do catálogo ou uma oferta de serviço apresentada à parte, e justificar. Não force um serviço dentro do template de software se isso quebrar a consistência.

## 3. Soluções compostas

**Nenhuma solução composta no lançamento (Q-006).**

Consequência a tratar com cuidado, porque altera o escopo do MVP:

- O modelo de dados e o relacionamento muitos-para-muitos entre produto e solução **permanecem no MVP**. Eram a razão de ser da arquitetura e o cliente não pediu para removê-los.
- As páginas P-05 (índice de soluções) e P-06 (página de solução) **não têm conteúdo para exibir**. Reclassificar de MVP para "construído, desligado até existir a primeira solução", ou postergar a construção. Os redatores decidem, justificam e ajustam a navegação para não expor menu vazio.
- O posicionamento de venda combinada (OB-09) não desaparece: passa a ser promessa de ecossistema, não catálogo de soluções prontas.

## 4. Mercado, público e modelo comercial

| Item | Decisão |
|---|---|
| Segmento (Q-009) | Clubes, parques e pequenas empresas. **Tom levemente neutro**: não fechar a comunicação nesses três nichos. |
| Porte (Q-010) | Pequena e média empresa. |
| Geografia e idioma (Q-011) | Brasil no lançamento. Preparar estrutura para tradução básica ao inglês. Deixa de ser preparação genérica e vira requisito de estrutura. |
| Modelo comercial (Q-007) | **Assinatura recorrente e projeto sob encomenda.** |
| Preço (Q-008) | Depende do projeto. Não publicar preço. PR-005 continua válida. |
| Diferencial (Q-018) | Softwares adaptados e versáteis. |
| Por que produtos menores (Q-019) | Valores acessíveis. |
| Ganho da integração (Q-020) | Facilidade de uso. |
| Promessa verificável (Q-022) | **Período de avaliação gratuita.** |
| Credibilidade (Q-021) | Sem prova social no lançamento. Um cliente poderá ceder logo em breve. Manter o bloco previsto e vazio. |
| Ciclo de venda e ticket (Q-016) | A definir. |

## 5. Demonstração e conversão

| Item | Decisão |
|---|---|
| Formato da demonstração (Q-026) | **Ambiente próprio para teste por tempo determinado.** Muda a natureza do pedido: não é só apresentação conduzida por pessoa. Revisar PR-016 e o fluxo de P-09. |
| Canais de contato (Q-012) | **WhatsApp e e-mail**, além do formulário. |
| Destino dos leads (Q-013) | Caixa de e-mail. Um dos dois sócios responde em **até 2 dias úteis**. Revisar PR-048, que assumia 1 dia útil. |
| Ferramenta de gestão comercial (Q-014) | Não no início. Apenas caixa de e-mail. PR-021 confirmada. |
| E-mail remetente e caixa própria (Q-031, Q-063) | Haverá e-mail institucional no domínio, ainda não criado. |
| Triagem (Q-064) | Um dos sócios. |
| Campo de qualificação (Q-062) | **Não.** Formulário permanece curto. PR-046 confirmada. |
| Antispam (Q-030) | Sem desafio interativo no início, mas **prever a inclusão futura de captcha**. Revisar PR-050: deixa de ser exclusão simples e passa a exigir ponto de extensão previsto. |
| Aceite para comunicações futuras (Q-066) | **Sim**, aceite separado. |
| Volume atendível (Q-015) e indicadores (Q-017) | A definir. |

## 6. Administração de conteúdo

**Decisão relevante: haverá painel de administração (Q-033).**

- Resposta literal: "Um painel simples de administração deve ser feito sim."
- Isso resolve a decisão D-02 e converte a faixa RF-180..199 de capacidade abstrata em funcionalidade a construir.
- Papéis (Q-034): tudo executado pelos dois sócios no início. Sem hierarquia de aprovação.
- Infraestrutura (Q-071) e despublicação ou renomeação (Q-072): responsabilidade dos sócios.
- **Impacto de escopo a tratar explicitamente:** um painel de administração é software com autenticação, sessão, permissão e superfície de ataque. Não é item pequeno dentro de um site institucional. Os redatores devem dimensionar isso com honestidade, propor o corte mínimo viável e registrar o efeito no cronograma.

## 7. Parceiros

- Um parceiro em vista, **ainda não confirmado** (Q-025).
- Taxonomia de tipos de parceria: seguir a proposta do PRD (Q-024).
- Autorização de uso de marca: ainda não existe (Q-054). PR-018 continua valendo: sem autorização, não publica.
- Página de parceiros permanece condicionada.

## 8. Jurídico, privacidade e dados

| Item | Decisão |
|---|---|
| Textos legais (Q-028) | Haverá setor jurídico responsável. |
| Rodapé (Q-053) | Publicar razão social, CNPJ, endereço e canal de contato. |
| Base legal e retenção (Q-065, Q-042) | A definir; seguir a LGPD. |
| Direitos do titular (Q-043) | Canal e prazo a definir. |
| Dados fora do Brasil (Q-040) | **Provavelmente sim.** Incluir no aviso de privacidade o texto de transferência internacional como cenário possível. |
| Histórico de versões legais (Q-032) | Apenas interno. |
| Incidente de segurança (Q-044) | Não incluir por enquanto. |
| Teste de intrusão (Q-047) | Posteriormente. |
| Acessibilidade (Q-036, Q-060, Q-061) | Sem exigência acima do padrão, sem laudo formal, sem auditoria externa. A meta AA do PRD permanece por decisão técnica, não por obrigação legal. |

## 9. Técnico e operacional

| Item | Decisão |
|---|---|
| Navegadores (Q-037) | Suportar apenas dispositivos e versões recentes, aceitando perder parte do público. Garantir mobile e desktop. Revisar a faixa RNF-060..069, que era mais conservadora. |
| Disponibilidade (Q-038) | Manter a premissa do PRD. |
| Monitoramento externo (Q-039) | **Não necessário.** Revisar a faixa RNF-090..099: o alerta de falha de formulário continua obrigatório, mas sem contratar monitoração externa. Resolver essa tensão explicitamente. |
| Monitoramento de erro (Q-041) | A definir. |
| Hospedagem (Q-046) | A definir. |
| Janela de publicação (Q-045) | Sem restrição. |
| Orçamento de infraestrutura (Q-035) | Sem restrição. |
| Gatilhos numéricos de catálogo (Q-023) | Manter os do PRD. Observar que 5 produtos ficam abaixo de todos os gatilhos: catálogo simples, sem filtro, sem busca, sem paginação. |
| Blog (Q-027) | Não é pré-requisito. Permanece Fase 2. |
| Mídia paga (Q-067) e metas do trimestre (Q-068) | Sem definição. |
| SEO e webmaster (Q-057, Q-058) | Sócios. |
| Métricas (Q-069) | Os dois sócios. |
| Integração com sistemas de terceiros (Q-070) | Não é requisito, mas será possível. |

## 10. Conflito que os redatores devem enfrentar, não contornar

**Data alvo: setembro de 2026 (Q-029). Hoje é 07 de setembro de 2026.**

O prazo declarado é o mês corrente. No mesmo conjunto de respostas o escopo **aumentou**: entrou um painel de administração, entrou um ambiente de avaliação gratuita por tempo determinado, entrou preparação para inglês, entraram cinco páginas de produto com prints ainda inexistentes, e a identidade visual ainda precisa ser derivada do logotipo.

Nenhum redator deve fingir que isso cabe. O tratamento correto é:

1. Registrar o conflito como risco de severidade máxima, com sinal de alerta e consequência.
2. Propor um recorte de lançamento defensável para o prazo declarado, dizendo o que fica de fora e o que se perde.
3. Deixar a decisão de cortar escopo ou mover a data explicitamente com o cliente, como decisão pendente.

Não invente prazo em dias. Não prometa entrega. Não silencie o conflito.

## 11. Regras que continuam valendo

- Não inventar informação de negócio além do que está neste digesto e no formulário de respostas.
- Onde a resposta foi "a definir", a pendência **continua aberta**: mantenha a pergunta viva no PRD, não a converta em fato.
- Rótulos de prioridade seguem `MVP`, `Fase 2`, `Futuro`.
- Não escolher tecnologia, framework, CMS ou fornecedor. O painel de administração é especificado por capacidade, não por implementação.
- Numeração existente de RF, RNF, PR, Q, R, D e CA **não é renumerada**. Itens novos continuam a numeração. Itens resolvidos são marcados como resolvidos, não apagados.
