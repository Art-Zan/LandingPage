// Dono: Onda 2b
//
// Regras que só valem NA TRANSIÇÃO PARA PUBLICADO. Rascunho incompleto é normal e
// precisa poder ser salvo (RF-070, RF-185, RF-193).
//
// Implementa: RF-070, RF-185, RF-186, RF-103 (bloqueio por autorização de marca),
// PR-014 (slug imutável), PR-057 (piso de conteúdo do produto), PR-010 (mínimo de
// dois produtos por solução), dev/CONVENCOES.md §7.4 (trava de placeholder).

import type { CollectionBeforeChangeHook, CollectionSlug } from 'payload'
import { APIError } from 'payload'

import { lerPropriedade, textoNaoVazio } from './campos-payload'
import { ehProducao } from './env'

const PUBLICADO = 'published'

const estaPublicando = (data: unknown): boolean => lerPropriedade(data, '_status') === PUBLICADO

/**
 * Junta o que veio na requisição com o que já estava gravado: uma gravação
 * parcial não pode simular pendência que não existe.
 */
const documentoCompleto = (data: unknown, originalDoc: unknown): Record<string, unknown> => ({
  ...(typeof originalDoc === 'object' && originalDoc !== null
    ? (originalDoc as Record<string, unknown>)
    : {}),
  ...(typeof data === 'object' && data !== null ? (data as Record<string, unknown>) : {}),
})

/**
 * Conta caracteres de texto de um campo, seja ele texto simples ou documento
 * Lexical. Só conta nós de texto: marcação e atributo não são conteúdo
 * redigido (PR-057).
 */
export const contarCaracteresDeTexto = (valor: unknown): number => {
  if (typeof valor === 'string') return valor.trim().length
  if (Array.isArray(valor)) {
    return valor.reduce<number>((total, item) => total + contarCaracteresDeTexto(item), 0)
  }
  if (typeof valor === 'object' && valor !== null) {
    const registro = valor as Record<string, unknown>
    let total = 0
    if (typeof registro.text === 'string') total += registro.text.trim().length
    if (registro.root !== undefined) total += contarCaracteresDeTexto(registro.root)
    if (Array.isArray(registro.children)) total += contarCaracteresDeTexto(registro.children)
    return total
  }
  return 0
}

const recusar = (pendencias: string[], cabecalho: string): void => {
  if (pendencias.length === 0) return
  const lista = pendencias.map((pendencia) => `- ${pendencia}`).join('\n')
  throw new APIError(
    `${cabecalho}\n${lista}\nSalve como rascunho e complete o que falta.`,
    400,
  )
}

const quantidadeDeVinculos = (valor: unknown): number => (Array.isArray(valor) ? valor.length : 0)

const objetos = (valor: unknown): Record<string, unknown>[] =>
  Array.isArray(valor)
    ? valor.filter(
        (item): item is Record<string, unknown> => typeof item === 'object' && item !== null,
      )
    : []

// ---------------------------------------------------------------------------
// Slug — PR-014 e 6.5, regra 3
// ---------------------------------------------------------------------------

/** Depois da primeira publicação o slug é compromisso público e não muda (PR-014). */
export const travarSlugAposPublicacao: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  const slugAnterior = lerPropriedade(originalDoc, 'slug')
  const slugNovo = lerPropriedade(data, 'slug')
  const jaPublicou = Boolean(lerPropriedade(originalDoc, 'dataDePublicacao'))
  if (
    jaPublicou &&
    textoNaoVazio(slugNovo) &&
    textoNaoVazio(slugAnterior) &&
    slugNovo !== slugAnterior
  ) {
    throw new APIError(
      `Slug imutável após a primeira publicação (PR-014). O endereço "${slugAnterior}" já é público; trocá-lo exige redirecionamento permanente decidido fora do painel.`,
      400,
    )
  }
  return data
}

/**
 * Conflito de slug recusa a gravação e exige resolução manual — nunca sufixo
 * numérico automático (6.5, regra 3). O `unique` do banco é a rede de segurança;
 * esta é a porta, e ela diz o que fazer.
 */
