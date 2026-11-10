# Perguntas Pendentes do PRD — Documento de Trabalho

Este arquivo reúne todas as perguntas que o PRD do site institucional deixou em aberto. Ele não é um relatório para leitura passiva — é um formulário de trabalho. Cada pergunta está escrita para se sustentar sozinha, sem exigir que você tenha lido o PRD inteiro.

| Campo | Valor |
|---|---|
| Data | 07/09/2026 |
| Origem | PRD.md v1.0 |
| Total de perguntas | 69 perguntas a responder (mais 1 remissão interna — Q-042 aponta para Q-065 sobre o mesmo assunto — totalizando 70 identificadores do PRD) |
| Perguntas que bloqueiam o início do trabalho | 7 (Bloco 1) |

**Como usar.** Responda diretamente no espaço indicado como "Resposta", logo abaixo de cada pergunta. Não precisa ser tudo de uma vez: respostas parciais já destravam parte do trabalho, e o arquivo pode ser devolvido em etapas — o Bloco 1 primeiro, se for o caso. Se uma pergunta não fizer sentido para o negócio hoje, escreva isso mesmo no espaço de resposta; "ainda não sabemos" também é uma resposta válida e ajuda a equipe a planejar.

## Painel de situação

**Por bloco de urgência**

| Bloco | O que representa | Perguntas |
|---|---|---|
| Bloco 1 — Responder primeiro | Bloqueiam o início do design ou do desenvolvimento | 7 |
| Bloco 2 — Responder antes de escrever o conteúdo | Afetam conteúdo e escopo do MVP (primeira versão do site) | 49 |
| Bloco 3 — Podem esperar | Afetam Fase 2 e o futuro do produto | 13 |
| **Total** | | **69** |

**Por tema**

| Tema | Perguntas |
|---|---|
| Contato e operação comercial | 10 |
| Medição | 10 |
| Posicionamento | 7 |
| Produtos e portfólio | 6 |
| Conteúdo e responsáveis | 5 |
| Nome da empresa e identidade visual | 4 |
| Publicação e administração | 4 |
| Disponibilidade e monitoramento | 4 |
| Público-alvo | 3 |
| Modelo comercial | 3 |
| Parceiros | 3 |
| Jurídico | 3 |
| Escopo do MVP | 2 |
| Segurança | 2 |
| Publicação de conteúdo | 1 |
| Compatibilidade | 1 |
| Formulários | 1 |
| **Total** | **69** |

---

## Bloco 1 — Responder primeiro

Estas sete perguntas bloqueiam o início do design ou do desenvolvimento. Nada abaixo delas deve esperar.

### Nome da empresa e identidade visual

#### Q-001 — Nome comercial da empresa

**Pergunta.** Qual é o nome comercial definitivo da empresa? "ArtZan" — nome da pasta onde este projeto está guardado no computador — é o nome oficial, ou é apenas um nome de trabalho provisório?

**Por que precisamos saber.** O nome aparece em toda página do site: cabeçalho, rodapé, título da aba do navegador, e-mails, textos institucionais. Sem confirmação, nada relacionado a marca pode ser produzido em versão final.

**Enquanto não houver resposta.** Não existe premissa formal que assuma um nome — o PRD usa apenas o marcador "[EMPRESA]" em todo o texto. Sem resposta, identidade visual, domínio e redação final de qualquer página permanecem parados.

**Onde impacta no PRD.** Seção 1 (Resumo executivo) e todo uso do marcador "[EMPRESA]" ao longo do documento — praticamente todas as seções.

**Resposta:**

ArtZan

#### Q-002 — Domínio do site

**Pergunta.** Qual será o endereço (domínio) do site na internet — por exemplo, algo como "suaempresa.com.br"?

**Por que precisamos saber.** O domínio define o endereço de todas as páginas, o e-mail institucional e o e-mail transacional das confirmações de formulário. Sem ele, não há como montar a estrutura técnica de endereços nem testar nada em ambiente real.

**Enquanto não houver resposta.** Não há premissa que assuma um domínio específico; o PRD descreve apenas o padrão de formação dos endereços, deixando o domínio em branco. Sem resposta, o ambiente de desenvolvimento e o e-mail transacional não podem ser configurados.

**Onde impacta no PRD.** Seção 6.4 (Padrão canônico de URLs); dependência registrada em 18.5 ("Domínio e infraestrutura básica").

**Resposta:**

Vamos seguir como "artzan.com.br", mas pode ser que seja alterado.

#### Q-003 — Identidade visual e logotipo

**Pergunta.** Já existe identidade visual da empresa — logotipo, paleta de cores, tipografia — ou um manual de marca?

**Por que precisamos saber.** Define se o design da interface começa com uma identidade pronta ou precisa criar um sistema visual provisório, que depois será substituído — com retrabalho de verificação de contraste e de todo material já publicado.

**Enquanto não houver resposta.** Não há premissa formal; a ausência de identidade é tratada no PRD como a principal pendência de marca (seção 11.10). Sem resposta, o design segue com um sistema provisório sujeito a troca completa.

**Onde impacta no PRD.** Seção 2.2 (A empresa como marca principal) e Seção 11.10 (Pendências de marca); decisão D-01 em 18.4.

**Resposta:**

Logo em C:\Users\user\OneDrive\Documents\ArtZan\LandingPage\Logo.png
Paleta: Azul e tons escuros, conforme a logo.

#### Q-056 — Responsável, prazo e orçamento da identidade visual

**Pergunta.** Quem vai produzir a identidade visual (logotipo, paleta, tipografia), em quanto tempo, e existe orçamento reservado para isso?

**Por que precisamos saber.** Define se o desenho das telas começa com a identidade final pronta ou com um sistema provisório — o caminho provisório implica retrabalho de contraste e de todo material de compartilhamento (redes sociais, imagens padrão etc.) quando a identidade real chegar.

**Enquanto não houver resposta.** Não há premissa formal; é o mesmo tema de Q-003, agora sob o ângulo de quem executa e quando. Sem resposta, o cronograma de design não tem data de início confiável.

**Onde impacta no PRD.** Seção 11.10 (Pendências de marca); decisão D-01 em 18.4.

**Resposta:**

O Claude deverá produzir. O objetivo é simples e deve seguir um padrão flat e clean.

### Público-alvo

#### Q-011 — Mercado geográfico e idioma

**Pergunta.** Qual é o mercado geográfico do negócio — só Brasil, ou também outros países — e o site precisa existir em mais de um idioma?

**Por que precisamos saber.** Define se o site é construído desde já para múltiplos idiomas (o que muda estrutura de endereços, conteúdo duplicado e dados de busca) ou permanece só em português. Acrescentar um segundo idioma depois do desenvolvimento já iniciado custa muito mais do que prever isso desde o início.

**Enquanto não houver resposta.** Premissa PR-006 assume que o site será publicado em um único idioma, português do Brasil. Se essa premissa cair, há retrabalho estrutural relevante (decisão D-06 em 18.4).

**Onde impacta no PRD.** Seção 4 (Público-alvo); decisão D-06 em 18.4; impacto detalhado em 18.6 ("Segundo idioma exigido").

**Resposta:**

Só Brasil de início, mas ter frameworks para tradução básica para inglês.

### Escopo do MVP

#### Q-029 — Data alvo e orçamento do lançamento

**Pergunta.** Existe uma data alvo para o lançamento do site, ou uma restrição de orçamento que deva influenciar o que entra na primeira versão (MVP), o que fica para a Fase 2, e o que fica para o futuro?

