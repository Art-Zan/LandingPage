// Dono: Onda 3c
//
// Envio de e-mail por SMTP — transporte de RF-129 (lead), RF-130 (confirmação
// ao remetente) e do canal de e-mail de `src/lib/alerta.ts` (RNF-092).
//
// Implementa: RF-129, RF-130, RNF-092 (metade "alerta" via este transporte)
// Perguntas abertas: D-15 (hospedagem e provedor SMTP concreto ainda não
//   decididos) — `SMTP_HOST` vazio no scaffold é o estado real deste ambiente,
//   não um valor de exemplo.
//
// SERVIDOR APENAS. Usa `node:net`/`node:tls`.
//
// POR QUE UM CLIENTE SMTP PRÓPRIO EM VEZ DE UMA BIBLIOTECA: nenhuma biblioteca
// de e-mail está em `package.json` (Onda 1), e `dev/CONVENCOES.md` §2 reserva
// esse arquivo à Onda 1 — acrescentar dependência é pedido ao maestro, não
// decisão desta onda. A alternativa de abrir mão de envio real e só simular
// sucesso foi descartada: a instrução deste trabalho proíbe simular. Este
// módulo fala SMTP mínimo diretamente pelos módulos nativos do Node, o que
// mantém o envio real possível assim que `SMTP_HOST` for preenchido, sem
// depender de nova dependência.
//
// ESTADO REAL DESTE AMBIENTE: `SMTP_HOST` está vazio (não há serviço de
// e-mail configurado nesta máquina). Por isso o caminho efetivamente
// exercitado aqui — e o único que pôde ser demonstrado sem simular sucesso —
// é o de configuração incompleta, tratado ANTES de qualquer tentativa de rede
// (função `configuracaoDeEntrega().completa`, ver `configuracao-contato.ts`).
// O diálogo SMTP abaixo é código real, não simulação, mas não foi exercitado
// contra um servidor de verdade nesta sessão — reportado ao maestro.

import { connect as connectNet, type Socket } from 'node:net'
import { connect as connectTls, type TLSSocket } from 'node:tls'

import { configuracaoDeEntrega } from './configuracao-contato'

export type MensagemDeEmail = {
  para: string
  assunto: string
  corpoTexto: string
}

export type ResultadoDeEnvioDeEmail =
  | { entregue: true }
  | { entregue: false; motivo: 'nao-configurado'; ausentes: readonly string[] }
  | { entregue: false; motivo: 'rede' | 'tempo-esgotado' | 'servidor'; detalhe: string }

const TEMPO_LIMITE_TOTAL_MS = 15_000
const QUEBRA_DE_LINHA = '\r\n'

type LigacaoSmtp = { soquete: Socket | TLSSocket; encerrar: () => void }

/** Codifica o corpo em base64, para não depender de 7bit/8bit do canal (RFC 2045). */
const codificarCorpoBase64 = (texto: string): string => {
  const base64 = Buffer.from(texto, 'utf8').toString('base64')
  // Linhas de até 76 caracteres, exigência de MIME.
  return (base64.match(/.{1,76}/g) ?? []).join(QUEBRA_DE_LINHA)
}

