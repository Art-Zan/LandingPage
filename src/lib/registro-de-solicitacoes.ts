// Dono: Onda 3c
//
// Registro durável de solicitações — 14.5, requisito 2: "a solicitação é
// persistida em um registro do próprio site ANTES de ser encaminhada. Se a
// entrega falhar, o dado existe." É a metade "preserva os dados digitados" de
// RNF-092 do lado do servidor — a outra metade, do lado do visitante, é o
// componente de formulário nunca limpar o estado em caso de erro.
//
// Implementa: RF-128 (contexto), RF-129 (rastreabilidade e reprocessamento),
//   RF-124 (envio duplicado descartado no servidor), RNF-092 (preservação)
// Perguntas abertas: nenhuma — mecanismo técnico.
//
// SERVIDOR APENAS. Usa `node:fs`. Nunca importado por um componente de tela.
//
// POR QUE ARQUIVO E NÃO BANCO: 14.5 decide a caixa de e-mail como destino, sem
// ferramenta de gestão comercial (Q-014, PR-021); criar uma tabela de leads no
// Payload seria exatamente a "gestão de leads no painel" que este projeto
// (task da Onda 3c) veta explicitamente. O arquivo cumpre o requisito 2 de
// 14.5 — "registro independente do canal de entrega" — sem introduzir a
// superfície de administração que a decisão do cliente recusou.
//
// FORMATO: JSON Lines (`.log`, ignorado por `.gitignore` — Onda 1) — um
// objeto por linha, apenas acrescentado (`appendFile`), nunca reescrito. Um
// ledger que só cresce sobrevive a escrita concorrente de um jeito que
// reescrever o arquivo inteiro não sobrevive, e preserva o histórico de
// status em vez de apagar o estado anterior.