**Por que precisamos saber.** Sem prazo ou teto de investimento declarado, a divisão entre "o que entra agora" e "o que pode esperar" é feita só por critério técnico — o que pode não refletir a urgência real do negócio.

**Enquanto não houver resposta.** Não há premissa numérica sobre prazo; a decisão correspondente (D-10, em 18.4) também está em aberto. Sem resposta, a discussão de escopo permanece abstrata.

**Onde impacta no PRD.** Seção 7 (introdução de Páginas e requisitos, que organiza todas as páginas por prioridade MVP / Fase 2 / Futuro); decisão D-10 em 18.4.

**Resposta:**

Setembro de 2026.

### Publicação de conteúdo

#### Q-033 — Forma de publicação de conteúdo

**Pergunta.** O site será mantido por edição de arquivos técnicos (feita por alguém com conhecimento técnico) ou por um painel de administração pensado para equipe sem formação técnica? Existe hoje alguém com perfil técnico disponível de forma contínua para publicar conteúdo?

**Por que precisamos saber.** Essa escolha define todo o desenvolvimento da parte de administração do site — como produtos e soluções são cadastrados e publicados. Não é detalhe técnico secundário: muda orçamento e prazo de desenvolvimento.

**Enquanto não houver resposta.** Premissa PR-009 assume que o conteúdo será mantido por equipe reduzida e não técnica, o que aponta para a opção de painel administrativo — mas isso ainda não está confirmado. Sem resposta, essa parte do desenvolvimento não pode ser dimensionada nem iniciada.

**Onde impacta no PRD.** Seção 9.10 (Gestão de conteúdo e administração, requisitos RF-180 em diante); decisão D-02 em 18.4.

**Resposta:**

Um painel simples de administração deve ser feito sim.

---

## Bloco 2 — Responder antes de escrever o conteúdo

Estas 49 perguntas não impedem o design de começar, mas precisam de resposta antes de o conteúdo final e o escopo do MVP serem fechados.

### Produtos e portfólio

#### Q-004 — Produtos do lançamento

**Pergunta.** Quais produtos (softwares) existirão no lançamento do site, quantos serão, e com quais nomes e categorias?

**Por que precisamos saber.** É a informação mais básica para preencher o site: sem ela, o catálogo e o modelo de cada página de produto ficam prontos, porém vazios. Também define se o site nasce com 1, 2 ou 5 produtos — o que muda blocos inteiros da página inicial e se a página de soluções compostas (que exige ao menos 2 produtos) tem razão de existir.

**Enquanto não houver resposta.** Premissa PR-002 assume um portfólio de lançamento pequeno, entre 2 e 5 produtos. Sem resposta, o catálogo permanece estruturalmente pronto, mas sem conteúdo publicável.

**Onde impacta no PRD.** Seção 6.6 (Crescimento do catálogo: gatilhos de ativação) e Seção 7, página P-03 (Catálogo de softwares); dependência registrada em 18.5.

**Resposta:**

- Sistema Lara para gestão geral de empresa;
- Sistema de alocação de quadras;
- Sistema de Scout para partidas esportivas;
- Sistema de Placar Esportivo;
- Desenvolvimento de Integrações entre sistemas;

#### Q-005 — Material visual dos produtos

**Pergunta.** Existe material visual dos produtos — telas do sistema, vídeos, demonstrações gravadas — já disponível para publicação no site?

**Por que precisamos saber.** A falta de imagens é uma causa registrada de desistência de quem avalia um produto. Se o material existe mas não é usado, é conversão perdida; se não existe, a seção de galeria simplesmente não aparece — nenhuma imagem é inventada.

**Enquanto não houver resposta.** Não há premissa formal sobre a existência do material; a regra atual é apenas condicional (a seção some se não houver material). Sem resposta, a página de produto fica sem o recurso que mais ajuda a demonstrar o que o software faz.

**Onde impacta no PRD.** Seção 9.4, requisito RF-064 (Galeria e material de demonstração); dependência registrada em 18.5.

**Resposta:**

Haverá prints. Deixe o espaço reservado.

#### Q-006 — Soluções compostas no lançamento

**Pergunta.** Quais soluções compostas (combinações de dois ou mais produtos vendidos e apresentados em conjunto) existirão no lançamento? Se nenhuma, as páginas de solução saem do escopo inicial.

**Por que precisamos saber.** Sem ao menos uma solução real, a página de índice de soluções e a página de solução individual não têm o que exibir. Nesse caso, ambas saem do MVP e o item de menu correspondente é removido — mudando a estrutura de navegação de todo o site.

**Enquanto não houver resposta.** Premissa PR-010 assume que toda solução composta exige no mínimo dois produtos vinculados. Sem resposta sobre quais soluções existem, essas páginas ficam com entrada no lançamento condicionada, sem confirmação.

**Onde impacta no PRD.** Seção 7, páginas P-05 (Índice de soluções) e P-06 (Página individual de solução).

**Resposta:**

Nenhuma de início.

#### Q-051 — Padrão de nome entre produto e empresa

**Pergunta.** Qual dos três padrões de relação entre nome de produto e nome da empresa será adotado: nomes independentes (com a assinatura "um software de [EMPRESA]"), nomes com prefixo ou sufixo da marca (ex.: "[EMPRESA] Nome"), ou nomes com um radical em comum entre os produtos?

**Por que precisamos saber.** É uma decisão única para todo o portfólio, não caso a caso — muda como cada nome de produto é escrito em todo o site: menu, títulos de página e endereços.

**Enquanto não houver resposta.** Premissa PR-042 assume que os nomes de produto ainda não existem e que haverá um padrão único para a família, mas não define qual dos três padrões. Sem resposta, a nomeação de qualquer produto novo fica sem critério.

**Onde impacta no PRD.** Seção 11.4 (Padrão de nomenclatura de produtos).

**Resposta:**

Com base nas aplicações, sugira nomes, por início nomes independentes.

#### Q-052 — Registro de marca dos produtos

**Pergunta.** Haverá registro de marca para os nomes dos produtos, e quem é responsável por verificar se cada nome está disponível antes de publicá-lo?

**Por que precisamos saber.** Publicar um nome de produto sem verificar disponibilidade de marca cria risco jurídico e de imagem — pode ser preciso trocar o nome (e o endereço da página) depois que ele já ganhou reconhecimento.

**Enquanto não houver resposta.** Não há premissa formal sobre registro de marca de produtos (a premissa PR-018 trata de marca de parceiros, assunto diferente). Sem resposta, cada nome novo corre o risco de ser publicado sem essa verificação.

**Onde impacta no PRD.** Seção 11.4 (Padrão de nomenclatura de produtos, regra "Risco de colisão de marca").

**Resposta:**

A definir

#### Q-070 — Integração técnica com sistemas de terceiros

**Pergunta.** Os produtos precisarão integrar tecnicamente com sistemas de terceiros já usados pelos clientes-alvo (por exemplo, outros sistemas de gestão ou planilhas), e isso deve aparecer descrito no site?

**Por que precisamos saber.** Avaliadores técnicos costumam perguntar se o produto integra com o que já usam antes de aprovar uma compra internamente. Se a resposta for relevante, o site precisa de conteúdo específico sobre integrações; se não for, essa seção permanece vazia.

**Enquanto não houver resposta.** Não há premissa formal. O modelo de página já reserva um espaço condicional para "integrações", mas a profundidade desse conteúdo depende de os produtos estarem definidos (Q-004).

**Onde impacta no PRD.** Seção 4 (perfil PU-06, avaliador técnico) e Seção 9.4, requisitos RF-062/RF-063 (seções condicionais da página de produto).

**Resposta:**

Não precisa, mas será possível.

### Posicionamento

