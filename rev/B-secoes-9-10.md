## 9. Requisitos funcionais

Cada requisito traduz um comportamento já descrito nas seções 1 a 8: nenhum item existe por convenção de mercado. Referências a páginas (`P-xx`), públicos (`PU-xx`), objetivos (`OB-xx`), jornadas (`J-xx`), premissas (`PR-xxx`) e perguntas (`Q-xxx`) apontam para as seções 1 a 8 deste PRD.

### 9.0 Resumo das faixas

| Faixa | Domínio | Requisitos | Dos quais MVP |
|---|---|---|---|
| RF-001..011 | Navegação e estrutura global | 11 | 11 |
| RF-020..028 | Página inicial | 9 | 9 |
| RF-040..050 | Catálogo de softwares | 11 | 5 |
| RF-060..070, RF-222 | Página individual de software e avaliação gratuita | 12 | 11 |
| RF-080..089 | Soluções compostas | 10 | 10 |
| RF-100..107 | Parceiros | 8 | 8 |
| RF-120..132, RF-220..221 | Formulários e contato comercial | 15 | 15 |
| RF-140..147 | Conteúdo e páginas institucionais | 8 | 5 |
| RF-160..172 | SEO, compartilhamento e dados estruturados | 13 | 12 |
| RF-180..193 | Gestão de conteúdo / administração (painel confirmado) | 14 | 14 |
| RF-200..206 | Analytics e medição | 7 | 6 |
| **Total** | — | **118** | **106** |

*Nota: administração cresceu de 8 para 14 requisitos (painel confirmado por Q-033); formulários ganharam 2 (WhatsApp, aceite separado); produto ganhou 1 (avaliação gratuita). Nenhum requisito existente foi renumerado.*

### 9.1 Navegação e estrutura global (RF-001..011)

#### RF-001 — Cabeçalho persistente
- **Descrição:** todo template exibe um cabeçalho fixo ao topo, com identificação da ArtZan, menu principal e ação de contato destacada.
- **Motivo:** J-05 e PU-07 entram por páginas internas sem contexto de marca; sem identificação e saída permanentes, a sessão termina na página de entrada (OB-01, OB-04).
- **Comportamento esperado:** o cabeçalho acompanha a rolagem sem cobrir mais de 15% da altura útil em telas pequenas; a identificação leva à inicial; a ação de contato permanece visível em qualquer largura, inclusive com o menu recolhido.
- **Páginas afetadas:** P-01 a P-18.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao rolar qualquer página até o fim, o cabeçalho continua acessível sem rolar de volta ao topo. Ao abrir qualquer página interna, a identificação da ArtZan está presente e leva a `/`.
- **Depende de:** Q-003 (identidade visual).

#### RF-002 — Menu principal de cinco itens fixos
- **Descrição:** o menu principal contém exatamente os cinco destinos de 6.1 — Softwares, Soluções, Parceiros, Sobre, Contato — e não cresce com o portfólio.
- **Motivo:** OB-07 exige que publicar produto, solução ou parceiro não altere navegação; menu que lista entidades quebra a cada lançamento.
- **Comportamento esperado:** os itens nunca listam produtos, soluções ou parceiros individualmente. Submenu só é renderizado com dois ou mais destinos reais e apenas para categorias, com profundidade máxima de dois níveis; abaixo do gatilho de filtro (6.6) "Softwares" leva direto a `/produtos`. Destino sem conteúdo publicado — soluções (Q-006) ou parceiros (PR-011) — tem o item ocultado, nunca exibido levando a página vazia.
- **Páginas afetadas:** P-01 a P-18.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dado um catálogo com qualquer quantidade de produtos, quando a inicial é aberta, então o menu apresenta cinco itens. Dado zero parceiros publicados, quando o menu é renderizado, então "Parceiros" não aparece e `/parceiros` não é linkado no rodapé.
- **Depende de:** RF-044, RF-089, RF-105.

#### RF-003 — Menu em tela pequena
- **Descrição:** em larguras reduzidas o menu abre por controle único, preservando ordem e destaque da ação de contato.
- **Motivo:** princípio 9 e PR-017: parte relevante do tráfego é móvel; esconder a conversão atrás de dois toques custa oportunidades (OB-04).
- **Comportamento esperado:** um único controle abre e fecha o menu, com estado anunciado a tecnologias assistivas; a ordem dos itens é idêntica à de tela larga; a ação de contato permanece visível fora do painel recolhido; o painel aberto retém o foco e fecha por tecla de escape e por toque fora dele.
- **Páginas afetadas:** P-01 a P-18.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao abrir o menu em tela pequena, o foco vai para o primeiro item e não escapa para trás do painel. Ao fechar por escape, o foco retorna ao controle de abertura.
- **Depende de:** RF-002.

#### RF-004 — Rodapé global de quatro colunas
- **Descrição:** todo template encerra com o rodapé de quatro colunas definido em P-01.
- **Motivo:** OB-05 e PU-07: sem prova social (PR-007), identificação completa e páginas legais acessíveis são os elementos de confiança disponíveis.
- **Comportamento esperado:** colunas Empresa, Portfólio, Contato, Institucional e legal, nesta ordem, empilhadas na mesma sequência em tela pequena. Links para destinos sem conteúdo publicado são omitidos. Categorias aparecem na coluna Portfólio apenas quando exibidas publicamente (6.6).
- **Páginas afetadas:** P-01 a P-18.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao abrir qualquer página, o rodapé apresenta as quatro colunas e os links legais. Ao reduzir a largura, as colunas empilham sem reordenar.
- **Depende de:** RF-028, Q-012.

#### RF-005 — Trilha de navegação (breadcrumb)
- **Descrição:** páginas de produto, solução, categoria e item de conteúdo exibem trilha textual a partir da inicial.
- **Motivo:** J-05 e P-06: a trilha é um dos quatro mecanismos que distinguem produto de solução e permite subir de nível 2 para nível 1 da mensagem (5.2).
- **Comportamento esperado:** formatos fixos `Início › Softwares › [Produto]` e `Início › Soluções › [Solução]`; nunca aninha produto dentro de categoria, coerente com o padrão de URLs de 6.4; o item atual não é link; a trilha antecede o título da página.
- **Páginas afetadas:** P-04, P-06, P-11, P-18.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao abrir uma página de produto, a trilha mostra dois níveis acima e o segmento "Softwares" leva a `/produtos`. Ao abrir uma solução, o segmento intermediário é "Soluções", nunca um produto.
- **Depende de:** RF-168.

#### RF-006 — Navegação cruzada e ausência de becos sem saída
- **Descrição:** toda página comercial oferece pelo menos um caminho adiante — outra entidade do catálogo, o institucional ou um formulário.
- **Motivo:** princípio 6 e J-01, J-03, J-05: página terminal converte a sessão em abandono.
- **Comportamento esperado:** as relações de 6.8 são renderizadas nos dois sentidos a partir dos vínculos entre registros, nunca de texto digitado; bloco sem vínculo é omitido, jamais exibido vazio; toda página interna oferece caminho para `/sobre` e para `/produtos`.
- **Páginas afetadas:** P-01 a P-11, P-15, P-16, P-18.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao abrir qualquer página publicada, existe ao menos um link para outra página do site além do cabeçalho e do rodapé. Dado um produto sem solução vinculada, quando a página é aberta, então o bloco de soluções não é renderizado.
- **Depende de:** RF-066, RF-082, RF-106.

#### RF-007 — Página não encontrada
- **Descrição:** endereços inválidos respondem com a página P-15, mantendo cabeçalho, rodapé e identidade.
- **Motivo:** despublicação de produto (6.9, regra 7) e links externos envelhecidos são inevitáveis; tráfego orgânico é o mais caro de conquistar (OB-08).
- **Comportamento esperado:** mensagem objetiva sem culpar o visitante; ao menos três caminhos de retorno — inicial, catálogo e contato —, mais soluções quando houver e busca quando ativada; código de resposta de recurso inexistente, nunca de sucesso; página não indexável.
- **Páginas afetadas:** P-15.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao acessar um endereço inexistente, a resposta indica recurso não encontrado e a página oferece três ou mais destinos. Ao inspecionar a página, ela não está listada no mapa do site.
- **Depende de:** RF-171.

#### RF-008 — Página de confirmação de envio
- **Descrição:** todo envio bem-sucedido de formulário leva a P-16, com endereço próprio e sem indexação.
- **Motivo:** OB-04 e P-16: sem confirmação explícita o visitante reenvia ou abandona sem saber se foi atendido; o endereço próprio permite medir conversão com precisão (RF-201).
- **Comportamento esperado:** confirma o recebimento, informa o prazo de retorno de **até 2 dias úteis** (Q-013, resolvida; **PR-048, revisada** — a premissa anterior assumia 1 dia útil, definida em outra seção do PRD e citada aqui), sugere ao menos um próximo passo — catálogo, soluções ou institucional — e não repete o formulário. Acesso direto ao endereço sem envio prévio exibe a mesma página sem confirmar recebimento falso.
- **Páginas afetadas:** P-08, P-09, P-16.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dado um envio válido, quando a resposta retorna, então `/obrigado` é exibida com prazo de retorno e ao menos um próximo passo. Ao inspecionar `/obrigado`, ela está marcada como não indexável.
- **Depende de:** RF-125, RF-172, Q-013.

#### RF-009 — Salto para o conteúdo e estados de foco
- **Descrição:** todo template oferece link de salto para o conteúdo principal e mantém indicador de foco visível em todo elemento acionável.
- **Motivo:** princípio 11 e PU-06, que avalia risco e conformidade; navegação por teclado é critério de aceite, não refinamento.
- **Comportamento esperado:** o link de salto é o primeiro elemento focável, torna-se visível ao receber foco e move o foco para o início do conteúdo principal; a ordem de tabulação segue a ordem visual; nenhum elemento acionável perde o indicador de foco; menus, painéis e mensagens de erro devolvem o foco a posição previsível.
- **Páginas afetadas:** P-01 a P-18.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao pressionar a tecla de tabulação na primeira interação, o link de salto aparece e funciona. Ao percorrer a página apenas por teclado, todo elemento acionável é alcançável e visivelmente focado.
- **Depende de:** RNF-022, RNF-023.

#### RF-010 — Consistência estrutural entre templates
- **Descrição:** os templates de produto, solução, parceiro, institucional e conteúdo compartilham a mesma estrutura de página — cabeçalho, trilha, título, corpo, chamada final e rodapé.
- **Motivo:** princípio 8 e J-06: comparar dois produtos exige encontrar a mesma informação na mesma posição; consistência substitui o comparador no MVP.
- **Comportamento esperado:** nenhuma página publicada usa estrutura própria (6.9, regra 2); a posição da chamada para ação, da trilha e do título é idêntica entre templates; variações são de conteúdo, nunca de arranjo.
- **Páginas afetadas:** P-02, P-04, P-06, P-07, P-11 a P-14, P-18.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dadas duas páginas de produto distintas, quando abertas lado a lado, então as seções aparecem na mesma ordem. Ao publicar um produto novo, nenhuma exceção de layout é criada.
- **Depende de:** RF-060, RF-081, RNF-071.

#### RF-011 — Idioma declarado do documento
- **Descrição:** toda página declara o idioma do conteúdo no documento, e trechos em outro idioma são marcados individualmente.
- **Motivo:** leitores de tela pronunciam conforme a declaração; PR-006 fixa um único idioma no lançamento e a estrutura precisa suportar a mudança sem retrabalho (RNF-083).
- **Comportamento esperado:** o idioma é atributo do documento, não texto fixo em código; nomes próprios e termos técnicos estrangeiros recebem marcação de idioma quando alterarem a pronúncia; a declaração acompanha o conteúdo caso outro idioma seja ativado.
- **Páginas afetadas:** P-01 a P-18.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao inspecionar qualquer página, o idioma declarado corresponde ao do conteúdo publicado. Ao ativar um segundo idioma no futuro, a declaração muda por configuração, sem alteração de template.
- **Depende de:** PR-006, Q-011.

### 9.2 Página inicial (RF-020..028)

#### RF-020 — Bloco de proposta de valor
- **Descrição:** a primeira seção de P-01 apresenta frase principal, frase de apoio e uma única ação primária.
- **Motivo:** 5.1 exige que o visitante entenda o que a ArtZan faz, para quem e qual o próximo passo sem rolar; é a entrada de J-01 e de PU-01.
- **Comportamento esperado:** sem carrossel nem mensagem rotativa; exatamente uma ação primária na primeira tela, sem chamada concorrente de mesmo peso visual; o texto segue o esqueleto de 5.3 e não pode ser publicado com lacuna visível (princípio 2). **Q-018 e Q-019, resolvidas:** o diferencial declarado é softwares adaptados e versáteis, e a razão de produtos menores é oferecer valores acessíveis; o conteúdo estratégico que sustenta a frase principal deixou de ser pendência — a redação final de marca é atividade de conteúdo, fora do escopo deste PRD de requisitos.
- **Páginas afetadas:** P-01.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao abrir a inicial em tela pequena, frase principal e ação primária são compreensíveis sem rolagem. Ao inspecionar a primeira tela, existe exatamente uma ação primária.
- **Depende de:** RF-140.

#### RF-021 — Bloco de apresentação da empresa
- **Descrição:** seção curta de 2 a 4 linhas sobre a ArtZan, com link para `/sobre`.
- **Motivo:** PU-01 abandona sem saber quem está por trás; OB-01 e OB-05 dependem de resposta imediata a "que empresa é essa".
- **Comportamento esperado:** texto institucional único, idêntico ao nível 1 da mensagem (5.2), sem variação por campanha; nenhuma afirmação sobre tamanho, tempo de mercado ou clientes (PR-007); link de continuidade sempre presente.
- **Páginas afetadas:** P-01, P-02.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao abrir a inicial, a seção existe e leva a `/sobre`. Ao comparar com P-02, a formulação institucional é a mesma.
- **Depende de:** RF-140.

#### RF-022 — Destaque de produtos alimentado pelo catálogo
- **Descrição:** o bloco de softwares em destaque é gerado a partir dos produtos publicados marcados como destaque, com limite configurável de 3 a 6 itens.
- **Motivo:** OB-02 e OB-07: lista escrita à mão exigiria editar a inicial a cada lançamento e divergiria do catálogo (6.9, regra 6).
- **Comportamento esperado:** usa o mesmo card de P-03 (RF-041), ordenado pelo campo de ordem de destaque; produto despublicado desaparece do bloco sem edição manual; com menos itens que o mínimo, exibe os existentes sem espaços de preenchimento; com nenhum produto publicado, o bloco é omitido e o link "ver todos" permanece.
- **Páginas afetadas:** P-01, P-03, P-04.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dado um produto novo marcado como destaque, quando publicado, então aparece na inicial sem alteração de código. Dado um produto despublicado, quando a inicial é recarregada, então ele não aparece e nenhum espaço vazio permanece.
- **Depende de:** RF-040, RF-041, RF-186.

#### RF-023 — Bloco de soluções na inicial
- **Descrição:** seção com 2 a 4 soluções publicadas, cada uma indicando os produtos que a compõem e o ganho da combinação em uma linha.
- **Motivo:** OB-09 é o diferencial estrutural do negócio e precisa aparecer na página de maior tráfego; é a entrada alternativa de J-03.
- **Comportamento esperado:** gerado por registros, com limite configurável; cada item mostra os produtos vinculados (RF-082) e leva à página da solução; com zero soluções publicadas o bloco inteiro é omitido, e não substituído por texto explicativo genérico.
- **Páginas afetadas:** P-01, P-05, P-06.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao abrir a inicial com ao menos uma solução publicada, o bloco lista os produtos de cada solução. Dado zero soluções, quando a inicial é aberta, então a seção não é renderizada.
- **Depende de:** RF-080, RF-082, Q-006.

#### RF-024 — Bloco de benefícios do modelo de portfólio
- **Descrição:** seção com 3 a 6 benefícios do modelo de softwares combináveis, redigidos como resultado para o cliente.
- **Motivo:** PU-01 e PU-04 precisam entender por que vários softwares menores, e não uma suíte; responde às objeções de J-03 antes da página de solução.
- **Comportamento esperado:** cada benefício é uma afirmação verificável sobre o modelo — adoção por etapas, escopo delimitado, integração dentro do mesmo fornecedor —, nunca sobre desempenho de produto não medido; o bloco reflete o diferencial e a razão de produtos menores confirmados por **Q-018 e Q-019** — softwares adaptados e versáteis, com valores acessíveis —, sem texto genérico.
- **Páginas afetadas:** P-01.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao revisar o bloco, cada item descreve um resultado, não um recurso. Nenhum item contradiz o diferencial declarado em Q-018 e Q-019.
- **Depende de:** RF-140.

#### RF-025 — Faixa de parceiros com estado vazio tratado
- **Descrição:** faixa de logos de parceiros publicados e autorizados, precedida de título que explica o papel das parcerias.
- **Motivo:** OB-06: parceiros ampliam a capacidade percebida de entrega de uma empresa nova, mas exibi-los sem autorização é risco jurídico (PR-018) e sugerir parcerias inexistentes é fraude de percepção.
- **Comportamento esperado:** renderiza somente com ao menos um parceiro publicado, com autorização registrada; com lista vazia (PR-011) a seção inteira é omitida — proibido logo genérico, silhueta, texto "em breve" ou logo de cliente; o título deixa claro que são parceiros, nunca clientes.
- **Páginas afetadas:** P-01, P-07.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dado zero parceiros publicados, quando a inicial é aberta, então nenhuma faixa nem espaço reservado aparece. Dado um parceiro sem autorização registrada, quando se tenta publicá-lo, então ele não é exibido na inicial.
- **Depende de:** RF-103, RF-105, PR-018.

#### RF-026 — Elementos de confiança verificáveis
- **Descrição:** bloco que reúne apenas provas de credibilidade verificáveis disponíveis no lançamento.
- **Motivo:** PR-007 elimina cases, clientes e depoimentos; OB-05 precisa ser sustentado por identificação, transparência e consistência, não por invenção. **Q-021, resolvida:** sem prova social no lançamento; um cliente poderá autorizar um case em breve, mas o bloco permanece previsto e vazio até isso acontecer — nunca preenchido por antecipação.
- **Comportamento esperado:** admite identificação completa da empresa, páginas legais publicadas e datadas, explicação do que acontece após o envio do formulário e parceiros quando existirem. Proibidos: número inventado, selo sem lastro, depoimento fictício, logo de cliente. Sem item verificável, o bloco é omitido — inclusive o espaço para um futuro case, que só aparece quando o cliente autorizar e o case existir de fato.
- **Páginas afetadas:** P-01, P-13, P-14.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao revisar o bloco, cada item é rastreável a um fato documentado. Nenhum item não verificável é publicado, mesmo com Q-021 resolvida.
- **Depende de:** RF-141.

#### RF-027 — Hierarquia de chamadas para ação
- **Descrição:** a inicial tem uma ação primária global — contato comercial — e uma secundária — explorar o catálogo —, repetidas na chamada final.
- **Motivo:** OB-03 e OB-04; 5.1 proíbe chamadas concorrentes de mesmo peso, que dispersam a decisão em J-01.
- **Comportamento esperado:** no máximo uma ação primária por seção; a ação secundária tem tratamento visual distinto e menor peso; a seção final repete a ação primária e oferece a alternativa de menor compromisso; nenhuma seção termina sem caminho adiante.
- **Páginas afetadas:** P-01, P-08.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao percorrer a inicial, nenhuma seção apresenta duas ações de peso visual idêntico. Ao chegar ao fim da página, a ação primária está novamente disponível.
- **Depende de:** RF-020, RF-120.

#### RF-028 — Rodapé institucional e identificação da empresa
- **Descrição:** o rodapé da inicial e das demais páginas apresenta a identificação da ArtZan, a frase institucional, os canais de contato e os links legais com data de atualização.
- **Motivo:** sem prova social, a identificação completa é o principal sinal de seriedade (OB-05) e responde à dúvida de PU-07 em J-05.
- **Comportamento esperado:** a identificação inclui razão social e dados de registro quando disponíveis (Q-001); canais diretos aparecem apenas se confirmados (PR-012, Q-012); links legais sempre presentes; a data de atualização das páginas legais é exibida ou linkada.
- **Páginas afetadas:** P-01 a P-18.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao abrir qualquer página, o rodapé identifica a empresa e linka `/privacidade` e `/termos`. Dado que um canal direto não foi confirmado, quando o rodapé é renderizado, então ele não é exibido com valor de exemplo.
- **Depende de:** RF-004, Q-001, Q-012.

### 9.3 Catálogo de softwares (RF-040..050)

#### RF-040 — Listagem gerada a partir dos registros publicados
- **Descrição:** P-03 lista todos os produtos com status publicado, em grade uniforme, sem lista fixa mantida à mão.
- **Motivo:** OB-02 e OB-07; 6.9, regra 3: listagem manual desatualiza no primeiro lançamento e reintroduz o retrabalho que o modelo evita.
- **Comportamento esperado:** nenhum produto publicado fica de fora e nenhum despublicado permanece; a grade não cria hierarquia visual entre produtos — todos os cards têm o mesmo tamanho e estrutura; a ordem padrão é estável e configurável, nunca aleatória entre carregamentos.
- **Páginas afetadas:** P-03, P-18.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dado um produto publicado, quando o catálogo é aberto, então ele aparece sem qualquer edição da página. Dadas duas visitas seguidas sem mudança de dados, a ordem exibida é idêntica.
- **Depende de:** RF-186.

#### RF-041 — Card de produto com campos exatos
- **Descrição:** o card exibe exatamente seis elementos: imagem de destaque, nome, resumo de uma linha, rótulo de categoria (quando exibida), selo de participação em soluções (quando houver vínculo) e ação de abertura nomeando o produto.
- **Motivo:** J-06 depende de comparabilidade; campo a mais em um card destrói a varredura da grade e cria manutenção manual (P-03).
- **Comportamento esperado:** o card inteiro é acionável com destino único, sem links aninhados concorrentes; nenhuma informação existe apenas no card; preço não entra (PR-005) e lista de funcionalidades não entra; imagem ausente bloqueia a publicação do produto (RF-185), pois é campo obrigatório.
- **Páginas afetadas:** P-01, P-03, P-05, P-06, P-18.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao abrir o catálogo, todos os cards apresentam os mesmos campos na mesma ordem. Dado um produto sem categoria exibida publicamente, quando o card é renderizado, então o rótulo é omitido sem espaço reservado.
- **Depende de:** RF-040, RF-042.

#### RF-042 — Selo de participação em soluções
- **Descrição:** o card indica que o produto participa de ao menos uma solução, sem informar quantas.
- **Motivo:** OB-09 precisa de sinal já no catálogo; indicar quantidade criaria ranking involuntário entre produtos (P-03).
- **Comportamento esperado:** o selo é derivado do vínculo produto↔solução, nunca de campo digitado; aparece somente quando existe ao menos uma solução publicada contendo o produto; desaparece automaticamente quando o último vínculo é removido ou a solução é despublicada.
- **Páginas afetadas:** P-01, P-03, P-05, P-18.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dado um produto vinculado a três soluções, quando o card é exibido, então o selo não menciona número. Dado que a única solução do produto é despublicada, quando o catálogo recarrega, então o selo desaparece sem edição manual.
- **Depende de:** RF-066, RF-082.

#### RF-043 — Agrupamento por categoria
- **Descrição:** a partir de 7 produtos publicados, a grade passa a ser agrupada por categoria, com título por grupo.
- **Motivo:** gatilho de 6.6: abaixo desse volume a leitura sequencial é mais rápida que a triagem, e o agrupamento sugere catálogo maior do que o real.
- **Comportamento esperado:** produto em mais de uma categoria aparece em cada grupo pertinente, sem duplicar registro; produto sem categoria visível vai para um grupo final neutro; o agrupamento é ativado por configuração, não por alteração de template.
- **Páginas afetadas:** P-03.
- **Prioridade:** Fase 2.
- **Critérios de aceite:** Dado um catálogo com 6 produtos, quando aberto, então não há agrupamento. Dado o sétimo produto publicado, quando o catálogo é aberto, então os grupos por categoria aparecem sem intervenção de desenvolvimento.
- **Depende de:** RF-048, PR-013, Q-023.

