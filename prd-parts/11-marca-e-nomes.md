> Conteúdo para inserção na seção 11 do PRD, como subseções 11.11 a 11.20, na sequência de 11.10 (Pendências de marca). Resolve as pendências de logotipo, paleta, tipografia e nomenclatura de produto ali registradas, e abre as pendências Q-073 a Q-085.

### 11.11 Leitura do logotipo

O arquivo `Logo.png` (911×691 px) contém um monograma geométrico e um wordmark. A leitura abaixo vem de observação direta do arquivo, incluindo amostragem de cor em pontos específicos da imagem — não de impressão estética (o método está detalhado em 11.12).

**Monograma.** Duas formas angulares sobrepostas, construídas só com segmentos retos e vértices agudos — nenhuma curva em todo o traçado. A forma da esquerda, que sugere a letra "A", é preenchida em tom sólido e único, num azul-marinho quase preto. A forma da direita, que sugere a letra "Z", é preenchida com um gradiente leve entre dois azuis — mais escuro numa ponta, mais claro e mais saturado na outra. É o único gradiente de toda a peça. As duas formas se encaixam por uma aresta diagonal compartilhada, formando um contorno único em vez de duas letras lado a lado: a ideia do monograma é fusão, não justaposição.

**Wordmark.** "ARTZAN" em caixa alta, com espaçamento entre letras nitidamente mais largo que o de leitura corrida, e desenho anguloso coerente com o monograma — o ápice do "A" repete o ângulo do pico do monograma. Todas as letras usam a mesma tinta escura, exceto o "Z", que usa o tom azul chapado mais claro do gradiente: uma referência direta de volta ao monograma. O wordmark ocupa a mesma largura do monograma acima dele (medido: ambos ≈ 844 px) e sua caixa alta corresponde a cerca de 15% da altura total da peça — proporção que serve de unidade de medida em 11.16.

**Fundo e ausência de efeito.** Fundo branco, sem moldura, sombra, contorno ou relevo. A peça já nasce flat: um preenchimento sólido predominante e um único gradiente contido, sem qualquer efeito de profundidade.

**Consequências para o site:**
- Geometria sem curvas → cantos pequenos e discretos, nunca arredondamento pronunciado (11.15).
- Tinta escura domina, azul marca um elemento único → o azul fica reservado ao que for acionável, nunca usado como fundo geral (11.12).
- Gradiente único e contido → não se reproduz fora do arquivo do logotipo (11.15).
- Espaçamento largo do wordmark em caixa alta → mesmo tratamento em título de interface; texto corrido nunca vai para caixa alta (11.14).

### 11.12 Paleta

Os valores abaixo vêm de amostragem de pixel diretamente no arquivo `Logo.png` — não de estimativa visual —, em pontos dentro dos preenchimentos sólidos, longe de bordas com serrilhado.

| Origem no logotipo | Hex medido |
|---|---|
| Preenchimento do "A" e das letras do wordmark (exceto "Z") | `#172738` |
| Letra "Z" do wordmark (tom chapado, sem gradiente) | `#0E66B4` |
| Extremo mais escuro do gradiente do "Z" do monograma | `#0E4988` |
| Extremo mais claro do gradiente do "Z" do monograma | `#106AB6` |
| Fundo | `#FFFFFF` |

A partir desses cinco pontos medidos monta-se o sistema funcional — nomeado por função, não por cor — nos dois temas.

| Token | Tema claro | Tema escuro | Origem |
|---|---|---|---|
| Superfície | `#FFFFFF` | `#0B121B` | Fundo do logotipo / neutro desenhado |
| Superfície elevada | `#F3F6FA` | `#131B26` | Neutro desenhado, leve inclinação para o matiz da tinta |
| Texto principal | `#172738` | `#EDF1F5` | Tinta do monograma / inverso desenhado |
| Texto secundário | `#5A6974` | `#A9B3C0` | Neutro desenhado na família de matiz da tinta |
| Borda | `#85919D` | `#78818A` | Neutro desenhado, calibrado para contraste de interface |
| Ação primária | `#0E66B4` | `#0E66B4` | Tom chapado da letra "Z" do wordmark |
| Ação primária em foco | `#0E4988` | `#106AB6` | Extremos do gradiente do monograma — escuro no tema claro, claro no tema escuro |
| Ação secundária | `#172738` | `#EDF1F5` | Reaproveita o texto principal do próprio tema |
| Destaque | `#106AB6` | `#5AA9E6` | Extremo claro do gradiente / variação clareada para fundo escuro |
| Sucesso | `#14783C` | `#3FCB6B` | Verde desenhado, fora do logotipo |
| Atenção | `#B24400` | `#F5B94D` | Laranja desenhado, fora do logotipo |
| Erro | `#B3261E` | `#FF7A70` | Vermelho desenhado, fora do logotipo |

