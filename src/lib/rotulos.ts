// Dono: Onda 3b
//
// Rótulos de INTERFACE fixados pelo próprio PRD. Este arquivo NÃO contém dado de
// negócio: nenhum nome de produto, número, prazo, preço ou texto editorial. Contém
// apenas as cadeias que o PRD declara normativas e não editáveis:
//
//   - o inventário de chamadas para ação de 14.1, cujas regras 4 e 5 exigem
//     "o mesmo rótulo sempre para a mesma ação em todo o site";
//   - o rótulo de tipo "Software", fixo e não editável pelo autor (RF-061, 11.8);
//     - os nomes das seções do template obrigatório de P-04, que existem porque a
//     ordem é fixa e idêntica em todo o catálogo (RF-060, PR-008);
//   - o título obrigatório da faixa de parceiros (11.6, regra 1);
//   - os nomes das seções de P-01, na ordem de 7/P-01.
//
// Vive num arquivo só justamente porque RNF-074 proíbe espalhar texto por template:
// mudar um rótulo do inventário de 14.1 precisa ser uma edição única e visível.
//
// O QUE NÃO ESTÁ AQUI, DE PROPÓSITO: frase de proposta de valor, apresentação da
// empresa, benefícios, texto de card, descrição de produto e texto de contratação.
// Tudo isso vem do registro (Payload) — código sem vestígio de texto de negócio.

/**
 * Nome público da marca. Confirmado (Q-001 quanto ao nome; a razão social e os
 * dados de registro seguem pendentes em Q-086 e pertencem ao rodapé, da Onda 3a).
 * Usado apenas na composição de título de busca (RF-160) e nos dados estruturados
 * de organização (RF-166). NÃO é razão social e não pode ser apresentado como tal.
 */
export const NOME_DA_MARCA = 'ArtZan'

/**
 * Rótulo de tipo que precede o nome do software (RF-061, 11.8). Fixo e não
 * editável: é um dos quatro mecanismos que impedem a confusão entre software e
 * solução (P-06). O par "Solução" não existe aqui porque não há solução no
 * lançamento (Q-006) e nenhuma superfície desta onda o usaria.
 */
export const ROTULO_DE_TIPO_SOFTWARE = 'Software'

/**
 * Inventário de chamadas para ação (14.1).
 *
 * AUSÊNCIA DELIBERADA — `Solicitar avaliação gratuita`. 14.1 declara esse rótulo
 * como ação primária de P-01, P-03 e P-04, mas o destino dele é P-09, que a
 * decisão D-11 (Alternativa C) coloca na etapa 2 e dev/CONVENCOES.md §4.2 proíbe
 * construir agora. A regra 5 de 14.1 — "um rótulo nunca aponta para destinos
 * diferentes em páginas diferentes" — impede apontá-lo para `/contato` como
 * substituto. Enquanto P-09 não existir, a ação primária de todas as páginas
 * desta onda é `Falar com a equipe`, que é o próprio rótulo que 14.1 atribui às
 * páginas sem produto no contexto. Contradição relatada ao maestro.
 */
export const ACOES = {
  /** Primária enquanto P-09 não existir. Destino: `/contato` (P-08). */
  falarComEquipe: 'Falar com a equipe',
  /** Secundária: aprofunda a navegação no portfólio. Destino: `/produtos`. */
  verSoftwares: 'Ver softwares',
  /** Secundária, por card de produto (RF-041). Nunca aparece sozinha: o nome do
   *  produto é associado pelo rótulo acessível do card. */
  verDetalhes: 'Ver detalhes',
  /** Terciária: caminho ao institucional a partir de qualquer página (RF-069). */
  sobreAMarca: `Sobre a ${NOME_DA_MARCA}`,
} as const

/**
 * Seções do template obrigatório de P-04, na ordem fixa da tabela de P-04.
 * Não editável por produto (RF-060): é o que sustenta a comparabilidade de J-06.
 *
 * `descricaoCompleta` NÃO consta da tabela de onze seções de P-04, mas 11.3 fixa
 * limites editoriais para "P-04, seção 'descrição completa'" e o campo é
 * obrigatório no modelo (6.7). Contradição interna do PRD, relatada ao maestro;
 * resolvida aqui por posição fixa dentro do template único, de modo que todas as
 * páginas de produto continuem com a mesma ordem.
 */
export const SECOES_DE_PRODUTO = {
  problemaQueResolve: 'Problema que resolve',
  descricaoCompleta: 'Descrição completa',
  publicoAlvo: 'Para quem é',
  funcionalidades: 'Principais funcionalidades',
  beneficios: 'Benefícios',
  imagens: 'Imagens',
  integracoes: 'Integrações',
  informacoesComerciais: 'Informações comerciais',
  /** Seção 9 da tabela de P-04: derivada, omitida enquanto não houver vínculo (Q-006). */
  solucoesQueParticipa: 'Soluções das quais participa',
  /** Seção 11 — chamada final. Mesmo rótulo em toda página de produto (RNF-074). */
  chamadaFinal: 'Próximo passo',
} as const