#### RF-044 — Filtro por categoria
- **Descrição:** o filtro por categoria é ativado com 10 produtos publicados, ou com 4 categorias que tenham ao menos 2 produtos cada.
- **Motivo:** gatilho de 6.6: filtro só ajuda quando remove quantidade relevante de itens; antes disso é ruído (PU-02, PU-03).
- **Comportamento esperado:** seleção múltipla, contagem de resultados visível, estado selecionado refletido no endereço para permitir compartilhamento, e opção de limpar seleção sempre disponível; com o filtro ativo, o submenu de "Softwares" pode listar categorias (6.2).
- **Páginas afetadas:** P-03, P-18.
- **Prioridade:** Fase 2.
- **Critérios de aceite:** Dado o filtro ativo e duas categorias selecionadas, quando a página é recarregada pelo endereço, então a mesma seleção é restaurada. Ao selecionar categorias, a contagem de resultados é atualizada e visível.
- **Depende de:** RF-043, RF-050, Q-023.

#### RF-045 — Ordenação da listagem
- **Descrição:** controle de ordenação da grade, ativado com 12 produtos publicados.
- **Motivo:** gatilho de 6.6: abaixo desse volume não há o que ordenar de forma útil, e o controle ocuparia espaço que a comparação precisa.
- **Comportamento esperado:** critérios limitados e neutros — alfabético e mais recentes primeiro —, sem ordenação por popularidade ou relevância comercial, que criaria hierarquia entre produtos; a ordenação escolhida é refletida no endereço e preservada ao voltar da página de produto.
- **Páginas afetadas:** P-03.
- **Prioridade:** Fase 2.
- **Critérios de aceite:** Dado o controle ativo, quando um critério é escolhido, então a grade reordena sem recarregar o contexto de filtro. Ao voltar de uma página de produto, o critério anterior permanece aplicado.
- **Depende de:** RF-044, Q-023.

#### RF-046 — Busca dentro do catálogo
- **Descrição:** campo de busca sobre nome, resumo e problema resolvido dos produtos, ativado com 15 produtos publicados ou 20 itens de conteúdo.
- **Motivo:** gatilho de 6.6: busca com poucos resultados frustra mais do que ajuda e sugere catálogo maior do que o real (P-17).
- **Comportamento esperado:** busca por termo parcial, sem sensibilidade a acento e caixa; resultados exibidos na mesma grade de cards; termo refletido no endereço; estado sem resultados tratado por RF-050; a busca unificada de P-17 é evolução deste requisito, não substituto.
- **Páginas afetadas:** P-03, P-17.
- **Prioridade:** Futuro.
- **Critérios de aceite:** Dado o termo digitado sem acentos, quando a busca é executada, então produtos com acento no nome são encontrados. Dado um termo sem correspondência, então o estado sem resultados é exibido com caminho para o contato.
- **Depende de:** RF-048, RF-050, Q-023.

#### RF-047 — Paginação da listagem
- **Descrição:** a listagem passa a paginar com 24 produtos publicados, mantendo no máximo 24 itens por página.
- **Motivo:** gatilho de 6.6 e RNF-011: listagem única com portfólio grande compromete o peso da página e a varredura visual.
- **Comportamento esperado:** cada página tem endereço próprio e indexável; filtros e ordenação são preservados entre páginas; a numeração é navegável por teclado; a primeira página é a canônica da listagem.
- **Páginas afetadas:** P-03, P-05, P-10, P-18.
- **Prioridade:** Fase 2.
- **Critérios de aceite:** Dado um catálogo com 30 produtos, quando aberto, então são exibidos 24 itens e um controle de navegação entre páginas. Ao avançar de página com filtro ativo, o filtro permanece aplicado.
- **Depende de:** RF-044, RF-161, Q-023.

#### RF-048 — Ativação progressiva por configuração
- **Descrição:** agrupamento, filtro, ordenação, busca e paginação existem no modelo desde o MVP e são ligados por configuração quando os gatilhos de 6.6 são atingidos.
- **Motivo:** OB-07 e PR-013: ativar recurso não pode ser migração de dados nem alteração de template; o site precisa acompanhar o crescimento do portfólio sem projeto.
- **Comportamento esperado:** o sistema calcula continuamente as contagens de produtos, categorias com dois ou mais produtos, soluções e conteúdos publicados; ao cruzar um gatilho, sinaliza a quem administra que o recurso pode ser ativado; a ativação é decisão editorial explícita, não automática, para evitar mudança de interface sem aviso.
- **Páginas afetadas:** P-03, P-05, P-10, P-18.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dado que o catálogo atinge 10 produtos, quando a administração é aberta, então há sinalização de que o filtro pode ser ativado. Ao ativar um recurso, nenhuma alteração de código ou de estrutura de dados é necessária.
- **Depende de:** RF-180, Q-023.

#### RF-049 — Estado vazio e catálogo pequeno
- **Descrição:** o catálogo trata como válidos os estados de zero produtos e de 1 a 3 produtos publicados.
- **Motivo:** PR-002 estima 2 a 5 produtos no lançamento, e 6.9 (regra 8) proíbe requisito que assuma número mínimo; catálogo quebrado no primeiro dia contradiz OB-05.
- **Comportamento esperado:** com poucos produtos, mesma grade, sem filtro, busca ou espaço de preenchimento, e introdução que assume portfólio em formação e reforça soluções e contato; com zero produtos, mensagem objetiva e chamada para contato. Proibidos card falso, item "em breve" sem página e produto fictício.
- **Páginas afetadas:** P-03.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dado um catálogo com 2 produtos, quando aberto, então a grade não exibe posições vazias nem placeholders. Dado zero produtos publicados, então a página exibe mensagem e chamada para contato, sem erro.
- **Depende de:** RF-040, PR-002.

#### RF-050 — Estado sem resultados de filtro ou busca
- **Descrição:** quando filtro ou busca não retornam itens, a página exibe estado dedicado com saída.
- **Motivo:** J-06 e PU-03: resultado vazio sem caminho encerra a sessão; a saída converte frustração em contato (OB-03).
- **Comportamento esperado:** informa que nenhum item corresponde ao critério, apresenta ação de limpar filtro ou busca, oferece link para o catálogo completo e para o contato, e preserva o termo digitado para correção.
- **Páginas afetadas:** P-03, P-05, P-17, P-18.
- **Prioridade:** Fase 2.
- **Critérios de aceite:** Dado um filtro sem correspondência, quando aplicado, então a mensagem, a ação de limpar e o link de contato estão presentes. Ao limpar o filtro, a listagem completa é restaurada.
- **Depende de:** RF-044, RF-046.

### 9.4 Página individual de software (RF-060..070, RF-222)

#### RF-060 — Template único obrigatório com ordem fixa
- **Descrição:** toda página de produto é gerada pelo template de P-04, com as onze seções na ordem definida, não editável por produto.
- **Motivo:** PR-008 e princípio 8: página artesanal para produto estratégico quebra a comparabilidade de J-06 e reintroduz retrabalho a cada lançamento (OB-07).
- **Comportamento esperado:** não existe página de produto fora do template; a ordem das seções é idêntica em todo o catálogo; adicionar produto não cria exceção de layout; alterações de template valem para todos os produtos simultaneamente.
- **Páginas afetadas:** P-04.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dadas duas páginas de produto, quando comparadas, então as seções presentes aparecem na mesma ordem. Ao publicar um produto novo, nenhuma página específica é criada manualmente.
- **Depende de:** RF-010, RF-180.

#### RF-061 — Bloco de abertura e rótulo de tipo
- **Descrição:** a primeira seção exibe rótulo "Software", nome, resumo de uma linha, categoria e ação primária.
- **Motivo:** P-06 define o rótulo fixo como um dos quatro mecanismos que impedem a confusão entre produto e solução; PU-03, que entra por busca, precisa se situar em segundos.
- **Comportamento esperado:** o rótulo é fixo e não editável pelo autor do conteúdo; a ação primária é contato ou demonstração, visível sem rolagem em tela pequena; a categoria só é exibida quando visível publicamente.
- **Páginas afetadas:** P-04.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao abrir qualquer produto, o rótulo "Software" precede o nome. Ao abrir em tela pequena, a ação primária está visível na primeira tela.
- **Depende de:** RF-085.

#### RF-062 — Seções obrigatórias e mínimos de preenchimento
- **Descrição:** problema que resolve, para quem é, funcionalidades (mínimo 3), benefícios (mínimo 3) e informações comerciais são obrigatórios em todo produto publicado.
- **Motivo:** os mínimos impedem páginas rasas e sustentam J-02 e J-06, em que o visitante compara escopos vizinhos; sem eles o vigésimo produto seria pior que o primeiro (princípio 8).
- **Comportamento esperado:** benefícios são redigidos como resultado e não repetem a lista de funcionalidades; "para quem é" descreve papéis ou tipos de organização, evitando lead desqualificado; a publicação é bloqueada se qualquer mínimo não for atendido (RF-185).
- **Páginas afetadas:** P-04.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dado um produto com 2 funcionalidades, quando se tenta publicar, então a publicação é recusada com indicação do campo. Ao abrir um produto publicado, nenhuma seção obrigatória está vazia.
- **Depende de:** RF-185.

#### RF-063 — Renderização condicional de blocos ausentes
- **Descrição:** seções condicionais — mídia, integrações, soluções, produtos relacionados — são omitidas por completo quando não há conteúdo.
- **Motivo:** princípio 2: nenhuma página publicada exibe lacuna, imagem ausente ou "em breve"; espaço vazio comunica descuido a PU-01 e PU-06 (OB-05).
- **Comportamento esperado:** omissão elimina título, espaçamento e separadores da seção, não apenas o conteúdo; nunca há substituição por imagem genérica ou texto de preenchimento; a ausência de uma seção não altera a ordem das demais.
- **Páginas afetadas:** P-04, P-06, P-11.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dado um produto sem integrações, quando a página é aberta, então nem o título nem o espaço da seção aparecem. Dado um produto sem imagens, então nenhuma imagem genérica é exibida.
- **Depende de:** RF-060.

#### RF-064 — Galeria e material de demonstração
- **Descrição:** quando existir material visual do produto, a seção de imagens ou demonstração é obrigatória.
- **Motivo:** J-02 registra a falta de imagens como causa de abandono para PU-03; material existente e não publicado é perda direta de conversão (OB-03). **Q-005, resolvida:** haverá prints de tela dos produtos, com espaço reservado no template desde já — mas RF-041 já torna a imagem de destaque obrigatória para publicar; este requisito trata da galeria adicional, que continua condicionada a existir material além da imagem obrigatória.
- **Comportamento esperado:** cada imagem tem texto alternativo descritivo obrigatório; a galeria é navegável por teclado; vídeo, quando houver, não inicia automaticamente com som e possui alternativa textual; com material de galeria inexistente para um produto específico, a seção é omitida integralmente — nunca com imagem genérica no lugar.
- **Páginas afetadas:** P-04, P-06.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dado material cadastrado, quando a página é aberta, então a galeria é navegável apenas por teclado. Dada uma imagem sem texto alternativo, quando se tenta publicar, então a publicação é recusada.
- **Depende de:** RF-187, RF-041.

#### RF-065 — Informações comerciais e ausência de preço
- **Descrição:** a seção de informações comerciais descreve o modelo de contratação e, na ausência de preço, exibe um texto padrão único para todo o catálogo.
- **Motivo:** PR-005 mantém o preço fora do MVP (**Q-008, resolvida:** o preço depende do projeto e não será publicado; PR-005 continua válida). J-02 mostra que a ausência de preço só não bloqueia se houver explicação do critério — frases evasivas diferentes por produto quebrariam o princípio 8. **Q-007, resolvida:** o modelo comercial é assinatura recorrente **e** projeto sob encomenda — não uma escolha entre os dois —, e cada produto pode se enquadrar em um, no outro, ou nos dois, conforme o escopo.
- **Comportamento esperado:** o texto padrão explica que a ArtZan trabalha com assinatura recorrente e com projeto sob encomenda, conforme o escopo, sem fixar um modelo único para todo o catálogo; é definido uma vez e aplicado a todos os produtos, não editável individualmente; explica que o valor depende do escopo e indica o caminho para proposta; se no futuro a empresa decidir publicar preço público ou faixado, o campo passa a ser exibido em todos os produtos de uma vez.
- **Páginas afetadas:** P-04, P-06.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dadas duas páginas de produto, o texto sobre modelo de contratação e ausência de preço é idêntico. Ao abrir a seção, existe caminho direto para solicitar proposta.
- **Depende de:** PR-005.

#### RF-066 — Soluções das quais o produto participa
- **Descrição:** bloco derivado que lista todas as soluções publicadas que contêm o produto, sem hierarquia entre elas.
- **Motivo:** OB-09 e princípio 4: é o mecanismo que faz publicar uma solução enriquecer automaticamente as páginas de todos os produtos que ela agrega (P-04).
- **Comportamento esperado:** gerado exclusivamente pelo vínculo N:N (PR-003), nunca digitado; ordem estável e sem destaque para nenhuma solução; nenhum texto da página de produto pode assumir uma solução específica como contexto fora deste bloco; sem vínculo, o bloco é omitido.
- **Páginas afetadas:** P-04, P-06.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dado que uma solução nova inclui o produto, quando publicada, então o bloco passa a exibi-la sem edição da página de produto. Dado um produto em três soluções, então as três aparecem sem ordenação por importância.
- **Depende de:** RF-082, RF-086.

#### RF-067 — Produtos relacionados
- **Descrição:** bloco opcional com produtos complementares, derivados por categoria ou selecionados manualmente.
- **Motivo:** J-06: o visitante compara escopos vizinhos; oferecer o produto adjacente reduz a chance de abandono por escolha errada (OB-02).
- **Comportamento esperado:** rotulado sempre como "relacionado", nunca como "solução", para não competir com RF-066; usa o card padrão; exclui o próprio produto e produtos despublicados; sem candidatos, o bloco é omitido.
- **Páginas afetadas:** P-04.
- **Prioridade:** Fase 2.
- **Critérios de aceite:** Ao abrir o bloco, o rótulo não contém a palavra "solução". Dado um produto despublicado que era relacionado, quando a página recarrega, então ele não aparece.
- **Depende de:** RF-041, RF-066.

#### RF-068 — Chamada para contato e demonstração com contexto
- **Descrição:** a página encerra com ação de contato e de demonstração, e a origem é transportada para o formulário.
- **Motivo:** OB-03 e J-02: pedir ao visitante que redigite o produto de interesse é fricção evitável e degrada a qualidade do lead (P-08).
- **Comportamento esperado:** ao acionar a partir de um produto, o campo de interesse do formulário chega pré-preenchido com aquele produto e o campo permanece editável; a origem é registrada mesmo que o visitante altere a seleção; a ação também está acessível durante a leitura, não apenas ao fim.
- **Páginas afetadas:** P-04, P-08, P-09.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dado o acionamento a partir de um produto, quando o formulário abre, então o campo de interesse já contém aquele produto. Ao enviar, o registro do lead indica a página de origem.
- **Depende de:** RF-120, RF-128.

#### RF-069 — Trilha e caminho ao institucional
- **Descrição:** a página exibe a trilha `Início › Softwares › [Produto]` e oferece caminho explícito para `/sobre` e `/produtos`.
- **Motivo:** J-05: PU-07 chega por busca sem contexto de marca; sem identificação e caminho de subida, a sessão termina em uma página só (OB-01, OB-08).
- **Comportamento esperado:** a trilha nunca inclui categoria, coerente com 6.4; a identificação da ArtZan está presente independentemente da rolagem (RF-001); o caminho ao institucional não depende do rodapé como única via.
- **Páginas afetadas:** P-04.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao entrar direto em uma página de produto, é possível alcançar o catálogo e o institucional em um clique. A trilha exibe exatamente dois níveis acima do produto.
- **Depende de:** RF-005, RF-001.

#### RF-070 — Bloqueio de publicação incompleta
- **Descrição:** um produto só é publicável com todos os campos obrigatórios do modelo de conteúdo (6.7) preenchidos.
- **Motivo:** princípio 2 e princípio 8: a consistência do catálogo depende de a validação ocorrer antes da publicação, não de revisão humana caso a caso.
- **Comportamento esperado:** a tentativa de publicar sem obrigatórios é recusada com indicação de cada campo pendente; rascunhos incompletos podem ser salvos, mas não ficam acessíveis publicamente nem aparecem em listagens, mapa do site ou blocos derivados.
- **Páginas afetadas:** P-04.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dado um produto sem imagem de destaque, quando se tenta publicar, então a operação é recusada nomeando o campo. Dado um rascunho, quando seu endereço é acessado publicamente, então responde como recurso não encontrado.
- **Depende de:** RF-185, RF-186.

#### RF-222 — Registro do pedido de avaliação gratuita, sem provisionamento automático
- **Descrição:** o envio do formulário de P-09 registra o pedido de avaliação gratuita e confirma o recebimento; o site não cria, ativa nem libera automaticamente nenhum ambiente de teste.
- **Motivo:** Q-026 mudou o formato da demonstração para um ambiente próprio de teste por tempo determinado (Q-022, período de avaliação gratuita); isso muda a expectativa do visitante em relação à antiga apresentação conduzida por pessoa (PR-016, revisada) — sem este requisito, um visitante pode razoavelmente esperar acesso imediato ao enviar o formulário, expectativa que o site não tem como cumprir sozinho. Registrar essa fronteira evita prometer automação que não existe.
- **Comportamento esperado:** a página de confirmação (RF-125, P-16) trata o pedido de avaliação exatamente como qualquer outro lead — confirma recebimento e informa o prazo de resposta de até 2 dias úteis (Q-013) —, sem mencionar liberação automática de acesso; a criação e a liberação do ambiente de teste, incluindo suas credenciais e sua duração exata, são decididas e executadas por um dos sócios fora do site, pelos canais confirmados (RF-220, e-mail); o site não integra nem provisiona qualquer sistema de teste — sua responsabilidade termina no registro do pedido e no alerta ao responsável (RNF-092).
- **Páginas afetadas:** P-09, P-16.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao enviar o formulário de P-09, a confirmação exibida não afirma nem sugere acesso imediato ao software. Nenhuma integração do site cria automaticamente conta, ambiente ou credencial de teste.
- **Depende de:** RF-121, RF-125, RNF-092.

### 9.5 Soluções compostas (RF-080..089)

**Q-006, resolvida: não haverá solução composta publicada no lançamento.** Isso não remove a faixa — o modelo de dados e o relacionamento muitos-para-muitos entre produto e solução são a razão de ser da arquitetura de catálogo (PR-003), e **permanecem MVP** independentemente de existir solução publicada no dia um. Cada requisito abaixo foi reclassificado em duas categorias: (1) **modelo e mecanismo** — vínculo, regras de composição, convenções de nomeação e URL —, que precisam existir desde o lançamento como fundação da primeira solução futura; e (2) **exibição pública** — índice, card, template —, construída no MVP, mas cuja aparição real depende de existir ao menos uma solução publicada. Nenhuma das duas é Fase 2: a diferença é "sempre ativo" versus "construído, ativado na primeira publicação". RF-089 garante que, até lá, nenhum menu ou link leva a uma listagem vazia.

#### RF-080 — Índice de soluções
- **Descrição:** P-05 lista todas as soluções publicadas, precedidas de explicação curta do que é uma solução composta na ArtZan.
- **Motivo:** OB-09 precisa de lugar próprio; sem índice, a venda combinada só existiria dentro de páginas de produto e nunca seria descoberta por PU-04 em J-03.
- **Comportamento esperado:** listagem gerada por registros, com card de solução (RF-081) e caminho para o catálogo e para o contato ao fim; o texto introdutório distingue solução de produto antes da primeira leitura de card.
- **Páginas afetadas:** P-05.
- **Prioridade:** MVP — categoria exibição pública: a página é construída e publicável no lançamento, mas fica sem conteúdo a exibir enquanto não houver nenhuma solução (Q-006); RF-089 rege o comportamento nesse estado.
- **Critérios de aceite:** Ao publicar uma solução, ela aparece no índice sem edição da página. Ao abrir o índice, o texto introdutório explica a diferença entre software e solução.
- **Depende de:** RF-089.

#### RF-081 — Card de solução
- **Descrição:** o card de solução exibe rótulo "Solução", nome, resumo da necessidade, os produtos que a compõem e o ganho em uma linha.
- **Motivo:** P-06: exibir os produtos no próprio card é o que impede que a solução seja lida como um produto novo, e antecipa a resposta de J-03 "preciso contratar tudo?".
- **Comportamento esperado:** tratamento visual distinto do card de produto, consistente em todas as páginas onde aparece; a lista de produtos vem do vínculo, com no mínimo dois itens (PR-010); produto despublicado é removido do card automaticamente.
- **Páginas afetadas:** P-01, P-05, P-07.
- **Prioridade:** MVP — categoria exibição pública: o card é construído no lançamento; sem nenhuma solução publicada (Q-006), ele simplesmente não tem instância para renderizar, coerente com RF-023 e RF-089.
- **Critérios de aceite:** Ao abrir o índice, cada card mostra os produtos que compõem a solução. Ao comparar com o card de produto, o tratamento visual é distinguível sem ler o rótulo.
- **Depende de:** RF-085.

#### RF-082 — Template da página de solução
- **Descrição:** P-06 é gerada por template único com as oito seções na ordem definida, sendo obrigatórias nome e resumo, cenário, produtos que compõem, ganho da combinação e chamada para contato.
- **Motivo:** mesma razão de RF-060 aplicada a soluções: consistência editorial e crescimento sem retrabalho (OB-07, OB-09).
- **Comportamento esperado:** casos de uso, adoção por etapas e parceiros envolvidos são condicionais e omitidos quando ausentes (RF-063); a solução nunca descreve funcionalidades próprias — se tiver, é produto novo, e a publicação deve ser revista.
- **Páginas afetadas:** P-06.
- **Prioridade:** MVP — categoria exibição pública: o template precisa existir para que a primeira solução (quando publicada) já nasça consistente com o restante do site; sem nenhuma solução (Q-006), nenhuma página deste template é gerada.
- **Critérios de aceite:** Dadas duas soluções, as seções presentes aparecem na mesma ordem. Dada uma solução sem casos de uso, quando aberta, então a seção não é renderizada.
- **Depende de:** RF-010, RF-083, RF-084.

#### RF-083 — Composição por vínculo, com card e link
- **Descrição:** a página lista os produtos que compõem a solução usando o card padrão do catálogo, com link para cada página de produto.
- **Motivo:** 6.9, regra 4: a solução referencia e não reescreve o produto, evitando divergência quando o produto é atualizado; J-03 exige avaliar cada peça antes de decidir.
- **Comportamento esperado:** mínimo de dois produtos vinculados (PR-010); a solução não duplica a descrição do produto; produto despublicado sai da composição e, se restar menos de dois, a solução é sinalizada como pendente de revisão e não permanece publicada com composição inválida.
- **Páginas afetadas:** P-06.
- **Prioridade:** MVP — categoria modelo e mecanismo: a regra de composição por vínculo precisa existir antes de qualquer solução ser cadastrada, para que a primeira já nasça correta; não depende de haver solução publicada para ser construída.
- **Critérios de aceite:** Dada uma solução com dois produtos, quando um é despublicado, então a solução é sinalizada e sai do ar até revisão. Ao alterar o resumo de um produto, o card exibido na solução reflete a alteração sem edição da solução.
- **Depende de:** RF-041, RF-186.

#### RF-084 — Ganho da combinação obrigatório
- **Descrição:** campo obrigatório que declara o que a união entrega e nenhum produto entrega isolado.
- **Motivo:** critério 3 de existência de solução (P-06) e nível 3 da mensagem (5.2): se o ganho for a soma óbvia das partes, a solução não se justifica e vira "produtos relacionados".
- **Comportamento esperado:** publicação bloqueada sem o campo; quando a composição muda, o campo é marcado como pendente de revisão editorial e a alteração fica registrada para quem administra; o conteúdo é redigido com verbos de cobertura, não de capacidade.
- **Páginas afetadas:** P-06.
- **Prioridade:** MVP — categoria modelo e mecanismo: é regra de validação do painel (RF-185), necessária desde a primeira solução que qualquer um dos sócios tentar publicar, independentemente de quantas soluções já existirem.
- **Critérios de aceite:** Dada uma solução sem ganho preenchido, quando se tenta publicar, então a operação é recusada. Dado que um produto é adicionado à composição, então o ganho é sinalizado para revisão.
- **Depende de:** RF-083, RF-185.

