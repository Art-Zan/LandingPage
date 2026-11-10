// Dono: Onda 4c (4d-B amplia o que a 4c esboçou)
//
// Seed de desenvolvimento — `npm run seed`.
//
// Escopo da Onda 4d-B: cria o usuário administrador local (já fazia parte da
// Onda 4c) E o conteúdo provisório a partir de `content/_PLACEHOLDER/*.json`,
// alimentando as coleções `categorias`, `produtos`, `midia`, `paginas-institucionais`
// e o global `configuracao-do-site`. Cada bloco é gerado por bibliotecas sob
// `scripts/lib/` (`texto-placeholder.ts`, `imagem-placeholder.ts`) — nenhuma
// string de negócio é digitada neste arquivo.
//
// REGRAS QUE ESTE SCRIPT CUMPRE (não são negociáveis):
//  - IDEMPOTÊNCIA: se já existir um usuário administrador com SEED_ADMIN_EMAIL,
//    nada se cria na conta dele. Se já existir QUALQUER produto ou página
//    institucional com `placeholder: true` E status `published`, o seed inteiro
//    sai com sucesso (0) sem criar nada — repetição é detectada e respeitada.
//  - PRODUÇÃO: SITE_MODE=producao recusa o seed antes de tocar em qualquer
//    coisa (mesma regra já existente).
//  - SEM INVENÇÃO: nenhum CNPJ, razão social, endereço, telefone, e-mail,
//    preço, prazo, depoimento ou nome de cliente aparece em qualquer dado
//    produzido por este script. Texto vem de `textoPlaceholderLongo`/
//    `textoPlaceholderCurto`; imagem vem de `gerarImagemDePlaceholder`.
//
// PADRÃO DE BOOT: `./lib/carregar-env` é o primeiro import porque
// `payload.config.ts` lê `process.env` no momento do `buildConfig({...})`.
// Em ESM, imports estáticos irmãos são avaliados na ordem em que aparecem.
// Ver nota completa em `scripts/lib/carregar-env.ts`.

import './lib/carregar-env' // precisa ser o primeiro import — ver o arquivo

import { readFileSync } from 'node:fs'
import path from 'node:path'

import { getPayload, type Payload } from 'payload'

import config from '../src/payload.config'
import { ADMIN_USER_SLUG } from '../src/payload.config'
import {
  SLUG_CATEGORIAS,
  SLUG_MIDIA,
  SLUG_PAGINAS_INSTITUCIONAIS,
  SLUG_PRODUTOS,
  gerarSlug,
} from '../src/lib/slugs'

import { gerarImagemDePlaceholder } from './lib/imagem-placeholder'
import { richTextDeParagrafos, textoPlaceholderCurto, textoPlaceholderLongo } from './lib/texto-placeholder'

// -----------------------------------------------------------------------------
// Constantes do diretório de placeholders. Tudo o que vai para o banco vem de
// arquivos sob `content/_PLACEHOLDER/`. Os arquivos são lidos em tempo de
// execução (não importados via `import`) justamente para manter este seed fora
// do ciclo de compilação do frontend: a forma do JSON é estável e versionada;
// mudanças no banco não precisam passar pelo `tsc`.
// -----------------------------------------------------------------------------

const DIRETORIO_DE_PLACEHOLDER = path.resolve(process.cwd(), 'content/_PLACEHOLDER')

type CategoriaJson = {
  slug: string
  nome: string
}

type CategoriasArquivo = {
  _comentario: string
  categorias: CategoriaJson[]
}

type ModelosDeContratacao = 'assinatura-recorrente' | 'projeto-sob-encomenda'

type ProdutoJson = {
  slug: string
  nome: string
  nomeEstaAprovado: boolean
  dominio: string
  categoriaSlug: string
  modelosDeContratacao: ModelosDeContratacao[]
}

type ProdutosArquivo = {
  _comentario: string
  produtos: ProdutoJson[]
}

type BlocoDeTextoJson = {
  tipo: 'texto'
  titulo?: string | null
  paragrafos: string[]
}

type BlocoDeListaJson = {
  tipo: 'lista'
  titulo?: string | null
  itens: { titulo: string; texto?: string }[]
}

type BlocoDeChamadaJson = {
  tipo: 'chamada'
  titulo: string
  texto?: string
  rotuloDaAcao: string
  destino: string
}

type BlocoPaginaJson = BlocoDeTextoJson | BlocoDeListaJson | BlocoDeChamadaJson