**Por que ação secundária não é azul.** O sistema reserva o azul só à ação primária. Ação secundária usa a cor de texto principal do tema, em rótulo e contorno, nunca em preenchimento — preserva a regra de 11.9 ("ação primária... única na seção"): se a secundária também fosse azul, duas ações da mesma tela disputariam o mesmo destaque.

**Verificação de contraste dos pares que o site usa de fato.** Fórmula de luminância relativa do WCAG 2.x; mínimo 4,5:1 para texto normal, 3:1 para texto grande e elementos de interface (contorno de campo, contorno de botão).

| Tema | Par | Razão | Mínimo | Situação |
|---|---|---|---|---|
| Claro | Texto principal / Superfície | 15,18:1 | 4,5:1 | Atende |
| Claro | Texto principal / Superfície elevada | 14,00:1 | 4,5:1 | Atende |
| Claro | Texto secundário / Superfície | 5,66:1 | 4,5:1 | Atende |
| Claro | Texto secundário / Superfície elevada | 5,23:1 | 4,5:1 | Atende |
| Claro | Borda / Superfície (contorno funcional) | 3,21:1 | 3:1 | Atende |
| Claro | Branco (rótulo) / Ação primária | 5,87:1 | 4,5:1 | Atende |
| Claro | Branco (rótulo) / Ação primária em foco | 9,02:1 | 4,5:1 | Atende |
| Claro | Ação secundária / Superfície | 15,18:1 | 4,5:1 | Atende |
| Claro | Destaque / Superfície | 5,59:1 | 4,5:1 | Atende |
| Claro | Sucesso / Superfície | 5,55:1 | 4,5:1 | Atende |
| Claro | Atenção / Superfície | 5,65:1 | 4,5:1 | Atende |
| Claro | Erro / Superfície | 6,54:1 | 4,5:1 | Atende |
| Escuro | Texto principal / Superfície | 16,57:1 | 4,5:1 | Atende |
| Escuro | Texto secundário / Superfície | 8,86:1 | 4,5:1 | Atende |
| Escuro | Borda / Superfície (contorno funcional) | 4,75:1 | 3:1 | Atende |
| Escuro | Ação primária / Superfície (contraste não textual do botão) | 3,20:1 | 3:1 | Atende |
| Escuro | Branco (rótulo) / Ação primária em foco | 5,59:1 | 4,5:1 | Atende |
| Escuro | Destaque / Superfície | 7,39:1 | 4,5:1 | Atende |
| Escuro | Sucesso / Superfície | 8,93:1 | 4,5:1 | Atende |
| Escuro | Atenção / Superfície | 10,68:1 | 4,5:1 | Atende |
| Escuro | Erro / Superfície | 7,41:1 | 4,5:1 | Atende |

**Ajustes feitos.** Três valores falharam na primeira tentativa e foram corrigidos:
- Borda, tema claro: um tom comum em paletas "clean" (próximo de `#D7DCE2`) mede 1,38:1 contra a superfície branca — insuficiente para contorno funcional. Escurecido até `#85919D` (3,21:1).
- Borda, tema escuro: problema oposto — um tom próximo da superfície elevada (`#2A3542`) mede 1,51:1. Clareado até `#78818A` (4,75:1).
- Atenção: laranjas vivos típicos de aviso (faixa de `#F0A020`) medem entre 2:1 e 3:1 contra branco. Escurecido até `#B24400` (5,65:1), o tom mais vívido que ainda passa.

**O azul da marca como texto: tratado, não presumido.** O tom extraído do wordmark (`#0E66B4`) passa como texto normal sobre branco, com 5,87:1 — acima do mínimo de 4,5:1. Mas a margem não é folgada: um azul só um pouco mais claro e vívido, do tipo comum em outras marcas de tecnologia (testados: `#2E86D6` e `#3B82F6`), cai para 3,82:1 e 3,68:1 — abaixo do mínimo. Ou seja, o azul aprovado é este valor exato, não "um azul parecido"; qualquer clareamento futuro por preferência estética exige nova verificação antes de entrar em texto ou ícone.