#### RF-085 — Diferenciação entre produto e solução
- **Descrição:** produto e solução são distinguidos por quatro mecanismos simultâneos: rótulo fixo, linguagem, tratamento visual e trilha com URL em espaços separados.
- **Motivo:** J-03 registra a confusão produto/solução como principal causa de abandono; um único mecanismo não basta para quem chega direto por busca (PU-07).
- **Comportamento esperado:** rótulos "Software" e "Solução" são fixos e não editáveis; produto usa verbos de capacidade e solução verbos de cobertura; os endereços seguem `/produtos/…` e `/solucoes/…`, nunca aninhados (6.4); o card de solução sempre exibe os produtos que a compõem.
- **Páginas afetadas:** P-03, P-04, P-05, P-06.
- **Prioridade:** MVP — categoria modelo e mecanismo: rótulo, convenção de linguagem, tratamento visual e padrão de URL precisam estar definidos antes de existir a primeira solução, para que ela não seja publicada sob uma convenção provisória depois corrigida.
- **Critérios de aceite:** Ao abrir qualquer página de solução, rótulo, trilha e endereço a identificam como solução. Ao revisar textos, nenhuma solução descreve funcionalidades próprias.
- **Depende de:** RF-005, RF-061, RF-081, RF-169.

#### RF-086 — Mesmo produto em várias soluções
- **Descrição:** um produto pode integrar quantas soluções forem cadastradas, sem exclusividade nem limite.
- **Motivo:** PR-003 é a decisão estrutural central do PRD; qualquer restrição a um vínculo por produto inviabilizaria OB-09 e exigiria reestruturação futura.
- **Comportamento esperado:** o produto aparece com o mesmo card em todas as soluções; sua página lista todas elas sem hierarquia; é proibido texto na página de produto assumindo uma solução como contexto fora do bloco derivado (P-06).
- **Páginas afetadas:** P-04, P-05, P-06.
- **Prioridade:** MVP — categoria modelo e mecanismo: é a regra estrutural central do catálogo (PR-003); permanece MVP independentemente de existir solução publicada, porque o próprio modelo de produto (RF-066) depende dela desde o primeiro produto cadastrado.
- **Critérios de aceite:** Dado um produto em três soluções, quando cada solução é aberta, então o produto aparece corretamente nas três. Ao abrir a página do produto, as três soluções são listadas sem ordenação por importância.
- **Depende de:** RF-066, RF-083.

#### RF-087 — Alteração da composição sem reescrever páginas
- **Descrição:** incluir ou remover produto de uma solução é operação sobre o vínculo e não exige editar a página da solução nem a de qualquer produto.
- **Motivo:** OB-07 no nível da entidade: se cada mudança de composição exigisse reescrita, o custo de manter o portfólio cresceria com o quadrado do número de vínculos.
- **Comportamento esperado:** após a alteração, a página da solução se recompõe, os blocos derivados dos produtos afetados se atualizam e o selo do catálogo (RF-042) é recalculado; apenas o ganho da combinação exige revisão editorial, sinalizada por RF-084.
- **Páginas afetadas:** P-03, P-04, P-06.
- **Prioridade:** MVP — categoria modelo e mecanismo: precisa estar pronto antes da primeira solução ser composta, para que incluir o primeiro produto numa solução já funcione por vínculo, sem exigir ajuste posterior.
- **Critérios de aceite:** Dado um produto adicionado a uma solução, quando a página do produto é aberta, então a solução consta do bloco derivado sem edição do produto. Nenhum texto de produto precisou ser alterado.
- **Depende de:** RF-066, RF-083, RF-182.

#### RF-088 — Chamada para ação da solução com contexto
- **Descrição:** a página de solução encerra com chamada para contato que transporta a solução como origem.
- **Motivo:** J-03 termina em "contato com a solução registrada como origem"; sem esse registro não é possível medir a contribuição de OB-09 ao funil.
- **Comportamento esperado:** o campo de interesse do formulário chega pré-preenchido com a solução, editável; o texto da chamada reconhece que a adoção pode ser por etapas, respondendo à objeção "preciso contratar tudo?".
- **Páginas afetadas:** P-06, P-08.
- **Prioridade:** MVP — categoria exibição pública: só se manifesta quando existir página de solução para exibir a chamada (Q-006); o comportamento precisa estar pronto desde o template para que a primeira solução publicada já converta corretamente.
- **Critérios de aceite:** Dado o acionamento a partir de uma solução, quando o formulário abre, então o interesse contém aquela solução. Ao enviar, o lead identifica a solução de origem.
- **Depende de:** RF-120, RF-128.

#### RF-089 — Estado sem soluções e filtro por produto
- **Descrição:** com zero soluções publicadas — o estado confirmado do lançamento —, a página e o item de menu são ocultados; com 7 ou mais soluções, é ativado o filtro por produto.
- **Motivo:** P-05 e gatilho de 6.6: página vazia frustra e comunica portfólio inacabado (princípio 2); filtro antes do volume é ruído. **Q-006, resolvida:** não haverá solução composta no lançamento, o que torna este requisito o comportamento **padrão esperado no dia um**, não uma exceção hipotética — nenhum menu, rodapé ou bloco da inicial (RF-023) pode levar a uma listagem vazia de soluções enquanto essa condição persistir.
- **Comportamento esperado:** o estado vazio remove o item do menu e o link do rodapé, sem página publicada; o mesmo vale para qualquer bloco derivado que dependeria de solução existir (RF-023, RF-066); ao publicar a primeira solução pelo painel, página, menu, rodapé e blocos derivados voltam a aparecer automaticamente, sem intervenção de desenvolvimento; o filtro por produto, quando ativo, usa a mesma mecânica de RF-044, inclusive contagem de resultados e estado sem correspondência.
- **Páginas afetadas:** P-01, P-05, P-06.
- **Prioridade:** MVP (ocultação, ativa desde o lançamento); Fase 2 (filtro, ativado apenas pelo gatilho de volume).
- **Critérios de aceite:** Dado zero soluções publicadas, quando o site é aberto, então "Soluções" não aparece no menu, no rodapé nem na inicial. Dadas 7 soluções, o filtro por produto pode ser ativado por configuração.
- **Depende de:** RF-002, RF-023, RF-048, Q-023.

### 9.6 Parceiros (RF-100..107)

#### RF-100 — Listagem de parceiros agrupada por tipo
- **Descrição:** P-07 apresenta os parceiros publicados agrupados pelo tipo de parceria, precedidos de introdução sobre o papel das parcerias.
- **Motivo:** OB-06 e PU-05: o visitante precisa entender qual é a relação antes do nome; lista sem tipo não responde "quem me atende?" em J-04.
- **Comportamento esperado:** listagem gerada por registros, ordenada por tipo e depois pelo campo de ordem; grupos sem parceiros não são renderizados; a introdução deixa explícito que parceiros não são clientes.
- **Páginas afetadas:** P-07.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao abrir a página, cada parceiro aparece sob o rótulo do seu tipo. Dado um tipo sem parceiros, então o grupo não é exibido.
- **Depende de:** RF-102, Q-025.

#### RF-101 — Ficha do parceiro
- **Descrição:** cada parceiro exibe nome, logo, descrição curta, tipo de parceria, natureza da relação e, quando houver, link externo e vínculos com produtos ou soluções.
- **Motivo:** J-04 aponta "relação vaga" como causa de abandono; a natureza da relação é campo obrigatório justamente por isso.
- **Comportamento esperado:** todos os campos obrigatórios do modelo (6.7) preenchidos para publicar; a descrição da relação é a acordada com o parceiro; nenhum parceiro fictício ou ilustrativo é publicado.
- **Páginas afetadas:** P-07.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao abrir a ficha, tipo e natureza da relação estão visíveis. Dado um parceiro sem natureza da relação, quando se tenta publicar, então a operação é recusada.
- **Depende de:** RF-185, PR-018.

#### RF-102 — Taxonomia de tipos de parceria
- **Descrição:** o tipo de parceria é escolhido em taxonomia controlada, editável sem desenvolvimento.
- **Motivo:** OB-06; **Q-024, resolvida:** a taxonomia de P-07 deixa de ser rascunho a validar — o cliente confirmou seguir a proposta do PRD tal como está; texto livre por parceiro tornaria o agrupamento inconsistente e impediria a leitura comparativa.
- **Comportamento esperado:** valores iniciais conforme P-07 — tecnológico, implantação, revenda, indicação, institucional; alterar, acrescentar ou remover tipo é operação de cadastro; um parceiro pode ter mais de um tipo, e nesse caso aparece em cada grupo pertinente.
- **Páginas afetadas:** P-07.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao cadastrar um parceiro, o tipo é selecionado de lista controlada. Ao acrescentar um tipo novo, nenhuma alteração de código é necessária.
- **Depende de:** RF-181.

#### RF-103 — Autorização de uso de marca de terceiro
- **Descrição:** logo e nome de parceiro só são publicados com autorização formal registrada no cadastro.
- **Motivo:** PR-018 e risco jurídico e reputacional: publicar marca de terceiro sem autorização expõe a ArtZan e contradiz OB-05.
- **Comportamento esperado:** o campo de autorização é obrigatório e bloqueia a publicação quando ausente; a autorização registra data e responsável; a remoção a pedido do parceiro é imediata, retirando-o da página, da faixa da inicial e de qualquer bloco derivado.
- **Páginas afetadas:** P-01, P-07, P-06.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dado um parceiro sem autorização registrada, quando se tenta publicar, então a operação é recusada. Dada uma solicitação de remoção, quando o parceiro é despublicado, então ele desaparece de todas as páginas na mesma operação.
- **Depende de:** RF-186, PR-018.

#### RF-104 — Link externo com atributos de segurança
- **Descrição:** o link para o site do parceiro abre em nova aba, sem transferir autoridade de busca e sem expor o contexto da janela de origem.
- **Motivo:** o link é conveniência para PU-05, não endosso de posicionamento; abrir na mesma aba interromperia J-04 e transferir autoridade beneficiaria terceiros à custa de OB-08.
- **Comportamento esperado:** abertura em nova aba sinalizada visualmente e para tecnologias assistivas; relação de link que impede transferência de autoridade e o acesso da página de destino à janela de origem; links quebrados são detectados pela verificação de RNF-094.
- **Páginas afetadas:** P-07.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao acionar o link, uma nova aba é aberta e a página de origem permanece. Ao inspecionar o link, ele não transfere autoridade de busca.
- **Depende de:** RNF-094.

#### RF-105 — Comportamento quando não há parceiros
- **Descrição:** com zero parceiros publicados, P-07 não é publicada, o item de menu é ocultado e a faixa da inicial é omitida.
- **Motivo:** PR-011 admite lista vazia no lançamento; página vazia ou logos genéricos comunicariam parcerias inexistentes, o que fere o princípio 2 e a regra de não inventar fatos.
- **Comportamento esperado:** nenhum link para `/parceiros` no menu ou rodapé nesse estado; ao publicar o primeiro parceiro autorizado, página, item de menu e faixa voltam a aparecer sem intervenção de desenvolvimento; o bloco "seja um parceiro" pode permanecer como página simples se houver interesse em captar canal.
- **Páginas afetadas:** P-01, P-07.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dado zero parceiros, quando o site é navegado, então não há caminho para `/parceiros`. Dado o primeiro parceiro publicado, então página, menu e faixa aparecem automaticamente.
- **Depende de:** RF-002, RF-025, Q-025.

#### RF-106 — Vínculo entre parceiro, produto e solução
- **Descrição:** parceiros podem ser vinculados a produtos e soluções, e o vínculo é exibido nos dois sentidos quando existir.
- **Motivo:** J-04 leva do parceiro à solução; sem vínculo, a página de parceiros é beco sem saída e não contribui para OB-03.
- **Comportamento esperado:** relação N:N conforme 6.7; na ficha do parceiro, os produtos e soluções aparecem como links; na página de solução, o bloco de parceiros envolvidos é condicional e omitido quando vazio; despublicar qualquer lado remove o vínculo da exibição.
- **Páginas afetadas:** P-06, P-07.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dado um parceiro vinculado a uma solução, quando a ficha é aberta, então há link para a solução. Dada a solução despublicada, então o vínculo deixa de ser exibido.
- **Depende de:** RF-082, RF-182.

#### RF-107 — Captação de novos parceiros
- **Descrição:** a página de parceiros oferece bloco "seja um parceiro" que leva ao formulário de contato com o assunto já classificado como parceria.
- **Motivo:** PU-05 chega buscando modelo de parceria (4.1), e o volume esperado não justifica página de candidatura própria no lançamento; classificar a origem evita lead mal roteado (RF-129).
- **Comportamento esperado:** o bloco existe mesmo quando não há parceiros publicados, desde que haja interesse comercial em captar canal; ao acionar, o formulário abre com o assunto "sou parceiro" pré-selecionado e editável.
- **Páginas afetadas:** P-07, P-08.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao acionar o bloco, o formulário abre com o assunto de parceria selecionado. O lead resultante é identificável como candidatura a parceria.
- **Depende de:** RF-120, RF-129.

### 9.7 Formulários e contato comercial (RF-120..132, RF-220..221)

Esta faixa concentra a conversão do MVP (OB-03, OB-04). **Premissa PR-020:** contato e demonstração são os únicos formulários do site no lançamento; não há cadastro, área logada (PR-001) nem assinatura de newsletter. Isso não muda com a resposta a Q-012: WhatsApp e e-mail passam a existir como **canais** de contato ao lado do formulário (RF-220), mas nenhum dos dois é um terceiro formulário — a premissa permanece válida.

#### RF-120 — Formulário de contato comercial
- **Descrição:** P-08 apresenta formulário com nome, e-mail, empresa, assunto, produto ou solução de interesse e mensagem.
- **Motivo:** OB-03: é o único mecanismo de conversão do MVP; PR-004 estabelece que a venda é concluída por atendimento humano, e o formulário faz a qualificação mínima. **Premissa PR-046, confirmada (Q-062):** o cliente decidiu não incluir campo de qualificação comercial; o formulário permanece curto, exatamente como especificado abaixo.
- **Comportamento esperado:** obrigatórios nome, e-mail e mensagem; empresa e interesse são opcionais para não bloquear PU-07; o assunto é lista controlada que inclui a opção "sou parceiro" (PU-05); o formulário cabe em uma tela de celular sem rolagem excessiva, com no máximo seis campos visíveis; nenhum campo de qualificação comercial é adicionado.
- **Páginas afetadas:** P-08.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao abrir P-08 em tela pequena, todos os campos são utilizáveis sem zoom. Dado o preenchimento apenas dos obrigatórios, o envio é aceito.
- **Depende de:** RF-122, RF-127.

#### RF-121 — Formulário de solicitação de avaliação gratuita
- **Descrição:** P-09 é variante de P-08, com os mesmos campos base mais identificação do produto ou solução de interesse.
- **Motivo:** J-02 termina em pedido de avaliação; tratar como variante, e não como estrutura independente, evita dois fluxos divergentes de manutenção (princípio 7). **Q-026, resolvida:** a demonstração deixou de ser apresentação conduzida por pessoa (**PR-016, revisada** — a versão anterior desta premissa não vale mais) e passa a ser **ambiente próprio para teste por tempo determinado**, oferecido como período de avaliação gratuita (Q-022). Isso muda o pedido: o visitante não está marcando uma apresentação, está solicitando acesso temporário ao software.
- **Comportamento esperado:** identificação do produto ou solução obrigatória, pré-preenchida quando a origem for uma página de catálogo; o campo de disponibilidade de agenda da versão anterior deste requisito deixa de existir, porque não há apresentação por pessoa a agendar; o texto da página informa, sem ambiguidade, que o envio é um **pedido** de avaliação gratuita e que a liberação do ambiente de teste é feita por um dos sócios depois do envio, nunca automaticamente pelo site (RF-222); nenhum prazo de duração do período de avaliação é anunciado no formulário além do que a resposta humana confirmar.
- **Páginas afetadas:** P-04, P-06, P-09.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dado o acesso a partir de um produto, quando P-09 abre, então o produto está identificado. Ao abrir P-09, o texto informa que o pedido será avaliado por um sócio e que o acesso ao ambiente de teste não é concedido no momento do envio.
- **Depende de:** RF-068, RF-128, RF-222.

#### RF-122 — Validação em tempo real e no envio
- **Descrição:** os campos são validados ao perder o foco e novamente no envio, antes de qualquer processamento.
- **Motivo:** OB-04: erro descoberto só após o envio faz o visitante recomeçar e é causa direta de abandono em J-01.
- **Comportamento esperado:** validação de formato de e-mail, de comprimento mínimo da mensagem e de campos obrigatórios; a validação no cliente é conveniência e a validação no servidor é obrigatória, jamais dispensada; campo corrigido tem o erro removido imediatamente; o envio só é bloqueado por erro real, nunca por formatação cosmética de telefone ou nome.
- **Páginas afetadas:** P-08, P-09.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dado um e-mail inválido, quando o campo perde o foco, então o erro é exibido antes do envio. Dado um envio manipulado sem os obrigatórios, então o servidor recusa a requisição.
- **Depende de:** RF-123.

#### RF-123 — Mensagens de erro por campo
- **Descrição:** cada erro é exibido junto do campo correspondente, em texto que descreve como corrigir.
- **Motivo:** P-08 exige que o erro identifique o campo; mensagem genérica no topo obriga o visitante a caçar o problema e degrada a acessibilidade para PU-06.
- **Comportamento esperado:** a mensagem é associada programaticamente ao campo e anunciada por tecnologias assistivas; o erro não depende apenas de cor; ao falhar o envio, o foco vai ao primeiro campo com erro e um resumo indica a quantidade de pendências; o texto informa a correção, não apenas a falha.
- **Páginas afetadas:** P-08, P-09.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dado um envio com três erros, quando submetido, então o foco vai ao primeiro campo inválido e cada erro aparece junto do seu campo. Ao usar leitor de tela, a mensagem de erro é anunciada com o rótulo do campo.
- **Depende de:** RF-131.

#### RF-124 — Estado de carregamento e prevenção de envio duplicado
- **Descrição:** durante o processamento, o formulário exibe estado de envio em andamento e impede reenvio.
- **Motivo:** sem retorno visível, o visitante clica novamente e gera leads duplicados, que sobrecarregam o time e distorcem a medição de OB-03.
- **Comportamento esperado:** a ação de envio é desabilitada e rotulada como em andamento, com anúncio para tecnologias assistivas; envios idênticos do mesmo remetente em janela curta são descartados no servidor; o duplo clique nunca gera dois registros; o estado dura até a resposta, com tempo limite e mensagem de falha (RF-132).
- **Páginas afetadas:** P-08, P-09.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dado um duplo clique no envio, então apenas um lead é registrado. Durante o processamento, a ação de envio está desabilitada e o estado é anunciado.
- **Depende de:** RF-126, RF-132.

#### RF-125 — Confirmação de sucesso
- **Descrição:** o envio bem-sucedido leva a P-16, com confirmação, prazo de retorno e próximo passo.
- **Motivo:** OB-04 e P-16: sem confirmação explícita o visitante reenvia ou abandona; o destino próprio permite medir conversão sem inferência (RF-201).
- **Comportamento esperado:** a confirmação informa o prazo de resposta de **até 2 dias úteis** (Q-013, resolvida) e nunca promete prazo não confirmado; oferece ao menos um caminho de continuidade; o conteúdo do formulário não é reexibido, evitando reenvio acidental.
- **Páginas afetadas:** P-08, P-09, P-16.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dado um envio válido, então `/obrigado` é exibida com o prazo de até 2 dias úteis e um próximo passo. Ao voltar no navegador, o formulário não reenvia os dados.
- **Depende de:** RF-008.

#### RF-126 — Proteção contra envio automatizado, com ponto de extensão para captcha
- **Descrição:** os formulários são protegidos por campo-armadilha invisível, limitação de taxa por origem e validação de tempo mínimo de preenchimento; a estrutura do envio reserva um ponto de extensão para incluir um desafio interativo (captcha) no futuro, sem ativá-lo no lançamento.
- **Motivo:** formulário público sem proteção recebe envio automatizado desde a primeira indexação, o que polui o funil de OB-03 e faz o time perder confiança no canal. **Q-030, resolvida:** sem desafio interativo no lançamento — evita o atrito e o risco de acessibilidade que um captcha introduziria sem volume real de abuso que o justifique. **PR-050 (revisada):** deixa de ser apenas "exclusão do desafio interativo" e passa a exigir que o ponto de extensão exista desde o desenho inicial, para que ativar um captcha depois seja configuração, não reconstrução do fluxo de envio.
- **Comportamento esperado:** o campo-armadilha não é perceptível nem alcançável por teclado ou leitor de tela, e seu preenchimento descarta o envio silenciosamente; a limitação de taxa restringe envios por origem em janela de tempo, com mensagem clara ao visitante legítimo que a atingir; preenchimento em tempo inferior a poucos segundos é tratado como automatizado; o fluxo de envio prevê um passo de verificação adicional — hoje sem efeito — onde um desafio interativo poderia ser inserido sem alterar os demais campos do formulário nem o roteamento do lead (RF-129). Este ponto de extensão é estrutural, não funcionalidade ativa: nenhum desafio é exibido ao visitante enquanto não houver decisão explícita de ativá-lo, tomada com volume real de abuso medido.
- **Páginas afetadas:** P-08, P-09.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dado o campo-armadilha preenchido, então o envio é descartado sem criar lead. Ao navegar por teclado, o campo-armadilha nunca recebe foco. Nenhum desafio interativo é exibido ao visitante no lançamento.
- **Depende de:** RNF-042.

#### RF-127 — Consentimento e vínculo com a política de privacidade
- **Descrição:** todo formulário informa a finalidade do tratamento dos dados da solicitação e liga à política de privacidade antes do envio; a autorização para receber comunicações futuras é pedida à parte, nunca junto deste aviso.
- **Motivo:** obrigação sob a LGPD e requisito de P-13; PU-06 avalia explicitamente como os dados são tratados, e a transparência é elemento de confiança (OB-05). **Q-066, resolvida:** haverá aceite separado para comunicações futuras (RF-221); este requisito trata apenas do consentimento de tratamento dos dados da própria solicitação, que é distinto e não pode se confundir com aquele.
- **Comportamento esperado:** o aviso descreve finalidade, destinatário e prazo de retenção em linguagem simples, com link para `/privacidade`; o consentimento referente ao tratamento dos dados **desta solicitação** é registrado com data, hora e versão do texto vigente; nenhuma casela deste aviso concede permissão para comunicações futuras não relacionadas ao pedido — essa autorização é tratada exclusivamente por RF-221, sempre desmarcada por padrão.
- **Páginas afetadas:** P-08, P-09, P-13.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao abrir qualquer formulário, o aviso e o link para `/privacidade` estão presentes antes da ação de envio. Ao registrar um lead, a versão do texto de privacidade aceita fica gravada, e o aceite de comunicações futuras (RF-221), quando marcado, fica registrado separadamente do consentimento de tratamento desta solicitação.
- **Depende de:** RF-141, RF-142, RNF-051, RF-221.

#### RF-128 — Registro do contexto de origem
- **Descrição:** cada envio registra a página de origem, o produto ou a solução que o motivou e os parâmetros de campanha, quando houver.
- **Motivo:** OB-03 e OB-09 exigem saber qual página e qual entidade do catálogo geraram a oportunidade; sem isso não é possível avaliar contribuição de produto, de solução ou de parceiro.
- **Comportamento esperado:** a origem é capturada automaticamente e não depende do preenchimento do visitante; permanece registrada mesmo que o campo de interesse seja alterado; envio direto por `/contato`, sem origem, é registrado como origem geral, estado válido e não erro.
- **Páginas afetadas:** P-04, P-06, P-07, P-08, P-09.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dado o envio a partir de uma solução, então o registro identifica a solução e a página. Dado o acesso direto a `/contato`, então o lead é registrado com origem geral, sem falha.
- **Depende de:** RF-068, RF-088, RF-202.

#### RF-129 — Roteamento do lead
- **Descrição:** cada envio é entregue ao destino comercial definido, classificado por assunto e por origem.
- **Motivo:** J-04 e PU-05 produzem leads de natureza diferente do comercial; roteamento indistinto atrasa a resposta e contradiz OB-04. **Q-013 e Q-014, resolvidas:** o destino é a caixa de e-mail compartilhada da ArtZan; um dos dois sócios responde em até 2 dias úteis, e a triagem de qual sócio responde é decidida entre eles (Q-064).
- **Comportamento esperado:** entrega ao destino confirmado, com assunto legível que identifique tipo de formulário, produto ou solução de origem e classificação do assunto; a falha de entrega dispara alerta operacional (RNF-092); nenhum lead é descartado silenciosamente. **Premissa PR-021, confirmada (Q-014):** no MVP o destino é uma caixa de mensagens compartilhada, sem integração com ferramenta de gestão comercial.
- **Páginas afetadas:** P-08, P-09.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dado um envio classificado como parceria, então o destino recebe a classificação no assunto. Dada uma falha de entrega, então um alerta é gerado e o envio fica registrado para reprocessamento.
- **Depende de:** RNF-092.