#### Q-018 — Diferencial competitivo

**Pergunta.** O que a empresa faz melhor ou diferente das alternativas que o cliente já usa hoje — incluindo planilhas, processos manuais e concorrentes diretos?

**Por que precisamos saber.** É a base do texto de proposta de valor da página inicial; sem essa resposta, os blocos de diferencial e de benefícios do portfólio continuam sem poder ser escritos com afirmações reais.

**Enquanto não houver resposta.** Não há premissa que substitua essa resposta. O requisito RF-024 (bloco de benefícios do portfólio) determina que esse bloco fica despublicado enquanto esta pergunta e a Q-019 não forem respondidas, em vez de exibir texto de preenchimento.

**Onde impacta no PRD.** Seção 5.4 (Diferenciais ainda não definidos); Seção 9.2, requisito RF-024.

**Resposta:**

Softwares adaptados e versáteis. 

#### Q-019 — Por que vários softwares menores

**Pergunta.** Por que a estratégia é oferecer vários softwares menores em vez de uma suíte única, e qual o benefício concreto disso para o cliente — custo de entrada menor, implantação mais rápida, escopo sob medida, independência entre áreas da empresa do cliente?

**Por que precisamos saber.** É a explicação que transforma um portfólio pequeno e em formação de limitação aparente em decisão deliberada. Sem ela, a página institucional não tem argumento para sustentar o modelo de negócio.

**Enquanto não houver resposta.** Mesma trava de RF-024 citada em Q-018: o bloco de benefícios do portfólio fica despublicado até haver resposta a esta pergunta e à anterior.

**Onde impacta no PRD.** Seção 5.4 (Diferenciais ainda não definidos); Seção 9.2, requisito RF-024; Seção 11.5 ("Explicação do modelo de negócio" como elemento de credibilidade).

**Resposta:**

Valores acessíveis;

#### Q-020 — Ganho da integração entre produtos

**Pergunta.** O que a integração entre os produtos da empresa entrega de valor que o cliente não conseguiria simplesmente combinando ferramentas de fornecedores diferentes?

**Por que precisamos saber.** Sustenta o argumento comercial da solução composta (dois ou mais produtos vendidos juntos). Sem resposta concreta, a página de solução não consegue provar o ganho da combinação — algo que é requisito obrigatório dessa página.

**Enquanto não houver resposta.** Não há premissa correspondente. Fica pendente o texto que comprova o ganho da combinação nas páginas de solução.

**Onde impacta no PRD.** Seção 5.4 (Diferenciais ainda não definidos); Seção 9.5, requisito RF-084 (Ganho da combinação obrigatório).

**Resposta:**

Facilidade de uso.

#### Q-021 — Provas de credibilidade no lançamento

**Pergunta.** Sem cases nem logos de clientes (porque a empresa está começando), quais provas de credibilidade existirão no lançamento — por exemplo, experiência prévia da equipe, um piloto que autorize ser citado, parceiro de referência, certificação, garantia contratual ou política de suporte?

**Por que precisamos saber.** Uma empresa nova sem nenhum sinal de credibilidade gera desconfiança em quem avalia contratar software. O site precisa de ao menos um elemento real para substituir a prova social que ainda não existe.

**Enquanto não houver resposta.** Premissa PR-007 assume que não há clientes, cases, depoimentos ou logos no lançamento — o que reforça a necessidade de outro tipo de prova. Sem resposta, o site fica apoiado só nos elementos de credibilidade que independem de clientes (identificação completa da empresa, transparência do processo, páginas legais publicadas).

**Onde impacta no PRD.** Seção 5.4 (Diferenciais ainda não definidos); Seção 11.5 (Como apresentar a empresa sem tempo de mercado, cases ou equipe).

**Resposta:**

Vamos manter sem resposta por enquanto, mas há um cliente que poderá ter a logo incluída em breve

#### Q-022 — Promessa comercial verificável

**Pergunta.** Haverá alguma promessa comercial verificável para reforçar a credibilidade — como prazo de implantação, garantia de migração de dados ou período de avaliação gratuita?

**Por que precisamos saber.** Uma promessa concreta e cumprível pesa mais do que qualquer adjetivo de marketing; se existir, vira um elemento forte de conversão em várias páginas.

**Enquanto não houver resposta.** Não há premissa correspondente. Sem resposta, o site não inclui nenhuma promessa desse tipo — nenhuma será inventada.

**Onde impacta no PRD.** Seção 5.4 (Diferenciais ainda não definidos).

**Resposta:**

Período de avaliação gratuita.

#### Q-050 — Aprovação do tom de voz

**Pergunta.** Os seis atributos de tom de voz propostos no PRD (claro, específico, direto, confiante sem exagero, profissional e próximo, consistente) estão aprovados, ou já existe uma personalidade de marca pretendida que deva substituí-los?

**Por que precisamos saber.** O tom de voz é a régua usada para revisar todo texto publicado no site. Se já existir uma ideia diferente de como a marca deve soar, ajustar agora é mais barato do que depois de todo o conteúdo escrito.

**Enquanto não houver resposta.** Premissa PR-040 assume uma única voz, a de [EMPRESA], sem tom próprio por produto — mas os seis atributos específicos permanecem uma proposta a confirmar, não uma decisão fechada.

**Onde impacta no PRD.** Seção 11.1 (Tom de voz).

**Resposta:**

Aprovado.

#### Q-059 — Restrição de vocabulário do setor

**Pergunta.** Existe alguma restrição de vocabulário imposta pelo mercado ou setor do cliente-alvo — um termo regulado, uma sigla setorial obrigatória — que os textos do site precisem respeitar?

**Por que precisamos saber.** Evita publicar um termo que soe errado ou amador para quem conhece o setor, ou que descumpra uma exigência regulatória de nomenclatura.

**Enquanto não houver resposta.** Não há premissa correspondente. Sem resposta, o glossário de termos do site é fechado só com base no vocabulário genérico do PRD, sem essa checagem setorial.

**Onde impacta no PRD.** Seção 12.8 (Método para levantar palavras-chave).

**Resposta:**

Não.

### Público-alvo

#### Q-009 — Segmento ou vertical alvo

**Pergunta.** Qual é o segmento de mercado ou vertical de atuação que os produtos vão atender?

**Por que precisamos saber.** Sem segmento definido, a profundidade técnica do texto, o vocabulário usado e a prioridade do conteúdo continuam sendo suposições — a equipe de redação não sabe, na prática, para quem está escrevendo.

**Enquanto não houver resposta.** Não há premissa; os perfis de público descritos no PRD são hipóteses derivadas do modelo de negócio, sem pesquisa nem base de clientes que as valide.

**Onde impacta no PRD.** Seção 4 (Público-alvo).

**Resposta:**

Clubes, parques e pequenas empresas, mas tenha um tom levemente neutro quanto a isso.

#### Q-010 — Porte de cliente pretendido

**Pergunta.** Qual é o porte de cliente pretendido — pequena empresa, média, grande, ou mais de um porte ao mesmo tempo?

**Por que precisamos saber.** Muda a linguagem (mais próxima ou mais formal), o nível de prova de credibilidade exigido e a complexidade esperada de integração com sistemas de terceiros (Q-070).

**Enquanto não houver resposta.** Não há premissa; mesma ressalva de Q-009 — hipótese ainda não validada.

**Onde impacta no PRD.** Seção 4 (Público-alvo).

**Resposta:**

Pequena e média empresa.

### Modelo comercial

#### Q-007 — Modelo comercial de venda

**Pergunta.** Qual é o modelo comercial dos produtos: assinatura recorrente, licença, projeto sob encomenda, ou uma combinação dos três conforme o produto?

