// Dono: Onda 3c
//
// Contrato ÚNICO do formulário de contato (P-08): campos, opções, validação e
// redação das mensagens. Compartilhado pelo componente de tela e pelo
// recebimento em `src/app/api/contato/`.
//
// Implementa: RF-120 (campos), RF-122 (validação no cliente E no servidor),
//   RF-123 (mensagem por campo), RF-127 (consentimento de tratamento),
//   RF-221 (aceite separado), RF-128 (contexto de origem)
// Redação: 13.7 (princípios), 14.4 (textos propostos), 11.8 (mesma redação em
//   toda superfície)
// Perguntas abertas que afetam este arquivo: Q-089 (o texto do aceite de
//   comunicações precisa de validação jurídica), D-16 / Q-065 (finalidade,
//   destinatário e prazo de retenção do aviso de tratamento não existem)
//
// ESTE MÓDULO NÃO IMPORTA NADA DE SERVIDOR. É a razão de a validação poder ser
// literalmente a mesma nos dois lados: RF-122 exige que a do servidor exista e
// nunca seja dispensada, e duas implementações divergentes seriam pior que uma.
//
// NENHUM DADO DE NEGÓCIO VIVE AQUI: sem telefone, sem e-mail, sem prazo além do
// único confirmado pelo cliente (Q-013).

/** O único prazo confirmado (Q-013). Uma constante, uma redação (11.8). */
export const PRAZO_DE_RESPOSTA = 'até 2 dias úteis'

/**
 * Assunto: lista controlada que roteia o lead (RF-129) e inclui a opção
 * "sou parceiro" — substituto imediato do fluxo dedicado de parceria (16.5).
 */
export const ASSUNTOS = [
  { valor: 'comercial', rotulo: 'Quero contratar ou pedir um orçamento' },
  { valor: 'parceria', rotulo: 'Sou parceiro, ou quero ser parceiro' },
  { valor: 'suporte', rotulo: 'Preciso de suporte em algo que já uso' },
  { valor: 'outro', rotulo: 'Outro assunto' },
] as const

export type Assunto = (typeof ASSUNTOS)[number]['valor']

const VALORES_DE_ASSUNTO: readonly string[] = ASSUNTOS.map((a) => a.valor)

/**
 * Valor do campo de interesse quando o visitante chega por página institucional
 * e não sabe qual software procura (14.2). Não é produto: é ausência declarada.
 */
export const INTERESSE_INDEFINIDO = 'ainda-nao-sei'

/** Tipo de página que originou o envio (14.7). Nunca fica vazio (PR-049). */
export const TIPOS_DE_ORIGEM = ['produto', 'solucao', 'categoria', 'institucional', 'conteudo', 'parceiro'] as const
export type TipoDeOrigem = (typeof TIPOS_DE_ORIGEM)[number]

/** Nível da chamada que originou o envio (14.7, 14.1). */
export const ACOES_DE_ORIGEM = ['primaria', 'secundaria', 'rodape', 'bloco-final', 'direta'] as const
export type AcaoDeOrigem = (typeof ACOES_DE_ORIGEM)[number]

/** Contexto de origem (RF-128). Capturado sem esforço do visitante. */
export type ContextoDeOrigem = {
  /** Caminho da página onde a ação foi acionada. Nunca URL absoluta de terceiro. */
  paginaDeOrigem: string
  tipoDeEntidade: TipoDeOrigem
  /** Slug do produto ou solução vinculado, quando houver. */
  entidade?: string
  acao: AcaoDeOrigem
  /** Parâmetros de campanha, sem identificação pessoal (RF-204). */
  campanha?: Record<string, string>
}

/** Campos preenchidos pelo visitante. */
export type DadosDoFormulario = {
  nome: string
  email: string
  empresa: string
  assunto: string
  interesse: string
  mensagem: string
  /** RF-127 — consentimento de tratamento DESTA solicitação. Obrigatório. */
  consentimentoDeTratamento: boolean
  /** RF-221 — aceite de comunicações futuras. Opcional, jamais pré-marcado. */
  aceiteDeComunicacoes: boolean
}

export const DADOS_VAZIOS: DadosDoFormulario = {
  nome: '',
  email: '',
  empresa: '',
  assunto: '',
  interesse: '',
  mensagem: '',
  consentimentoDeTratamento: false,
  aceiteDeComunicacoes: false,
}

/** Corpo aceito pelo recebimento. Campos técnicos e contexto vão juntos. */
export type EnvioDeContato = {
  dados: DadosDoFormulario
  contexto: ContextoDeOrigem
  /** Token de origem do formulário (14.6, camada 3). */
  token: string
  /** Campo isca (14.6, camada 1). Preenchido ⇒ descarte silencioso. */
  isca: string
  /**
   * Resposta do desafio interativo. Sempre presente no contrato e SEMPRE vazia
   * hoje: é o ponto de extensão de PR-050. Ativar o captcha depois não muda
   * este tipo, nem a validação, nem o roteamento — só a configuração do
   * verificador em `src/lib/antispam.ts`.
   */
  desafio: string
}