/** Rótulos das duas formas de contratação (Q-007, 11.8). Espelham o `select` de
 *  `src/collections/Produtos.ts`; preço não é publicado (PR-005, Q-008). */
export const MODELOS_DE_CONTRATACAO: Readonly<Record<string, string>> = {
  'assinatura-recorrente': 'Assinatura recorrente',
  'projeto-sob-encomenda': 'Projeto sob encomenda',
}

/**
 * Nomes das seções de P-01, na ordem de 7/P-01. Usados como nome acessível da
 * região (13.5) e, quando o registro não traz título próprio, como único rótulo
 * da seção. "Empresas parceiras" é o único deles que 11.6 (regra 1) declara
 * obrigatório e não editável — os demais cedem lugar ao título do registro.
 */
export const SECOES_DA_INICIAL = {
  propostaDeValor: 'Proposta de valor',
  apresentacaoDaEmpresa: 'A empresa',
  destaqueDeSoftwares: 'Softwares em destaque',
  beneficios: 'Benefícios',
  /** 11.6, regra 1: título fixo que declara a natureza da relação. Nunca "Quem
   *  confia", "Trabalham com a gente" ou qualquer forma que sugira clientes. */
  parceiros: 'Empresas parceiras',
  elementosDeConfianca: 'Elementos de confiança',
  chamadaFinal: 'Próximo passo',
} as const

/** Trilha de RF-069 — `Início › Softwares › [Produto]`. Nunca inclui categoria (6.4). */
export const TRILHA = {
  inicio: 'Início',
  softwares: 'Softwares',
} as const

/**
 * Títulos fixos por 12.3 — texto de estrutura, não de conteúdo editorial, e
 * por isso não vem de nenhum registro. Hoje só P-03 tem H1 literal: 12.3 diz
 * que o de P-01 é a proposta de valor (dinâmica, vem do bloco de chamada da
 * página inicial) e o de P-02 é o título do próprio registro institucional.
 */
export const TITULOS_FIXOS = {
  /** H1 de P-03 (12.3): `Softwares` (com o complemento do subtítulo à parte). */
  catalogo: 'Softwares',
} as const

/** Rótulo do bloco opcional de P-04 (RF-067). Nunca "solução" (11.8). */
export const ROTULO_PRODUTOS_RELACIONADOS = 'Produtos relacionados'

/** Selo do card de catálogo (RF-042). Indica existência, nunca quantidade. */
export const ROTULO_SELO_PARTICIPA_DE_SOLUCOES = 'Participa de soluções'

/** Rótulo do complemento de nome proposto, ainda não aprovado (PR-063, Q-084). */
export const ROTULO_NOME_PROPOSTO_A_APROVAR = 'Nome proposto — a aprovar'

/**
 * Estado vazio do catálogo (RF-049). Texto estrutural de interface, não fato
 * de negócio (nenhum número, nome ou prazo) — por isso fica aqui, centralizado,
 * como o resto deste arquivo, em vez de em um campo do modelo de conteúdo que
 * não existe hoje. Cenário improvável no lançamento: PR-002 estima 2 a 5
 * produtos publicados.
 */
export const ESTADO_VAZIO_DO_CATALOGO = {
  titulo: 'Nenhum software publicado no momento',
  apoio: 'A equipe pode explicar o que está em preparação — fale com a gente.',
} as const

/**
 * Etiqueta da marca de conteúdo provisório (dev/CONVENCOES.md §7.2 e §7.3).
 * Só aparece em homologação; em produção o primitivo não renderiza nada.
 * A redação definitiva é da Onda 4, dona do contrato de placeholder.
 */
export const ROTULO_DE_CONTEUDO_PROVISORIO = 'Conteúdo provisório'

/**
 * Parâmetro de consulta que transporta o produto de origem até o formulário
 * (RF-068: "o campo de interesse chega pré-preenchido com aquele produto").
 *
 * CONTRATO ENTRE ONDAS, ainda não acordado: `/contato` é território da Onda 3c.
 * Enquanto ela não ler este mesmo nome, o parâmetro é inerte — o link continua
 * funcionando e o formulário apenas não vem pré-preenchido. Relatado ao maestro.
 * O parâmetro nunca altera o canônico (RF-161): o canônico sai de `montarUrlAbsoluta`.
 */
export const PARAMETRO_DE_PRODUTO_DE_ORIGEM = 'produto'
