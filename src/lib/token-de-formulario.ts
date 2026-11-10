// Dono: Onda 3c
//
// Token de origem do formulário — 14.6, camada 3: "vinculado à sessão, de uso
// único e validade limitada; impede envio direto ao destino sem passar pela
// página. A expiração precisa ser longa e recuperável sem perda de dados
// (13.6, regra 13)".
//
// Implementa: RF-126 (ponto de extensão de antispam, camada 3)
// Perguntas abertas: nenhuma — mecanismo técnico, sem dado de negócio.
//
// SERVIDOR APENAS: usa `node:crypto`. Nunca importado por `contato-contrato.ts`
// (que precisa continuar seguro para o cliente) nem por um componente `'use client'`.
//
// DESENHO: o token carrega o instante da emissão, assinado por HMAC com
// `PAYLOAD_SECRET` (reaproveitado — `src/lib/env.ts` não expõe segredo novo,
// e abrir um segundo seria inventar configuração fora de `.env.example`).
// O mesmo timestamp resolve DUAS camadas com um único valor: a camada 3
// (prova de que o token veio da renderização da página, não de uma chamada
// direta ao endpoint) e a camada 2 (tempo mínimo de preenchimento), que é
// simplesmente "agora − emitidoEm".
//
// USO ÚNICO — LIMITAÇÃO REGISTRADA: aplicar uso único de verdade exigiria um
// registro compartilhado entre requisições (banco ou fila), que este fluxo
// deliberadamente não tem (14.5: leads vão para e-mail, não para o banco).
// A mitigação adotada é um cache em memória do processo, com expurgo por
// tempo — suficiente para o volume baixo previsto (PR-002) e para as camadas
// 4 (limitação de taxa) e 6 (triagem manual) absorverem o resíduo. Se o
// processo reiniciar, o cache reseta — efeito equivalente a "nenhum token
// usado ainda", nunca a "todos os tokens usados", então um reinício nunca
// bloqueia visitante legítimo. Registrado ao maestro como residual, não como
// corte: RF-126 não exige uso único perfeito, só o ponto de extensão.

import { createHmac, timingSafeEqual } from 'node:crypto'

import { segredoDeAssinatura } from './configuracao-contato'

/** Validade máxima do token — longa o bastante para não punir preenchimento lento (13.6 regra 13). */
const VALIDADE_MAXIMA_MS = 4 * 60 * 60 * 1000 // 4 horas

const assinar = (base: string): string =>
  createHmac('sha256', segredoDeAssinatura()).update(base).digest('hex')

/** Emite um token novo, vinculado ao instante da renderização da página. */
export const emitirToken = (): string => {
  const emitidoEm = Date.now().toString(36)
  return `${emitidoEm}.${assinar(emitidoEm)}`
}

export type ResultadoDoToken =
  | { valido: true; emitidoEm: number }
  | { valido: false; motivo: 'formato' | 'assinatura' | 'expirado' }

const jaUsados = new Map<string, number>()

const expurgarUsados = (agora: number): void => {
  for (const [token, expiraEm] of jaUsados) {
    if (expiraEm <= agora) jaUsados.delete(token)
  }
}

/**
 * Valida o token, sem consumi-lo — quem chama decide o momento de marcar uso
 * (só depois que as demais camadas de antispam também passarem).
 */
export const validarToken = (token: string): ResultadoDoToken => {
  const partes = token.split('.')
  if (partes.length !== 2 || partes[0] === '' || partes[1] === '') {
    return { valido: false, motivo: 'formato' }
  }
  const [baseBruta, assinatura] = partes as [string, string]
  const assinaturaEsperada = assinar(baseBruta)

  const bufferRecebido = Buffer.from(assinatura, 'hex')
  const bufferEsperado = Buffer.from(assinaturaEsperada, 'hex')
  if (
    bufferRecebido.length !== bufferEsperado.length ||
    !timingSafeEqual(bufferRecebido, bufferEsperado)
  ) {
    return { valido: false, motivo: 'assinatura' }
  }

  const emitidoEm = Number.parseInt(baseBruta, 36)
  if (!Number.isFinite(emitidoEm)) return { valido: false, motivo: 'formato' }

  const agora = Date.now()
  if (agora - emitidoEm > VALIDADE_MAXIMA_MS || emitidoEm > agora) {
    return { valido: false, motivo: 'expirado' }
  }

  return { valido: true, emitidoEm }
}

/** Token já foi usado nesta instância do processo (ver limitação acima)? */
export const tokenJaFoiUsado = (token: string): boolean => {
  expurgarUsados(Date.now())
  return jaUsados.has(token)
}

/** Marca o token como usado. Chamar só depois de decidido que o envio será processado. */
export const marcarTokenComoUsado = (token: string): void => {
  jaUsados.set(token, Date.now() + VALIDADE_MAXIMA_MS)
}