// ---------------------------------------------------------------------------
// Identificadores de campo. Usados pelo rótulo, pelo erro, pelo resumo de erros
// e pelo foco — precisam ser os mesmos nos três lugares (13.6, regras 2 e 6).
// ---------------------------------------------------------------------------

export const CAMPOS = [
  'nome',
  'email',
  'empresa',
  'assunto',
  'interesse',
  'mensagem',
  'consentimentoDeTratamento',
] as const

export type CampoComErro = (typeof CAMPOS)[number]

export type ErrosDeValidacao = Partial<Record<CampoComErro, string>>

// ---------------------------------------------------------------------------
// Redação. Textos de 14.4, palavra por palavra, e princípios de 13.7:
// dizer o que houve, dizer como resolver, nunca culpar o visitante.
// ---------------------------------------------------------------------------

export const MENSAGENS = {
  nomeVazio: 'Informe seu nome para que possamos responder.',
  emailVazio: 'Informe um e-mail para receber a resposta.',
  emailInvalido: 'Verifique o e-mail: o formato esperado é nome@dominio.com.',
  assuntoVazio: 'Selecione um assunto para direcionarmos sua mensagem.',
  mensagemVazia: 'Escreva em poucas linhas o que você precisa resolver.',
  mensagemCurta: 'Conte um pouco mais: quanto mais claro o cenário, mais objetiva é a resposta.',
  consentimentoVazio:
    'Confirme que podemos usar seus dados para responder a esta solicitação. Sem isso não temos como retornar.',
  resumo: (quantidade: number): string =>
    `Faltam ${quantidade} ${quantidade === 1 ? 'informação' : 'informações'} para enviar. Os campos com problema estão indicados abaixo.`,
} as const

/** Mensagens de falha de envio (14.4). Todas oferecem os canais diretos. */
export const FALHAS = {
  rede: 'Não foi possível enviar agora: a conexão falhou. Seus dados continuam preenchidos. Tente novamente em alguns instantes, ou fale com a gente pelo WhatsApp ou por e-mail.',
  servidor:
    'Tivemos um problema ao registrar sua solicitação. Nada do que você escreveu foi perdido. Tente enviar novamente, ou fale com a gente pelo WhatsApp ou por e-mail.',
  tempoEsgotado:
    'O envio demorou mais do que o esperado e não foi concluído. Seus dados continuam preenchidos. Tente novamente, ou fale com a gente pelo WhatsApp ou por e-mail.',
  duplicado:
    'Sua solicitação já foi enviada. Se precisar acrescentar alguma informação, responda ao e-mail de confirmação.',
} as const

// ---------------------------------------------------------------------------
// Validação. RF-122: a do cliente é conveniência, a do servidor é obrigatória.
// ---------------------------------------------------------------------------

/**
 * Comprimento mínimo da mensagem. Limiar técnico, não dado de negócio: é o
 * ponto abaixo do qual não há cenário descrito, só um "oi". Deliberadamente
 * baixo — RF-122 proíbe bloquear por formatação cosmética.
 */
export const MINIMO_DA_MENSAGEM = 20

/** Tetos de tamanho. Protegem o recebimento de payload arbitrário (RNF-043). */
export const LIMITES: Readonly<Record<'nome' | 'email' | 'empresa' | 'mensagem', number>> = {
  nome: 120,
  email: 180,
  empresa: 160,
  mensagem: 4000,
}

/**
 * Rótulo do envio (14.1, inventário por página): "nada compete com o envio" em
 * P-08 — não existe ação secundária na mesma seção. Vive aqui, e não em
 * `rotulos.ts` (Onda 3b), porque pertence ao contrato do próprio formulário,
 * e não ao inventário geral de chamadas para ação.
 */
export const ROTULO_DO_ENVIO = 'Enviar solicitação'

/** Anunciado a leitor de tela enquanto o envio está em andamento (13.6 regra 14). */
export const ROTULO_DE_ENVIO_EM_ANDAMENTO = 'Enviando sua solicitação…'

// ---------------------------------------------------------------------------
// Validação central — RF-122: idêntica no cliente (conveniência) e no servidor
// (obrigatória, nunca dispensada). Nenhum campo é bloqueado por formatação
// cosmética: só por ausência do que é necessário para responder (RF-120).
//
// CAMPOS OBRIGATÓRIOS, e por quê exatamente estes — RF-120 é explícito
// ("obrigatórios nome, e-mail e mensagem; empresa e interesse são opcionais")
// e é a fonte que prevalece aqui: é o único lugar do PRD que descreve
// "Comportamento esperado" (a especificação funcional) para este campo. Duas
// outras passagens do PRD (7/P-08 e a tabela de 14.2) leem como se empresa,
// assunto e interesse também fossem obrigatórios — CONTRADIÇÃO INTERNA
// relatada ao maestro. Assunto entra como obrigatório mesmo assim, porque
// não é dado de negócio do visitante: é a lista controlada que RF-129 usa
// para rotear o lead, e um envio sem classificação não tem para onde ir.
// ---------------------------------------------------------------------------