#### RF-130 — Confirmação por e-mail ao remetente
- **Descrição:** o visitante recebe mensagem automática confirmando o recebimento e informando o prazo de retorno.
- **Motivo:** OB-04 e OB-05: a confirmação em tela desaparece ao fechar a aba; a mensagem cria registro para o visitante e reduz reenvios, sustentando a percepção de seriedade sem prova social.
- **Comportamento esperado:** mensagem transacional, sem conteúdo comercial nem rastreamento de abertura; repete o resumo do pedido e o produto ou solução de interesse; o remetente é um endereço do domínio próprio (**artzan.com.br**, sujeito a alteração), autenticado, para não cair em caixa de spam. **Premissa PR-022:** o e-mail é transacional e não constitui comunicação de marketing, dispensando consentimento adicional. **Q-031, parcialmente resolvida:** haverá e-mail institucional no domínio da ArtZan; o endereço específico ainda não foi criado, então a caixa exata e quem acompanha as respostas a ela continuam pendentes até a criação.
- **Páginas afetadas:** P-08, P-09.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dado um envio válido, então a confirmação chega ao e-mail informado com o prazo de retorno de até 2 dias úteis. Ao inspecionar a mensagem, não há rastreamento de abertura nem conteúdo promocional.
- **Depende de:** RNF-053.

#### RF-131 — Acessibilidade dos formulários
- **Descrição:** todo campo tem rótulo visível e associado, e a interação completa é possível apenas por teclado.
- **Motivo:** princípio 11 e RNF-020: formulário inacessível elimina parte do público de OB-03; PU-06 pode avaliar acessibilidade como critério de contratação.
- **Comportamento esperado:** rótulo persistente, nunca substituído por texto interno que desaparece ao digitar; campos obrigatórios sinalizados em texto, não só por símbolo ou cor; agrupamento com legenda para conjuntos de opções; mensagens de erro e de sucesso anunciadas por região de status; ordem de tabulação igual à ordem visual.
- **Páginas afetadas:** P-08, P-09.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao percorrer o formulário por teclado, todos os campos e a ação de envio são alcançáveis e rotulados. Ao remover o estilo visual, cada campo continua identificável pelo rótulo.
- **Depende de:** RNF-020, RNF-027.

#### RF-132 — Tratamento de falha de envio
- **Descrição:** falha de processamento exibe mensagem clara, preserva o conteúdo digitado e oferece alternativa de contato.
- **Motivo:** perder um lead por falha silenciosa é o pior defeito possível deste site (RNF-092); obrigar o visitante a redigitar após erro equivale a perdê-lo (OB-03).
- **Comportamento esperado:** a mensagem distingue falha temporária de dado inválido; todos os campos preenchidos são mantidos; é oferecida ao menos uma alternativa — nova tentativa e os canais diretos confirmados por Q-012: e-mail e WhatsApp (RF-220); a falha é registrada e alertada, nunca apenas exibida.
- **Páginas afetadas:** P-08, P-09.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dada uma falha de servidor, quando a resposta retorna, então o conteúdo digitado permanece no formulário, com o canal de WhatsApp ou e-mail oferecido como alternativa imediata. Dada a mesma falha, então um alerta operacional é gerado.
- **Depende de:** RNF-092, RF-220.

#### RF-220 — Canal de contato por WhatsApp
- **Descrição:** o site oferece um ponto de acionamento de WhatsApp como canal de contato direto, ao lado do formulário e do e-mail.
- **Motivo:** **Q-012, resolvida:** WhatsApp e e-mail passam a existir como canais de contato além do formulário. PU-07 e visitantes que preferem contato imediato a preencher formulário ganham uma via mais direta; sem especificar o comportamento por dispositivo, o acionamento pode falhar silenciosamente em desktop, onde não há aplicativo nativo instalado por padrão.
- **Comportamento esperado:** em dispositivo móvel com aplicativo de WhatsApp instalado, o acionamento abre uma conversa já direcionada ao número da ArtZan; em desktop, o acionamento abre a versão web do WhatsApp em nova aba ou exibe o número para contato manual — nunca falha silenciosamente nem exige que o visitante descubra o número por conta própria; nenhuma mensagem é pré-preenchida com dado que o visitante não digitou; o site **não acompanha nem registra o conteúdo da conversa** que ocorre fora dele — apenas o evento de acionamento do canal é mensurável (RF-200), nunca o teor trocado no aplicativo.
- **Páginas afetadas:** P-01 a P-18.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao acionar o ponto de contato de WhatsApp em desktop, o visitante recebe um caminho utilizável para iniciar a conversa, sem falha silenciosa. Ao inspecionar a medição do site, nenhum conteúdo da conversa de WhatsApp é capturado.
- **Depende de:** RF-004, RF-028.

#### RF-221 — Aceite separado para comunicações futuras
- **Descrição:** todo formulário oferece uma opção separada e desmarcada por padrão para o visitante autorizar o recebimento de comunicações futuras não relacionadas ao pedido enviado.
- **Motivo:** **Q-066, resolvida:** o cliente confirmou que haverá aceite separado para comunicações futuras. Esse aceite é distinto do consentimento de tratamento dos dados da própria solicitação (RF-127): um autoriza responder ao pedido feito agora; o outro autoriza contato futuro sem pedido correspondente, e misturar os dois violaria a exigência de consentimento específico da LGPD.
- **Comportamento esperado:** a opção aparece como casela própria, sempre desmarcada por padrão, com texto que explica o que o visitante está autorizando e a diferença em relação ao consentimento obrigatório de RF-127; marcar ou não essa opção nunca bloqueia o envio do formulário; a escolha é registrada com data, hora e versão do texto aceito (RNF-057), da mesma forma que o consentimento de tratamento; o visitante pode revogar esse aceite pelo mesmo canal usado para exercer direitos do titular (RNF-054).
- **Páginas afetadas:** P-08, P-09.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao abrir qualquer formulário, a opção de comunicações futuras está desmarcada por padrão e visualmente distinta do aviso de tratamento de dados da solicitação. Ao enviar sem marcar essa opção, o envio é aceito normalmente.
- **Depende de:** RF-127, RNF-057.

### 9.8 Conteúdo e páginas institucionais (RF-140..147)

#### RF-140 — Página institucional sobre a empresa
- **Descrição:** P-02 é montada em blocos reordenáveis e explica promessa institucional, o que a empresa faz, como trabalha e por que um ecossistema de produtos.
- **Motivo:** OB-01 e OB-05: PU-01 e PU-07 não avançam sem saber quem está por trás; a seção "por que um ecossistema" responde à objeção estrutural de J-05.
- **Comportamento esperado:** blocos reordenáveis sem edição de estrutura; nenhuma afirmação não verificável sobre tamanho, tempo de mercado, clientes ou resultados (PR-007); encerra com caminho para catálogo e contato; equipe é bloco opcional — **Q-021, resolvida:** mantém a decisão de não incluir prova social de cliente no lançamento (case ou depoimento seguem vazios até autorização), mas isso não impede publicar a equipe, que é fato verificável sobre a própria ArtZan e não depende de autorização de terceiro.
- **Páginas afetadas:** P-02.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao abrir P-02, o modelo de portfólio está explicado e há caminho para `/produtos` e `/contato`. Ao revisar o texto, nenhuma afirmação depende de dado inexistente.
- **Depende de:** RF-146.

#### RF-141 — Páginas legais publicadas e datadas
- **Descrição:** P-13 e P-14 são publicadas desde o lançamento, com data de atualização visível e acesso a partir do rodapé e de todo formulário.
- **Motivo:** há coleta de dados pessoais desde o primeiro dia (P-08, P-09); a publicação é obrigação legal e, simultaneamente, elemento de confiança verificável (OB-05, RF-026).
- **Comportamento esperado:** mesmo template institucional; linguagem acessível; finalidades descritas e canal para exercício de direitos indicado; a data de vigência aparece no topo do documento, não apenas no rodapé; PR-019 mantém a redação sob responsabilidade do cliente. **Q-028, resolvida:** haverá setor jurídico responsável pelos textos, o que dá a PR-019 um responsável nomeado em vez de uma obrigação genérica do cliente.
- **Páginas afetadas:** P-13, P-14, P-08, P-09.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao abrir `/privacidade`, a data de vigência está visível sem rolagem. Ao abrir qualquer formulário, há link direto para `/privacidade`.
- **Depende de:** RF-127, PR-019.

#### RF-142 — Versionamento dos textos legais
- **Descrição:** cada alteração de texto legal gera nova versão identificada, com data de vigência e histórico preservado.
- **Motivo:** o consentimento registrado em RF-127 só tem valor se for possível demonstrar qual texto vigia no momento da coleta; sem versão, a prova se perde.
- **Comportamento esperado:** a versão vigente é a exibida publicamente; versões anteriores são preservadas e recuperáveis; a data de vigência é obrigatória e não pode ser retroativa; alteração relevante é comunicada no aviso das páginas de formulário. **Q-032, resolvida:** o histórico de versões é **apenas interno** — não há tela pública de versões anteriores; a recuperação serve para prova e auditoria (RNF-057), acessível a quem opera o site, não ao visitante.
- **Páginas afetadas:** P-13, P-14.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dada uma nova versão publicada, então a data de vigência muda e a versão anterior permanece recuperável internamente, sem tela pública dedicada a ela. Ao consultar um lead, a versão do texto aceita é identificável.
- **Depende de:** RF-127, RF-186.

#### RF-143 — Perguntas frequentes
- **Descrição:** P-12 agrupa perguntas por tema — contratação, suporte, integrações e tratamento de dados — com itens vinculáveis a produtos.
- **Motivo:** reduz dúvidas repetidas no atendimento e antecipa objeções de PU-01 e PU-06 antes do contato, melhorando a qualidade dos leads de OB-03.
- **Comportamento esperado:** nenhuma resposta baseada em suposição — as perguntas vêm de contatos reais, o que só existe após o lançamento; cada item pode referenciar produtos e soluções; o conteúdo alimenta os dados estruturados de RF-169.
- **Páginas afetadas:** P-12.
- **Prioridade:** Fase 2.
- **Critérios de aceite:** Ao publicar, cada resposta é rastreável a uma dúvida efetivamente recebida. Ao abrir um item vinculado a produto, há link para a página do produto.
- **Depende de:** RF-169.

#### RF-144 — Índice de conteúdos
- **Descrição:** P-10 lista itens de conteúdo publicados, com título, resumo, imagem, tema e data.
- **Motivo:** OB-08 na sua parcela de Fase 2: a empresa não tem autoridade acumulada e depende de conteúdo para ser encontrada por quem ainda não busca a marca (PU-07).
- **Comportamento esperado:** listagem gerada por registros, ordenada por data de publicação; paginação ativada pelo mesmo gatilho de RF-047; sem itens publicados, a página e o link de rodapé não são exibidos, evitando o efeito de abandono descrito em P-10 (PR-015).
- **Páginas afetadas:** P-10.
- **Prioridade:** Fase 2.
- **Critérios de aceite:** Ao publicar um item, ele aparece no índice sem edição da página. Dado zero itens, então não há link para `/conteudo`.
- **Depende de:** RF-147, Q-027.

#### RF-145 — Item de conteúdo
- **Descrição:** P-11 usa template único, com bloco obrigatório de produtos e soluções relacionados ao final.
- **Motivo:** conteúdo sem destino no catálogo gera visita sem valor comercial; o bloco converte tráfego orgânico em navegação de portfólio (OB-02, OB-08, J-05).
- **Comportamento esperado:** publicar exige ao menos um destino — produto, solução ou contato; identificação da ArtZan presente para quem chega por busca; a URL não contém data (6.4), preservando estabilidade quando o conteúdo é atualizado.
- **Páginas afetadas:** P-11.
- **Prioridade:** Fase 2.
- **Critérios de aceite:** Dado um item sem destino vinculado, quando se tenta publicar, então a operação é recusada. Ao abrir o item, existe caminho para o catálogo.
- **Depende de:** RF-144, RF-170.

#### RF-146 — Reuso de blocos de conteúdo
- **Descrição:** páginas institucionais são montadas a partir de uma biblioteca de blocos reutilizáveis, sem edição de estrutura.
- **Motivo:** princípio 7 e PR-009: a equipe é reduzida e não técnica; criar página institucional não pode exigir desenvolvimento nem produzir arranjos divergentes (RF-010).
- **Comportamento esperado:** os blocos disponíveis são finitos e documentados; a ordem é ajustável; um bloco alterado na biblioteca reflete em todas as páginas que o usam; nenhum bloco permite inserir estrutura arbitrária que quebre o padrão visual ou a hierarquia de cabeçalhos.
- **Páginas afetadas:** P-02, P-12, P-13, P-14.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao criar uma página institucional nova, ela é montada apenas com blocos existentes. Ao reordenar blocos, a hierarquia de cabeçalhos permanece válida.
- **Depende de:** RF-162, RF-181.

#### RF-147 — Política de publicação e despublicação
- **Descrição:** qualquer entidade tem estado de rascunho ou publicado, e a despublicação preserva o endereço com destino alternativo.
- **Motivo:** 6.9, regra 7: produto retirado do portfólio é despublicado, não apagado; a URL preservada protege o histórico de busca conquistado, ativo mais caro de reconstruir (OB-08).
- **Comportamento esperado:** rascunho não aparece em listagens, blocos derivados, mapa do site nem busca interna, e seu endereço responde como não encontrado; ao despublicar, o endereço passa a redirecionar permanentemente para o catálogo ou para o sucessor indicado; o endereço nunca é reaproveitado para outro conteúdo (6.4).
- **Páginas afetadas:** P-03 a P-11, P-18.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dado um produto despublicado com sucessor indicado, quando seu endereço é acessado, então há redirecionamento permanente ao sucessor. Dado um rascunho, então ele não consta do mapa do site.
- **Depende de:** RF-163, RF-171, RF-186.

### 9.9 SEO, compartilhamento e dados estruturados (RF-160..172)

#### RF-160 — Título e descrição por template
- **Descrição:** cada template gera título e descrição de página a partir dos campos do registro, com possibilidade de sobrescrita manual.
- **Motivo:** OB-08: a empresa não tem audiência e depende de busca; título escrito à mão por página não escala com o portfólio (OB-07) e é a primeira coisa esquecida em um lançamento.
- **Comportamento esperado:** o padrão automático combina nome da entidade e nome da ArtZan para o título, e o resumo de uma linha para a descrição; a sobrescrita é opcional e por registro; títulos são únicos em todo o site; comprimentos respeitam os limites usuais de exibição em resultados de busca, com aviso ao editor quando excedidos.
- **Páginas afetadas:** P-01 a P-18.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao publicar um produto sem preencher campos de SEO, título e descrição são gerados automaticamente. Dadas duas páginas quaisquer, seus títulos são diferentes.
- **Depende de:** RF-180.

#### RF-161 — Endereço canônico
- **Descrição:** toda página declara seu endereço canônico absoluto.
- **Motivo:** filtros, ordenação, paginação e parâmetros de campanha criam variantes do mesmo conteúdo; sem canônico, a autoridade se divide e OB-08 é prejudicado.
- **Comportamento esperado:** listagens filtradas e ordenadas apontam para a listagem base; páginas paginadas são canônicas de si mesmas; parâmetros de campanha nunca alteram o canônico; o canônico usa o domínio **artzan.com.br** (Q-002 resolvida; domínio sujeito a alteração futura, caso em que todo canônico é regerado a partir da configuração única, nunca por edição manual de página), com um único formato de endereço. **Preparação para inglês (Q-011):** a montagem do canônico já reserva onde um identificador de idioma entraria caso um segundo idioma seja ativado (RNF-083); enquanto o site publicar um único idioma, essa preparação fica inativa e o canônico não muda de formato.
- **Páginas afetadas:** P-01 a P-18.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao abrir o catálogo com filtro aplicado, o canônico aponta para `/produtos`. Ao acessar uma página com parâmetro de campanha, o canônico permanece sem parâmetros.
- **Depende de:** RF-170.

#### RF-162 — Hierarquia de cabeçalhos
- **Descrição:** cada página tem um único cabeçalho de primeiro nível e hierarquia sem saltos.
- **Motivo:** é simultaneamente requisito de leitura por tecnologias assistivas (RNF-025) e de interpretação do conteúdo por buscadores (OB-08); não pode depender da disciplina do editor.
- **Comportamento esperado:** o template define os níveis; blocos de conteúdo não permitem escolher nível arbitrário que quebre a sequência; o cabeçalho de primeiro nível corresponde ao nome da entidade; a validação ocorre antes da publicação.
- **Páginas afetadas:** P-01 a P-18.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao inspecionar qualquer página, existe exatamente um cabeçalho de primeiro nível. Ao percorrer os cabeçalhos, não há salto de nível.
- **Depende de:** RF-146, RNF-025.

#### RF-163 — Mapa do site gerado na publicação
- **Descrição:** o mapa do site é regenerado automaticamente a cada publicação ou despublicação.
- **Motivo:** OB-07 e OB-08: manter lista manual de endereços é exatamente o retrabalho que o modelo evita, e mapa desatualizado atrasa a indexação de produto novo.
- **Comportamento esperado:** inclui apenas páginas indexáveis e publicadas, com data da última modificação; exclui `/obrigado`, `/busca`, rascunhos e páginas despublicadas; é referenciado pelo arquivo de diretrizes para robôs (RF-164); a regeneração não depende de ação manual do editor.
- **Páginas afetadas:** P-01 a P-18.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dado um produto publicado, então ele consta do mapa do site sem intervenção. Dado um produto despublicado, então ele é removido do mapa na mesma operação.
- **Depende de:** RF-147, RF-172.

#### RF-164 — Diretrizes para robôs de indexação
- **Descrição:** o site publica arquivo de diretrizes para robôs, referenciando o mapa do site e restringindo o que não deve ser rastreado.
- **Motivo:** sem diretriz explícita, páginas utilitárias e variantes com parâmetro consomem orçamento de rastreamento e competem com as páginas comerciais (OB-08).
- **Comportamento esperado:** libera o conteúdo público; restringe endereços utilitários e resultados de busca interna; o ambiente de homologação bloqueia integralmente a indexação, e essa configuração nunca é promovida junto com o conteúdo para produção.
- **Páginas afetadas:** todo o site.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao consultar o arquivo, o mapa do site está referenciado e `/busca` está restrito. Ao consultar o mesmo arquivo em homologação, toda indexação está bloqueada.
- **Depende de:** RF-163, RNF-103.

#### RF-165 — Cartão de compartilhamento
- **Descrição:** cada página fornece título, descrição, imagem e tipo para pré-visualização em redes e mensageiros.
- **Motivo:** J-04 e o ciclo consultivo de PU-01 envolvem repassar links internamente; link sem pré-visualização perde contexto e reduz a chance de abertura (OB-03).
- **Comportamento esperado:** usa a imagem de destaque da entidade; na ausência dela, uma imagem institucional padrão; nunca compartilha imagem quebrada nem espaço vazio; título e descrição derivam de RF-160; as dimensões seguem o formato aceito pelos principais leitores de link.
- **Páginas afetadas:** P-01 a P-18.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao compartilhar uma página de produto, a pré-visualização mostra nome, resumo e imagem do produto. Dada uma página sem imagem própria, então a imagem institucional é usada.
- **Depende de:** RF-160, RF-187.

#### RF-166 — Dados estruturados de organização
- **Descrição:** a inicial e as páginas institucionais declaram os dados estruturados de organização, com nome, endereço do site, logotipo e canais de contato confirmados.
- **Motivo:** OB-01 e OB-05: para empresa desconhecida, a declaração explícita de identidade é o que permite ao buscador associar o site à entidade; sem ela, a marca nova não é reconhecida.
- **Comportamento esperado:** apenas dados confirmados são declarados — nada de canal, endereço ou perfil inventado (Q-001, Q-002, Q-012); os dados são gerados a partir de configuração única, não repetidos manualmente por página.
- **Páginas afetadas:** P-01, P-02.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao validar a inicial, os dados de organização são reconhecidos sem erro. Dado um canal não confirmado, então ele não é declarado.
- **Depende de:** RF-028, Q-001, Q-002, Q-012.

#### RF-167 — Dados estruturados de produto e solução
- **Descrição:** páginas de produto declaram dados estruturados do tipo aplicação de software; páginas de solução declaram dados de oferta de serviço, sem se apresentarem como produto único.
- **Motivo:** OB-02 e OB-08: PU-03 chega por busca de software específico, e a declaração explícita aumenta a chance de apresentação enriquecida; declarar solução como produto contradiz RF-085.
- **Comportamento esperado:** os campos são preenchidos a partir do modelo de conteúdo, nunca digitados por página; preço só é declarado se Q-008 autorizar publicação — enquanto vigorar PR-005, o campo de oferta é omitido em vez de declarado como zero ou indefinido; avaliações não são declaradas na ausência de avaliações reais.
- **Páginas afetadas:** P-04, P-06.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao validar uma página de produto, os dados são reconhecidos sem erro nem aviso de campo obrigatório ausente. Enquanto o preço não for público, nenhum campo de oferta é declarado.
- **Depende de:** RF-065, PR-005, Q-008.

#### RF-168 — Dados estruturados da trilha de navegação
- **Descrição:** páginas com trilha declaram os dados estruturados correspondentes, refletindo exatamente a trilha visível.
- **Motivo:** exibe o caminho no resultado de busca, reforçando a distinção entre software e solução (RF-085) para quem ainda não conhece a marca (PU-07).
- **Comportamento esperado:** a declaração é gerada a partir da mesma fonte da trilha visível, impedindo divergência; nunca inclui categoria em páginas de produto, coerente com 6.4.
- **Páginas afetadas:** P-04, P-06, P-11, P-18.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao validar uma página de produto, a trilha declarada coincide com a exibida. Nenhuma trilha declarada contém segmento inexistente na navegação.
- **Depende de:** RF-005.

#### RF-169 — Dados estruturados de perguntas frequentes
- **Descrição:** quando P-12 existir, suas perguntas e respostas são declaradas como dados estruturados de perguntas frequentes.
- **Motivo:** amplia a presença em resultados para dúvidas de PU-01 e PU-06 sem produzir conteúdo adicional; depende de FAQ real, que só existe após contatos reais (RF-143).
- **Comportamento esperado:** só declara perguntas efetivamente publicadas na página; não declara conteúdo oculto; se P-12 não existir, nenhuma declaração é emitida.
- **Páginas afetadas:** P-12.
- **Prioridade:** Fase 2.
- **Critérios de aceite:** Ao validar P-12, cada par declarado corresponde a um item visível na página. Sem P-12 publicada, nenhuma declaração desse tipo existe no site.
- **Depende de:** RF-143.

#### RF-170 — Conformidade com o padrão de URLs
- **Descrição:** todos os endereços seguem o padrão canônico de 6.4 e as regras de slug de 6.5.
- **Motivo:** URL de produto contendo categoria deixaria de ser estável quando o produto entrasse em uma segunda categoria — situação normal no modelo N:N (PR-003) — e quebraria links conquistados (OB-08). **Preparação para inglês (Q-011, resolvida):** deixa de ser preparação genérica e vira requisito concreto de estrutura — o padrão de endereço precisa reservar, desde já, onde um segmento de idioma seria inserido, para que ativar um segundo idioma (RNF-083) não exija redefinir o padrão nem gerar colisão com endereços já publicados em português.
- **Comportamento esperado:** slug com letras minúsculas, números e hífen, sem acento, de 2 a 5 palavras e até 60 caracteres; sem identificador numérico; sem prefixo repetitivo; conflito de slug bloqueia a publicação e exige resolução manual, nunca sufixo automático; slug editável apenas antes da primeira publicação (PR-014); a composição do endereço já isola o segmento de idioma dos demais segmentos (tipo de entidade e slug), de modo que o lançamento em português usa a estrutura preparada sem precisar declará-la — nenhum idioma é ativado por este requisito.
- **Páginas afetadas:** P-01 a P-18.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dado um nome com acentos, quando o slug é gerado, então ele não contém acentos nem espaços. Dado um slug já existente no mesmo tipo, então a publicação é recusada.
- **Depende de:** RF-171, PR-014.

