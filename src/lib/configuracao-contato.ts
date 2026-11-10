// Dono: Onda 3c
//
// Leitura tipada das variáveis de ambiente do fluxo de contato (RF-120..132,
// RF-220, RNF-092). Todas já estão previstas em `.env.example` (Onda 1).
//
// DESVIO REGISTRADO, e é deliberado. `dev/CONVENCOES.md` §2 diz que
// `src/lib/env.ts` é "o único ponto do código que lê `process.env` para
// configuração". `env.ts` é arquivo da Onda 1 e NÃO expõe SMTP, caixa de leads,
// destino de alerta nem WhatsApp — e a mesma seção 2 proíbe uma onda editar
// arquivo de outra em `src/lib/`. Entre violar a propriedade de arquivo e
// abrir um segundo ponto de leitura, escolheu-se o segundo: este arquivo é o
// ÚNICO lugar da Onda 3c que toca `process.env`. Relatado ao maestro para que a
// Onda 4 unifique os dois, se for o caso.
//
// NENHUM VALOR PADRÃO DE NEGÓCIO EXISTE AQUI. Variável vazia significa "canal
// não configurado", nunca um endereço plausível: um e-mail ou número inventado
// não é detalhe estético, é um canal que recebe lead e o joga fora.

/** Estado de um canal que depende de dado que talvez ainda não exista. */
export type EstadoDoCanal =
  | { readonly configurado: true; readonly valor: string }
  | { readonly configurado: false; readonly perguntaAberta: string }

const ler = (nome: string): string => (process.env[nome] ?? '').trim()

const canal = (valor: string, perguntaAberta: string): EstadoDoCanal =>
  valor.length > 0 ? { configurado: true, valor } : { configurado: false, perguntaAberta }

// ---------------------------------------------------------------------------
// Canais diretos publicados na página (RF-220, 14.10)
// ---------------------------------------------------------------------------

/**
 * WhatsApp comercial, apenas dígitos com código do país.
 * Q-091: o número não foi fornecido, e a decisão entre linha própria e número
 * pessoal de um dos sócios não foi tomada.
 */
export const whatsappPublicado = (): EstadoDoCanal =>
  canal(
    ler('NEXT_PUBLIC_WHATSAPP_NUMERO').replace(/\D/g, ''),
    'Q-091 — número de WhatsApp comercial e horário de atendimento declarado',
  )

/**
 * E-mail institucional publicado como canal direto.
 *
 * AMBIGUIDADE REGISTRADA: `.env.example` declara `LEAD_INBOX_ADDRESS` como a
 * caixa compartilhada dos dois sócios (PR-021) e não declara uma variável
 * separada para o endereço EXIBIDO ao público. Como 14.5 trata as duas coisas
 * como a mesma caixa e nenhuma variável nova pode ser inventada aqui, o
 * endereço publicado é o mesmo da caixa de leads. Q-063 / Q-031 precisam
 * confirmar se são de fato o mesmo endereço.
 */
export const emailPublicado = (): EstadoDoCanal =>
  canal(
    ler('LEAD_INBOX_ADDRESS'),
    'Q-031 / Q-063 — e-mail institucional no domínio próprio ainda não criado',
  )

// ---------------------------------------------------------------------------
// Entrega das solicitações (RF-129, RF-130, RNF-092)
// ---------------------------------------------------------------------------

export type ConfiguracaoDeEntrega = {
  readonly remetente: string
  readonly nomeDoRemetente: string
  readonly caixaDeLeads: string
  readonly destinoDeAlerta: string
  readonly webhookDeAlerta: string
  readonly smtp: {
    readonly host: string
    readonly porta: number
    readonly tlsImplicito: boolean
    readonly usuario: string
    readonly senha: string
  }
  /** Falta algum dado sem o qual nenhuma mensagem pode sair. */
  readonly completa: boolean
  /** Nomes das variáveis ausentes. Vai para o alerta, nunca para a tela. */
  readonly ausentes: readonly string[]
}

export const configuracaoDeEntrega = (): ConfiguracaoDeEntrega => {
  const remetente = ler('EMAIL_FROM_ADDRESS')
  const caixaDeLeads = ler('LEAD_INBOX_ADDRESS')
  const host = ler('SMTP_HOST')

  const ausentes: string[] = []
  if (remetente === '') ausentes.push('EMAIL_FROM_ADDRESS')
  if (caixaDeLeads === '') ausentes.push('LEAD_INBOX_ADDRESS')
  if (host === '') ausentes.push('SMTP_HOST')

  const portaBruta = Number.parseInt(ler('SMTP_PORT'), 10)

  return {
    remetente,
    nomeDoRemetente: ler('EMAIL_FROM_NAME'),
    caixaDeLeads,
    destinoDeAlerta: ler('ALERT_EMAIL_ADDRESS'),
    webhookDeAlerta: ler('ALERT_WEBHOOK_URL'),
    smtp: {
      host,
      porta: Number.isFinite(portaBruta) ? portaBruta : 0,
      tlsImplicito: ler('SMTP_SECURE').toLowerCase() === 'true',
      usuario: ler('SMTP_USER'),
      senha: ler('SMTP_PASSWORD'),
    },
    completa: ausentes.length === 0,
    ausentes,
  }
}

/**
 * Segredo usado para assinar o token de origem do formulário (14.6, camada 3).
 * Reaproveita `PAYLOAD_SECRET` em vez de exigir uma variável nova que não está
 * em `.env.example`. Nunca sai do servidor (RNF-045).
 */
export const segredoDeAssinatura = (): string => {
  const valor = ler('PAYLOAD_SECRET')
  if (valor === '') {
    throw new Error(
      'PAYLOAD_SECRET ausente: sem ele o token de origem do formulário não pode ser assinado.',
    )
  }
  return valor
}

/**
 * Diretório do registro durável de solicitações (14.5, requisito 2).
 * Sufixo `.log` no arquivo é intencional: `.gitignore` (Onda 1) ignora `*.log`,
 * e é isso que impede dado pessoal de ser versionado por acidente.
 */
export const diretorioDoRegistro = (): string => {
  const configurado = ler('SOLICITACOES_DIR')
  return configurado !== '' ? configurado : 'var/solicitacoes'
}