**Por que precisamos saber.** Define o vocabulário comercial usado em todo o catálogo (por exemplo, se a palavra "plano" pode ser usada) e se, no futuro, o site pode oferecer algum tipo de autoatendimento de proposta — hoje impossível de construir sem modelo comercial fechado.

**Enquanto não houver resposta.** Não há premissa própria (a premissa PR-005 trata só da ausência de preço público, assunto relacionado mas diferente). Sem resposta, termos como "plano" e "pacote" continuam banidos do site.

**Onde impacta no PRD.** Seção 2.7 ("O que este site NÃO é" — exclusão de e-commerce); Seção 11.4 (proibição de sufixos como "Pro"/"Plus"); Seção 14.9 (autoatendimento de proposta fora do MVP); risco R-13 em 18.1.

**Resposta:**

Assinatura recorrente e projeto sob encomenda.

#### Q-008 — Exibição de preço

**Pergunta.** O preço dos produtos será público, apresentado em faixas de valor, ou apenas sob consulta comercial?

**Por que precisamos saber.** É uma decisão única, aplicada a todos os produtos ao mesmo tempo: substitui o texto padrão atual de "o valor depende do escopo" por um campo de preço real em cada página — muda o catálogo inteiro de uma vez, não produto por produto.

**Enquanto não houver resposta.** Premissa PR-005 assume que o preço não é publicado no MVP; até essa premissa ser confirmada ou derrubada, todas as páginas de produto usam o mesmo texto padrão sobre ausência de preço.

**Onde impacta no PRD.** Seção 7, página P-04 (Página individual de software — "Ausência de preço"); decisão D-04 em 18.4.

**Resposta:**

A depender do projeto. 

### Parceiros

#### Q-024 — Validação da taxonomia de parceiros

**Pergunta.** A taxonomia de tipos de parceria proposta no PRD (tecnológico, implantação, revenda, indicação, institucional) corresponde aos modelos de parceria que a empresa realmente pretende ter? Nenhum parceiro real foi citado no documento até agora.

**Por que precisamos saber.** Se os tipos reais de parceria forem diferentes dos propostos, a estrutura da página de parceiros precisa mudar antes de qualquer parceiro ser cadastrado.

**Enquanto não houver resposta.** Não há premissa sobre quais tipos existirão de fato (a premissa PR-011 trata apenas da possibilidade de a lista estar vazia, não da taxonomia). Sem resposta, a estrutura atual segue como proposta não confirmada.

**Onde impacta no PRD.** Seção 7, página P-07 (Parceiros).

**Resposta:**

Siga essa proposta, estamos avaliando a inclusão do primeiro parceiro.

#### Q-025 — Parceiros confirmados no lançamento

**Pergunta.** Existirão parceiros já confirmados no lançamento, e já existe autorização formal para usar a marca (logo e nome) de cada um deles?

**Por que precisamos saber.** Sem ao menos um parceiro autorizado, a página de parceiros sai do lançamento (vira Fase 2) e o item de menu correspondente desaparece — isso muda a navegação do site e precisa ser decidido antes de fechar o design do menu e do rodapé.

**Enquanto não houver resposta.** Premissa PR-011 assume que a lista de parceiros pode estar vazia no lançamento; nesse caso a página, o item de menu e a faixa de parceiros na inicial ficam ocultos, sem prejuízo ao restante do site.

**Onde impacta no PRD.** Seção 7, página P-07 (Parceiros); decisão D-05 em 18.4.

**Resposta:**

Há um parceiro, mas ainda não confirmado.

#### Q-054 — Abrangência da autorização do parceiro

**Pergunta.** A autorização já obtida de um parceiro cobre também o texto que descreve a relação com ele, ou apenas o uso do logotipo?

**Por que precisamos saber.** O PRD exige que a descrição de cada parceiro seja redigida em conjunto com ele. Se a autorização existente cobrir só o logo, falta negociar também o texto antes de publicar a página.

**Enquanto não houver resposta.** Premissa PR-018 assume que marca de terceiro só é publicada com autorização formal registrada, mas essa premissa não resolve se a autorização inclui o texto descritivo — que é o que esta pergunta busca esclarecer.

**Onde impacta no PRD.** Seção 11.6 (Como apresentar parceiros).

**Resposta:**

Ainda não há;

### Contato e operação comercial

#### Q-012 — Canais de contato disponíveis

**Pergunta.** Além do formulário do site, quais outros canais de contato existirão — telefone, WhatsApp, e-mail direto, chat?

**Por que precisamos saber.** Define o que aparece na página de contato comercial como alternativa ao formulário.

**Enquanto não houver resposta.** Premissa PR-012 assume que o formulário é o canal principal, e que canais diretos (como telefone) só são exibidos após confirmação. Sem resposta, o site publica apenas o formulário.

**Onde impacta no PRD.** Seção 7, página P-08 (Contato comercial).

**Resposta:**

WhatsApp e Email.

#### Q-013 — Destino e prazo de resposta dos leads

**Pergunta.** Quem recebe as solicitações enviadas pelo formulário do site, e em qual prazo a empresa se compromete a responder?

**Por que precisamos saber.** Sem essa definição, o site não pode informar ao visitante o que esperar depois de enviar o formulário — segundo o próprio PRD, essa informação é o que mais reduz a hesitação de quem está prestes a fazer um primeiro contato comercial.

**Enquanto não houver resposta.** Premissa PR-048 assume um prazo provisório de resposta de um dia útil, válido apenas até esta pergunta ser respondida oficialmente.

**Onde impacta no PRD.** Seção 7, página P-08 (Contato comercial); Seção 11.5 ("Transparência do processo comercial"); Seção 14.5 (Destino das solicitações).

**Resposta:**

Um dos dois sócios responderá no prazo de 2 dias úteis.

#### Q-014 — Encaminhamento a ferramenta de gestão comercial

**Pergunta.** As solicitações recebidas pelo site devem ser encaminhadas automaticamente para alguma ferramenta de gestão de relacionamento com cliente (CRM), ou apenas para uma caixa de e-mail?

**Por que precisamos saber.** Muda o desenvolvimento técnico do formulário: integrar com um CRM é um trabalho diferente (e mais caro) do que enviar e-mail para uma caixa compartilhada.

**Enquanto não houver resposta.** Premissa PR-021 assume, para o MVP, que o destino é uma caixa de mensagens compartilhada, sem integração com ferramenta de gestão comercial.

**Onde impacta no PRD.** Seção 7, página P-08 (Contato comercial); Seção 14.5 (Destino das solicitações); decisão D-03 em 18.4.

**Resposta:**

De início, apenas caixa de email.

#### Q-015 — Volume de oportunidades atendível por mês

**Pergunta.** Quantas oportunidades comerciais por mês o time consegue atender, e qual seria a expectativa mínima de sucesso nesse volume?

**Por que precisamos saber.** Sem essa informação, nenhuma meta numérica de conversão pode ser definida de forma realista — qualquer número viraria critério de aceite arbitrário.

**Enquanto não houver resposta.** Não há premissa correspondente. Enquanto isso, os três primeiros meses de site no ar servem apenas como período de calibração (premissa PR-053), sem meta a cumprir.

**Onde impacta no PRD.** Seção 3 (Objetivos do negócio); Seção 15.8 (Como ler os primeiros meses sem tirar conclusão errada).

**Resposta:**

A definiri

#### Q-017 — Indicadores acompanhados e responsável

**Pergunta.** Quais indicadores do site serão acompanhados de fato, com que periodicidade, e por quem?