export const recusarSlugDuplicado: CollectionBeforeChangeHook = async ({
  collection,
  data,
  originalDoc,
  req,
}) => {
  const slug = lerPropriedade(data, 'slug')
  if (!textoNaoVazio(slug)) return data
  const idAtual = lerPropriedade(originalDoc, 'id')
  const encontrados = await req.payload.find({
    collection: collection.slug as CollectionSlug,
    depth: 0,
    limit: 2,
    pagination: false,
    req,
    where: { slug: { equals: slug } },
  })
  const conflito = encontrados.docs.find(
    (documento) => lerPropriedade(documento, 'id') !== idAtual,
  )
  if (conflito) {
    throw new APIError(
      `Conflito de slug: "${slug}" já pertence a outro registro desta coleção. Escolha outro slug manualmente — o sistema nunca acrescenta número ao final (6.5, regra 3).`,
      409,
    )
  }
  return data
}

// ---------------------------------------------------------------------------
// Datas automáticas e trava de placeholder
// ---------------------------------------------------------------------------

/** Grava a data da primeira publicação uma única vez (6.7). */
export const registrarDataDePublicacao: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  if (!estaPublicando(data)) return data
  const jaTem =
    lerPropriedade(data, 'dataDePublicacao') ?? lerPropriedade(originalDoc, 'dataDePublicacao')
  return {
    ...(data as Record<string, unknown>),
    dataDePublicacao: jaTem ?? new Date().toISOString(),
  }
}

/** dev/CONVENCOES.md §7.4: em produção, registro provisório não vira publicado. */
export const recusarPlaceholderPublicadoEmProducao: CollectionBeforeChangeHook = ({
  collection,
  data,
  originalDoc,
}) => {
  if (!ehProducao()) return data
  const documento = documentoCompleto(data, originalDoc)
  if (documento.placeholder === true && estaPublicando(data)) {
    throw new APIError(
      `Registro provisório não pode ser publicado em produção (dev/CONVENCOES.md §7.4). Coleção: ${collection.slug}. Substitua o conteúdo provisório e desmarque "placeholder" antes de publicar.`,
      400,
    )
  }
  return data
}

// ---------------------------------------------------------------------------
// Piso de conteúdo do produto — PR-057, RF-062, RF-070, RF-185
// ---------------------------------------------------------------------------

const PISO = {
  beneficios: 3,
  descricaoCompleta: 500,
  descricaoDeFuncionalidade: 40,
  funcionalidades: 3,
  problemaQueResolve: 400,
  textoDeBeneficio: 30,
  textoExclusivo: 1200,
} as const

export const validarPisoDeConteudoDoProduto: CollectionBeforeChangeHook = ({
  data,
  originalDoc,
}) => {
  if (!estaPublicando(data)) return data
  const produto = documentoCompleto(data, originalDoc)
  const pendencias: string[] = []

  if (!textoNaoVazio(produto.nome)) pendencias.push('Nome: obrigatório.')
  if (!textoNaoVazio(produto.resumoUmaLinha)) pendencias.push('Resumo de uma linha: obrigatório.')
  if (!textoNaoVazio(produto.publicoAlvo)) {
    pendencias.push('Para quem é (público-alvo): obrigatório.')
  }
  if (!produto.imagemDestaque) {
    pendencias.push(
      'Imagem de destaque: obrigatória, e precisa ser captura de tela real do produto (RF-041, Q-005).',
    )
  }
  if (quantidadeDeVinculos(produto.categorias) < 1) {
    pendencias.push('Categoria: ao menos uma (6.7).')
  }

  const caracteresDoProblema = contarCaracteresDeTexto(produto.problemaQueResolve)
  if (caracteresDoProblema < PISO.problemaQueResolve) {
    pendencias.push(
      `Problema que resolve: ${caracteresDoProblema} de ${PISO.problemaQueResolve} caracteres mínimos (PR-057).`,
    )
  }
  const caracteresDaDescricao = contarCaracteresDeTexto(produto.descricaoCompleta)
  if (caracteresDaDescricao < PISO.descricaoCompleta) {
    pendencias.push(
      `Descrição completa: ${caracteresDaDescricao} de ${PISO.descricaoCompleta} caracteres mínimos (PR-057).`,
    )
  }

  const funcionalidades = objetos(produto.funcionalidades)
  if (funcionalidades.length < PISO.funcionalidades) {
    pendencias.push(
      `Funcionalidades: ${funcionalidades.length} de ${PISO.funcionalidades} mínimas (RF-062).`,
    )
  }
  funcionalidades.forEach((funcionalidade, indice) => {
    if (!textoNaoVazio(funcionalidade.titulo)) {
      pendencias.push(`Funcionalidade ${indice + 1}: título obrigatório.`)
    }
    const tamanho = contarCaracteresDeTexto(funcionalidade.descricao)
    if (tamanho < PISO.descricaoDeFuncionalidade) {
      pendencias.push(
        `Funcionalidade ${indice + 1}: descrição com ${tamanho} de ${PISO.descricaoDeFuncionalidade} caracteres mínimos (PR-057).`,
      )
    }
  })

  const beneficios = objetos(produto.beneficios)
  if (beneficios.length < PISO.beneficios) {
    pendencias.push(`Benefícios: ${beneficios.length} de ${PISO.beneficios} mínimos (RF-062).`)
  }
  beneficios.forEach((beneficio, indice) => {
    const tamanho = contarCaracteresDeTexto(beneficio.texto)
    if (tamanho < PISO.textoDeBeneficio) {
      pendencias.push(
        `Benefício ${indice + 1}: ${tamanho} de ${PISO.textoDeBeneficio} caracteres mínimos (PR-057).`,
      )
    }
  })

  if (quantidadeDeVinculos(produto.modeloDeContratacao) === 0) {
    pendencias.push('Informações comerciais: escolha ao menos um modelo de contratação (Q-007).')
  }

  // Texto exclusivo da página: só o que é redigido para este produto. Os textos
  // padrão do catálogo (ausência de preço, chamada final) não são campos do
  // registro — PR-057, regra 3, fica atendida por construção.
  const textoExclusivo =
    contarCaracteresDeTexto(produto.resumoUmaLinha) +
    contarCaracteresDeTexto(produto.problemaQueResolve) +
    contarCaracteresDeTexto(produto.descricaoCompleta) +
    contarCaracteresDeTexto(produto.publicoAlvo) +
    contarCaracteresDeTexto(produto.funcionalidades) +
    contarCaracteresDeTexto(produto.beneficios)
  if (textoExclusivo < PISO.textoExclusivo) {
    pendencias.push(
      `Texto exclusivo da página: ${textoExclusivo} de ${PISO.textoExclusivo} caracteres mínimos, cerca de 200 palavras (PR-057).`,
    )
  }

  recusar(pendencias, 'Publicação recusada: o produto está abaixo do piso de conteúdo de PR-057.')
  return data
}