type PaginaInstitucionalJson = {
  titulo: string
  indexavel: boolean
  blocos: BlocoPaginaJson[]
}

type PaginasInstitucionaisArquivo = {
  [chave: string]: PaginaInstitucionalJson
}

// -----------------------------------------------------------------------------
// Helpers de leitura
// -----------------------------------------------------------------------------

const lerJson = <T>(nomeDoArquivo: string): T => {
  const caminho = path.join(DIRETORIO_DE_PLACEHOLDER, nomeDoArquivo)
  const bruto = readFileSync(caminho, 'utf8')
  return JSON.parse(bruto) as T
}

const esperarVariavel = (nome: string): string => {
  const valor = process.env[nome]
  if (!valor || valor.trim() === '') {
    console.error(
      `[seed] Variável de ambiente obrigatória ausente: ${nome}. ` +
        'Copie .env.example para .env e preencha SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD e ' +
        'SEED_ADMIN_NOME antes de rodar `npm run seed`.',
    )
    process.exitCode = 1
    process.exit(1)
  }
  return valor
}

// -----------------------------------------------------------------------------
// Idempotência — verificada ANTES de qualquer criação.
// Se o seed já rodou uma vez, o estado publicado+placeholder está gravado e
// basta detectar um dos marcadores. Procurar em produto E página institucional
// é redundante por construção (só falta um dos dois para detectar qualquer
// execução prévia completa) e robusto se uma única coleção for zerada por
// engano.
// -----------------------------------------------------------------------------

const jaExisteConteudoProvisorioPublicado = async (payload: Payload): Promise<boolean> => {
  const encontradoEmProdutos = await payload.find({
    collection: SLUG_PRODUTOS,
    where: { and: [{ placeholder: { equals: true } }, { _status: { equals: 'published' } }] },
    limit: 1,
    depth: 0,
    pagination: false,
    overrideAccess: true,
  })
  if (encontradoEmProdutos.docs.length > 0) return true

  const encontradoEmPaginas = await payload.find({
    collection: SLUG_PAGINAS_INSTITUCIONAIS,
    where: { and: [{ placeholder: { equals: true } }, { _status: { equals: 'published' } }] },
    limit: 1,
    depth: 0,
    pagination: false,
    overrideAccess: true,
  })
  return encontradoEmPaginas.docs.length > 0
}

// -----------------------------------------------------------------------------
// Tradução dos blocos do JSON para o formato aceito por
// `src/lib/blocos-institucionais.ts` (Onda 2b). O JSON é a fonte da verdade
// editorial; este tradutor é a única ponte entre aquele arquivo e o Payload.
// -----------------------------------------------------------------------------

type BlocoInstitucional =
  | {
      blockType: 'blocoDeTexto'
      titulo?: string | null
      corpo: ReturnType<typeof richTextDeParagrafos>
    }
  | { blockType: 'blocoDeLista'; titulo?: string | null; itens: { titulo: string; texto?: string }[] }
  | {
      blockType: 'blocoDeChamada'
      titulo: string
      texto?: string
      rotuloDaAcao: string
      destino: string
    }

const traduzirBloco = (bloco: BlocoPaginaJson): BlocoInstitucional => {
  if (bloco.tipo === 'texto') {
    return {
      blockType: 'blocoDeTexto',
      titulo: bloco.titulo ?? undefined,
      corpo: richTextDeParagrafos(bloco.paragrafos),
    }
  }
  if (bloco.tipo === 'lista') {
    return {
      blockType: 'blocoDeLista',
      titulo: bloco.titulo ?? undefined,
      itens: bloco.itens.map((item) => ({ titulo: item.titulo, texto: item.texto })),
    }
  }
  // bloco.tipo === 'chamada'
  return {
    blockType: 'blocoDeChamada',
    titulo: bloco.titulo,
    texto: bloco.texto,
    rotuloDaAcao: bloco.rotuloDaAcao,
    destino: bloco.destino,
  }
}

const traduzirBlocos = (blocos: BlocoPaginaJson[]): BlocoInstitucional[] =>
  blocos.map(traduzirBloco)

// -----------------------------------------------------------------------------
// Etapas de criação. Cada uma é uma função assíncrona separada para manter a
// `main` legível e para que a falha de UMA etapa não seja silenciosa.
// -----------------------------------------------------------------------------