**Por que precisamos saber.** Um painel de métricas que ninguém olha com regularidade é investimento perdido; esta pergunta garante que a medição tenha dono e ritmo de revisão.

**Enquanto não houver resposta.** Não há premissa numérica. Fica pendente também qual ferramenta de medição será usada (decisão D-08) — sem ferramenta escolhida, a instrumentação de eventos não tem para onde apontar.

**Onde impacta no PRD.** Seção 3 (Objetivos do negócio); Seção 15.7 (Painel mínimo de lançamento).

**Resposta:**

A definir

#### Q-026 — Formato da demonstração comercial

**Pergunta.** A demonstração do produto solicitada pelo visitante será uma demonstração ao vivo com uma pessoa, um ambiente para o próprio visitante testar, um vídeo gravado, ou uma apresentação comercial tradicional?

**Por que precisamos saber.** Define o texto que a página de solicitação de demonstração usa para explicar ao visitante o que vai acontecer depois do envio.

**Enquanto não houver resposta.** Premissa PR-016 assume que a demonstração é sempre conduzida por uma pessoa, sem acesso automático ao software — mas o formato exato dentro dessa premissa ainda não está definido.

**Onde impacta no PRD.** Seção 7, página P-09 (Solicitação de demonstração).

**Resposta:**

Ambuente próprio para teste por tempo determinado.

#### Q-031 — E-mail remetente das confirmações

**Pergunta.** Qual endereço de e-mail será usado como remetente da confirmação automática enviada a quem preenche um formulário, e quem responde se o visitante responder a esse e-mail?

**Por que precisamos saber.** Um e-mail transacional enviado de um endereço não confiável tende a cair em spam — o remetente precisa ser do domínio próprio da empresa, com alguém acompanhando as respostas recebidas.

**Enquanto não houver resposta.** Premissa PR-022 assume que esse e-mail é transacional (não é marketing) e por isso dispensa consentimento adicional, mas não resolve qual endereço específico será usado.

**Onde impacta no PRD.** Seção 9.7, requisito RF-130 (Confirmação por e-mail ao remetente).

**Resposta:**

Ainda a definir. Haverá o email institucional.

#### Q-062 — Campo de qualificação no formulário

**Pergunta.** O time comercial precisa de alguma informação de qualificação já no primeiro contato — porte da empresa, orçamento, prazo, quantidade de usuários — que justifique um campo a mais no formulário?

**Por que precisamos saber.** O formulário foi desenhado deliberadamente curto para maximizar a taxa de conclusão; qualquer campo a mais tem custo (mais rolagem, mais chance de erro, menos gente termina de preencher), então só deve entrar se resolver um problema real do comercial.

**Enquanto não houver resposta.** Premissa PR-046 assume formulário curto por decisão, com qualificação mais profunda deixada para o atendimento humano depois do envio. Sem resposta, nenhum campo extra é adicionado.

**Onde impacta no PRD.** Seção 14.2 (O que o visitante pode enviar).

**Resposta:**

Não.

#### Q-063 — E-mail próprio para receber solicitações

**Pergunta.** Existe um endereço de e-mail no domínio próprio da empresa para receber e responder as solicitações do site, e quem tem acesso a essa caixa?

**Por que precisamos saber.** É pré-requisito técnico e operacional para o formulário funcionar de verdade — sem uma caixa de e-mail real definida, não há para onde enviar os leads captados.

**Enquanto não houver resposta.** Não há premissa formal; depende diretamente da definição de domínio (Q-002) e da escolha de destino dos leads (Q-014), ambas também em aberto.

**Onde impacta no PRD.** Seção 14.5 (Destino das solicitações).

**Resposta:**

Ainda não, mas haverá

#### Q-064 — Responsável pela triagem diária

**Pergunta.** Quem é o responsável nomeado pela triagem diária das solicitações recebidas, e qual o procedimento quando essa pessoa estiver ausente (férias, licença etc.)?

**Por que precisamos saber.** Sem um responsável nomeado e um plano de backup, leads reais correm risco de ficar sem resposta dentro do prazo prometido (Q-013), o que corrói a confiança que o site trabalhou para construir.

**Enquanto não houver resposta.** Não há premissa correspondente. É uma das dez perguntas consideradas mais críticas para a operação comercial funcionar desde o primeiro dia.

**Onde impacta no PRD.** Seção 14.5 (Destino das solicitações); decisão D-09 em 18.4.

**Resposta:**

Será um dos sócios,

### Conteúdo e responsáveis

#### Q-028 — Responsável pelos textos legais

**Pergunta.** Quem escreve e valida os textos de política de privacidade e termos de uso do site?

**Por que precisamos saber.** O site coleta dados pessoais desde o primeiro dia (formulários de contato e demonstração); sem textos legais reais e validados, essas páginas obrigatórias não podem ser publicadas de forma responsável.

**Enquanto não houver resposta.** Premissa PR-019 assume que o conteúdo jurídico é fornecido e validado pelo próprio cliente, e que o site apenas publica o texto pronto — essa redação não está no escopo da equipe de desenvolvimento.

**Onde impacta no PRD.** Seção 7, páginas P-13 (Política de privacidade) e P-14 (Termos de uso).

**Resposta:**

Haverá um setor jurídico responsável por isso.

#### Q-053 — Dados institucionais publicáveis no rodapé

**Pergunta.** Quais dados institucionais completos (razão social, CNPJ, endereço, canal de contato) podem ser publicados no rodapé do site?

**Por que precisamos saber.** Uma empresa que se identifica completamente assume responsabilidade perante quem visita o site; a ausência desses dados é lida como sinal de risco por quem avalia contratar um fornecedor novo.

**Enquanto não houver resposta.** Não há premissa formal. Sem resposta, o rodapé institucional fica incompleto na identificação legal da empresa.

**Onde impacta no PRD.** Seção 11.5 (elemento de credibilidade "Identificação completa"); Seção 9.2, requisito RF-028 (Rodapé institucional).

**Resposta:**

razão social, CNPJ, endereço, canal de contato

### Escopo do MVP

#### Q-023 — Ajuste dos gatilhos numéricos de ativação

**Pergunta.** Os números que ativam recursos como filtro, busca e paginação no catálogo (por exemplo, filtro ativa com 10 produtos) são aceitáveis, ou devem ser ajustados ao ritmo real esperado de lançamento de novos produtos?

**Por que precisamos saber.** Esses números foram estimados sem dados reais de quantos produtos a empresa vai lançar e em que ritmo; se o ritmo real for muito diferente, um recurso pode ser ativado cedo ou tarde demais.

**Enquanto não houver resposta.** Premissa PR-013 assume que categorias já existem como estrutura desde o início, mesmo sem aparecer, para que a ativação futura seja só configuração — não uma migração de dados.

**Onde impacta no PRD.** Seção 6.6 (Crescimento do catálogo: gatilhos de ativação).

**Resposta:**

A definir, seguir premissa

### Publicação e administração

#### Q-034 — Papéis de publicação e aprovação de conteúdo

**Pergunta.** Quem, especificamente, vai exercer cada papel de acesso ao site (quem edita rascunhos, quem publica), e quem aprova o conteúdo antes de ele ir ao ar?

**Por que precisamos saber.** O sistema prevê ao menos dois papéis distintos (editor e publicador), com contas individuais — sem pessoas reais nomeadas para esses papéis, o processo de publicação não tem dono.

**Enquanto não houver resposta.** Premissa PR-023 assume que até três pessoas terão acesso de publicação no lançamento, mas não define quem são nem qual papel cada uma exerce.

**Onde impacta no PRD.** Seção 9.10, requisito RF-183 (Papéis e níveis de acesso).

**Resposta:**

