// Dono: Onda 3c
//
// Alerta operacional de falha de formulário — RNF-092: "toda falha no
// processamento ou entrega de um formulário gera alerta a um responsável
// operacional em até 15 minutos, além do erro mostrado ao visitante."
//
// Implementa: RNF-092, RF-129 (alerta em falha de entrega), RF-132
// Perguntas abertas: Q-091 (destino de e-mail e webhook de alerta ainda
//   podem não existir — ver `ausentes` no resultado de cada tentativa)
//
// SERVIDOR APENAS.
//
// GARANTIA CENTRAL, a que RNF-092 e o critério de aceite CA-16 exigem
// verificável: "o alerta continua funcionando mesmo sem qualquer
// monitoramento externo contratado". Por isso este módulo SEMPRE grava o
// alerta em `alertas.log` (sistema de arquivos local, zero serviço externo),
// e SÓ ALÉM DISSO tenta os canais configuráveis (webhook, e-mail) — cada um
// isolado em seu próprio `try/catch`, para que a falha de um nunca cancele os
// demais nem o registro local. Nenhum caminho deste módulo lança: quem chama
// recebe sempre um resultado, nunca uma exceção — alertar sobre uma falha não
// pode, ele mesmo, falhar em silêncio.

import { configuracaoDeEntrega } from './configuracao-contato'
import { registrarAlertaLocal } from './registro-de-solicitacoes'
import { enviarEmail } from './correio'

export type CanalDeAlerta = 'local' | 'webhook' | 'email'

export type ResultadoDoAlerta = {
  /** O canal que NUNCA falha por ausência de configuração externa (CA-16). */
  local: 'gravado' | 'falhou-ao-gravar'
  webhook: 'nao-configurado' | 'enviado' | 'falhou'
  email: 'nao-configurado' | 'enviado' | 'falhou'
}

export type DispararAlertaParametros = {
  mensagem: string
  idDaSolicitacao?: string
  detalhe?: Record<string, unknown>
}

/**
 * Dispara o alerta em todos os canais disponíveis. Nunca lança. O canal
 * local é tentado primeiro e é o único cuja falha (disco cheio, permissão)
 * seria, de fato, grave — os demais são estritamente adicionais.
 */
export const dispararAlerta = async ({
  mensagem,
  idDaSolicitacao,
  detalhe,
}: DispararAlertaParametros): Promise<ResultadoDoAlerta> => {
  const resultado: ResultadoDoAlerta = {
    local: 'falhou-ao-gravar',
    webhook: 'nao-configurado',
    email: 'nao-configurado',
  }

  try {
    await registrarAlertaLocal({ idDaSolicitacao, mensagem, detalhe })
    resultado.local = 'gravado'
  } catch {
    // Sem escalonamento possível a partir daqui: se nem o arquivo local
    // aceita a escrita, o ambiente tem um problema fora do alcance desta
    // função (disco, permissão). Registrado como o pior caso aceito por
    // RNF-092 — "só não é coberto se o site inteiro estiver fora do ar".
    resultado.local = 'falhou-ao-gravar'
  }

  const config = configuracaoDeEntrega()

  const webhook = config.webhookDeAlerta
  if (webhook !== '') {
    try {
      const resposta = await fetch(webhook, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ mensagem, idDaSolicitacao, detalhe, dataHora: new Date().toISOString() }),
        signal: AbortSignal.timeout(5_000),
      })
      resultado.webhook = resposta.ok ? 'enviado' : 'falhou'
    } catch {
      resultado.webhook = 'falhou'
    }
  }

  const destino = config.destinoDeAlerta
  // O alerta por e-mail depende do MESMO SMTP do envio de lead. Se o SMTP for
  // exatamente o que está falhando, este canal falha também — por isso ele
  // NUNCA é o único canal (o arquivo local acima sempre é tentado primeiro).
  if (destino !== '') {
    try {
      const envio = await enviarEmail({
        para: destino,
        assunto: `[Alerta ArtZan] ${mensagem}`,
        corpoTexto: [
          mensagem,
          idDaSolicitacao ? `Identificador da solicitação: ${idDaSolicitacao}` : undefined,
          detalhe ? JSON.stringify(detalhe, null, 2) : undefined,
        ]
          .filter(Boolean)
          .join('\n\n'),
      })
      resultado.email = envio.entregue ? 'enviado' : 'falhou'
    } catch {
      resultado.email = 'falhou'
    }
  }

  return resultado
}