**Pergunta Q-073:** a paleta acima — extraída do arquivo existente, sem escolha estética adicional — está aprovada como paleta oficial? **Pergunta Q-074:** confirma-se a regra de reservar o azul só à ação primária, com a ação secundária no tom de texto principal, conforme proposto acima?

### 11.13 Tema claro e escuro

O tema claro é o principal: o logotipo foi desenhado para fundo branco, e toda a leitura de 11.11 depende desse contraste. O tema escuro é montado com a coluna correspondente da tabela de 11.12, já verificada — a decisão de oferecer ou não os dois temas, e por qual mecanismo, é de implementação e não é definida aqui.

**O logotipo no tema escuro não pode ser o mesmo arquivo.** A tinta quase preta do monograma e do wordmark (`#172738`) se aproxima demais da superfície escura (`#0B121B`) — a peça perderia leitura, não por decisão de estilo, mas por contraste insuficiente. É necessária uma versão reversa: a forma hoje pintada na tinta escura passa a usar o texto principal do tema escuro (`#EDF1F5`); a forma azul mantém a identidade cromática, porque já tem contraste comprovado contra fundo escuro (11.12). Essa versão reversa ainda não existe como arquivo — é parte da pendência registrada em 11.16.

### 11.14 Tipografia

Duas famílias, ambas de licença aberta (o modelo é o SIL Open Font License — sem custo de uso, sem fornecedor a contratar) — nenhuma fonte proprietária ou paga.

**Títulos: família geométrica de traço anguloso**, referência Space Grotesk ou equivalente aberto de mesma família de desenho. Justificativa: os ápices angulares de "A" e "N" seguem a lógica de traço do monograma, e números de largura uniforme ajudam onde o portfólio mostra número em tela — placar e indicadores de scout —, já que número que muda de largura ao girar prejudica a leitura rápida de um placar.

**Texto corrido: família humanista desenhada para tela**, referência Inter ou equivalente aberto de mesmo propósito. Justificativa: título tolera traço com mais personalidade por aparecer em poucas palavras; texto corrido precisa, acima de tudo, ser lido rápido e sem fadiga em blocos de várias linhas (11.7) — famílias para tela pequena diferenciam melhor caracteres parecidos ("I", "l", "1") e cobrem por completo a acentuação do português.

**Escala**, coerente com os limites de caracteres de 11.3:

| Nível | Tamanho | Peso | Uso |
|---|---|---|---|
| H1 | 32–40 px | 700 (bold) | Título de página |
| H2 | 24–28 px | 600 (semibold) | Chamada de seção |
| H3 | 20 px | 600 (semibold) | Título de funcionalidade, subtítulo de card |
| Corpo | 16 px | 400 (regular) | Todo texto corrido — piso, nunca menor |
| Apoio / legenda | 14 px | 400 (regular) | Rótulo de campo, legenda, texto de erro |
| Rótulo de botão | 14–16 px | 500 (medium) | Ação primária e secundária |

**Corpo mínimo de 16 px, sem exceção.** Abaixo disso o texto cansa a leitura em tela pequena, e parte dos navegadores móveis reage ao foco de campo menor com zoom automático indesejado — problema de uso, não só de estilo.

**Espaçamento de letras.** Só em caixa alta e só em elemento curto — rótulo de navegação, etiqueta, rótulo de botão —, ecoando o wordmark: +4% do tamanho da fonte. Título corrido (H1, H2, H3) fica em caixa normal, sem espaçamento adicional: caixa alta em frase inteira lê mais devagar na varredura de nível 1 (11.7), o oposto do que a hierarquia de leitura exige.

**Pergunta Q-075:** a proposta acima — família geométrica para título, família humanista para corpo, ambas abertas — pode ser adotada, ou já existe fonte em uso em outro material da empresa (cartão, apresentação, assinatura de e-mail) que deva prevalecer por consistência?

### 11.15 Princípios de aplicação flat e clean

"Flat e clean" deixa de ser adjetivo e vira regra verificável.