Por início, tudo é executado pelos sócios.

#### Q-071 — Responsável por contratar e custear a infraestrutura

**Pergunta.** Quem contrata e paga pela infraestrutura básica de publicação do site — domínio, e-mail transacional e a ferramenta de medição de audiência?

**Por que precisamos saber.** São itens que precisam existir antes mesmo de o ambiente de desenvolvimento poder ser montado; sem responsável definido para contratá-los e pagá-los, essas contratações não avançam.

**Enquanto não houver resposta.** Não há premissa formal. É uma dependência registrada diretamente: domínio e infraestrutura básica bloqueiam o ambiente de desenvolvimento, os endereços de teste e o e-mail transacional enquanto pendentes.

**Onde impacta no PRD.** Seção 18.5 (Dependências); decisão D-08 em 18.4 (ferramenta de medição).

**Resposta:**

Executado pelos sócios.

### Medição

#### Q-035 — Restrição de orçamento de infraestrutura

**Pergunta.** Existe alguma restrição de orçamento de infraestrutura (hospedagem, servidores) que impeça sustentar os limites de desempenho definidos no PRD?

**Por que precisamos saber.** Os limites de velocidade de carregamento foram calibrados assumindo uma hospedagem de padrão médio; uma restrição maior que o previsto pode obrigar a rever esses limites antes do desenvolvimento começar.

**Enquanto não houver resposta.** Premissa PR-025 assume que o orçamento de desempenho foi calibrado para conexão móvel de qualidade média e dispositivo de faixa intermediária — hipótese a revisar quando houver dados reais.

**Onde impacta no PRD.** Seção 10.2 (Performance, faixa RNF-010 a RNF-016).

**Resposta:**

Não há restrição.

#### Q-036 — Exigência legal de acessibilidade acima do padrão

**Pergunta.** Existe alguma obrigação legal, de edital público ou de cliente específico que exija um nível de acessibilidade superior ao padrão AA adotado no PRD?

**Por que precisamos saber.** Se existir, o esforço e o custo de desenvolvimento da parte de acessibilidade mudam — garantir o padrão AA e garantir um nível superior com laudo formal não é o mesmo trabalho.

**Enquanto não houver resposta.** Premissa PR-026 assume que não há exigência contratual ou setorial adicional além do padrão AA já adotado.

**Onde impacta no PRD.** Seção 10.3 (Acessibilidade, faixa RNF-020 a RNF-027).

**Resposta:**

Não.

#### Q-060 — Exigência de laudo formal de acessibilidade

**Pergunta.** Existe exigência contratual, setorial ou de licitação que obrigue um nível de acessibilidade superior a AA, um laudo formal de acessibilidade, ou uma declaração pública de conformidade?

**Por que precisamos saber.** É o mesmo tema de Q-036, sob o ângulo de quem usa o site como avaliador técnico em processo de compra — se a resposta for sim, entra um passo formal de auditoria hoje não previsto no MVP.

**Enquanto não houver resposta.** Premissa PR-044 assume o padrão WCAG 2.2 nível AA como critério de aceite de publicação, sem laudo formal adicional.

**Onde impacta no PRD.** Seção 13.1 (Meta de conformidade).

**Resposta:**

Não.

#### Q-065 — Base legal e prazo de retenção dos dados de formulário

**Pergunta.** Qual é a base legal e o prazo de retenção dos dados pessoais coletados nos formulários do site, e quem faz a validação jurídica dessa definição?

**Por que precisamos saber.** A política de privacidade do site é obrigada a declarar um prazo de retenção real; sem essa definição jurídica, a declaração publicada não resiste a uma fiscalização.

**Enquanto não houver resposta.** Não há premissa numérica sobre o prazo em si. A premissa PR-019 cobre apenas quem fornece e valida o texto legal de modo geral (o mesmo tema de Q-028), não o prazo específico de retenção.

**Onde impacta no PRD.** Seção 10.6, requisito RNF-053 (Prazo de retenção definido); Seção 15.9 (Consentimento e privacidade na medição).

**Nota.** A pergunta Q-042 do PRD trata do mesmo assunto e foi convertida em remissão direta para esta pergunta — por isso não aparece como item separado neste documento.

**Resposta:**

A definir, seguir definições da LGPD.

#### Q-066 — Aceite separado para comunicações futuras

**Pergunta.** Haverá um campo de aceite explícito e separado para o visitante autorizar comunicações futuras de marketing (diferente do simples envio do formulário), e qual é o texto aprovado desse aceite?

**Por que precisamos saber.** Consentir em ser respondido sobre uma solicitação é, legalmente, diferente de consentir em receber comunicações futuras. Se a empresa quiser fazer isso, precisa de campo e texto próprios, aprovados antes da publicação.

**Enquanto não houver resposta.** Não há premissa sobre o texto; o formulário já prevê o campo desmarcado por padrão, mas o texto de aceite em si depende desta resposta.

**Onde impacta no PRD.** Seção 15.9 (Consentimento e privacidade na medição); Seção 14.2 (O que o visitante pode enviar).

**Resposta:**

Sim.

#### Q-069 — Responsável pelo painel de métricas

**Pergunta.** Quem tem acesso ao painel de métricas do site, e a quem cabe agir quando um indicador se deteriorar?

**Por que precisamos saber.** Um painel de métricas sem responsável nomeado existe, mas ninguém age sobre ele — é a forma mais silenciosa de o investimento em medição se perder sem que ninguém perceba.

**Enquanto não houver resposta.** Não há premissa correspondente. Esta pergunta complementa diretamente a Q-017, que trata de quais indicadores serão acompanhados e com que periodicidade.

**Onde impacta no PRD.** Seção 15.9 (Consentimento e privacidade na medição); Seção 15.7 (Painel mínimo de lançamento).

**Resposta:**

Os 2 sócios.

### Jurídico

#### Q-032 — Histórico público ou interno dos textos legais

**Pergunta.** O histórico de versões anteriores da política de privacidade e dos termos de uso deve ficar acessível publicamente ao visitante, ou apenas guardado internamente pela empresa?

**Por que precisamos saber.** O PRD já garante que versões anteriores sejam preservadas e recuperáveis internamente; esta pergunta decide só se o visitante externo também pode consultá-las.

**Enquanto não houver resposta.** Não há premissa formal sobre a visibilidade externa do histórico.

**Onde impacta no PRD.** Seção 9.8, requisito RF-142 (Versionamento dos textos legais).

**Resposta:**

Apenas internamente.

#### Q-040 — Processamento de dados fora do Brasil

**Pergunta.** Os serviços de tecnologia cogitados para o site (hospedagem, e-mail transacional, ferramenta de medição) processam algum dado fora do Brasil?

**Por que precisamos saber.** Se a resposta for sim, a política de privacidade precisa declarar essa transferência internacional — uma obrigação legal que só pode ser cumprida depois de os fornecedores serem conhecidos.

**Enquanto não houver resposta.** Premissa PR-031 assume, até confirmação dos fornecedores contratados, que é possível haver processamento de dado fora do Brasil.

**Onde impacta no PRD.** Seção 10.6, requisito RNF-056 (Transferência internacional de dados).

**Resposta:**

Provavelmente será sim fora do Brasil. Inclua os textos como possíveis.

#### Q-043 — Canal e prazo para direitos do titular de dados

**Pergunta.** Qual canal e qual prazo de resposta serão usados para atender pedidos de titulares de dados pessoais — por exemplo, alguém pedindo para saber ou apagar os dados que a empresa tem sobre ele?

**Por que precisamos saber.** É um direito garantido por lei (LGPD) mesmo sem o site ter área logada; sem canal e prazo claros definidos antes, a primeira solicitação real vira uma obrigação que ninguém sabe como cumprir.