#### RF-171 — Redirecionamento permanente
- **Descrição:** mudança inevitável de slug e despublicação de entidade geram redirecionamento permanente do endereço antigo.
- **Motivo:** PR-014 e 6.9, regra 7: endereço publicado é compromisso público; perdê-lo destrói autoridade acumulada e produz erro para quem chegou por link externo (OB-08).
- **Comportamento esperado:** o redirecionamento é permanente, aponta ao sucessor indicado ou ao catálogo, e o endereço antigo nunca é reaproveitado para outro conteúdo; cadeias de redirecionamento são resolvidas para um único salto; a criação do redirecionamento é automática na operação de renomear ou despublicar.
- **Páginas afetadas:** P-03 a P-11, P-15, P-18.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dado um slug alterado, quando o endereço antigo é acessado, então há redirecionamento permanente ao novo. Nenhuma cadeia de redirecionamento tem mais de um salto.
- **Depende de:** RF-147, RF-170.

#### RF-172 — Controle de indexação de páginas utilitárias
- **Descrição:** `/obrigado`, `/busca`, resultados filtrados e páginas de rascunho são marcados como não indexáveis.
- **Motivo:** indexar a confirmação de envio distorce a medição de conversão (RF-201) e coloca no resultado de busca páginas sem valor para o visitante, prejudicando a percepção do site (OB-05, OB-08).
- **Comportamento esperado:** a indexabilidade é campo do modelo de conteúdo (6.7), configurável por página institucional; páginas não indexáveis também ficam fora do mapa do site; o bloqueio não impede o acesso direto por quem tem o endereço.
- **Páginas afetadas:** P-16, P-17, P-03, P-18.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao inspecionar `/obrigado`, ela está marcada como não indexável e ausente do mapa do site. Ao inspecionar uma listagem filtrada, ela não é indexável e aponta canônico para a listagem base.
- **Depende de:** RF-161, RF-163.

### 9.10 Gestão de conteúdo e administração (RF-180..193)

**Q-033, resolvida.** Resposta literal do cliente: "Um painel simples de administração deve ser feito sim." Esta faixa deixa de comparar duas formas possíveis de implementação — o painel (antiga opção B) é o caminho escolhido; a edição por arquivo versionado (antiga opção A) não será construída. A faixa agora especifica, por capacidade, o painel real que os dois sócios da ArtZan vão usar para cadastrar, validar, pré-visualizar, publicar e manter todo o conteúdo do site.

**Nota de honestidade que este PRD não pode omitir.** Um painel com autenticação e edição de conteúdo público é software com superfície de ataque própria — não é acréscimo pequeno a um site institucional. Ele soma ao site os requisitos de autenticação, sessão, controle de tentativa de acesso e proteção de rota administrativa (seção 10.5), a mesma disciplina de correção de vulnerabilidade e cópia de segurança de qualquer aplicação com login (RNF-044, RNF-095), e agrava o conflito de prazo já registrado para setembro de 2026: painel é desenvolvimento novo, não configuração de site pronto. O corte mínimo descrito abaixo é deliberadamente estreito — dois usuários, sem hierarquia, sem recurso além do necessário para publicar e corrigir conteúdo — porque o prazo declarado não comporta mais do que isto.

**Papéis.** Os dois sócios operam o painel com o mesmo nível de acesso. Q-034, resolvida: "tudo executado pelos dois sócios no início. Sem hierarquia de aprovação." Não há papel de editor distinto de publicador, nem papel administrativo acima dos dois — a versão anterior deste requisito (RF-183) previa essa hierarquia; ela deixou de existir. Cada sócio tem conta individual, nunca compartilhada, para que toda ação fique associada a uma pessoa (RF-192, RNF-046), não para restringir o que cada um pode fazer.

#### RF-180 — Publicar produto sem desenvolvimento
- **Descrição:** o painel de administração permite cadastrar e publicar um produto novo, com todos os campos e vínculos de 6.7, sem alterar código nem estrutura.
- **Motivo:** é o requisito central de OB-07 e a razão de existir do modelo de conteúdo; se publicar produto exigir desenvolvimento, toda a estratégia de portfólio crescente falha. A forma de administração deixou de ser uma escolha em aberto (Q-033, resolvida): é um painel, não edição de arquivo por pessoa técnica.
- **Comportamento esperado:** o painel cobre todos os campos obrigatórios e opcionais do produto, a seleção de categorias e o vínculo com soluções; publicar não exige nova versão do sistema; a página resultante é idêntica em estrutura às demais (RF-060).
- **Páginas afetadas:** P-03, P-04, administração.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dado um produto novo com conteúdo pronto, quando publicado pelo painel, então ele aparece no catálogo e tem página própria sem alteração de código. Ao publicar, nenhuma alteração estrutural é registrada.
- **Depende de:** RF-185, RF-188.

#### RF-181 — Publicar solução, parceiro, categoria, página institucional e conteúdo
- **Descrição:** o mesmo painel permite cadastrar e publicar soluções, parceiros, categorias, páginas institucionais e itens de conteúdo.
- **Motivo:** 6.9, regra 5, e OB-06 e OB-09: se apenas produto for gerenciável, soluções e parceiros voltam a ser páginas artesanais e o problema retorna por outra porta; a mesma lógica vale para as páginas institucionais, que dependem da biblioteca de blocos de RF-146 para não repetir o problema por uma terceira via.
- **Comportamento esperado:** categorias existem desde o MVP mesmo sem exibição pública (PR-013), com campo de visibilidade; páginas institucionais são montadas e reordenadas a partir da biblioteca de blocos de RF-146 pelo próprio painel, sem exigir desenvolvimento; itens de conteúdo entram na Fase 2 junto de P-10 e P-11; a taxonomia de tipos de parceria é editável (RF-102).
- **Páginas afetadas:** P-02, P-05 a P-07, P-10, P-11, P-13, P-14, P-18, administração.
- **Prioridade:** MVP (produto, solução, parceiro, categoria, página institucional); Fase 2 (conteúdo).
- **Critérios de aceite:** Ao cadastrar uma categoria não visível, ela existe no modelo e não aparece publicamente. Ao publicar uma solução ou atualizar uma página institucional pelo painel, a alteração aparece no site sem desenvolvimento.
- **Depende de:** RF-180, PR-013.

#### RF-182 — Gestão de vínculos entre entidades
- **Descrição:** os vínculos produto↔solução, produto↔categoria, parceiro↔produto e parceiro↔solução são criados e removidos como relação, não como texto.
- **Motivo:** PR-003 e 6.9, regra 4: é o vínculo que faz publicar uma solução enriquecer as páginas dos produtos; digitar a relação reintroduz divergência e retrabalho.
- **Comportamento esperado:** cada vínculo é editável dos dois lados, com o mesmo efeito; a remoção de um vínculo atualiza imediatamente todos os blocos derivados; o sistema impede vínculo com entidade inexistente e alerta quando a remoção deixa uma solução com menos de dois produtos (RF-083).
- **Páginas afetadas:** P-03, P-04, P-06, P-07, administração.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dado um vínculo criado pelo lado da solução, quando a página do produto é aberta, então a solução consta do bloco derivado. Ao remover o vínculo, ambos os lados são atualizados na mesma operação.
- **Depende de:** RF-066, RF-083, RF-106.

#### RF-183 — Acesso sem hierarquia entre os dois sócios
- **Descrição:** o acesso de publicação é individual — uma conta por sócio —, mas sem diferenciação de papel: qualquer um dos dois pode criar, editar, publicar e despublicar qualquer entidade e alterar qualquer configuração do painel.
- **Motivo:** Q-034, resolvida, decidiu o que a versão anterior deste requisito deixava em aberto: os dois sócios executam tudo, sem hierarquia de aprovação. **Premissa PR-023 (corrigida):** o acesso de publicação no lançamento é de exatamente duas pessoas — os sócios da ArtZan —, não "até três" como a premissa original assumia antes da resposta a Q-034. Contas individuais continuam obrigatórias — não para restringir ação, mas porque publicação tem efeito público e legal (RF-141) e a responsabilidade por um erro publicado só é apurável se a conta não for compartilhada (RNF-046).
- **Comportamento esperado:** cada sócio autentica com credencial própria (RF-188); nenhuma tela do painel é exclusiva de um papel superior — não existe configuração, texto legal ou gatilho (RF-048) reservado a um papel "administrador" distinto de um papel "editor", porque esse papel superior não existe; a conta identifica o autor de cada ação para o registro de auditoria (RF-192), não para bloquear o que ele pode fazer.
- **Páginas afetadas:** administração.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dado um dos dois sócios autenticado, quando tenta publicar, editar ou despublicar qualquer entidade, então a operação é permitida sem exigir aprovação da outra conta. Ao consultar uma publicação, o sócio responsável é identificável.
- **Depende de:** RF-188, RF-192, RNF-046.

#### RF-184 — Pré-visualização antes de publicar
- **Descrição:** o painel permite ver a página exatamente como ficará publicada, antes de torná-la pública.
- **Motivo:** princípio 2: página com lacuna visível já publicada compromete a percepção da marca (OB-05); a pré-visualização evita corrigir em produção. Sem hierarquia de aprovação entre os dois sócios (RF-183) e sem segunda pessoa revisando antes de publicar, a pré-visualização é o único ponto de checagem entre o cadastro e a publicação — deixa de ser refinamento de Fase 2 e passa a ser parte do corte mínimo viável do painel confirmado por Q-033.
- **Comportamento esperado:** a pré-visualização usa o template real, inclusive blocos derivados e omissões condicionais; o endereço de pré-visualização não é indexável nem descobrível por navegação; expira ou exige autenticação.
- **Páginas afetadas:** P-04, P-06, P-07, P-11, administração.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao pré-visualizar um produto sem integrações, a seção correspondente não aparece, como na página publicada. O endereço de pré-visualização não é indexável.
- **Depende de:** RF-063, RF-172, RF-188.

#### RF-185 — Validação de campos obrigatórios na publicação
- **Descrição:** a publicação é bloqueada enquanto houver campo obrigatório ou mínimo de itens não atendido.
- **Motivo:** princípio 8: a consistência entre o primeiro e o vigésimo produto não pode depender de revisão humana; a validação é o mecanismo que a garante (P-04).
- **Comportamento esperado:** valida obrigatórios de 6.7, mínimo de 3 funcionalidades e 3 benefícios em produto, mínimo de 2 produtos e ganho preenchido em solução, autorização de marca em parceiro e texto alternativo em toda imagem; a recusa nomeia cada pendência; rascunho incompleto pode ser salvo.
- **Páginas afetadas:** P-04, P-06, P-07, P-11.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dada uma solução com um único produto vinculado, quando se tenta publicar, então a operação é recusada nomeando a pendência. Dado um rascunho incompleto, então ele é salvo sem publicar.
- **Depende de:** RF-070, RF-084, RF-103.

#### RF-186 — Publicação e despublicação com efeito imediato
- **Descrição:** publicar e despublicar uma entidade atualiza listagens, blocos derivados, mapa do site e redirecionamentos na mesma operação.
- **Motivo:** OB-07: se a propagação exigir etapas manuais, alguma será esquecida e o site exibirá estado inconsistente — produto no catálogo mas com página fora do ar, ou o inverso.
- **Comportamento esperado:** a operação é atômica do ponto de vista do visitante; entidade despublicada sai de todas as listagens e blocos derivados e passa a redirecionar (RF-171); o histórico de quem publicou, quando e o que mudou fica registrado (RF-192).
- **Páginas afetadas:** P-01 a P-11, P-18, administração.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dado um produto despublicado, quando o catálogo, a inicial e as soluções são recarregados, então ele não aparece em nenhum deles. Ao consultar o histórico, a operação está registrada com autor e data.
- **Depende de:** RF-147, RF-163, RF-171, RF-192.

#### RF-187 — Gestão de mídia
- **Descrição:** imagens e vídeos são carregados uma vez pelo painel, reutilizáveis entre entidades, com texto alternativo obrigatório.
- **Motivo:** RF-064 e RNF-026 exigem texto alternativo; RNF-012 exige controle de peso; sem gestão central, cada editor sobe versões diferentes da mesma imagem e o orçamento de performance é rompido.
- **Comportamento esperado:** o texto alternativo é obrigatório no momento do carregamento e impede o uso da imagem sem ele; o sistema gera as variações de tamanho necessárias (RNF-006) e recusa arquivos acima do limite definido em RNF-011; imagem em uso não pode ser excluída sem aviso das páginas afetadas.
- **Páginas afetadas:** P-01 a P-11, administração.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dada uma imagem sem texto alternativo, quando se tenta usá-la, então a operação é recusada. Ao carregar uma imagem, as variações responsivas são geradas sem ação manual.
- **Depende de:** RF-064, RNF-006, RNF-012.

#### RF-188 — Autenticação individual de acesso ao painel
- **Descrição:** o acesso ao painel de administração exige autenticação individual dos dois sócios da ArtZan, com credencial própria por pessoa; não existe acesso anônimo nem conta genérica compartilhada.
- **Motivo:** é a base de toda a faixa 9.10: sem autenticação não há como restringir quem publica, nem como atribuir uma alteração a um autor (RF-192, RNF-046); um painel de conteúdo público sem login equivaleria a publicar sem controle algum.
- **Comportamento esperado:** cada sócio possui credencial individual; a tela de acesso não revela, a quem tenta entrar sem sucesso, se o identificador informado existe, para não facilitar tentativa dirigida; toda tentativa de acesso, bem-sucedida ou não, fica associada a data e hora; o painel inteiro — não apenas a ação de publicar — fica atrás dessa autenticação, incluindo listagens e rascunhos ainda não publicados.
- **Páginas afetadas:** administração.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dada uma tentativa de acesso sem credencial válida, então o painel nega a entrada sem revelar qual campo está incorreto. Dado um acesso bem-sucedido, então a sessão fica associada ao sócio autenticado desde a primeira tela.
- **Depende de:** RNF-047, RNF-048.

#### RF-189 — Sessão do painel e expiração por inatividade
- **Descrição:** a sessão autenticada no painel expira automaticamente após um período de inatividade, exigindo nova autenticação para continuar.
- **Motivo:** sessão que nunca expira em uma máquina compartilhada ou esquecida aberta é a forma mais comum de acesso indevido a um painel de conteúdo; o painel administra conteúdo público (RF-180, RF-181), então uma sessão aberta indevidamente pode publicar em nome do sócio dono da conta.
- **Comportamento esperado:** a expiração ocorre por tempo de inatividade, não por tempo fixo de uso contínuo; ao expirar, o painel exige nova autenticação antes de qualquer leitura ou alteração; alteração em rascunho não salva antes da expiração não é publicada silenciosamente — o sócio é avisado antes de perder trabalho não salvo, sempre que tecnicamente detectável; encerrar a sessão manualmente invalida o acesso imediatamente, mesmo em outra aba ou dispositivo.
- **Páginas afetadas:** administração.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dada uma sessão inativa além do limite definido, quando qualquer ação é tentada, então o painel exige nova autenticação antes de prosseguir. Ao encerrar a sessão manualmente, uma aba diferente com a mesma sessão anterior também perde o acesso.
- **Depende de:** RF-188, RNF-048.

#### RF-190 — Recuperação de acesso
- **Descrição:** existe um caminho para um sócio recuperar o acesso ao painel caso perca a credencial, sem depender de suporte técnico externo a cada ocorrência.
- **Motivo:** com exatamente dois usuários (RF-183) e nenhum papel de suporte técnico permanente confirmado, perder acesso sem caminho de recuperação poderia travar a publicação inteira do site até uma intervenção manual fora do painel.
- **Comportamento esperado:** a recuperação usa um canal que já existe de forma independente do painel — o e-mail institucional do sócio (RF-028, Q-012) —, nunca uma pergunta de segurança previsível nem um canal que o próprio painel controla sozinho; o link ou código de recuperação expira em pouco tempo e só pode ser usado uma vez; a recuperação bem-sucedida encerra qualquer sessão anterior daquela conta; toda recuperação usada fica registrada como evento de segurança.
- **Páginas afetadas:** administração.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dado um pedido de recuperação, quando o canal de e-mail confirma a identidade, então uma nova credencial pode ser definida sem intervenção manual de terceiro. Dado um link de recuperação já usado uma vez, quando reaberto, então ele não concede acesso novamente.
- **Depende de:** RF-188, RNF-049.

#### RF-191 — Painel central de listagem das entidades
- **Descrição:** o painel apresenta uma listagem central de produtos, soluções, parceiros e páginas institucionais, com o estado de cada um — rascunho ou publicado — e acesso direto à edição.
- **Motivo:** RF-180 e RF-181 garantem que cada entidade pode ser cadastrada e publicada; sem uma visão de conjunto, os dois sócios (RF-183) não têm como saber, sem abrir cada registro, o que está publicado, o que é rascunho esquecido e o que precisa de revisão — por exemplo, uma solução sinalizada por RF-083 com composição inválida.
- **Comportamento esperado:** a listagem mostra nome, tipo, estado e data da última alteração de cada entidade; permite abrir qualquer item diretamente para edição ou pré-visualização (RF-184); sinaliza visualmente entidades pendentes de revisão editorial (RF-084, RF-083) ou com campo obrigatório incompleto; não exige que o sócio memorize endereços para localizar o que precisa alterar.
- **Páginas afetadas:** administração.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao abrir o painel, é possível ver todas as entidades e seu estado sem abrir cada uma individualmente. Dada uma solução sinalizada como pendente de revisão (RF-083), então ela aparece destacada na listagem.
- **Depende de:** RF-180, RF-181, RF-188.

#### RF-192 — Registro de auditoria de alterações
- **Descrição:** toda criação, alteração, publicação, despublicação e exclusão de mídia realizada no painel fica registrada com autor, data e hora, consultável por quem acessa o painel.
- **Motivo:** RF-183 remove a hierarquia de aprovação entre os dois sócios; sem hierarquia, o registro de quem fez o quê e quando é o único mecanismo de responsabilização que resta, e sua ausência tornaria impossível investigar um erro publicado ou uma alteração indevida (RNF-046).
- **Comportamento esperado:** cada evento de auditoria identifica a entidade afetada, o tipo de ação, o autor e o momento; o registro existe mesmo quando as duas contas têm exatamente o mesmo nível de acesso; este registro no nível de ação — o que foi feito, por quem, quando — é exigido desde o lançamento; o histórico campo a campo, com o texto anterior recuperável, continua tratado por RNF-077 como capacidade de Fase 2, sem prejuízo de este registro mais simples já valer como trilha de auditoria mínima do MVP.
- **Páginas afetadas:** administração.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dada qualquer publicação, despublicação ou exclusão de mídia, então o registro de auditoria mostra quem, quando e em qual entidade. Ao consultar o histórico de uma entidade, a sequência de ações é legível sem acesso a registro técnico bruto.
- **Depende de:** RF-186, RF-188, RNF-046.

#### RF-193 — Comportamento de erro no painel administrativo
- **Descrição:** toda falha do painel — de validação, de salvamento ou de sessão — é comunicada ao sócio de forma clara, sem perda do conteúdo em edição.
- **Motivo:** o painel é operado pelos próprios sócios, sem suporte técnico dedicado (RF-183); uma falha muda de contratempo administrável para conteúdo perdido e publicação travada se não for tratada explicitamente — o mesmo princípio que RF-132 aplica ao formulário público vale aqui, com o agravante de que o painel também é o único caminho de publicar e corrigir o site.
- **Comportamento esperado:** falha de validação (RF-185) nomeia o campo pendente, nunca uma mensagem genérica; falha de salvamento por instabilidade técnica preserva o conteúdo digitado na tela e oferece nova tentativa, sem obrigar o sócio a redigitar; expiração de sessão em meio à edição (RF-189) avisa antes de descartar alterações não salvas sempre que for tecnicamente detectável; nenhuma falha do painel publica ou despublica conteúdo por engano — a operação falha por completo ou é concluída por completo.
- **Páginas afetadas:** administração.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dada uma falha de salvamento por instabilidade técnica, quando ocorre, então o conteúdo digitado permanece disponível para nova tentativa. Dada uma tentativa de publicar com campo pendente, então o painel nomeia o campo em vez de recusar genericamente.
- **Depende de:** RF-185, RF-189.

### 9.11 Analytics e medição (RF-200..206)

**Premissa PR-024:** haverá uma única ferramenta de medição, escolhida fora deste PRD; nenhum outro recurso de terceiro é carregado no site no MVP.

#### RF-200 — Instrumentação de eventos de navegação
- **Descrição:** o site registra visualização de página e as interações que representam progresso de jornada.
- **Motivo:** OB-01, OB-02 e OB-09 têm indicadores declarados na seção 3 — profundidade de navegação, visualizações por produto, sessões que veem produto e solução — que não existem sem instrumentação.
- **Comportamento esperado:** eventos mínimos: abertura de página de produto e de solução, acionamento de card no catálogo, uso de filtro ou busca quando ativos, e clique em link de parceiro; cada evento identifica a entidade por slug, nunca por identificador interno instável; a instrumentação é definida por template, não repetida por página.
- **Páginas afetadas:** P-01 a P-11.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao abrir uma página de produto, um evento identificando aquele produto é registrado. Ao publicar um produto novo, ele é medido sem instrumentação adicional.
- **Depende de:** RF-203.

#### RF-201 — Eventos de conversão
- **Descrição:** início de formulário, envio bem-sucedido e falha de envio são registrados como eventos distintos.
- **Motivo:** OB-03 e OB-04 medem "início versus conclusão de formulário"; sem os três eventos não é possível distinguir desinteresse de fricção de fluxo quebrado.
- **Comportamento esperado:** o evento de conversão carrega tipo de formulário, página de origem e entidade de interesse; a confirmação em `/obrigado` é o marco de sucesso, o que exige que a página não seja indexável (RF-172); nenhum dado preenchido pelo visitante é enviado ao evento.
- **Páginas afetadas:** P-04, P-06, P-08, P-09, P-16.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dado um envio válido a partir de um produto, então o evento de conversão identifica o produto. Dada uma falha de envio, então um evento de falha distinto é registrado.
- **Depende de:** RF-128, RF-204.

#### RF-202 — Identificação de origem de tráfego
- **Descrição:** o site preserva e registra a origem da sessão — canal, campanha e página de entrada.
- **Motivo:** OB-03 exige avaliar conversão por página de origem, e OB-08 exige separar tráfego orgânico de direto e de indicação; sem origem preservada, todo lead parece direto.
- **Comportamento esperado:** parâmetros de campanha são lidos, preservados durante a sessão e anexados ao envio do formulário (RF-128); os parâmetros nunca alteram o canônico (RF-161); a origem é armazenada apenas pelo tempo da sessão.
- **Páginas afetadas:** P-01 a P-11.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dada uma entrada com parâmetro de campanha e navegação até o contato, então o lead registra a campanha. Ao consultar o canônico da página de entrada, ele não contém parâmetros.
- **Depende de:** RF-128, RF-161.

#### RF-203 — Consentimento antes de rastreamento não essencial
- **Descrição:** nenhuma medição não essencial é executada antes de consentimento explícito do visitante.
- **Motivo:** exigência de tratamento lícito sob a LGPD e coerência com o discurso de transparência que sustenta OB-05 diante de PU-06.
- **Comportamento esperado:** o aviso é apresentado sem bloquear a leitura do conteúdo, com opções equivalentes de aceitar e recusar — recusar não pode ser mais difícil que aceitar; a escolha é registrada com data e versão do aviso e pode ser alterada a qualquer momento por acesso permanente no rodapé; sem consentimento, apenas medições estritamente necessárias ao funcionamento ocorrem.
- **Páginas afetadas:** P-01 a P-18, P-13.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dado que o visitante não respondeu ao aviso, então nenhum evento não essencial é enviado. Ao recusar, a escolha persiste entre páginas e é revisável pelo rodapé.
- **Depende de:** RNF-051, RNF-055.

#### RF-204 — Ausência de dados pessoais em eventos
- **Descrição:** nenhum evento de medição carrega dado pessoal ou conteúdo digitado pelo visitante.
- **Motivo:** minimização é obrigação legal (RNF-050) e reduz a superfície de incidente; conteúdo de formulário em ferramenta de medição é vazamento por desenho.
- **Comportamento esperado:** eventos carregam apenas identificadores de página e de entidade, tipo de formulário e resultado; nome, e-mail, empresa e mensagem nunca são enviados; endereços de página com dado pessoal em parâmetro são proibidos por construção.
- **Páginas afetadas:** P-08, P-09, P-16.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao inspecionar os eventos de um envio, nenhum campo contém dado do visitante. Nenhum endereço do site transporta dado pessoal em parâmetro.
- **Depende de:** RF-201, RNF-050.