**Proibido, sempre:** sombra difusa em elemento estático (card, cabeçalho, seção, imagem); qualquer efeito de profundidade — bisel, relevo, brilho, textura, contorno duplo; gradiente fora do arquivo do logotipo, em botão, fundo de seção, ícone ou faixa; mais de duas famílias tipográficas ou mais de três pesos na mesma tela; borda decorativa empilhada (mais de uma linha ao redor do mesmo elemento).

**Obrigatório, sempre:** preenchimento sólido, só com os tokens de 11.12; um raio de canto por categoria — 4 px em controle pequeno (botão, campo, etiqueta), 8 px em card, container e imagem, nenhum outro valor; uma única espessura de borda, 1 px, em todo contorno (card, campo, divisor, tabela); respiro em escala de 8 px (8/16/24/32/48/64/96), com preenchimento interno mínimo de card de 24 px em tela grande e 16 px em tela pequena, e espaço mínimo entre seções de página de 64 px. O raio pequeno se justifica pela origem: o logotipo é anguloso (11.11), e arredondamento amplo, estilo "pílula", contradiria a peça que dá origem ao sistema.

**Onde existe elevação.** Só em camada temporariamente sobreposta ao conteúdo — janela modal, menu suspenso, aviso temporário, texto de apoio sob passagem do cursor. Uma única sombra padrão, difusa e de baixo contraste, exclusiva dessas camadas. Card, cabeçalho, rodapé e seção de página nunca recebem sombra: usam a borda de 1 px para se separar do fundo, porque estão no mesmo plano da página, não flutuando sobre ela.

**Como o gradiente do logotipo é usado sem se espalhar pelo site.** O gradiente vive só dentro do arquivo de imagem do logotipo — cabeçalho, rodapé, versão maior do ícone, imagem de compartilhamento. Nenhuma outra superfície do site reproduz gradiente, nem com as mesmas cores. Toda cor de interface fora do arquivo do logotipo é tom chapado — inclusive os dois tons vindos das extremidades do próprio gradiente (`#0E4988`, `#106AB6`), que entram no sistema como cor sólida única, nunca misturados entre si numa transição.

**Pergunta Q-076:** o raio de canto (4 px / 8 px) e a espessura de borda (1 px) acima podem ser adotados como padrão único do site, ou existe preferência do cliente por um estilo ainda mais anguloso, com raio zero, coerente ao extremo com a geometria do monograma?

### 11.16 Uso do logotipo

**Área de proteção.** Mínimo, em todos os lados, igual à altura do wordmark "ARTZAN" medida no próprio arquivo — a caixa alta do texto, cerca de 15% da altura total da peça. Nenhum texto, borda, imagem ou outro logotipo entra nessa área.

**Tamanho mínimo.** Peça completa (monograma e wordmark): nunca abaixo de 120 px de largura em tela, nem de 30 mm em impresso — abaixo disso os traços finos do wordmark perdem legibilidade. Em espaço menor que isso, usa-se só o monograma, nunca o conjunto reduzido.

**Versões necessárias**, nenhuma existente além da principal: (1) principal, monograma e wordmark, cores completas, tema claro; (2) monograma isolado, para favicon, ícone e espaço quadrado pequeno; (3) reversa para tema escuro (11.13); (4) monocromática, um único tom, para impressão em uma cor e fundo fotográfico não controlado.

**Favicon.** Só o monograma isolado. Em 16 e 32 px o gradiente não se sustenta visualmente — usar a versão monocromática ou de dois tons chapados nesse tamanho especificamente; ícones maiores (o usado para adicionar à tela inicial, por exemplo) podem manter o gradiente.

**Imagem padrão de compartilhamento.** Proporção larga, próxima de 1200×630 px — a mais comum em pré-visualização de link. Logotipo em cores completas, centralizado, sobre a superfície do tema claro (o principal, por definição de 11.13), respeitando a área de proteção; nunca sobre fotografia.

**Nunca fazer:** esticar, achatar ou girar; usar cor fora da paleta de 11.12; recriar o gradiente com outras cores; adicionar sombra, contorno ou brilho; separar monograma de wordmark na versão principal; arredondar os vértices do traçado.