const REGEX_DE_EMAIL_BASICO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const normalizar = (valor: string): string => valor.trim()

/**
 * Valida os dados digitados e devolve um erro por campo problemático. A
 * ORDEM das chaves segue a ordem visual dos campos no formulário (13.6 regra
 * 6): é essa ordem que decide qual erro recebe o foco primeiro e em que
 * sequência o resumo os lista.
 */
export const validarDados = (dados: DadosDoFormulario): ErrosDeValidacao => {
  const erros: ErrosDeValidacao = {}

  const nome = normalizar(dados.nome)
  if (nome === '') erros.nome = MENSAGENS.nomeVazio
  else if (nome.length > LIMITES.nome) erros.nome = MENSAGENS.nomeVazio

  const email = normalizar(dados.email)
  if (email === '') erros.email = MENSAGENS.emailVazio
  else if (email.length > LIMITES.email || !REGEX_DE_EMAIL_BASICO.test(email))
    erros.email = MENSAGENS.emailInvalido

  // Empresa é opcional (RF-120): comprimento excessivo é aparado por
  // `normalizarParaEnvio`, nunca bloqueia o envio com um erro de campo.

  if (!VALORES_DE_ASSUNTO.includes(dados.assunto)) erros.assunto = MENSAGENS.assuntoVazio

  const mensagem = normalizar(dados.mensagem)
  if (mensagem === '') erros.mensagem = MENSAGENS.mensagemVazia
  else if (mensagem.length < MINIMO_DA_MENSAGEM) erros.mensagem = MENSAGENS.mensagemCurta
  else if (mensagem.length > LIMITES.mensagem) erros.mensagem = MENSAGENS.mensagemCurta

  if (!dados.consentimentoDeTratamento) {
    erros.consentimentoDeTratamento = MENSAGENS.consentimentoVazio
  }

  return erros
}

export const dadosSaoValidos = (dados: DadosDoFormulario): boolean =>
  Object.keys(validarDados(dados)).length === 0

/**
 * Recorta espaços e aplica os tetos de `LIMITES` (RNF-043) sem gerar erro de
 * validação — usada pelo servidor imediatamente antes de registrar e
 * encaminhar um envio já validado. Nunca aplicada antes da validação: aparar
 * silenciosamente um campo obrigatório vazio esconderia o problema do
 * visitante.
 */
export const normalizarParaEnvio = (dados: DadosDoFormulario): DadosDoFormulario => ({
  nome: normalizar(dados.nome).slice(0, LIMITES.nome),
  email: normalizar(dados.email).slice(0, LIMITES.email),
  empresa: normalizar(dados.empresa).slice(0, LIMITES.empresa),
  assunto: dados.assunto,
  interesse: dados.interesse,
  mensagem: normalizar(dados.mensagem).slice(0, LIMITES.mensagem),
  consentimentoDeTratamento: dados.consentimentoDeTratamento,
  aceiteDeComunicacoes: dados.aceiteDeComunicacoes,
})

/** Rótulo legível do assunto escolhido — usado no e-mail interno (RF-129). */
export const rotuloDoAssunto = (valor: string): string =>
  ASSUNTOS.find((a) => a.valor === valor)?.rotulo ?? valor

/**
 * Contexto de origem nunca fica vazio (PR-049, RF-128): envio direto por
 * `/contato`, sem produto de origem, é registrado como origem institucional
 * geral — estado válido, não erro.
 */
export const CONTEXTO_PADRAO: ContextoDeOrigem = {
  paginaDeOrigem: '/contato',
  tipoDeEntidade: 'institucional',
  acao: 'direta',
}

// ---------------------------------------------------------------------------
// PR-050 — ponto de extensão do captcha. Nada aqui verifica o desafio: isso é
// papel de `src/lib/antispam.ts` (que pode importar deste módulo, nunca o
// contrário). Este arquivo só define o formato dos dados.
// ---------------------------------------------------------------------------

/**
 * PR-050, camada 1 — campo isca. Preenchido só por robô que preenche todo
 * campo do formulário, inclusive os escondidos de humano. Descarte silencioso
 * (RF-126): quem preencheu não recebe erro específico de spam.
 */
export const iscaFoiPreenchida = (envio: Pick<EnvioDeContato, 'isca'>): boolean =>
  envio.isca.trim().length > 0