#### RF-205 — Relatório por página e por entidade do catálogo
- **Descrição:** os indicadores da seção 3 podem ser lidos por página e por produto, solução e parceiro.
- **Motivo:** OB-02, OB-06 e OB-09 têm indicadores por entidade; relatório apenas agregado não responde qual produto atrai e qual não se justifica manter no catálogo.
- **Comportamento esperado:** os eventos identificam a entidade por slug estável (RF-200), permitindo agrupar sem configuração por item; entidade nova entra no relatório automaticamente; a periodicidade e o responsável dependem de Q-017.
- **Páginas afetadas:** P-03 a P-07.
- **Prioridade:** Fase 2.
- **Critérios de aceite:** Ao publicar um produto novo, ele aparece no relatório sem configuração adicional. É possível comparar visualizações entre dois produtos no mesmo período.
- **Depende de:** RF-200, Q-017.

#### RF-206 — Medição do funil de formulário
- **Descrição:** a razão entre início e conclusão de formulário é apurável por tipo de formulário e por página de origem.
- **Motivo:** indicador explícito de OB-04; sem ele, uma queda de conversão é indistinguível de queda de tráfego, e a fricção do formulário nunca é corrigida.
- **Comportamento esperado:** o início é registrado na primeira interação com um campo, uma vez por sessão e formulário; abandono é inferido pela ausência de conclusão, sem rastrear conteúdo digitado; erros de validação por campo são contabilizados de forma agregada, permitindo identificar o campo que mais bloqueia.
- **Páginas afetadas:** P-08, P-09.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dado um formulário iniciado e não enviado, então há evento de início e nenhum de conclusão. É possível identificar qual campo gera mais erros de validação sem acessar o conteúdo digitado.
- **Depende de:** RF-201, RF-204.

### 9.12 Rastreabilidade entre objetivos e requisitos

| Objetivo | Requisitos que o sustentam |
|---|---|
| OB-01 Apresentar a ArtZan ao mercado | RF-001, RF-011, RF-020, RF-021, RF-026, RF-028, RF-069, RF-140, RF-166, RF-200 |
| OB-02 Divulgar o portfólio | RF-022, RF-040, RF-041, RF-047, RF-049, RF-060, RF-062, RF-067, RF-160, RF-167, RF-205 |
| OB-03 Gerar oportunidades comerciais | RF-027, RF-068, RF-088, RF-107, RF-120, RF-121, RF-124, RF-126, RF-128, RF-129, RF-132, RF-201, RF-222 |
| OB-04 Facilitar o contato | RF-001, RF-003, RF-008, RF-122, RF-123, RF-125, RF-130, RF-131, RF-206, RF-220 |
| OB-05 Fortalecer marca e confiabilidade | RF-004, RF-010, RF-026, RF-028, RF-063, RF-125, RF-140, RF-141, RF-142, RF-166, RF-221 |
| OB-06 Apresentar parcerias | RF-025, RF-100, RF-101, RF-102, RF-103, RF-104, RF-105, RF-106, RF-107 |
| OB-07 Expandir o portfólio sem retrabalho | RF-002, RF-022, RF-040, RF-043 a RF-048, RF-060, RF-066, RF-087, RF-163, RF-180, RF-181, RF-182, RF-186, RF-191, RF-192 |
| OB-08 Sustentar descoberta orgânica | RF-005, RF-007, RF-144, RF-145, RF-147, RF-160 a RF-165, RF-168 a RF-172 |
| OB-09 Posicionar a venda combinada | RF-023, RF-042, RF-066, RF-080 a RF-089, RF-128, RF-167 |

Nenhum requisito desta seção existe sem objetivo associado. Requisitos de infraestrutura editorial e de acesso ao painel (RF-183 a RF-185, RF-187 a RF-190, RF-193) sustentam OB-07 indiretamente, ao garantir que a publicação seja operação de rotina e não projeto — RF-191 e RF-192 foram listados explicitamente acima por sustentarem também, de forma direta, a visibilidade sobre o próprio portfólio.

## 10. Requisitos não funcionais

Todos os limites numéricos abaixo são compromissos verificáveis, não intenções. Onde o número depende de dado que o cliente ainda não forneceu, ele é registrado como premissa e vinculado a uma pergunta.

| Faixa | Domínio | Requisitos |
|---|---|---|
| RNF-001..006 | Responsividade | 6 |
| RNF-010..016 | Performance | 7 |
| RNF-020..029 | Acessibilidade | 10 |
| RNF-030..037 | SEO técnico | 8 |
| RNF-040..049, RNF-110 | Segurança | 11 |
| RNF-050..057 | Privacidade e proteção de dados | 8 |
| RNF-060..065 | Compatibilidade | 6 |
| RNF-070..077 | Manutenibilidade e modelo de conteúdo | 8 |
| RNF-080..085 | Escalabilidade | 6 |
| RNF-090..097 | Disponibilidade e monitoramento | 8 |
| RNF-100..107 | Qualidade da futura implementação | 8 |
| **Total** | — | **86** |

*Nota: contagem corrigida (acessibilidade e SEO já tinham RNF-028, RNF-029 e RNF-037 não contados antes) e somada aos itens novos de segurança do painel (RNF-047 a RNF-049, RNF-110).*

### 10.1 Responsividade (RNF-001..006)

#### RNF-001 — Concepção mobile-first
- **Descrição:** hierarquia de conteúdo, tamanho de listagens e comprimento de formulários são definidos primeiro para tela pequena e depois ampliados.
- **Motivo:** princípio 9 e PR-017; desenhar para tela grande e adaptar produz formulários longos e listagens densas que colapsam justamente onde está a maior parte do tráfego.
- **Métrica ou verificação:** revisão de cada template em largura de 360 pixels antes da aprovação do desenho para larguras maiores.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao abrir a inicial em 360 pixels, proposta de valor e ação primária são legíveis sem rolagem. Ao abrir P-08 na mesma largura, o formulário é preenchível sem zoom.

#### RNF-002 — Faixas de viewport suportadas
- **Descrição:** o site funciona de 320 a 1920 pixels de largura, com pontos de adaptação em telefone, tablet e desktop.
- **Motivo:** definir a faixa evita discussão caso a caso e torna verificável o que "responsivo" significa; abaixo de 320 pixels não há dispositivo relevante em uso.
- **Métrica ou verificação:** verificação em 320, 360, 768, 1024, 1440 e 1920 pixels em cada template.
- **Prioridade:** MVP.
- **Critérios de aceite:** Em cada uma das seis larguras, nenhum conteúdo é cortado, sobreposto ou ilegível. Nenhum texto fica menor que 16 pixels no corpo em telas pequenas.

#### RNF-003 — Ausência de rolagem horizontal
- **Descrição:** nenhuma página produz rolagem horizontal do corpo em nenhuma largura suportada.
- **Motivo:** rolagem horizontal é o sintoma mais visível de layout quebrado e destrói a percepção de cuidado que sustenta OB-05 sem prova social.
- **Métrica ou verificação:** medição da largura do documento contra a largura da janela em todas as larguras de RNF-002 e em todos os templates.
- **Prioridade:** MVP.
- **Critérios de aceite:** Em 320 pixels, nenhuma página apresenta barra de rolagem horizontal. Nenhum elemento excede a largura da janela, incluindo tabelas e imagens.

#### RNF-004 — Alvos de toque
- **Descrição:** todo elemento acionável tem área mínima de 44 por 44 pixels e espaçamento suficiente para evitar acionamento acidental.
- **Motivo:** requisito de acessibilidade e de conversão: alvo pequeno em card de catálogo e em ação de formulário custa oportunidades diretamente (OB-03).
- **Métrica ou verificação:** medição da área acionável de cards, itens de menu, ações de formulário e paginação em tela pequena.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao medir qualquer elemento acionável em tela pequena, a área é igual ou superior a 44 por 44 pixels. Elementos adjacentes têm ao menos 8 pixels de separação.

#### RNF-005 — Conteúdo largo com rolagem própria
- **Descrição:** tabelas, diagramas e blocos de texto pré-formatado rolam dentro de seu próprio contêiner, nunca empurrando a página.
- **Motivo:** o modelo de conteúdo admite tabelas comparativas e diagramas; sem contenção, um único conteúdo largo quebra RNF-003 em todas as páginas que o utilizam.
- **Métrica ou verificação:** inserção de tabela com o dobro da largura da janela em cada template que aceite conteúdo largo.
- **Prioridade:** MVP.
- **Critérios de aceite:** Dada uma tabela mais larga que a tela, quando a página é aberta, então a tabela rola isoladamente. O corpo da página permanece sem rolagem horizontal.

#### RNF-006 — Imagens responsivas
- **Descrição:** cada imagem é servida em variação compatível com a largura e a densidade do dispositivo, com dimensões declaradas.
- **Motivo:** servir a imagem de desktop ao telefone rompe o orçamento de peso de RNF-011; dimensões ausentes provocam deslocamento de layout e violam RNF-010.
- **Métrica ou verificação:** comparação do peso transferido de imagens em 360 e em 1440 pixels; verificação de dimensões declaradas em todas as imagens.
- **Prioridade:** MVP.
- **Critérios de aceite:** Em 360 pixels, o peso de imagens é ao menos 50% menor que em 1440. Nenhuma imagem provoca deslocamento visível durante o carregamento.

### 10.2 Performance (RNF-010..016)

**Premissa PR-025:** o orçamento abaixo foi calibrado para conexão móvel de qualidade média e dispositivo de faixa intermediária, hipótese a revisar quando houver dados reais de audiência. **Q-035, resolvida:** sem restrição de orçamento de infraestrutura que impeça sustentar estes limites.

#### RNF-010 — Orçamento de métricas de experiência
- **Descrição:** cada página pública cumpre, no percentil 75 dos acessos móveis: maior conteúdo visível renderizado em até 2,5 segundos; resposta à interação em até 200 milissegundos; deslocamento cumulativo de layout até 0,1.
- **Motivo:** OB-08 e OB-03: lentidão em página de produto reduz indexação e conversão simultaneamente; PU-03 chega por busca e compara alternativas em segundos.
- **Métrica ou verificação:** medição em laboratório antes de cada publicação e acompanhamento de campo mensal, sempre no percentil 75.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao medir a inicial e uma página de produto em conexão móvel simulada, os três limites são cumpridos. Nenhuma publicação ocorre com regressão acima de 10% em qualquer das três métricas.

#### RNF-011 — Peso e número de requisições por página
- **Descrição:** peso total transferido no primeiro acesso: até 1.200 KB na inicial, 1.000 KB em página de produto ou solução, 600 KB em páginas institucionais e legais; até 50 requisições e no máximo 150 KB de script.
- **Motivo:** limites concretos transformam performance em restrição de projeto (princípio 12) em vez de ajuste posterior, e protegem o orçamento contra decisões visuais tomadas isoladamente.
- **Métrica ou verificação:** medição do peso transferido e da contagem de requisições por template, com cache vazio.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao carregar uma página de produto com cache vazio, o total transferido não excede 1.000 KB. Nenhuma página excede 50 requisições no primeiro acesso.

#### RNF-012 — Otimização e formatos modernos de imagem
- **Descrição:** imagens são comprimidas, servidas em formato moderno com alternativa compatível, e nenhuma imagem individual excede 200 KB.
- **Motivo:** imagem é o maior componente de peso em site de catálogo; sem limite por arquivo, o orçamento de RNF-011 é rompido pelo primeiro produto com galeria.
- **Métrica ou verificação:** verificação automática do tamanho e do formato no momento do carregamento da mídia (RF-187).
- **Prioridade:** MVP.
- **Critérios de aceite:** Dada uma imagem acima de 200 KB após otimização, quando carregada, então o sistema recusa ou reprocessa o arquivo. Todas as imagens públicas são servidas em formato moderno quando o navegador suporta.

#### RNF-013 — Carregamento diferido abaixo da dobra
- **Descrição:** imagens, vídeos e blocos não visíveis na primeira tela são carregados sob demanda; a imagem principal da primeira tela nunca é diferida.
- **Motivo:** catálogo e galerias carregam muitos elementos que o visitante pode nunca ver; diferir o que está fora da tela é o ganho de maior relação entre efeito e custo em RNF-010.
- **Métrica ou verificação:** comparação do peso do primeiro acesso com e sem rolagem, por template.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao abrir o catálogo sem rolar, apenas as imagens visíveis foram transferidas. A imagem principal da primeira tela não é diferida e não atrasa a métrica de maior conteúdo visível.

#### RNF-014 — Fontes sem bloqueio de renderização
- **Descrição:** no máximo duas famílias e quatro arquivos de fonte, com peso total até 150 KB, exibindo texto imediatamente com fonte alternativa até o carregamento.
- **Motivo:** fonte bloqueante produz tela sem texto e piora a métrica de maior conteúdo visível; a alternativa mal escolhida produz deslocamento e viola RNF-010.
- **Métrica ou verificação:** medição do peso das fontes e observação da renderização de texto em conexão lenta simulada.
- **Prioridade:** MVP.
- **Critérios de aceite:** Em conexão lenta, o texto é legível antes do carregamento completo das fontes. O deslocamento causado pela troca de fonte mantém o total dentro de 0,1.

#### RNF-015 — Política de cache
- **Descrição:** recursos estáticos são armazenados em cache por longo prazo com identificação por versão; documentos são revalidados a cada acesso.
- **Motivo:** visitantes recorrentes são indicador de OB-05, e a segunda visita precisa ser sensivelmente mais rápida; sem versionamento, publicar conteúdo novo não chega a quem já visitou.
- **Métrica ou verificação:** comparação do peso transferido entre primeira e segunda visita; verificação de que uma publicação é visível em até 5 minutos.
- **Prioridade:** MVP.
- **Critérios de aceite:** Na segunda visita, o peso transferido cai ao menos 60%. Ao publicar uma alteração, ela é visível para novos acessos em até 5 minutos.

#### RNF-016 — Verificação do orçamento antes de cada publicação
- **Descrição:** nenhuma publicação que altere template, mídia ou recursos de terceiros ocorre sem verificação prévia do orçamento de RNF-010 a RNF-014.
- **Motivo:** orçamento não verificado é degradado silenciosamente por acréscimos individualmente pequenos; a verificação preventiva é mais barata que a correção após queda de indexação.
- **Métrica ou verificação:** execução da medição em ambiente de homologação (RNF-103) e registro do resultado no checklist de publicação (RNF-102).
- **Prioridade:** MVP.
- **Critérios de aceite:** Dada uma alteração que rompa qualquer limite, então a publicação é bloqueada até correção ou revisão explícita do orçamento. Cada publicação tem resultado de medição registrado.

### 10.3 Acessibilidade (RNF-020..029)

A política detalhada consta da seção 13. Aqui ficam os requisitos verificáveis.

#### RNF-020 — Conformidade WCAG 2.2 nível AA
- **Descrição:** todas as páginas públicas cumprem os critérios de sucesso do nível AA da WCAG 2.2.
- **Motivo:** princípio 11 e PU-06, que pode avaliar acessibilidade como critério de contratação; adiar acessibilidade multiplica o custo de correção quando o portfólio já cresceu. **Premissa PR-026, confirmada. Q-036, resolvida:** sem exigência legal, de edital ou de cliente acima do padrão — sem laudo formal, sem auditoria externa. A meta AA permanece por **decisão técnica** deste PRD, não por obrigação legal, e continua exigível como critério de qualidade interno mesmo sem cobrança externa.
- **Métrica ou verificação:** auditoria por template — não por página — combinando verificação automatizada e revisão manual dos critérios não automatizáveis, conduzida internamente, sem laudo formal nem auditoria externa contratada.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao auditar cada template, nenhum critério AA é violado. Toda não conformidade encontrada é corrigida ou registrada com prazo antes da publicação.

#### RNF-021 — Contraste
- **Descrição:** texto comum tem contraste mínimo de 4,5:1; texto grande e elementos de interface, 3:1.
- **Motivo:** é a falha de acessibilidade mais comum e a mais fácil de evitar na definição da identidade visual; corrigir depois exige refazer a paleta (Q-003).
- **Métrica ou verificação:** medição de cada par de cores da paleta, incluindo estados de foco, erro e desabilitado, antes da aprovação da identidade.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao medir todas as combinações publicadas, nenhuma fica abaixo do mínimo. Mensagens de erro e estados de foco também cumprem o limite.

#### RNF-022 — Navegação completa por teclado
- **Descrição:** toda funcionalidade é operável apenas por teclado, sem armadilhas de foco.
- **Motivo:** menus, galerias e formulários são os pontos onde a operação por teclado costuma quebrar, e são exatamente os elementos de conversão de OB-03.
- **Métrica ou verificação:** percurso completo de cada template apenas por teclado, incluindo abrir menu, filtrar, navegar galeria e enviar formulário.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao percorrer qualquer página por teclado, todas as funções são alcançáveis e executáveis. Nenhum componente retém o foco sem via de saída.

#### RNF-023 — Foco visível e previsível
- **Descrição:** o indicador de foco é visível em todo elemento acionável, com contraste suficiente, e a ordem de foco acompanha a ordem visual.
- **Motivo:** sem indicador, a navegação por teclado é tecnicamente possível e praticamente inutilizável; a ordem divergente confunde inclusive quem enxerga.
- **Métrica ou verificação:** inspeção do indicador em todos os componentes e comparação entre ordem de tabulação e ordem visual por template.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao tabular por qualquer página, cada elemento focado é claramente identificável. A ordem de foco não salta entre regiões distantes da página.

#### RNF-024 — Respeito à redução de movimento
- **Descrição:** animações e transições são suprimidas ou reduzidas quando o visitante indica preferência por movimento reduzido.
- **Motivo:** movimento não solicitado provoca desconforto e desorientação em parte do público; ignorar a preferência declarada é violação direta de um critério verificável.
- **Métrica ou verificação:** verificação de cada componente animado com a preferência de movimento reduzido ativada no sistema.
- **Prioridade:** MVP.
- **Critérios de aceite:** Com a preferência ativada, nenhuma animação decorativa é executada. Nenhuma informação depende exclusivamente de movimento para ser compreendida.

#### RNF-025 — Semântica e estrutura do documento
- **Descrição:** cada página usa marcos de região, listas, tabelas e cabeçalhos conforme o significado do conteúdo, com hierarquia sem saltos.
- **Motivo:** é o que permite a navegação por regiões e por cabeçalhos em leitores de tela, e simultaneamente sustenta a interpretação do conteúdo por buscadores (RF-162, OB-08).
- **Métrica ou verificação:** navegação por regiões e por lista de cabeçalhos em leitor de tela, por template.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao listar os cabeçalhos de qualquer página, a estrutura descreve o conteúdo sem saltos de nível. Cabeçalho, navegação, conteúdo principal e rodapé são identificáveis como regiões.

#### RNF-026 — Textos alternativos
- **Descrição:** toda imagem informativa tem texto alternativo descritivo; imagens decorativas são marcadas como tal.
- **Motivo:** galeria de produto e logos de parceiros são conteúdo, não decoração; sem alternativa, PU-06 e usuários de leitor de tela perdem informação decisiva (J-02).
- **Métrica ou verificação:** validação obrigatória no carregamento da mídia (RF-187) e revisão amostral da qualidade descritiva antes da publicação.
- **Prioridade:** MVP.
- **Critérios de aceite:** Nenhuma imagem publicada está sem alternativa ou sem marcação decorativa. Logos de parceiros identificam o nome da organização no texto alternativo.

#### RNF-027 — Formulários acessíveis
- **Descrição:** rótulos persistentes e associados, erros anunciados, agrupamentos com legenda e instruções que não dependem apenas de cor.
- **Motivo:** o formulário é o ponto de conversão único do MVP; uma falha de acessibilidade ali elimina parte do público de OB-03 sem deixar rastro na medição.
- **Métrica ou verificação:** preenchimento completo dos formulários com leitor de tela e apenas com teclado, incluindo o caminho de erro.
- **Prioridade:** MVP.
- **Critérios de aceite:** Ao submeter um formulário inválido com leitor de tela, cada erro é anunciado com o rótulo do campo. Nenhum campo obrigatório é sinalizado apenas por cor ou símbolo.


#### RNF-028 — Conteúdo com avanço automático pausável
- **Descrição:** bloco cujo conteúdo avança sozinho, sem ação do visitante (destaques da inicial, logos de parceiros), tem controle de pausa sempre visível e operável por teclado.
- **Motivo:** RF-022 e RF-025 crescem com o catálogo (OB-02, OB-06) e podem virar rotação automática; sem pausa, o conteúdo desaparece antes de parte do público lê-lo — falha distinta da resposta a movimento reduzido de RNF-024.
- **Métrica ou verificação:** inspeção de todo bloco com rotação ativa, confirmando pausa acessível por teclado e leitor de tela.
- **Prioridade:** MVP.
- **Critérios de aceite:** Pausado pelo visitante, o conteúdo não retoma sozinho. Nenhum bloco depende do cursor sobre o elemento para pausar.

#### RNF-029 — Verificação de acessibilidade a cada publicação
- **Descrição:** toda publicação de conteúdo novo passa por verificação automatizada e checagem manual dos critérios não automatizáveis antes de ficar pública.
- **Motivo:** a auditoria de RNF-020 cobre o template; conteúdo novo, redigido por quem não tem formação em acessibilidade (PR-023), pode reintroduzir falha sem deixar rastro até a próxima auditoria completa.
- **Métrica ou verificação:** resultado registrado no checklist de publicação (RNF-102) de cada entidade.
- **Prioridade:** MVP.
- **Critérios de aceite:** Publicação sem registro de verificação é bloqueada. O resultado da verificação é consultável por entidade.

### 10.4 SEO técnico (RNF-030..037)

#### RNF-030 — Indexabilidade das páginas públicas
- **Descrição:** toda página pública responde com status de sucesso, sem bloqueio de indexação não intencional, e é alcançável por crawler sem autenticação.
- **Motivo:** OB-08 depende de descoberta orgânica; um bloqueio esquecido em produção — por exemplo herdado da homologação (RF-164) — torna o conteúdo invisível sem sintoma visual.
- **Métrica ou verificação:** varredura do site em até 24 horas após cada publicação, comparando páginas esperadas às rastreáveis.
- **Prioridade:** MVP.
- **Critérios de aceite:** Nenhuma página do catálogo, de soluções ou institucional retorna bloqueio de indexação. A homologação mostra bloqueio total (RF-164).

#### RNF-031 — Conteúdo principal disponível sem execução de script
- **Descrição:** nome, resumo e texto principal de cada entidade estão presentes na resposta do servidor, sem depender de script.
- **Motivo:** crawlers de compartilhamento (RF-165) e parte dos buscadores não executam todo script; conteúdo que só existe após processamento no navegador fica invisível a eles, prejudicando OB-02.
- **Métrica ou verificação:** obtenção da resposta do servidor com script desativado, por template, conferindo a presença do texto principal.
- **Prioridade:** MVP.
- **Critérios de aceite:** Sem executar script, nome e resumo de um produto estão presentes na resposta. Nenhuma entidade depende de interação para revelar seu conteúdo principal.

#### RNF-032 — Integridade estrutural dos endereços publicados
- **Descrição:** todo endereço já publicado continua resolvendo para o conteúdo pretendido ao longo do tempo.
- **Motivo:** RF-170 e RF-171 definem geração de slug e redirecionamento; sem verificação, uma falha nesse mecanismo passa despercebida até quebrar um link externo e a autoridade acumulada (OB-08) com ele.
- **Métrica ou verificação:** auditoria mensal de todo endereço já publicado, confirmando sucesso direto ou redirecionamento de um único salto.
- **Prioridade:** MVP.
- **Critérios de aceite:** Nenhum endereço já publicado retorna erro na auditoria. Nenhuma cadeia de redirecionamento tem mais de um salto.

#### RNF-033 — Tempo de resposta do servidor
- **Descrição:** o servidor inicia a resposta de qualquer página pública em até 600 milissegundos no percentil 75.
- **Motivo:** o orçamento de RNF-010 é medido a partir da resposta do servidor; um servidor lento consome a margem antes de a página começar a renderizar. A calibração de **Premissa PR-025** aplica-se aqui.
- **Métrica ou verificação:** tempo até o primeiro byte de resposta, por template, na mesma verificação de RNF-016.
- **Prioridade:** MVP.
- **Critérios de aceite:** No percentil 75, a resposta inicia em até 600 ms. Nenhuma publicação piora esse tempo sem revisão explícita.