**Pergunta Q-077:** existe arquivo vetorial original do logotipo, ou só o `Logo.png` hoje disponível? Sem vetor, toda versão derivada — monograma isolado, reversa, monocromática, favicon — exige reconstrução do traçado a partir da imagem, com risco de pequena divergência geométrica. **Pergunta Q-078:** quem produz essas versões derivadas e em que prazo — trava o desenho de cabeçalho, rodapé, favicon e imagem de compartilhamento antes da publicação (11.10). **Pergunta Q-079:** existe papelaria, apresentação comercial ou assinatura de e-mail com identidade própria que deva seguir este mesmo sistema, ou o site é a primeira aplicação da marca além do logotipo em si?

### 11.17 Aplicação ao produto

O portfólio vai crescer continuamente (11.4, PR-042); a regra abaixo existe para que o vigésimo produto não exija uma decisão de identidade nova.

Cada produto do catálogo usa o mesmo sistema — mesma paleta, mesma tipografia, mesmos componentes — e se diferencia só por três elementos: (1) **nome**, com o mesmo tratamento tipográfico de qualquer título H2/H3 do site (11.14), sem destaque gráfico próprio; (2) **um ícone monocromático simples**, no mesmo traço e peso de todos os demais, na cor de texto principal ou de ação primária, nunca uma cor exclusiva por produto; (3) **a captura de tela real do produto** (Q-005), o único elemento que de fato varia entre produtos, sempre dentro de moldura padrão idêntica — mesma proporção, mesma borda de 1 px, sem bisel nem sombra de dispositivo — para que a moldura pareça igual mesmo quando o conteúdo interno muda.

**Nunca:** logotipo próprio de produto, paleta exclusiva, família tipográfica diferente, componente que não exista em outro produto do site. É a tradução visual de PR-040 (uma única voz): vozes diferentes por produto fragmentam a marca; identidade visual diferente por produto faria o mesmo dano, pela imagem em vez do texto.

**Pergunta Q-080:** confirma-se que nenhum produto do catálogo — incluindo os quatro a nomear em 11.19 — recebe paleta, tipografia ou logotipo próprios? **Pergunta Q-081:** quando a primeira captura de tela real existir, quem aprova o enquadramento antes da publicação — o revisor único de 11.9, ou alguém da área de produto? **Pergunta Q-082:** o conjunto de ícones monocromáticos por produto será produzido por quem, e já existe um conjunto interno reaproveitável?

### 11.18 Critérios de nomenclatura aplicados às propostas

Critérios usados nas doze opções de 11.19, além dos já registrados em 11.4: curto; pronunciável em português sem soletração; sem ambiguidade de grafia; sem depender de trocadilho em inglês; sem termo genérico do setor, não registrável e não disputável em busca; sem colisão óbvia com marca conhecida que haja razão para suspeitar. Segue-se o padrão (a) da regra 6 de 11.4 — nomes independentes, sob a assinatura "um software de [Empresa]" —, conforme decisão já registrada do cliente (Q-051, resolvida).

**Referência de estilo: Sistema Lara.** Nome próprio, curto, humano, fácil de pronunciar, abstrato em relação à função — não descreve gestão de empresa por si só, por isso sempre acompanhado do descritor funcional (regra 8 de 11.4). As doze opções seguem a mesma lógica, sem repetir som, raiz ou estrutura de "Lara" entre si.

**Aviso explícito, válido para as doze opções de 11.19:** nenhuma verificação de registro de marca, de disponibilidade de domínio ou slug, ou de uso por terceiros no mesmo mercado foi ou pôde ser feita neste documento. Nenhum nome está disponível até prova em contrário.

**Pergunta Q-083:** quem faz a verificação formal de registro de marca, domínio e uso por terceiros para os nomes que vierem a ser aprovados, e em que momento do cronograma isso acontece antes de qualquer publicação?

### 11.19 Nomes propostos por produto

**1. Alocação de quadras**

| Nome | Origem / sentido | Por que combina | Risco |
|---|---|---|---|
| **Theo** — recomendado | Forma curta de Theodoro | Curto, caloroso, distante em som de "Lara" | Nome muito popular no Brasil hoje, pode datar; grafia alternativa "Téo" pode dividir busca |
| Ivo | Nome tradicional em português, curto | Direto, fácil ao telefone | Pode soar antiquado para parte do público |
| Rian | Adaptação de "Ryan" à grafia portuguesa | Soa ativo e moderno | Grafia concorre com "Ryan" (regra de digitabilidade); nome comum internacionalmente |

**2. Scout para partidas esportivas**

