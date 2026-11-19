// Dono: Onda 5 (marca, capa e movimento — 2026-11-13)
//
// 11.11 — o wordmark em texto trata a marca em caixa alta com uma única
// letra em destaque ("Z"). Derivado do nome recebido (NOME_DA_MARCA, de
// src/lib/rotulos.ts) em vez de um literal, para que o nome nunca exista
// duas vezes no código (RNF-074). Antes, a mesma função vivia copiada no
// cabeçalho e no rodapé; a capa da inicial seria a terceira cópia.

export type PartesDoWordmark = { antes: string; z: string; depois: string }

export const partirWordmark = (nome: string): PartesDoWordmark => {
  const emCaixaAlta = nome.toUpperCase()
  const indiceDoZ = emCaixaAlta.indexOf('Z')
  if (indiceDoZ === -1) return { antes: emCaixaAlta, z: '', depois: '' }
  return {
    antes: emCaixaAlta.slice(0, indiceDoZ),
    z: emCaixaAlta.slice(indiceDoZ, indiceDoZ + 1),
    depois: emCaixaAlta.slice(indiceDoZ + 1),
  }
}