#### RNF-034 — Validade de sitemap e diretrizes para robôs
- **Descrição:** o mapa do site e o arquivo de diretrizes para robôs são tecnicamente válidos e refletem o estado publicado.
- **Motivo:** RF-163 e RF-164 garantem que existem e são regenerados; um mapa com endereço quebrado é pior que a ausência dele, pois o buscador passa a desconfiar dos demais endereços listados.
- **Métrica ou verificação:** validação de formato do mapa e checagem de que entidades publicadas nas últimas 24h constam dele, a cada publicação.
- **Prioridade:** MVP.
- **Critérios de aceite:** Nenhum endereço do mapa retorna erro. Uma entidade publicada aparece no mapa antes da próxima verificação.

#### RNF-035 — Ausência de conteúdo duplicado entre produto e solução
- **Descrição:** nenhum par de páginas publicadas repete o mesmo bloco de texto substancial como conteúdo principal.
- **Motivo:** RF-085 exige que solução não descreva funcionalidade própria; texto copiado do produto para a solução faz buscadores tratarem as páginas como concorrentes, dividindo a autoridade de que OB-09 depende.
- **Métrica ou verificação:** comparação de similaridade de texto entre solução e produtos componentes, antes da publicação.
- **Prioridade:** MVP.
- **Critérios de aceite:** Nenhum bloco de texto principal é idêntico entre solução e produtos que a compõem. Texto copiado é sinalizado antes de ir ao ar.

#### RNF-036 — Validade dos dados estruturados
- **Descrição:** todo dado estruturado declarado (RF-166 a RF-169) é reconhecido sem erro pelas ferramentas de validação de referência.
- **Motivo:** dado estruturado com erro é pior que a ausência: pode penalizar a confiabilidade do domínio inteiro, prejudicando OB-01, OB-02 e OB-09 ao mesmo tempo.
- **Métrica ou verificação:** validação de cada template com dado estruturado, a cada alteração de campo do modelo de conteúdo.
- **Prioridade:** MVP.
- **Critérios de aceite:** Nenhuma página publicada reporta erro de validação. Aviso de campo recomendado ausente é tratado antes da próxima publicação.

#### RNF-037 — Controle de indexação de páginas utilitárias
- **Descrição:** `/obrigado`, `/busca`, listagens filtradas e rascunhos nunca aparecem em resultado de busca.
- **Motivo:** garante o resultado do comportamento de RF-172; página de confirmação indexada distorce a métrica de conversão (RF-201) e expõe página sem valor, contra OB-05.
- **Métrica ou verificação:** busca mensal pelo endereço dessas páginas nos mecanismos de referência do mercado brasileiro.
- **Prioridade:** MVP.
- **Critérios de aceite:** Nenhum resultado indexado aparece para `/obrigado` ou `/busca`. Listagem filtrada não aparece como resultado distinto da listagem base.

### 10.5 Segurança (RNF-040..049, RNF-110)

#### RNF-040 — HTTPS obrigatório com redirecionamento permanente
- **Descrição:** todo acesso ao site é servido exclusivamente sobre conexão criptografada; acesso não criptografado é redirecionado de forma permanente.
- **Motivo:** formulários coletam dado pessoal desde o primeiro dia (RF-120, RF-121); conexão aberta expõe esse dado em trânsito e contradiz a seriedade que sustenta OB-05.
- **Métrica ou verificação:** tentativa de acesso não criptografado em cada endereço público, confirmando redirecionamento.
- **Prioridade:** MVP.
- **Critérios de aceite:** Acesso sem criptografia redireciona de forma permanente à versão criptografada. Nenhum recurso carrega por conexão aberta.

#### RNF-041 — Cabeçalhos de segurança do navegador
- **Descrição:** toda resposta declara diretrizes que restringem origem de script e estilo, forçam conexão criptografada, impedem interpretação incorreta de arquivo, limitam vazamento de origem e restringem recursos sensíveis do navegador.
- **Motivo:** o site publica formulário e recurso de terceiro (PR-024); sem essas diretrizes, uma falha de outra natureza (RNF-044) fica mais fácil de explorar contra o visitante.
- **Métrica ou verificação:** inspeção das diretrizes em toda resposta, por template, com ferramenta de referência.
- **Prioridade:** MVP.
- **Critérios de aceite:** Toda página pública declara as diretrizes listadas. Nenhuma é enfraquecida sem revisão registrada.

#### RNF-042 — Proteção contra envio automatizado
- **Descrição:** os formulários recusam ou descartam envio identificado como automatizado, sem depender de um único mecanismo.
- **Motivo:** site novo sem histórico é alvo fácil de automação; leads falsos poluem a caixa compartilhada (PR-021) e obrigam quem responde (PR-023) a triar lixo antes de uma oportunidade real (OB-03).
- **Métrica ou verificação:** envio automatizado simulado contra os dois formulários, confirmando descarte sem atrito perceptível a um envio humano.
- **Prioridade:** MVP.
- **Critérios de aceite:** Envio automatizado simulado é descartado sem gerar lead. Envio humano legítimo não sofre fricção adicional por padrão — ver Q-030.

#### RNF-043 — Proteção do endpoint que recebe os formulários
- **Descrição:** o ponto que recebe os formulários valida origem, formato, tamanho e método da requisição, rejeitando o que não corresponde ao esperado.
- **Motivo:** é a superfície que aceita dado externo sem autenticação; endpoint sem validação própria aceita payload arbitrário, o vetor mais comum de abuso. **Q-047, resolvida:** teste de intrusão fica para fase posterior ao lançamento, não antes — decisão que passa a valer também para o painel de administração (seção 9.10), cuja superfície de ataque própria (autenticação, sessão) só será submetida a teste de intrusão depois de lançada, não antes.
- **Métrica ou verificação:** requisição fora do formato esperado, confirmando rejeição sem expor detalhe interno.
- **Prioridade:** MVP.
- **Critérios de aceite:** Requisição de origem não reconhecida é rejeitada antes de gerar lead. Nenhum erro exposto revela detalhe da implementação.

#### RNF-044 — Gestão de dependências e correção de vulnerabilidades
- **Descrição:** todo componente de terceiro usado na construção do site é verificado contra vulnerabilidade conhecida, com correção em prazo definido por severidade.
- **Motivo:** vulnerabilidade não corrigida em componente de construção é a porta de entrada mais comum de comprometimento de site institucional. **Premissa PR-027:** a correção é rotina contínua da equipe de publicação. **Q-044, resolvida:** o cliente decidiu não incluir um procedimento formal de resposta a incidente de segurança por enquanto. **Risco registrado:** com o painel de administração confirmado (seção 9.10) ampliando a superfície de ataque do site, a ausência de um procedimento formal significa que, havendo incidente, a resposta dependerá de decisão ad hoc dos dois sócios no momento, sem passo a passo predefinido — risco aceito nesta fase, não eliminado por este requisito.
- **Métrica ou verificação:** verificação periódica automatizada, com prazo de correção contado a partir do alerta.
- **Prioridade:** MVP.
- **Critérios de aceite:** Nenhuma vulnerabilidade de severidade alta passa do prazo definido sem correção. Toda correção é registrada com data.

#### RNF-045 — Ausência de segredo no código entregue ao navegador
- **Descrição:** nenhuma chave, senha, token ou credencial aparece no código ou arquivo entregue ao navegador do visitante.
- **Motivo:** tudo que chega ao navegador é publicamente inspecionável; credencial exposta compromete o serviço de destino, risco desproporcional a qualquer atalho.
- **Métrica ou verificação:** varredura do código entregue ao navegador em busca de padrão de credencial, a cada publicação que altere script.
- **Prioridade:** MVP.
- **Critérios de aceite:** Nenhuma credencial é encontrada na varredura. Chamada que exija segredo é sempre intermediada pelo servidor.

#### RNF-046 — Controle de acesso à publicação
- **Descrição:** publicar ou alterar conteúdo exige autenticação individual, associada a quem publicou e quando.
- **Motivo:** publicação tem efeito público e legal (RF-141); com exatamente duas pessoas autorizadas — os sócios da ArtZan (**PR-023, corrigida** por Q-034: não "até três" como a premissa original assumia) —, conta compartilhada impede apurar responsabilidade por erro publicado (RF-183).
- **Métrica ou verificação:** tentativa de publicar sem autenticação válida e conferência de autoria em publicações reais.
- **Prioridade:** MVP.
- **Critérios de aceite:** Publicação sem sessão autenticada é recusada. Autor e data da última publicação são identificáveis em qualquer entidade.

#### RNF-047 — Autenticação segura de acesso administrativo
- **Descrição:** as credenciais de acesso ao painel são armazenadas e verificadas de forma segura, nunca em texto legível, com exigência mínima de robustez para a senha ou equivalente de cada sócio.
- **Motivo:** o painel de administração confirmado por Q-033 é a porta de entrada para publicar e alterar todo o conteúdo público (seção 9.10); uma credencial mal protegida ou fácil de adivinhar anula todos os demais controles de acesso do painel (RF-188), incluindo o registro de autoria de que RNF-046 depende.
- **Métrica ou verificação:** verificação de que nenhuma credencial é armazenada de forma reversível ou legível, e de que a política mínima de robustez é aplicada no cadastro e na troca de credencial.
- **Prioridade:** MVP.
- **Critérios de aceite:** Nenhuma credencial de acesso ao painel é encontrada em texto legível em qualquer armazenamento inspecionado. Uma tentativa de definir credencial abaixo do mínimo de robustez é recusada.

#### RNF-048 — Proteção de sessão administrativa
- **Descrição:** a sessão autenticada do painel é protegida contra reuso, interceptação e persistência além do necessário.
- **Motivo:** RF-189 exige expiração por inatividade; este item cobre a segurança técnica da sessão em si — sem ela, uma sessão capturada ou reaproveitada permitiria publicar em nome de um sócio sem que ele tivesse autenticado.
- **Métrica ou verificação:** verificação de que a sessão trafega apenas por conexão criptografada (RNF-040), de que encerrar a sessão a invalida de fato no servidor, e de que uma sessão antiga não pode ser reaproveitada após o encerramento ou a expiração.
- **Prioridade:** MVP.
- **Critérios de aceite:** Uma sessão encerrada não concede mais acesso, mesmo reapresentada tecnicamente. Nenhuma sessão do painel trafega fora de conexão criptografada.

#### RNF-049 — Controle de tentativas de acesso
- **Descrição:** tentativas repetidas e malsucedidas de autenticação no painel são limitadas, com atraso ou bloqueio temporário progressivo.
- **Motivo:** um painel com apenas duas contas conhecidas (RF-183) é alvo previsível de tentativa automatizada de adivinhação de credencial; sem limite de tentativas, a autenticação individual de RF-188 é apenas um obstáculo de tempo para um ataque automatizado, não uma proteção real.
- **Métrica ou verificação:** simulação de tentativas repetidas de acesso, confirmando atraso ou bloqueio progressivo sem exigir intervenção manual para tentativas legítimas eventuais.
- **Prioridade:** MVP.
- **Critérios de aceite:** Após um número definido de tentativas malsucedidas seguidas, uma nova tentativa imediata é atrasada ou bloqueada temporariamente. O bloqueio não exige suporte técnico externo para ser resolvido pelo próprio sócio.

#### RNF-110 — Proteção das rotas administrativas contra indexação e acesso anônimo
- **Descrição:** o painel de administração e todos os seus endereços não são indexáveis, não são descobríveis por navegação pública e não expõem qualquer conteúdo a quem não estiver autenticado. **Nota de numeração:** a faixa RNF-040..049 preencheu-se com RNF-047 a RNF-049; este item, exigido pela mesma confirmação do painel (Q-033), continua a partir de RNF-110, conforme a regra de não renumerar itens existentes.
- **Motivo:** um painel de conteúdo é o alvo mais valioso do site para um ataque, precisamente por poder publicar em nome da ArtZan (RF-183); deixá-lo indexável ou parcialmente visível sem autenticação equivale a anunciar publicamente onde atacar, e a listar para buscadores um caminho que RF-164 já trata como não indexável para a homologação — o mesmo cuidado se estende ao painel em produção.
- **Métrica ou verificação:** verificação de que nenhum endereço do painel aparece no mapa do site (RF-163) ou é rastreável pelo arquivo de diretrizes para robôs (RF-164); tentativa de acessar qualquer tela do painel sem autenticação, confirmando ausência de conteúdo ou de metadado sensível na resposta.
- **Prioridade:** MVP.
- **Critérios de aceite:** Nenhum endereço do painel consta do mapa do site nem é permitido pelas diretrizes para robôs. Uma requisição não autenticada a qualquer tela do painel não recebe conteúdo administrativo, apenas o redirecionamento ou a recusa de acesso.

### 10.6 Privacidade e proteção de dados (RNF-050..057)

#### RNF-050 — Minimização dos dados coletados
- **Descrição:** cada formulário coleta apenas os campos necessários para responder ao pedido, sem campo especulativo.
- **Motivo:** obrigação da LGPD que reduz superfície de incidente (RF-204); campo além do necessário também é fricção que reduz conclusão do formulário (OB-04).
- **Métrica ou verificação:** revisão de cada campo de RF-120 e RF-121 contra a finalidade declarada, antes da publicação.
- **Prioridade:** MVP.
- **Critérios de aceite:** Todo campo tem finalidade explicável. Nenhum campo obrigatório é alheio ao atendimento do pedido.

#### RNF-051 — Base legal e consentimento sob a LGPD
- **Descrição:** todo tratamento de dado pessoal tem base legal identificada; quando a base for consentimento, ele é específico, informado e registrável.
- **Motivo:** obrigação central da lei; sem base legal por finalidade, formulário e medição ficam expostos a questionamento (RF-127, RF-203).
- **Métrica ou verificação:** verificação de que cada finalidade — contato, demonstração, medição — tem base legal documentada antes do lançamento.
- **Prioridade:** MVP.
- **Critérios de aceite:** Cada finalidade de tratamento tem base legal identificada. Onde a base é consentimento, o registro existe por envio.

#### RNF-052 — Aviso de privacidade acessível de qualquer página
- **Descrição:** existe caminho para a política de privacidade a partir do rodapé de toda página e de todo formulário, em um passo.
- **Motivo:** RF-141 publica a política desde o lançamento; aviso inalcançável de qualquer ponto equivale a não existir no momento em que o visitante mais precisa dele.
- **Métrica ou verificação:** verificação da presença do link em cada template publicado.
- **Prioridade:** MVP.
- **Critérios de aceite:** A política é alcançável em um clique de qualquer página. Nenhum template omite o link de rodapé.

#### RNF-053 — Prazo de retenção definido
- **Descrição:** cada categoria de dado pessoal tem prazo de retenção definido e declarado, após o qual o dado é eliminado ou anonimizado.
- **Motivo:** RF-127 exige que o aviso descreva prazo de retenção; sem prazo real por trás, a declaração não resiste a uma auditoria. **Pergunta Q-042:** ver Q-065, que trata do prazo de retenção e da validação jurídica dos dados de formulário.
- **Métrica ou verificação:** conferência de que o prazo declarado corresponde a rotina real de eliminação, não apenas texto.
- **Prioridade:** MVP.
- **Critérios de aceite:** O aviso declara prazo de retenção por categoria de dado. Passado o prazo, o dado não é mais encontrado em texto claro.

#### RNF-054 — Atendimento aos direitos do titular
- **Descrição:** existe canal identificado para o titular solicitar acesso, correção ou eliminação de seu dado, com prazo de resposta definido.
- **Motivo:** direito garantido pela LGPD mesmo sem área logada; sem canal claro, um direito legal vira obrigação que ninguém sabe cumprir na primeira solicitação real. **Pergunta Q-043:** qual canal e prazo de resposta serão usados?
- **Métrica ou verificação:** verificação de que o canal está descrito no aviso e há responsável interno designado.
- **Prioridade:** MVP.
- **Critérios de aceite:** O canal para exercício de direitos está identificado no aviso. Solicitação simulada recebe resposta dentro do prazo declarado.

#### RNF-055 — Tratamento de cookies e recursos de terceiros
- **Descrição:** nenhum cookie ou recurso de terceiro não essencial é carregado antes do consentimento; os essenciais são listados e justificados.
- **Motivo:** RF-203 exige que medição não essencial dependa de consentimento prévio; sem isso aplicado tecnicamente, o aviso de cookies é só texto enquanto o rastreamento já ocorre — o que a LGPD veda.
- **Métrica ou verificação:** inspeção dos recursos carregados antes de qualquer resposta ao aviso.
- **Prioridade:** MVP.
- **Critérios de aceite:** Antes de resposta ao aviso, só recursos essenciais carregam. A lista declarada corresponde à lista carregada.

#### RNF-056 — Transferência internacional de dados
- **Descrição:** quando um fornecedor contratado processa dado pessoal fora do Brasil, o aviso de privacidade declara o fato e a salvaguarda aplicável.
- **Motivo:** PR-024, e possivelmente hospedagem e e-mail transacional (RF-130), podem operar fora do país. **Q-040, resolvida:** "provavelmente sim" — o cliente confirmou ser provável que o tratamento ocorra fora do Brasil. **Premissa PR-031 (atualizada):** diante dessa resposta, o aviso de privacidade passa a declarar a transferência internacional como **cenário possível desde a publicação**, em vez de esperar a confirmação final de cada fornecedor para só então incluir o texto.
- **Métrica ou verificação:** conferência da localização de processamento de cada fornecedor antes do lançamento, cruzada com o texto de transferência já publicado no aviso.
- **Prioridade:** MVP.
- **Critérios de aceite:** O aviso de privacidade inclui, desde o lançamento, o texto de transferência internacional como cenário possível. A localização de cada fornecedor é identificada e, havendo transferência confirmada, o aviso passa a declará-la nominalmente.

#### RNF-057 — Registro do consentimento com data e versão
- **Descrição:** todo consentimento coletado é registrado com o texto exato aceito, sua versão e o momento da aceitação.
- **Motivo:** RF-142 garante isso para o texto legal; este item estende o mesmo padrão ao ato de aceitar, sem o qual a empresa não demonstra o que foi consentido. **Aplica-se aos dois consentimentos distintos do formulário:** o consentimento de tratamento dos dados da solicitação (RF-127) e o aceite separado para comunicações futuras (RF-221, Q-066) — cada um com seu próprio registro de texto, versão e momento, nunca um registro combinado que confunda os dois.
- **Métrica ou verificação:** conferência por amostragem de que todo registro — tanto o de tratamento quanto o de comunicações futuras — inclui os três elementos, a cada nova versão dos textos legais.
- **Prioridade:** MVP.
- **Critérios de aceite:** Um consentimento registrado traz versão do texto, data e identifica a qual dos dois consentimentos se refere. Nova versão do texto não altera registros já coletados sob a anterior.

### 10.7 Compatibilidade (RNF-060..065)

#### RNF-060 — Critério objetivo de navegadores suportados
- **Descrição:** suporte completo apenas às versões recentes de cada navegador relevante, cobrindo mobile e desktop, sem compromisso de suportar navegador ou versão descontinuados.
- **Motivo:** **Q-037, resolvida:** o cliente aceitou suportar apenas dispositivos e versões recentes, mesmo com o risco de excluir parte do público, desde que mobile e desktop estejam ambos garantidos. Esta decisão substitui a formulação mais conservadora da versão anterior deste requisito, que hesitava em fechar esse corte por preocupação com ambientes corporativos desatualizados (PU-06). **Consequência assumida, registrada com honestidade:** quem acessa por navegador ou sistema descontinuado — inclusive parte de PU-06 em ambiente corporativo desatualizado — pode ter experiência degradada ou indisponível; o cliente decidiu aceitar essa perda em vez de arcar com o custo de suportar versões antigas indefinidamente. **Premissa PR-028:** sem dado real de audiência, usa-se referência genérica de mercado no Brasil para definir o que conta como "recente".
- **Métrica ou verificação:** verificação de cada template nas versões recentes de navegador, em mobile e em desktop, a cada mudança relevante da camada visual.
- **Prioridade:** MVP.
- **Critérios de aceite:** Nenhuma função essencial falha nas versões recentes testadas, tanto em mobile quanto em desktop. O critério, a lista testada e a data ficam documentados, junto do registro explícito de que suporte a versões antigas foi conscientemente descartado.

#### RNF-061 — Degradação graciosa
- **Descrição:** quando um recurso visual não é suportado por um navegador específico, o conteúdo permanece acessível em versão simplificada, nunca ausente.
- **Motivo:** princípio 2 — seção quebrada prejudica OB-05 mais que seção simples; degradar graciosamente separa suporte limitado de site quebrado.
- **Métrica ou verificação:** verificação de cada template com o recurso mais recente desativado.
- **Prioridade:** MVP.
- **Critérios de aceite:** Sem o recurso avançado, o conteúdo essencial permanece legível e operável. Nenhum elemento aparece quebrado ou sobreposto.

#### RNF-062 — Operação essencial sem JavaScript
- **Descrição:** navegar, ler conteúdo e enviar os formulários continuam funcionando com script desativado no navegador do visitante.
- **Motivo:** distinto de RNF-031, focado no crawler: aqui o público é humano — bloqueador ou falha de rede desativam script para um visitante real, e perder o envio nesse caso é perder oportunidade comercial (OB-03).
- **Métrica ou verificação:** percurso completo de navegação e envio de formulário com script desativado.
- **Prioridade:** Fase 2.
- **Critérios de aceite:** Com script desativado, toda página é navegável e legível. O formulário de contato pode ser enviado, ainda que sem validação em tempo real.

#### RNF-063 — Comportamento em impressão das páginas legais
- **Descrição:** privacidade e termos de uso produzem impressão legível, com texto completo, sem elemento de navegação nem corte entre páginas.
- **Motivo:** um titular pode precisar arquivar o texto vigente (RF-141) fora do site; documento com efeito legal exige esse cuidado que página institucional comum dispensa.
- **Métrica ou verificação:** geração de impressão de P-13 e P-14, conferindo texto completo sem corte.
- **Prioridade:** MVP.
- **Critérios de aceite:** A impressão da política de privacidade traz todo o texto vigente legível. Nenhum menu aparece na versão impressa.

#### RNF-064 — Suporte a zoom até 200%
- **Descrição:** toda página permanece legível e operável com ampliação de até 200% no navegador, sem perda de conteúdo nem rolagem horizontal.
- **Motivo:** teste de compatibilidade entre camada visual e ampliação; falhar remove conteúdo de quem depende de zoom, sem que a equipe de conteúdo perceba em uso normal.
- **Métrica ou verificação:** teste de cada template com ampliação de 200%, sem alterar configuração do sistema operacional.
- **Prioridade:** MVP.
- **Critérios de aceite:** A 200%, nenhum texto ou controle é cortado. O corpo não produz rolagem horizontal, coerente com RNF-003.

#### RNF-065 — Tolerância a bloqueadores de conteúdo comuns
- **Descrição:** navegação, leitura e envio de formulário continuam funcionando com bloqueador de anúncios ou rastreamento ativo no navegador.
- **Motivo:** parte do público técnico (PU-06) navega com bloqueador por padrão; se a ferramenta única de medição (PR-024) for bloqueada, a perda é só de dado — nunca deve virar perda comercial.
- **Métrica ou verificação:** percurso completo do site com bloqueador ativado, confirmando que só a medição é afetada.
- **Prioridade:** MVP.
- **Critérios de aceite:** Com bloqueador ativo, o envio de formulário funciona normalmente. Só eventos de medição são impedidos.

### 10.8 Manutenibilidade e modelo de conteúdo (RNF-070..077)

#### RNF-070 — Separação entre conteúdo e apresentação
- **Descrição:** campos de cada entidade vivem separados do código de layout, cor e tipografia; alterar um não exige tocar o outro.
- **Motivo:** princípio 5 e OB-07 — se publicar exigisse editar apresentação, o modelo de conteúdo seria ficção.
- **Métrica ou verificação:** verificação de que alteração de conteúdo não produz alteração de apresentação, por amostragem a cada publicação.
- **Prioridade:** MVP.
- **Critérios de aceite:** Publicar um produto novo não altera arquivo de apresentação. Alterar um token visual não edita conteúdo de entidade.