const criarAdministrador = async (payload: Payload): Promise<void> => {
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase() ?? ''
  const senha = process.env.SEED_ADMIN_PASSWORD ?? ''
  const nome = process.env.SEED_ADMIN_NOME ?? ''

  console.log('[seed] verificando usuário administrador existente...')
  const existentes = await payload.find({
    collection: ADMIN_USER_SLUG,
    where: { email: { equals: email } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  if (existentes.docs.length > 0) {
    const jaExiste = existentes.docs[0]
    if (!jaExiste) {
      throw new Error('Resultado inconsistente: docs[0] é `undefined` com `length > 0`.')
    }
    console.log(
      `[seed] já existe um usuário com e-mail "${email}" ` +
        `(id=${jaExiste.id}, nome="${jaExiste.nome}"). Nada a fazer — seed idempotente.`,
    )
    return
  }

  console.log('[seed] criando usuário administrador...')
  const criado = await payload.create({
    collection: ADMIN_USER_SLUG,
    data: { email, password: senha, nome },
    overrideAccess: true,
  })
  console.log(
    `[seed] usuário administrador criado (id=${criado.id}, email="${criado.email}", ` +
      `nome="${criado.nome}").`,
  )
}

/**
 * Cria uma categoria por entrada do `categorias.json` e devolve um mapa
 * `slug → id` para uso na etapa de produto.
 */
const criarCategorias = async (
  payload: Payload,
  arquivo: CategoriasArquivo,
): Promise<Map<string, number>> => {
  const mapa = new Map<string, number>()
  console.log(`[seed] criando ${arquivo.categorias.length} categoria(s)...`)
  for (const categoria of arquivo.categorias) {
    try {
      // Checagem de idempotência fina: se a categoria já existe (por slug),
      // reaproveita o id em vez de recriar. Importante porque rodar o seed
      // duas vezes com a guarda geral desligada (ambiente limpo) não pode
      // resultar em duplicatas — slug único é a defesa (SLUG_CATEGORIAS tem
      // unique=true no `campoSlug`).
      const existentes = await payload.find({
        collection: SLUG_CATEGORIAS,
        where: { slug: { equals: categoria.slug } },
        limit: 1,
        depth: 0,
        pagination: false,
        overrideAccess: true,
      })

      if (existentes.docs.length > 0) {
        const ja = existentes.docs[0]
        if (!ja) {
          throw new Error('Resultado inconsistente ao buscar categoria por slug.')
        }
        console.log(
          `[seed] categoria "${categoria.nome}" (slug=${categoria.slug}) já existia ` +
            `(id=${ja.id}); reaproveitada.`,
        )
        mapa.set(categoria.slug, ja.id)
        continue
      }

      const criada = await payload.create({
        collection: SLUG_CATEGORIAS,
        // TypeScript estrito do Payload 3 exige `slug` em `data` mesmo quando o
        // hook `campoSlug('nome')` o deriva. Passamos o slug derivado do `nome`
        // aqui para satisfazer o tipo; o hook sobrescreve esse valor durante
        // `beforeValidate` e `validarSlug` continua aplicando as regras.
        data: {
          nome: categoria.nome,
          slug: gerarSlug(categoria.nome),
          // slug é derivado do `nome` pelo hook `campoSlug` (Onda 2b).
          // Não passamos slug explícito; se a derivação falhar por algum motivo
          // o Payload recusaria com mensagem do `validarSlug`.
          visivelPublicamente: true,
          // descricaoCurta vazia por construção: 6.7 a torna obrigatória só
          // quando a categoria ganha URL própria (Fase 2, P-18).
        },
        draft: false,
        overrideAccess: true,
      })
      mapa.set(categoria.slug, criada.id)
      console.log(
        `[seed] categoria criada: "${criada.nome}" (slug=${criada.slug}, id=${criada.id}).`,
      )
    } catch (erro) {
      console.error(
        `[seed] falha ao criar categoria "${categoria.nome}" (slug=${categoria.slug}):`,
        erro,
      )
      throw erro
    }
  }
  return mapa
}

/**
 * Cria a mídia de placeholder para um produto e devolve o id da imagem
 * carregada. Upload programático no Payload 3 aceita o arquivo no formato
 * `{ data, file: { data, mimetype, name, size } }` — ver `payload.create`
 * com `collection: 'midia'` e `file` (esse é o nome do argumento, sem
 * conflito com `data.file`).
 *
 * Importante: o hook de `midia` (RNF-012) recusa arquivo com mais de 200 KB
 * depois da otimização. A imagem gerada por `gerarImagemDePlaceholder` é
 * propositalmente minimalista (1600×1000 px, paleta simples) e fica abaixo
 * desse teto depois do reprocessamento para webp em qualidade 78. Mesmo
 * assim, qualquer regressão aqui vai aparecer como 400 na resposta.
 */
const carregarMidiaDePlaceholder = async (
  payload: Payload,
  slug: string,
  dominio: string,
): Promise<number> => {
  const buffer = await gerarImagemDePlaceholder(dominio)
  const criada = await payload.create({
    collection: SLUG_MIDIA,
    data: {
      // Texto alternativo é obrigatório em `midia` (RF-187) e existe só para
      // leitores de tela. Como não inventamos dado, declaramos honestamente
      // o que está sendo visto.
      alt: `Imagem provisória do domínio ${dominio} — gerada por scripts/lib/imagem-placeholder.ts`,
    },
    file: {
      data: buffer,
      mimetype: 'image/png',
      name: `placeholder-${slug}.png`,
      size: buffer.length,
    },
    overrideAccess: true,
  })
  return criada.id as number
}

/**
 * Cria um produto por entrada do `produtos.json`. Cada produto exige no
 * mínimo três funcionalidades, três benefícios, uma categoria e uma imagem
 * de destaque (RF-062, RNF-082, PR-057). Os textos vêm todos dos helpers de
 * placeholder — zero redação local.
 */
const criarProdutos = async (
  payload: Payload,
  arquivo: ProdutosArquivo,
  categoriaIds: Map<string, number>,
): Promise<void> => {
  console.log(`[seed] criando ${arquivo.produtos.length} produto(s)...`)
  for (const produto of arquivo.produtos) {
    const categoriaId = categoriaIds.get(produto.categoriaSlug)
    if (!categoriaId) {
      throw new Error(
        `Produto "${produto.slug}" referencia categoriaSlug "${produto.categoriaSlug}" ` +
          'que não consta em categorias.json nem foi criada. Seed inconsistente — ' +
          'verifique o manifesto em content/_PLACEHOLDER/.',
      )
    }

    try {
      console.log(`[seed] gerando imagem de destaque para "${produto.slug}"...`)
      const imagemId = await carregarMidiaDePlaceholder(payload, produto.slug, produto.dominio)
      console.log(
        `[seed] mídia de ${produto.slug} criada (id=${imagemId}, ` +
          `${produto.modelosDeContratacao.length} modelo(s) de contratação).`,
      )

      // piso de publicação (PR-057, RF-062, RF-070): problemaQueResolve >= 400
      // caracteres, descricaoCompleta >= 500. textoPlaceholderLongo aplica
      // margem de 10% e nunca escreve menos que o mínimo pedido.
      const problemaLongo = textoPlaceholderLongo(produto.dominio, 400)
      const descricaoLonga = textoPlaceholderLongo(produto.dominio, 500)

      const funcionalidades = [1, 2, 3].map((indice) => ({
        titulo: `Funcionalidade ${indice}`,
        // 40 caracteres mínimo por funcionalidade (PR-057); textoPlaceholderCurto
        // garante o piso com margem e nunca inventa conteúdo.
        descricao: textoPlaceholderCurto(`funcionalidade ${indice} de ${produto.slug}`, 40),
      }))

      const beneficios = [1, 2, 3].map((indice) => ({
        // 30 caracteres mínimo por benefício (PR-057).
        texto: textoPlaceholderCurto(`benefício ${indice} de ${produto.slug}`, 30),
      }))

      const resumo = textoPlaceholderCurto(`resumo do produto ${produto.slug}`, 0)
      const publicoAlvo = textoPlaceholderCurto(`público-alvo do produto ${produto.slug}`, 0)

      const criado = await payload.create({
        collection: SLUG_PRODUTOS,
        // TypeScript estrito do Payload 3 exige `slug` em `data` mesmo quando o
        // hook `campoSlug('nome')` o deriva. Passamos o slug derivado do `nome`
        // aqui para satisfazer o tipo; o hook sobrescreve esse valor durante
        // `beforeValidate` e `validarSlug` continua aplicando as regras.
        data: {
          nome: produto.nome,
          slug: gerarSlug(produto.nome),
          resumoUmaLinha: resumo,
          problemaQueResolve: richTextDeParagrafos([problemaLongo]),
          descricaoCompleta: richTextDeParagrafos([descricaoLonga]),
          publicoAlvo,
          funcionalidades,
          beneficios,
          categorias: [categoriaId],
          modeloDeContratacao: produto.modelosDeContratacao,
          imagemDestaque: imagemId,
          destaqueNaInicial: false,
          // ordemDeDestaque não é obrigatória e não tem efeito quando
          // destaqueNaInicial é false — `null` é a melhor representação.
          ordemDeDestaque: null,
          placeholder: true,
          _status: 'published',
          // seoTitulo / seoDescricao propositadamente AUSENTES. Em
          // `src/lib/seo-automatico.ts` (Onda 2b) campo vazio significa
          // automático — derivar a partir de nome + resumo na leitura. Gravar
          // valor derivado congelaria o texto no nome atual.
        },
        draft: false,
        overrideAccess: true,
      })

      console.log(
        `[seed] produto criado: "${criado.nome}" (slug=${criado.slug}, id=${criado.id}, ` +
          `placeholder=${Boolean(criado.placeholder)}, status=${criado._status ?? 'draft'}).`,
      )
    } catch (erro) {
      console.error(`[seed] falha ao criar produto "${produto.slug}":`, erro)
      throw erro
    }
  }
}

/**
 * Cria cada página institucional a partir de `paginas-institucionais.json`.
 * Sem estado `_status` explícito: o hook `recusarPlaceholderPublicadoEmProducao`
 * não recusa em homolog (e este seed recusa em produção inteira), então
 * publicamos direto. O `campoPlaceholder()` escreve `placeholder: true`
 * automaticamente — o registro nasce marcado.
 *
 * Importante: `indexavel` é campo plain no modelo (não localizado). Quando o
 * texto jurídico de D-16 chegar, basta preencher o conteúdo real, desmarcar
 * `placeholder` e (se for o caso) marcar `indexavel: true`. Hoje, conforme o
 * despacho, `privacidade` e `termos` ficam `indexavel: true` mesmo sem texto
 * — a Onda 3a previne que apareçam no sitemap enquanto estiverem em rascunho,
 * e em homologação elas entram como placeholder visível.
 */
const criarPaginasInstitucionais = async (
  payload: Payload,
  arquivo: PaginasInstitucionaisArquivo,
): Promise<void> => {
  const chaves = Object.keys(arquivo).filter((chave) => chave !== '_comentario')
  console.log(`[seed] criando ${chaves.length} página(s) institucional(is)...`)
  for (const chave of chaves) {
    const pagina = arquivo[chave]
    if (!pagina) continue

    try {
      const criada = await payload.create({
        collection: SLUG_PAGINAS_INSTITUCIONAIS,
        data: {
          // `slug` é derivado do `titulo` pelo hook `campoSlug('titulo')`.
          // Para `inicio`, `sobre`, `catalogo`, `privacidade`, `termos`, o slug
          // derivado do título pode divergir do que se espera ("Início" → "inicio"
          // funciona; "Sobre a ArtZan" viraria "sobre-a-artzan", não "sobre").
          // Como a única fonte de verdade editorial hoje é este JSON, passamos
          // o slug explicitamente — assim a rota `/sobre` etc. funciona como
          // 3b espera. Esta decisão é coerente com PRD 6.4 (que fixa esses
          // endereços como oficiais).
          slug: chave,
          titulo: pagina.titulo,
          corpo: traduzirBlocos(pagina.blocos),
          indexavel: pagina.indexavel,
          placeholder: true,
          _status: 'published',
          // SEO título/descrição vazios: derivação automática (Onda 2b).
        },
        draft: false,
        overrideAccess: true,
      })
      console.log(
        `[seed] página institucional criada: "${criada.titulo}" ` +
          `(slug=${criada.slug}, id=${criada.id}, indexavel=${Boolean(criada.indexavel)}).`,
      )
    } catch (erro) {
      console.error(`[seed] falha ao criar página institucional "${chave}":`, erro)
      throw erro
    }
  }
}

/**
 * Garante que o global `configuracao-do-site` exista e esteja VAZIO no campo
 * `identificacaoDaEmpresa` — Q-053 / Q-086 continuam adiados (16.6), e este
 * script não é o lugar de preenchê-los. Atualização em vez de criação é o que
 * preserva qualquer valor legítimo que o cliente tenha inserido via painel
 * entre execuções do seed.
 */
const garantirConfiguracaoDoSite = async (payload: Payload): Promise<void> => {
  console.log('[seed] verificando global "configuracao-do-site"...')
  try {
    const existentes = await payload.findGlobal({
      slug: 'configuracao-do-site',
      depth: 0,
      overrideAccess: true,
    })

    if (existentes) {
      // atualização idempotente: se por algum motivo a identificação foi
      // preenchida (cliente operando pelo painel), não tocamos nela. Só
      // garantimos que o texto padrão esteja vazio como combinado.
      await payload.updateGlobal({
        slug: 'configuracao-do-site',
        data: {
          textoPadraoDeContratacao:
            existentes.textoPadraoDeContratacao && existentes.textoPadraoDeContratacao !== ''
              ? existentes.textoPadraoDeContratacao
              : '',
          // identificacaoDaEmpresa intencionalmente AUSENTE: preserva o valor
          // atual (inclusive se o cliente já tiver preenchido) sem sobrescrevê-lo
          // com nada.
        },
        overrideAccess: true,
      })
      console.log('[seed] global "configuracao-do-site" já existia — atualizado em modo idempotente.')
      return
    }

    await payload.updateGlobal({
      slug: 'configuracao-do-site',
      data: {
        textoPadraoDeContratacao: '',
        identificacaoDaEmpresa: {
          razaoSocial: '',
          cnpj: '',
          endereco: '',
        },
      },
      overrideAccess: true,
    })
    console.log('[seed] global "configuracao-do-site" criado VAZIO (Q-053 segue adiado).')
  } catch (erro) {
    console.error('[seed] falha ao garantir o global "configuracao-do-site":', erro)
    throw erro
  }
}

// -----------------------------------------------------------------------------
// Função principal
// -----------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log('[seed] lendo ambiente...')

  if (process.env.SITE_MODE === 'producao') {
    console.error(
      '[seed] RECUSADO: SITE_MODE="producao". Semear banco em produção é erro grave — ' +
        'este script é exclusivo de desenvolvimento local. Se você quer executar o seed ' +
        'mesmo assim, alterne SITE_MODE para "homolog" antes de rodar.',
    )
    process.exitCode = 1
    return
  }

  // Variáveis são validadas agora (depois da recusa de produção). Tudo o que
  // vier adiante usa só o usuário administrador como pivô da idempotência.
  esperarVariavel('SEED_ADMIN_EMAIL')
  esperarVariavel('SEED_ADMIN_PASSWORD')
  esperarVariavel('SEED_ADMIN_NOME')

  if (process.env.DB_ADAPTER !== 'sqlite') {
    console.log(
      `[seed] DB_ADAPTER="${process.env.DB_ADAPTER ?? 'postgres'}" — o seed funciona nos dois ` +
        'adaptadores, mas em Postgres exige o banco já no ar (DATABASE_URI alcançável).',
    )
  } else {
    console.log('[seed] DB_ADAPTER="sqlite" — usando o arquivo SQLite local.')
  }

  console.log('[seed] inicializando Payload...')
  const payload = await getPayload({ config })

  // Guarda geral de idempotência. Se já existe QUALQUER produto ou página
  // institucional com placeholder+publicado, considera-se o seed já executado
  // e aborta tudo com sucesso (0). Esta verificação vem antes da criação do
  // administrador e das outras etapas: rodar `npm run seed` duas vezes é
  // seguro, e rodar depois de uma limpeza parcial é seguro também (cada
  // etapa individual checa sua própria duplicata).
  console.log('[seed] verificando idempotência geral (placeholder+publicado)...')
  if (await jaExisteConteudoProvisorioPublicado(payload)) {
    console.log(
      '[seed] já existe conteúdo provisório (placeholder+publicado) no banco — ' +
        'seed considera-se concluído. Nada a criar.',
    )
    console.log('[seed] concluído.')
    return
  }

  await criarAdministrador(payload)

  console.log('[seed] lendo manifestos de content/_PLACEHOLDER/...')
  const arquivoCategorias = lerJson<CategoriasArquivo>('categorias.json')
  const arquivoProdutos = lerJson<ProdutosArquivo>('produtos.json')
  const arquivoPaginas = lerJson<PaginasInstitucionaisArquivo>('paginas-institucionais.json')

  const categoriaIds = await criarCategorias(payload, arquivoCategorias)
  await criarProdutos(payload, arquivoProdutos, categoriaIds)
  await criarPaginasInstitucionais(payload, arquivoPaginas)
  await garantirConfiguracaoDoSite(payload)

  console.log('[seed] concluído.')
}

main().catch((erro: unknown) => {
  console.error('[seed] Falha ao executar o seed:', erro)
  process.exitCode = 1
})