| Nome | Origem / sentido | Por que combina | Risco |
|---|---|---|---|
| **Iago** — recomendado | Forma portuguesa/galega tradicional de Tiago | Curto, sonoro, distinto dos demais nomes propostos | Associação com o vilão de "Otelo" e com personagem de animação; risco de busca dividida com "Tiago" |
| Rafa | Diminutivo comum de Rafael | Muito fácil e reconhecível | Apelido comum, inclusive de atleta famoso; baixa distintividade para registro |
| Vico | Diminutivo pouco comum de Vítor/Ludovico | Curto, ritmo ativo | Pouco reconhecível como nome autônomo; pode exigir explicação de pronúncia |

**3. Placar esportivo**

| Nome | Origem / sentido | Por que combina | Risco |
|---|---|---|---|
| **Nina** — recomendado | Nome curto, comum a várias línguas latinas | Fácil, reconhecível, cadência distinta de "Lara" | Já usado como nome de assistente virtual por outra empresa de software; verificar categoria |
| Bia | Diminutivo comum de Beatriz | Muito fácil e caloroso | Já em uso como assistente virtual por banco brasileiro; alta exposição por figuras públicas atuais |
| Mel | Forma curta, uma sílaba | Extremamente curto e direto | É também palavra comum do português ("mel"); ambiguidade de busca e de registro |

**4. Desenvolvimento de integrações entre sistemas**

| Nome | Origem / sentido | Por que combina | Risco |
|---|---|---|---|
| **Renan** — recomendado, caso vire produto | Nome próprio comum no Brasil | Registro mais técnico e sóbrio, coerente com serviço de engenharia | Nome e sobrenome muito comuns, inclusive de figura pública; baixa distintividade |
| Aldo | Nome tradicional ítalo-português | Curto, sóbrio | Coincide com marca internacional de varejo conhecida (calçados) |
| Ike | Forma curta de origem anglófona | Muito curto e direto | Som de origem inglesa, menos alinhado ao critério de raiz portuguesa; pode ser grafado "Aik" por quem só ouviu o nome |

**Pergunta Q-084:** dentre as doze opções acima, ou variações delas, quais o cliente aprova para seguir à verificação formal de registro (Q-083)?

### 11.20 Recomendação sobre o quinto item do portfólio

Desenvolvimento de integrações entre sistemas não tem as características dos outros quatro itens: não tem escopo fixo, não comporta ambiente de avaliação por tempo determinado (Q-026) como um software pronto, e não produz captura de tela representativa única (Q-005) — cada projeto é diferente por definição. Encaixá-lo no template obrigatório de produto (P-04) forçaria seções vazias ou genéricas na própria página que deveria provar competência pela precisão (11.1), quebrando a consistência que hoje é o principal argumento de credibilidade da empresa (11.5): um catálogo com quatro páginas completas e uma malformada é pior do que um catálogo com quatro.

**Recomendação: tratar como oferta de serviço apresentada à parte, não como quinto produto do catálogo.**

- **Página inicial:** o bloco de destaque de produtos (RF-022) continua alimentado só pelo catálogo de software; a integração aparece como parágrafo curto e independente — por exemplo, no institucional —, com ação própria ("Fale sobre seu projeto"), nunca a ação de avaliação gratuita dos softwares prontos.
- **Catálogo:** não recebe um quinto card no padrão de software. Se a empresa quiser visibilidade equivalente, a alternativa é um card com rótulo diferente ("Serviço", nunca "Software"), para página própria fora do template de produto.
- **Glossário (11.8):** atenção a uma colisão de vocabulário — "Integração" já é termo controlado, reservado para descrever conexão real e existente de um produto com sistema de terceiro. Se o serviço mantiver a palavra "integração" no nome público, as duas ocorrências do termo precisam de contexto que as distinga, ou o glossário precisa de entrada nova para a segunda acepção.
- Nome próprio da lista de 11.19 é dispensável nesse caminho: serviço sob encomenda pode ser referido pela própria descrição funcional ("desenvolvimento de integrações"), sem o peso de marca que um software vendido por assinatura precisa carregar.

**Pergunta Q-085:** confirma-se a recomendação de apresentar "desenvolvimento de integrações entre sistemas" como serviço à parte — com o ajuste correspondente na inicial, no catálogo e no glossário —, ou o cliente prefere mantê-lo como quinto produto de prateleira, aceitando a inconsistência de template descrita acima?