const montarMensagemMime = (
  mensagem: MensagemDeEmail,
  remetente: string,
  nomeDoRemetente: string,
): string => {
  const dataAtual = new Date().toUTCString()
  const idDaMensagem = `<${Date.now()}.${Math.random().toString(36).slice(2)}@artzan>`
  const cabecalhos = [
    `From: ${nomeDoRemetente} <${remetente}>`,
    `To: ${mensagem.para}`,
    `Subject: ${mensagem.assunto}`,
    `Date: ${dataAtual}`,
    `Message-ID: ${idDaMensagem}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=utf-8',
    'Content-Transfer-Encoding: base64',
    'X-Auto-Response-Suppress: All', // transacional — nunca deve gerar resposta automática em cadeia
  ]
  return `${cabecalhos.join(QUEBRA_DE_LINHA)}${QUEBRA_DE_LINHA}${QUEBRA_DE_LINHA}${codificarCorpoBase64(
    mensagem.corpoTexto,
  )}`
}

/** Lê uma resposta SMTP completa (pode ter várias linhas com `-` após o código). */
const lerResposta = (soquete: Socket | TLSSocket): Promise<{ codigo: number; texto: string }> =>
  new Promise((resolver, rejeitar) => {
    let acumulado = ''
    const aoReceberDados = (pedaco: Buffer) => {
      acumulado += pedaco.toString('utf8')
      const linhas = acumulado.split(QUEBRA_DE_LINHA).filter(Boolean)
      const ultimaLinha = linhas[linhas.length - 1]
      if (ultimaLinha && /^\d{3} /.test(ultimaLinha)) {
        limpar()
        resolver({ codigo: Number.parseInt(ultimaLinha.slice(0, 3), 10), texto: acumulado })
      }
    }
    const aoDarErro = (erro: Error) => {
      limpar()
      rejeitar(erro)
    }
    const limpar = () => {
      soquete.off('data', aoReceberDados)
      soquete.off('error', aoDarErro)
    }
    soquete.on('data', aoReceberDados)
    soquete.on('error', aoDarErro)
  })

const enviarComando = async (
  soquete: Socket | TLSSocket,
  comando: string,
): Promise<{ codigo: number; texto: string }> => {
  soquete.write(`${comando}${QUEBRA_DE_LINHA}`)
  return lerResposta(soquete)
}

const abrirLigacao = (host: string, porta: number, tlsImplicito: boolean): Promise<LigacaoSmtp> =>
  new Promise((resolver, rejeitar) => {
    const aoConectar = () => {
      soquete.off('error', aoFalhar)
      resolver({ soquete, encerrar: () => soquete.destroy() })
    }
    const aoFalhar = (erro: Error) => rejeitar(erro)

    const soquete: Socket | TLSSocket = tlsImplicito
      ? connectTls({ host, port: porta, servername: host }, aoConectar)
      : connectNet({ host, port: porta }, aoConectar)

    soquete.once('error', aoFalhar)
  })

const elevarParaTls = (soquete: Socket, host: string): Promise<TLSSocket> =>
  new Promise((resolver, rejeitar) => {
    const soqueteTls = connectTls({ socket: soquete, servername: host }, () => resolver(soqueteTls))
    soqueteTls.once('error', rejeitar)
  })

/**
 * Envia uma mensagem transacional. Nunca lança: toda falha vira
 * `{ entregue: false, ... }`, para que o chamador sempre trate o resultado
 * explicitamente (RNF-092 exige isso — falha silenciosa é o defeito vetado).
 */
export const enviarEmail = async (mensagem: MensagemDeEmail): Promise<ResultadoDeEnvioDeEmail> => {
  const config = configuracaoDeEntrega()
  if (!config.completa) {
    return { entregue: false, motivo: 'nao-configurado', ausentes: config.ausentes }
  }

  let ligacao: LigacaoSmtp | undefined
  const temporizadorDeTempoLimite = new Promise<never>((_, rejeitar) => {
    setTimeout(() => rejeitar(new Error('tempo-limite-smtp')), TEMPO_LIMITE_TOTAL_MS)
  })

  try {
    await Promise.race([
      (async () => {
        ligacao = await abrirLigacao(config.smtp.host, config.smtp.porta, config.smtp.tlsImplicito)
        let soquete = ligacao.soquete

        await lerResposta(soquete) // saudação (220)

        let respostaEhlo = await enviarComando(soquete, `EHLO artzan-site`)

        if (!config.smtp.tlsImplicito) {
          await enviarComando(soquete, 'STARTTLS')
          soquete = await elevarParaTls(soquete as Socket, config.smtp.host)
          ligacao = { soquete, encerrar: () => soquete.destroy() }
          respostaEhlo = await enviarComando(soquete, `EHLO artzan-site`)
        }
        void respostaEhlo

        if (config.smtp.usuario && config.smtp.senha) {
          await enviarComando(soquete, 'AUTH LOGIN')
          await enviarComando(soquete, Buffer.from(config.smtp.usuario, 'utf8').toString('base64'))
          const respostaSenha = await enviarComando(
            soquete,
            Buffer.from(config.smtp.senha, 'utf8').toString('base64'),
          )
          if (respostaSenha.codigo >= 400) {
            throw new SmtpErroDeServidor(`Autenticação recusada: ${respostaSenha.texto.trim()}`)
          }
        }

        const respostaRemetente = await enviarComando(soquete, `MAIL FROM:<${config.remetente}>`)
        if (respostaRemetente.codigo >= 400) {
          throw new SmtpErroDeServidor(`Remetente recusado: ${respostaRemetente.texto.trim()}`)
        }

        const respostaDestinatario = await enviarComando(soquete, `RCPT TO:<${mensagem.para}>`)
        if (respostaDestinatario.codigo >= 400) {
          throw new SmtpErroDeServidor(`Destinatário recusado: ${respostaDestinatario.texto.trim()}`)
        }

        const respostaData = await enviarComando(soquete, 'DATA')
        if (respostaData.codigo >= 400) {
          throw new SmtpErroDeServidor(`Servidor recusou DATA: ${respostaData.texto.trim()}`)
        }

        const corpo = montarMensagemMime(mensagem, config.remetente, config.nomeDoRemetente)
        // Dot-stuffing (RFC 5321): linha que começa com "." recebe um "." extra.
        const corpoComEscape = corpo.replace(/^\./gm, '..')
        const respostaFinal = await enviarComando(soquete, `${corpoComEscape}${QUEBRA_DE_LINHA}.`)
        if (respostaFinal.codigo >= 400) {
          throw new SmtpErroDeServidor(`Servidor recusou a mensagem: ${respostaFinal.texto.trim()}`)
        }

        await enviarComando(soquete, 'QUIT')
      })(),
      temporizadorDeTempoLimite,
    ])

    return { entregue: true }
  } catch (erro) {
    if (erro instanceof SmtpErroDeServidor) {
      return { entregue: false, motivo: 'servidor', detalhe: erro.message }
    }
    if (erro instanceof Error && erro.message === 'tempo-limite-smtp') {
      return { entregue: false, motivo: 'tempo-esgotado', detalhe: erro.message }
    }
    return {
      entregue: false,
      motivo: 'rede',
      detalhe: erro instanceof Error ? erro.message : 'Falha de rede desconhecida.',
    }
  } finally {
    ligacao?.encerrar()
  }
}

class SmtpErroDeServidor extends Error {}