#### RNF-071 — Template único por tipo de entidade
- **Descrição:** existe exatamente um template por tipo — produto, solução, parceiro, institucional; nenhuma entidade usa arranjo próprio.
- **Motivo:** RF-010 exige consistência estrutural; exceção "para produto estratégico" quebra a comparação que substitui o comparador no MVP (J-06).
- **Métrica ou verificação:** verificação de que toda página de um tipo usa o mesmo template, sem arranjo alternativo no sistema.
- **Prioridade:** MVP.
- **Critérios de aceite:** Duas páginas de produto quaisquer têm estrutura idêntica. Nenhum mecanismo permite publicar fora do template único.

#### RNF-072 — Biblioteca de componentes e tokens visuais
- **Descrição:** cor, tipografia, espaçamento e componentes são definidos uma vez, em referência única, reutilizada por todos os templates.
- **Motivo:** sem referência única, cada template redefine os mesmos valores com pequenas diferenças, repetindo na camada visual o problema que o princípio 8 evita no conteúdo.
- **Métrica ou verificação:** verificação de que nenhum template declara valor visual fora da referência única.
- **Prioridade:** MVP.
- **Critérios de aceite:** Alterar um token na referência reflete em todos os templates. Nenhum template declara valor equivalente por conta própria.

#### RNF-073 — Glossário de termos aplicado de forma consistente
- **Descrição:** termos que distinguem software, solução, parceiro e demais conceitos têm definição única, aplicada de forma idêntica em todo texto publicado.
- **Motivo:** RF-085 depende de rótulo consistente; glossário aplicado parcialmente reabre a confusão que RF-085 existe para fechar, sobretudo com novas pessoas redigindo conteúdo (PR-023).
- **Métrica ou verificação:** revisão de todo texto publicado contra o glossário, antes de cada publicação.
- **Prioridade:** MVP.
- **Critérios de aceite:** Os termos do glossário aparecem sem variação de rótulo. Termo fora do glossário para conceito já nomeado é sinalizado antes de publicar.

#### RNF-074 — Proibição de conteúdo de negócio fixo no código
- **Descrição:** nenhum nome de produto, solução, parceiro ou dado do negócio aparece escrito diretamente em código; todo esse conteúdo vem do registro correspondente.
- **Motivo:** um texto de negócio esquecido em código, multiplicado ao longo do crescimento do portfólio (OB-07), vira segunda fonte de verdade divergente do conteúdo publicado.
- **Métrica ou verificação:** varredura do código em busca de texto de entidade publicada, a cada revisão de arquitetura.
- **Prioridade:** MVP.
- **Critérios de aceite:** Nenhum nome de produto, solução ou parceiro publicado aparece fixo no código-fonte. Remover um registro não deixa vestígio de texto no código.

#### RNF-075 — Tempo alvo para publicar um produto novo
- **Descrição:** pessoa sem perfil técnico publica um produto novo, com campos e vínculos já redigidos, em até 60 minutos.
- **Motivo:** este alvo era o critério de escolha entre as duas opções de administração que a seção 9.10 comparava enquanto Q-033 estava aberta; com o painel confirmado, deixa de ser critério de escolha e passa a ser o **alvo de desempenho do próprio painel** — teste direto de que OB-07 se cumpre na prática, não apenas no modelo de dados. **Premissa PR-035:** os 60 minutos cobrem campos e vínculos preenchidos no painel, não a produção de texto e imagem.
- **Métrica ou verificação:** cronometragem de uma publicação completa pelo painel em homologação (RNF-103), feita por um dos sócios sem apoio técnico externo.
- **Prioridade:** MVP.
- **Critérios de aceite:** A publicação de um produto com conteúdo pronto, feita por um dos sócios usando apenas o painel, não excede 60 minutos. Nenhuma etapa exige suporte técnico externo ao papel dos dois sócios (RF-183).

#### RNF-076 — Documentação mínima de publicação
- **Descrição:** existe guia curto e atualizado descrevendo como publicar cada tipo de entidade e o que cada campo espera.
- **Motivo:** com até três publicadores (PR-023) e possível troca de pessoas, o conhecimento de publicar não pode existir só na memória de quem operou o lançamento.
- **Métrica ou verificação:** verificação de que o guia cobre todo campo obrigatório (6.7) e é revisado a cada mudança de campo.
- **Prioridade:** MVP.
- **Critérios de aceite:** Seguindo só o guia, uma pessoa nova publica um produto de teste sem apoio adicional. Mudança de campo atualiza o guia antes da próxima publicação.

#### RNF-077 — Rastreabilidade de alteração de conteúdo
- **Descrição:** toda alteração relevante de conteúdo publicado é identificável — o que mudou, quando e por quem — além do registro de autoria de RNF-046.
- **Motivo:** RNF-046 registra quem publicou; RF-192 (seção 9.10) garante, desde o MVP, um registro no nível de ação — o quê, quem, quando — suficiente como trilha de auditoria mínima entre os dois sócios sem hierarquia de aprovação. Este item vai além: garante recuperar o **texto anterior campo a campo**, necessário para investigar um erro relatado com precisão ou reverter uma alteração isolada sem reconstrução manual — capacidade mais cara de construir, por isso continua Fase 2, sem prejuízo de o registro mais simples de RF-192 já valer desde o lançamento.
- **Métrica ou verificação:** verificação de que alteração de campo em entidade publicada gera registro comparável ao estado anterior.
- **Prioridade:** Fase 2.
- **Critérios de aceite:** O histórico de uma entidade mostra o texto anterior a uma alteração específica. Reverter um campo não exige reconstrução manual.

### 10.9 Escalabilidade (RNF-080..085)

#### RNF-080 — Crescimento do catálogo em uma ordem de magnitude
- **Descrição:** o site opera sem mudança estrutural com catálogo de dezenas de produtos e soluções, ordem de magnitude acima da estimativa de lançamento (PR-002).
- **Motivo:** princípio 5 e OB-07 só se comprovam além do cenário de lançamento; modelo que degrada com dezenas de produtos só adiou o problema.
- **Métrica ou verificação:** povoamento de homologação (RNF-103) com dezenas de produtos de teste, verificando listagens, blocos derivados e tempo de publicação.
- **Prioridade:** Fase 2.
- **Critérios de aceite:** Com dezenas de produtos de teste, nenhuma listagem degrada perceptivelmente. Nenhuma alteração estrutural é necessária.

#### RNF-081 — Custo marginal constante de adicionar uma entidade
- **Descrição:** o esforço de publicar o vigésimo produto é o mesmo esforço do primeiro.
- **Motivo:** tradução verificável de OB-07 em custo de operação; entidade que exige mais esforço que a anterior torna o crescimento do portfólio progressivamente mais caro.
- **Métrica ou verificação:** comparação do tempo de publicação (RNF-075) entre as primeiras entidades e entidades cadastradas após o crescimento em homologação.
- **Prioridade:** Fase 2.
- **Critérios de aceite:** O tempo de publicação da vigésima entidade não excede o da primeira. Nenhuma entidade adicional exige alteração de código.

#### RNF-082 — Ativação progressiva sem migração
- **Descrição:** categoria, filtro, ordenação, busca e paginação já existem no modelo e são ligados por configuração, sem migração de dado, nos gatilhos de 6.6.
- **Motivo:** PR-013 já garante isso para categoria; este item estende a garantia aos demais recursos, para que atingir um gatilho seja ativar uma opção, não um projeto de migração. **Q-023, confirmada:** os gatilhos numéricos do PRD são mantidos; com os cinco itens de portfólio confirmados (seção 2 do digesto de respostas), o catálogo de lançamento fica **abaixo de todos os gatilhos** — nenhum destes recursos é ativado no dia um: catálogo simples, sem agrupamento, sem filtro, sem ordenação, sem busca e sem paginação.
- **Métrica ou verificação:** ativação de cada recurso em homologação antes do catálogo real atingir o gatilho, confirmando ausência de migração.
- **Prioridade:** MVP (existência); Fase 2 (ativação conforme o gatilho).
- **Critérios de aceite:** Ativar filtro por categoria em homologação não exige reeditar produto existente. A ativação é revertível sem perda de dado. Com os cinco produtos do lançamento, nenhum destes recursos aparece ligado.

#### RNF-083 — Preparação para múltiplos idiomas sem ativação no MVP
- **Descrição:** a estrutura suporta declarar e alternar o idioma do conteúdo por configuração — incluindo o segmento de idioma já isolado no padrão de URL (RF-170) e no canônico (RF-161) —, mesmo publicando um único idioma no lançamento.
- **Motivo:** PR-006 fixa um idioma no MVP, mas OB-08 pode exigir alcance internacional depois. **Q-011, resolvida:** a preparação para inglês deixa de ser genérica e vira requisito concreto de estrutura — não basta a intenção declarada; o padrão de URL e o canônico precisam reservar, desde o lançamento, o ponto exato onde um segundo idioma entraria, para que ativá-lo depois não exija refazer template, conteúdo nem endereço já publicado.
- **Métrica ou verificação:** verificação de que o idioma é atributo de configuração (RF-011), não texto fixo, em todo template, e de que o padrão de URL (RF-170) e o canônico (RF-161) já isolam o segmento de idioma na composição do endereço.
- **Prioridade:** MVP (estrutura); Futuro (ativação).
- **Critérios de aceite:** O idioma declarado vem de configuração em qualquer template. Simular um segundo idioma em homologação não altera a estrutura dos templates nem o padrão de URL já publicado em português.

#### RNF-084 — Comportamento das listagens em volume alto
- **Descrição:** catálogo, soluções e parceiros mantêm o mesmo tempo de resposta e clareza de leitura independente do número de itens, respeitando a paginação de 6.6.
- **Motivo:** modelo que promete escalar (princípio 5) mas degrada em volume alto transfere o problema para a experiência do visitante, prejudicando páginas de maior intenção comercial (OB-02, OB-03).
- **Métrica ou verificação:** medição do orçamento de RNF-011 na listagem povoada com o volume de RNF-080, sem degradar mais de 10%.
- **Prioridade:** Fase 2.
- **Critérios de aceite:** Com dezenas de itens e paginação ativa, o peso da listagem permanece dentro do orçamento de RNF-011. Nenhuma listagem carrega todos os itens de uma vez com paginação ativa.

#### RNF-085 — Crescimento do volume de mídia
- **Descrição:** o crescimento de imagens e vídeos que acompanha o catálogo não degrada o carregamento de nenhuma página nem exige reorganização manual do acervo.
- **Motivo:** RF-187 centraliza a gestão de mídia para este cenário; sem controle de volume, a primeira publicação que ultrapassar um limite não previsto rompe o orçamento de RNF-011 sem aviso.
- **Métrica ou verificação:** verificação do orçamento de imagem (RNF-012) após inserção de volume equivalente ao catálogo maior (RNF-080).
- **Prioridade:** Fase 2.
- **Critérios de aceite:** Com acervo ampliado, nenhuma página ultrapassa o orçamento de RNF-011. Localizar uma imagem carregada não depende de busca manual por nome de arquivo.

### 10.10 Disponibilidade e monitoramento (RNF-090..097)

#### RNF-090 — Alvo de disponibilidade declarado
- **Descrição:** declara-se meta de disponibilidade mensal de 99,5% para o site, referência de aceitação do provedor e de qualquer incidente.
- **Motivo:** sem alvo declarado, indisponibilidade não tem critério de gravidade, e a empresa não pode cobrar o provedor por um padrão nunca explicitado. **Premissa PR-029:** 99,5% assume hospedagem convencional sem redundância dedicada. **Q-038, resolvida:** "manter a premissa do PRD" — o alvo de 99,5% permanece, sem meta contratual adicional do provedor confirmada até o momento.
- **Métrica ou verificação:** apuração mensal do percentual real contra o alvo declarado, a partir do que o provedor de hospedagem reportar e da observação direta; **RNF-091 registra que não há verificação externa independente** — a apuração deste item herda a mesma limitação, sem prova externa própria.
- **Prioridade:** MVP.
- **Critérios de aceite:** O percentual mensal apurado é comparável ao alvo, com a fonte do dado (provedor ou observação direta) identificada. Indisponibilidade que rompe o alvo é registrada com causa e duração, quando percebida.

#### RNF-091 — Ausência de monitoramento externo de disponibilidade e risco residual
- **Descrição:** o site não contrata serviço externo de verificação de disponibilidade no lançamento; a percepção de indisponibilidade depende do que o provedor de hospedagem oferecer nativamente e da observação direta pelos sócios.
- **Motivo:** **Q-039, resolvida:** o cliente decidiu que monitoramento externo não é necessário — decisão consciente de custo, não omissão do PRD. **Risco residual assumido, registrado com honestidade:** sem verificação independente de fora da própria infraestrutura, uma queda completa do site pode não gerar alerta automático algum; a empresa pode saber da indisponibilidade só por reclamação de visitante ou checagem manual não sistemática, e o tempo entre a queda e sua percepção não tem limite superior garantido — ao contrário do que a verificação externa descartada garantiria. Este risco é aceito, não mitigado por este requisito.
- **Métrica ou verificação:** revisão periódica, pelos sócios, de que o site responde normalmente, complementada pelo painel do provedor de hospedagem quando disponível; não há verificação automatizada de terceiro.
- **Prioridade:** Futuro — decisão de não fazer registrada no lançamento; pode ser reconsiderada a qualquer momento por decisão comercial, sem exigir mudança estrutural do site.
- **Critérios de aceite:** A decisão de não contratar monitoramento externo, sua data e o risco residual ficam documentados e acessíveis a quem opera o site. Nenhuma parte deste PRD volta a afirmar que existe monitoramento externo contratado.

#### RNF-092 — Alerta obrigatório em falha no envio de formulário
- **Descrição:** toda falha no processamento ou entrega de um formulário gera alerta a um responsável operacional em até 15 minutos, além do erro mostrado ao visitante.
- **Motivo:** uma solicitação comercial perdida em silêncio é o pior defeito possível deste site — os dois formulários são o único ponto de conversão do MVP (PR-020, OB-03, OB-04). RF-128, RF-130 e RF-132 já assumem este alerta como dependência. **Tensão com RNF-091 resolvida explicitamente:** este alerta não depende do monitoramento externo que RNF-091 deixou de contratar — é a própria aplicação que detecta sua falha de processamento ou de entrega e dispara a notificação, mecanismo tecnicamente independente de um serviço externo verificar se o site está no ar. **Risco residual desta solução:** se a falha for grave o suficiente para tirar o site inteiro do ar — não apenas o processamento de um formulário —, a própria aplicação pode não conseguir disparar o alerta; esse cenário mais grave só seria coberto por verificação externa, que RNF-091 registra como não contratada. Este requisito garante o alerta para falha de processamento com o site no ar; não cobre o site inteiro fora do ar.
- **Métrica ou verificação:** simulação de falha de entrega em cada formulário, confirmando alerta a um responsável humano gerado pela própria aplicação, sem depender de serviço externo.
- **Prioridade:** MVP.
- **Critérios de aceite:** Falha simulada gera alerta em até 15 minutos. Nenhuma falha fica registrada apenas em log sem notificação ativa. O alerta continua funcionando mesmo sem qualquer monitoramento externo contratado.

#### RNF-093 — Monitoramento de erros técnicos
- **Descrição:** falhas de execução nas páginas públicas são capturadas e agregadas em painel consultável, sem depender de relato de visitante.
- **Motivo:** erro que quebra página de produto reduz OB-02 e OB-03 tão silenciosamente quanto falha de formulário. **Premissa PR-032:** categoria operacional distinta da ferramenta única de PR-024. **Pergunta Q-041:** isso conta como exceção à restrição de ferramenta única, ou compete pelo mesmo espaço de decisão?
- **Métrica ou verificação:** verificação periódica do painel, comparando com incidentes relatados por outros canais.
- **Prioridade:** Fase 2.
- **Critérios de aceite:** Erro simulado aparece no painel sem relato manual. Nenhum erro em produção fica sem registro consultável.

#### RNF-094 — Verificação periódica de links quebrados
- **Descrição:** todo link interno e externo publicado, incluindo os de parceiros (RF-104), é verificado semanalmente.
- **Motivo:** link externo de parceiro está fora do controle do site, e link interno quebrado costuma ser sintoma de despublicação sem redirecionamento (RF-171); os dois corroem a experiência sem que ninguém precise reportar.
- **Métrica ou verificação:** varredura semanal de todo link publicado, com pendências enviadas ao responsável.
- **Prioridade:** Fase 2.
- **Critérios de aceite:** A varredura semanal identifica qualquer link com erro. Link de parceiro quebrado é sinalizado sem depender de relato do visitante.

#### RNF-095 — Cópia de segurança do conteúdo e teste de restauração
- **Descrição:** o conteúdo publicado é copiado em rotina regular, com retenção mínima de 30 dias, e a restauração é testada periodicamente.
- **Motivo:** o conteúdo é o ativo central do site (6.7); perdê-lo sem cópia recente equivale a recomeçar a estratégia de portfólio do zero. **Premissa PR-030:** retenção mínima de 30 dias. **Pergunta Q-046:** qual será o provedor de hospedagem, do qual depende esta rotina e a homologação (RNF-103)?
- **Métrica ou verificação:** restauração completa a partir da cópia mais recente, em ambiente separado, comparando ao conteúdo de origem.
- **Prioridade:** MVP.
- **Critérios de aceite:** Restauração de teste reproduz o conteúdo sem perda. A cópia ocorre sem ação manual de quem publica.

#### RNF-096 — Monitoramento de desempenho em produção com dados reais
- **Descrição:** as métricas de RNF-010 são observadas a partir de acessos reais em produção, não só em laboratório antes da publicação.
- **Motivo:** a medição de laboratório de RNF-016 é simulada; só dado real revela se o orçamento se sustenta na distribuição real de dispositivo e conexão, coerente com a calibração de PR-025.
- **Métrica ou verificação:** acompanhamento mensal das três métricas no percentil 75 de acessos reais, comparado ao laboratório da última publicação.
- **Prioridade:** Fase 2.
- **Critérios de aceite:** Relatório mensal apresenta as três métricas medidas em produção. Divergência relevante entre laboratório e produção é investigada.

#### RNF-097 — Janela e procedimento de publicação
- **Descrição:** existe procedimento definido para quando e como uma publicação ocorre, incluindo o que fazer se algo sair errado logo depois.
- **Motivo:** sem procedimento, cada publicação depende da memória de quem a executa, aumentando a chance de pular um passo do checklist (RNF-102) sob pressão. **Premissa PR-034, confirmada (Q-045: "sem restrição"):** qualquer um dos dois sócios pode publicar em qualquer horário útil, sem plantão dedicado nem janela proibida.
- **Métrica ou verificação:** verificação de que o procedimento inclui os passos do checklist (RNF-102) e o caminho de reversão (RNF-107).
- **Prioridade:** MVP.
- **Critérios de aceite:** Qualquer publicador segue o mesmo procedimento. Problema logo após publicar tem caminho de reversão sem consulta externa.

### 10.11 Qualidade da futura implementação (RNF-100..107)

#### RNF-100 — Verificação combinada de acessibilidade e performance antes de publicar
- **Descrição:** nenhuma publicação que altere template, estilo ou recurso de terceiro ocorre sem os resultados de RNF-029 e RNF-016 registrados e aprovados.
- **Motivo:** verificação como responsabilidade individual depende de disciplina pessoal; um bloqueio único torna a verificação parte do processo, não passo opcional sob prazo apertado.
- **Métrica ou verificação:** bloqueio automático de publicação sem os dois registros no checklist (RNF-102), testado em homologação (RNF-103).
- **Prioridade:** MVP.
- **Critérios de aceite:** Publicação sem um dos dois registros é impedida. Toda publicação efetivada tem os dois resultados rastreáveis.

#### RNF-101 — Revisão editorial obrigatória antes de publicar
- **Descrição:** todo texto novo é lido por uma segunda pessoa antes de publicado, verificando ortografia, glossário (RNF-073) e ausência de afirmação não verificável (PR-007).
- **Motivo:** princípio 2 — erro de texto publicado é a falha mais visível e evitável; equipe pequena (PR-023) tende a pular a segunda leitura sob pressão.
- **Métrica ou verificação:** verificação de que toda publicação de texto tem um segundo nome associado à revisão.
- **Prioridade:** MVP.
- **Critérios de aceite:** Nenhum texto é publicado sem revisão registrada de outra pessoa. Erro de glossário encontrado na revisão bloqueia a publicação.

#### RNF-102 — Checklist de publicação
- **Descrição:** toda publicação passa por lista de verificação única, com os itens desta seção marcados como cumpridos antes de ir ao ar.
- **Motivo:** une as verificações de acessibilidade (RNF-029), performance (RNF-016) e homologação (RNF-103) em um único ponto de controle, já citado por RNF-016 como o registro do resultado.
- **Métrica ou verificação:** auditoria amostral de publicações passadas, confirmando checklist preenchido, não apenas assumido.
- **Prioridade:** MVP.
- **Critérios de aceite:** Toda publicação tem checklist preenchido associado. Item não marcado impede concluir a publicação.

#### RNF-103 — Ambiente de homologação equivalente à produção
- **Descrição:** existe ambiente separado do público, com a mesma estrutura e configuração da produção, onde toda alteração é verificada antes de ir ao ar.
- **Motivo:** é o ambiente que RNF-016, RNF-029 e RF-164 já assumem; sem equivalência real, verificação aprovada ali pode falhar de forma inesperada em produção. **Premissa PR-033:** réplica reduzida, no mesmo orçamento de PR-025, sem restrição adicional (Q-035, resolvida).
- **Métrica ou verificação:** comparação de configuração entre homologação e produção a cada alteração de infraestrutura; bloqueio de indexação verificado com RF-164.
- **Prioridade:** MVP.
- **Critérios de aceite:** Alteração verificada em homologação produz o mesmo resultado em produção. A homologação nunca é indexável.

#### RNF-104 — Padrão de marcação semântica
- **Descrição:** existe padrão documentado de marcação para cabeçalho, região, lista, tabela e formulário, aplicado de forma idêntica em todo template.
- **Motivo:** RNF-025 e RF-162 exigem estrutura consistente; sem padrão documentado, cada template implementa a exigência de forma ligeiramente diferente, e a diferença aparece nos casos que a auditoria de RNF-020 precisa achar um a um.
- **Métrica ou verificação:** verificação de que todo template segue o padrão, incluída na auditoria de RNF-020.
- **Prioridade:** MVP.
- **Critérios de aceite:** A mesma estrutura de conteúdo usa a mesma marcação em templates distintos. O padrão é referência única para template novo.

#### RNF-105 — Versionamento do conteúdo e do código
- **Descrição:** toda alteração de código de template é registrada em histórico com autor e data, no espírito do versionamento já exigido para texto legal (RF-142) e conteúdo (RNF-077).
- **Motivo:** sem histórico de código, uma regressão de template não pode ser localizada nem revertida isoladamente, obrigando reconstrução manual sob pressão.
- **Métrica ou verificação:** verificação de que toda alteração de template em produção corresponde a registro de histórico identificável.
- **Prioridade:** MVP.
- **Critérios de aceite:** Uma alteração de template é associável a autor e data. É possível recuperar o estado anterior a uma alteração específica.

#### RNF-106 — Critério de pronto da implementação
- **Descrição:** existe lista única de condições que um template deve cumprir para ser considerado pronto, cobrindo ao menos responsividade, performance, acessibilidade, SEO técnico e segurança.
- **Motivo:** sem critério explícito, "pronto" fica sujeito à interpretação de quem implementa, e a seção 10 não se traduz em prática sem um ponto de verificação formal antes da entrega.
- **Métrica ou verificação:** verificação de que nenhum template entra em produção sem passar pela lista completa, com resultado registrado.
- **Prioridade:** MVP.
- **Critérios de aceite:** Um template novo só é publicado após cumprir a lista de pronto. A lista é idêntica para qualquer template, novo ou alterado.

#### RNF-107 — Possibilidade de reverter uma publicação
- **Descrição:** qualquer publicação pode ser desfeita, retornando a entidade e páginas que a referenciam ao estado imediatamente anterior.
- **Motivo:** RNF-097 já assume este caminho no procedimento de publicação; sem reversão real, o remédio para uma publicação com problema é nova publicação corretiva — mais lenta e arriscada que desfazer.
- **Métrica ou verificação:** reversão de publicação de teste em homologação, confirmando que blocos derivados (RF-186) retornam ao estado anterior na mesma operação.
- **Prioridade:** Fase 2.
- **Critérios de aceite:** Reverter retorna a entidade ao estado anterior em uma operação. Nenhum bloco derivado referencia o estado revertido depois.

---