// ---------------------------------------------------------------------------
// Solução composta — PR-010, RF-084, RF-185
// ---------------------------------------------------------------------------

export const validarComposicaoDaSolucao: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  if (!estaPublicando(data)) return data
  const solucao = documentoCompleto(data, originalDoc)
  const pendencias: string[] = []

  const produtos = quantidadeDeVinculos(solucao.produtos)
  if (produtos < 2) {
    pendencias.push(
      `Produtos que compõem: ${produtos} vinculado(s), mínimo de 2 (PR-010). Com menos de dois não é solução composta — é produto relacionado.`,
    )
  }
  if (contarCaracteresDeTexto(solucao.ganhoDaCombinacao) === 0) {
    pendencias.push('Ganho da combinação: obrigatório e exclusivo da união dos produtos (RF-084).')
  }
  if (contarCaracteresDeTexto(solucao.necessidadeAtendida) === 0) {
    pendencias.push('Necessidade ou cenário atendido: obrigatório (6.7).')
  }
  recusar(pendencias, 'Publicação recusada: a solução não atende às regras de composição.')
  return data
}

// ---------------------------------------------------------------------------
// Parceiro — PR-018, RF-103
// ---------------------------------------------------------------------------

export const exigirAutorizacaoDeMarca: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  if (!estaPublicando(data)) return data
  const parceiro = documentoCompleto(data, originalDoc)
  const autorizacao = parceiro.autorizacaoDeUsoDeMarca
  const pendencias: string[] = []

  if (lerPropriedade(autorizacao, 'autorizada') !== true) {
    pendencias.push(
      'Autorização de uso de marca: sem autorização formal registrada, nenhum logotipo, nome ou descrição de parceiro é publicado (PR-018, RF-103).',
    )
  }
  if (!lerPropriedade(autorizacao, 'dataDaAutorizacao')) {
    pendencias.push('Autorização de uso de marca: informe a data em que foi concedida (RF-103).')
  }
  if (!textoNaoVazio(lerPropriedade(autorizacao, 'responsavel'))) {
    pendencias.push(
      'Autorização de uso de marca: informe quem a concedeu, do lado do parceiro (RF-103).',
    )
  }
  recusar(pendencias, 'Publicação recusada: marca de terceiro sem autorização registrada.')
  return data
}