**Enquanto não houver resposta.** Não há premissa formal sobre canal e prazo específicos.

**Onde impacta no PRD.** Seção 10.6, requisito RNF-054 (Atendimento aos direitos do titular).

**Resposta:**

A definir.

### Compatibilidade

#### Q-037 — Dados de audiência para calibrar navegadores suportados

**Pergunta.** Existe algum dado de audiência de outro canal da empresa (redes sociais, sistema atual, campanhas) que permita calibrar quais navegadores e dispositivos o site precisa suportar, antes do lançamento?

**Por que precisamos saber.** Sem dado real, "suportar tudo" é promessa impossível de verificar, e "suportar só os mais novos" pode excluir parte do público real, que muitas vezes navega em ambiente corporativo desatualizado.

**Enquanto não houver resposta.** Premissa PR-028 assume, na ausência de dado real de audiência, uma referência genérica de mercado no Brasil para definir navegadores suportados.

**Onde impacta no PRD.** Seção 10.7, requisito RNF-060 (Critério objetivo de navegadores suportados).

**Resposta:**

Pode manter o suporte apenas aos dispositivos mais novos, mesmo que perca parte do público. Garanta apenas mobile e desktop.

### Disponibilidade e monitoramento

#### Q-038 — Meta contratual de disponibilidade

**Pergunta.** Já existe uma meta contratual de disponibilidade do site definida, ou embutida na oferta do provedor de hospedagem em avaliação?

**Por que precisamos saber.** Sem meta declarada, uma indisponibilidade não tem critério de gravidade, e a empresa não tem como cobrar do provedor um padrão que nunca foi explicitado em contrato.

**Enquanto não houver resposta.** Premissa PR-029 assume uma meta de 99,5% de disponibilidade mensal, compatível com hospedagem convencional sem redundância dedicada.

**Onde impacta no PRD.** Seção 10.10, requisito RNF-090 (Alvo de disponibilidade declarado).

**Resposta:**

Manter premissa

#### Q-039 — Ferramenta de monitoramento externo

**Pergunta.** Qual ferramenta de monitoramento externo de disponibilidade será contratada, e quem recebe o alerta quando o site cair?

**Por que precisamos saber.** Sem monitoramento externo, a empresa só saberia que o site está fora do ar pela reclamação de um visitante — o que já seria tarde demais.

**Enquanto não houver resposta.** Não há premissa formal sobre a ferramenta específica.

**Onde impacta no PRD.** Seção 10.10, requisito RNF-091 (Monitoramento externo de disponibilidade).

**Resposta:**

Não necessário.

#### Q-046 — Provedor de hospedagem

**Pergunta.** Qual será o provedor de hospedagem do site?

**Por que precisamos saber.** Dele dependem a rotina de cópia de segurança do conteúdo e a criação do ambiente de homologação (ambiente de testes equivalente à produção) — sem provedor escolhido, essas rotinas não podem ser configuradas.

**Enquanto não houver resposta.** Premissa PR-030 assume uma retenção mínima de 30 dias para a cópia de segurança do conteúdo, independentemente do provedor.

**Onde impacta no PRD.** Seção 10.10, requisito RNF-095 (Cópia de segurança do conteúdo); Seção 10.11, requisito RNF-103 (Ambiente de homologação).

**Resposta:**

A definir.

### Segurança

#### Q-044 — Procedimento de resposta a incidente de segurança

**Pergunta.** Já existe um procedimento de resposta a incidente de segurança definido pela empresa — o que fazer se o site for invadido ou sofrer um vazamento de dados?

**Por que precisamos saber.** Sem um procedimento mínimo combinado com antecedência, um incidente real seria respondido de forma improvisada, sob pressão, no pior momento possível.

**Enquanto não houver resposta.** Premissa PR-027 assume que a correção de vulnerabilidades é rotina contínua da própria equipe de publicação — mas isso não é o mesmo que um procedimento formal de resposta a um incidente já ocorrido.

**Onde impacta no PRD.** Seção 10.5, requisito RNF-044 (Gestão de dependências e correção de vulnerabilidades).

**Resposta:**

Não incluir por enquanto.

---

## Bloco 3 — Podem esperar

Estas 13 perguntas afetam Fase 2 e o futuro do produto. Não precisam de resposta para o MVP avançar.

### Modelo comercial

#### Q-016 — Ciclo de venda e ticket esperado

**Pergunta.** Qual é o ciclo de venda esperado (tempo entre primeiro contato e fechamento) e o ticket médio esperado, por produto e por solução composta?

**Por que precisamos saber.** É informação necessária para transformar os indicadores do site em metas numéricas reais mais adiante — mas só faz sentido responder depois que o modelo comercial (Q-007) e o volume atendível (Q-015) estiverem mais claros.

**Enquanto não houver resposta.** Não há premissa correspondente. Enquanto isso, nenhuma meta de ciclo de venda ou ticket é fixada — os três primeiros meses seguem como calibração (premissa PR-053).

**Onde impacta no PRD.** Seção 3 (Objetivos do negócio).

**Resposta:**

A definir

### Conteúdo e responsáveis

#### Q-027 — Responsável e cadência do blog

**Pergunta.** Existe um responsável definido e uma cadência editorial (frequência de publicação) para o blog de conteúdo?

**Por que precisamos saber.** Um blog com poucos artigos antigos comunica abandono, o oposto do efeito desejado — por isso só entra em Fase 2, depois que houver capacidade real de manter uma cadência.

**Enquanto não houver resposta.** Premissa PR-015 assume que o blog não é pré-requisito de lançamento — pode esperar sem prejuízo ao MVP.

**Onde impacta no PRD.** Seção 7, página P-10 (Índice de conteúdos — Fase 2).

**Resposta:**

Não é pré-requisito.

#### Q-055 — Manual de marca ou vocabulário já em uso

**Pergunta.** Existe um manual de marca, guia de estilo verbal ou vocabulário já em uso na comunicação da empresa que deva substituir ou complementar o glossário de termos proposto no PRD?

**Por que precisamos saber.** Evita que o site crie um vocabulário próprio que depois entre em conflito com material de comunicação já usado em outros canais.

**Enquanto não houver resposta.** Não há premissa correspondente. O PRD usa o glossário proposto como padrão único até indicação em contrário.

**Onde impacta no PRD.** Seção 11.8 (Consistência entre páginas: glossário de termos controlados).

**Resposta:**

Não definido

#### Q-058 — Coleta inicial de termos de busca

**Pergunta.** Quem participa da conversa inicial de levantamento de termos de busca (palavras-chave) — comercial, atendimento, sócios — e quando essa conversa deve acontecer?

**Por que precisamos saber.** É o primeiro passo do trabalho de otimização para buscadores (encontrar como o cliente real procura o problema que o produto resolve); sem essa conversa, o levantamento de termos fica baseado em suposição.

**Enquanto não houver resposta.** Não há premissa correspondente. Pode esperar porque a estratégia de busca amadurece ao longo do tempo, com revisão trimestral já prevista.

**Onde impacta no PRD.** Seção 12.8 (Método para levantar palavras-chave).

**Resposta:**

Sócios.

### Publicação e administração

#### Q-057 — Administração das ferramentas de webmaster

**Pergunta.** Quem vai administrar o registro do site nas ferramentas de webmaster dos buscadores (como a Central de Pesquisa do Google) e receber os avisos de erro de indexação?

**Por que precisamos saber.** É quem vai perceber, por exemplo, se o site parar de aparecer corretamente nas buscas — sem essa pessoa definida, esses avisos não chegam a ninguém.