import { randomUUID } from 'node:crypto'
import { appendFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'

import type { ContextoDeOrigem, DadosDoFormulario } from './contato-contrato'
import { diretorioDoRegistro } from './configuracao-contato'

export type StatusDaSolicitacao =
  | 'recebida'
  | 'entregue'
  | 'confirmacao-nao-entregue'
  | 'falha-de-envio'
  | 'descartada-antispam'

export type RegistroInicial = {
  tipo: 'solicitacao'
  id: string
  dataHora: string
  dados: DadosDoFormulario
  contexto: ContextoDeOrigem
  status: StatusDaSolicitacao
}

export type RegistroDeAtualizacao = {
  tipo: 'atualizacao'
  id: string
  dataHora: string
  status: StatusDaSolicitacao
  detalhe?: string
}

const CAMINHO_DO_ARQUIVO_DE_SOLICITACOES = (): string =>
  join(diretorioDoRegistro(), 'solicitacoes.log')

const garantirDiretorio = async (): Promise<void> => {
  await mkdir(diretorioDoRegistro(), { recursive: true })
}

const acrescentarLinha = async (caminho: string, registro: unknown): Promise<void> => {
  await garantirDiretorio()
  await appendFile(caminho, `${JSON.stringify(registro)}\n`, { encoding: 'utf8' })
}

/**
 * Registra a solicitação ANTES de qualquer tentativa de entrega (14.5,
 * requisito 2). Devolve o identificador que acompanha a solicitação daqui em
 * diante — no e-mail interno (RF-129), no alerta de falha (RNF-092) e em
 * qualquer atualização de status.
 */
export const registrarSolicitacao = async (
  dados: DadosDoFormulario,
  contexto: ContextoDeOrigem,
): Promise<string> => {
  const id = randomUUID()
  const registro: RegistroInicial = {
    tipo: 'solicitacao',
    id,
    dataHora: new Date().toISOString(),
    dados,
    contexto,
    status: 'recebida',
  }
  await acrescentarLinha(CAMINHO_DO_ARQUIVO_DE_SOLICITACOES(), registro)
  return id
}

/** Acrescenta uma atualização de status. Nunca reescreve nem apaga a linha original. */
export const atualizarStatusDaSolicitacao = async (
  id: string,
  status: StatusDaSolicitacao,
  detalhe?: string,
): Promise<void> => {
  const registro: RegistroDeAtualizacao = {
    tipo: 'atualizacao',
    id,
    dataHora: new Date().toISOString(),
    status,
    ...(detalhe !== undefined ? { detalhe } : {}),
  }
  await acrescentarLinha(CAMINHO_DO_ARQUIVO_DE_SOLICITACOES(), registro)
}

// ---------------------------------------------------------------------------
// RF-124 — "envios idênticos do mesmo remetente em janela curta são
// descartados no servidor". Guarda em memória do processo: suficiente para o
// volume baixo previsto (PR-002); um reinício apenas esquece envios recentes,
// o que no pior caso deixa passar uma duplicata (nunca bloqueia uma
// submissão legítima nova).
// ---------------------------------------------------------------------------

const JANELA_DE_DUPLICIDADE_MS = 2 * 60 * 1000 // 2 minutos

const assinaturasRecentes = new Map<string, number>()

const assinaturaDe = (dados: Pick<DadosDoFormulario, 'email' | 'mensagem'>): string =>
  `${dados.email.trim().toLowerCase()}::${dados.mensagem.trim().toLowerCase()}`

const expurgarAntigas = (agora: number): void => {
  for (const [assinatura, quando] of assinaturasRecentes) {
    if (agora - quando > JANELA_DE_DUPLICIDADE_MS) assinaturasRecentes.delete(assinatura)
  }
}

/** Este exato par (e-mail, mensagem) já foi submetido nos últimos minutos? */
export const ehEnvioDuplicado = (dados: Pick<DadosDoFormulario, 'email' | 'mensagem'>): boolean => {
  const agora = Date.now()
  expurgarAntigas(agora)
  const quando = assinaturasRecentes.get(assinaturaDe(dados))
  return quando !== undefined && agora - quando <= JANELA_DE_DUPLICIDADE_MS
}

/** Registra a assinatura do envio aceito, para detectar repetições subsequentes. */
export const registrarAssinaturaDeEnvio = (
  dados: Pick<DadosDoFormulario, 'email' | 'mensagem'>,
): void => {
  assinaturasRecentes.set(assinaturaDe(dados), Date.now())
}

// ---------------------------------------------------------------------------
// Alerta — canal que PRECISA funcionar com zero serviço externo contratado
// (RNF-092, RNF-091, CA-16). O arquivo local é essa garantia: não depende de
// SMTP nem de webhook configurados, só do sistema de arquivos do próprio
// servidor onde a aplicação já está rodando.
// ---------------------------------------------------------------------------

export type RegistroDeAlerta = {
  dataHora: string
  idDaSolicitacao?: string
  mensagem: string
  detalhe?: Record<string, unknown>
}

const CAMINHO_DO_ARQUIVO_DE_ALERTAS = (): string => join(diretorioDoRegistro(), 'alertas.log')

/**
 * Grava o alerta no arquivo local. Chamada SEMPRE por `src/lib/alerta.ts`,
 * independentemente de webhook ou e-mail de alerta estarem configurados ou
 * terem funcionado — é o canal que nunca falha por falta de configuração
 * externa.
 */
export const registrarAlertaLocal = async (registro: Omit<RegistroDeAlerta, 'dataHora'>): Promise<void> => {
  const completo: RegistroDeAlerta = { dataHora: new Date().toISOString(), ...registro }
  await acrescentarLinha(CAMINHO_DO_ARQUIVO_DE_ALERTAS(), completo)
}

// ---------------------------------------------------------------------------
// Ocorrência de antispam — RF-126: "o envio é descartado SEM CRIAR LEAD";
// 14.6, camada 6: "registra ocorrência internamente para revisão". Por isso
// esta gravação vive num arquivo PRÓPRIO (`spam.log`), nunca em
// `solicitacoes.log`: registrar ali seria, na prática, criar o lead que o
// requisito proíbe.
// ---------------------------------------------------------------------------

const CAMINHO_DO_ARQUIVO_DE_SPAM = (): string => join(diretorioDoRegistro(), 'spam.log')

export type RegistroDeOcorrenciaDeSpam = {
  dataHora: string
  motivo: string
  origem: string
}

export const registrarOcorrenciaDeSpam = async (motivo: string, origem: string): Promise<void> => {
  const registro: RegistroDeOcorrenciaDeSpam = { dataHora: new Date().toISOString(), motivo, origem }
  await acrescentarLinha(CAMINHO_DO_ARQUIVO_DE_SPAM(), registro)
}