**Enquanto não houver resposta.** Não há premissa correspondente. Pode esperar até perto do lançamento, quando o site estiver pronto para ser registrado.

**Onde impacta no PRD.** Seção 12.5 (Sitemap, robots e canonical).

**Resposta:**

Sócios.

#### Q-072 — Autorização para despublicar ou renomear produto

**Pergunta.** Quem autoriza despublicar ou renomear um produto ou solução já publicados, e como essa mudança é comunicada a quem já é cliente daquele produto?

**Por que precisamos saber.** O endereço de cada produto é tratado como compromisso público — perder ou trocar o endereço prejudica quem chegou por um link externo ou já é cliente. A decisão de despublicar ou renomear precisa de dono e de um combinado de comunicação.

**Enquanto não houver resposta.** Premissa PR-014 assume que o endereço de cada produto é imutável após publicado, e que renomeação exige redirecionamento permanente — mas isso é regra técnica, não resolve quem decide nem como o cliente já existente é avisado.

**Onde impacta no PRD.** Seção 6.9 (Regras de crescimento sem reestruturação); Seção 9.8, requisito RF-147 (Política de publicação e despublicação); Seção 9.9, requisito RF-171 (Redirecionamento permanente).

**Resposta:**

Sócios.

### Formulários

#### Q-030 — Desafio interativo antispam

**Pergunta.** Será adotado um desafio interativo (como um captcha visível) contra envios automatizados no formulário, ou apenas as medidas silenciosas já previstas, que não pedem nada ao visitante legítimo?

**Por que precisamos saber.** Um desafio interativo aumenta a proteção contra abuso, mas também aumenta o atrito e o risco de problemas de acessibilidade — só se justifica diante de um volume real de abuso medido depois do lançamento.

**Enquanto não houver resposta.** Premissa PR-050 assume que não haverá desafio interativo no MVP, apenas as camadas silenciosas de proteção.

**Onde impacta no PRD.** Seção 14.6 (Proteção contra spam); Seção 9.7, requisito RF-126.

**Resposta:**

Sem no início, mas já deixe previsto a inclusão de um captcha.

### Medição

#### Q-061 — Auditoria externa de acessibilidade

**Pergunta.** Haverá verificação de acessibilidade por auditoria externa especializada, ou por teste com pessoas com deficiência, antes do lançamento — e existe orçamento reservado para isso?

**Por que precisamos saber.** É uma camada extra de confiança acima da verificação interna já prevista no checklist de publicação; não é obrigatória para lançar, mas pode ser decidida depois, se houver orçamento.

**Enquanto não houver resposta.** Não há premissa correspondente. O checklist interno de acessibilidade já é aplicado a cada publicação, independentemente desta resposta.

**Onde impacta no PRD.** Seção 13.12 (Checklist de verificação antes de publicar).

**Resposta:**

Não.

#### Q-067 — Investimento em mídia paga

**Pergunta.** Haverá investimento em mídia paga ou em divulgação no lançamento do site?

**Por que precisamos saber.** Muda completamente a leitura dos números do funil de conversão, a viabilidade de calcular custo por oportunidade, e se os endereços do site precisam de parâmetros de campanha para rastrear a origem do tráfego pago.

**Enquanto não houver resposta.** Não há premissa correspondente. Sem investimento declarado, a leitura dos primeiros meses assume tráfego essencialmente orgânico.

**Onde impacta no PRD.** Seção 15.8 (Como ler os primeiros meses sem tirar conclusão errada).

**Resposta:**

Não de início, mas possível.

#### Q-068 — Meta numérica do primeiro trimestre

**Pergunta.** Existe alguma meta numérica mínima aceitável para o primeiro trimestre do site no ar, ou esse período deve ser assumido inteiramente como calibração, sem meta?

**Por que precisamos saber.** Complementa a Q-015 (capacidade de atendimento) — sem meta nem capacidade definidas, os primeiros três meses só servem para observar e aprender, não para avaliar sucesso ou fracasso.

**Enquanto não houver resposta.** Premissa PR-053 assume que os três primeiros meses são linha de base, sem meta fixada e sem julgamento de desempenho além de verificar que tudo funciona tecnicamente.

**Onde impacta no PRD.** Seção 15.8 (Como ler os primeiros meses sem tirar conclusão errada).

**Resposta:**

Não definida.

#### Q-041 — Monitoramento de erro como exceção à ferramenta única

**Pergunta.** O monitoramento de erros técnicos e de desempenho conta como uma exceção à regra de usar uma única ferramenta de medição, ou compete pelo mesmo espaço de decisão que essa ferramenta?

**Por que precisamos saber.** Evita que a escolha de uma ferramenta de medição de audiência (decisão D-08) seja confundida com a escolha de uma ferramenta técnica de monitoramento de erro — são decisões diferentes, com risco real de serem tratadas como a mesma coisa.

**Enquanto não houver resposta.** Premissa PR-032 assume que o monitoramento de erro e desempenho real é categoria operacional distinta da ferramenta única definida pela premissa PR-024.

**Onde impacta no PRD.** Seção 10.10, requisito RNF-093 (Monitoramento de erros técnicos).

**Resposta:**

A definir.

### Disponibilidade e monitoramento

#### Q-045 — Janela de publicação

**Pergunta.** A publicação de conteúdo novo no site deve evitar algum horário específico — por exemplo, fora do horário comercial, ou em determinados dias?

**Por que precisamos saber.** Sem essa resposta, qualquer publicador autorizado pode publicar em qualquer horário útil, o que é operacionalmente mais simples, mas pode não refletir uma preferência real da empresa.

**Enquanto não houver resposta.** Premissa PR-034 assume que qualquer publicador autorizado pode publicar em qualquer horário útil, sem plantão dedicado no MVP.

**Onde impacta no PRD.** Seção 10.10, requisito RNF-097 (Janela e procedimento de publicação).

**Resposta:**

Nada específico.

### Segurança

#### Q-047 — Teste de intrusão antes do lançamento

**Pergunta.** Há expectativa de realizar um teste de intrusão (pentest) antes do lançamento do site, ou isso fica para uma fase posterior?

**Por que precisamos saber.** O formulário do site é a superfície mais exposta a ataque, por aceitar dado de qualquer visitante sem autenticação; um teste de intrusão é uma verificação adicional além da validação técnica já prevista, e pode ser decidida sem bloquear o lançamento.

**Enquanto não houver resposta.** Não há premissa correspondente. A proteção básica do formulário contra ataque (validação própria do endpoint) já está prevista independentemente desta resposta.

**Onde impacta no PRD.** Seção 10.5, requisito RNF-043 (Proteção do endpoint que recebe os formulários).

**Resposta:**

Posteriormente.

---

## Fechamento

### As dez perguntas mais críticas, para quem tiver pouco tempo

1. **Q-001** — Nome comercial da empresa
2. **Q-004** — Produtos do lançamento
3. **Q-002** — Domínio do site
4. **Q-003** — Identidade visual e logotipo
5. **Q-033** — Forma de publicação de conteúdo
6. **Q-008** — Exibição de preço
7. **Q-006** — Soluções compostas no lançamento
8. **Q-029** — Data alvo e orçamento do lançamento
9. **Q-011** — Mercado geográfico e idioma
10. **Q-013** — Destino e prazo de resposta dos leads

### Nota final

Responder integralmente o **Bloco 1** (as 7 perguntas de "Responder primeiro") já é suficiente para o design do site começar. Os Blocos 2 e 3 podem ser respondidos em paralelo, nas semanas seguintes, sem atrasar o início do trabalho visual.
