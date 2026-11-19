// Onda 1 — esqueleto da configuração do Payload.
// PRD: 6.7 (modelo de conteúdo), RNF-046..049 e RNF-110 (acesso administrativo),
// RNF-070..077 (manutenibilidade), RNF-083 (reserva de idioma).
//
// ESCOPO DESTE ARQUIVO NA ONDA 1: apenas infraestrutura — adaptador de banco,
// editor, autenticação administrativa, geração de tipos e localização.
// NENHUMA coleção é definida aqui. Ver `collections` abaixo.

import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { ehProducao } from './lib/env'

// Coleções e globais — Onda 2b. Uma coleção por entidade de 6.7, mais a
// infraestrutura que o modelo exige (usuários do painel, mídia, taxonomia de
// tipos de parceria e a trilha de auditoria de RF-192).
import Categorias from './collections/Categorias'
import ItensDeConteudo from './collections/ItensDeConteudo'
import Midia from './collections/Midia'
import PaginasInstitucionais from './collections/PaginasInstitucionais'
import Parceiros from './collections/Parceiros'
import Produtos from './collections/Produtos'
import RegistrosDeAuditoria from './collections/RegistrosDeAuditoria'
import Solucoes from './collections/Solucoes'
import TiposDeParceria from './collections/TiposDeParceria'
import Usuarios from './collections/Usuarios'
import ConfiguracaoDoSite from './globals/ConfiguracaoDoSite'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * Slug da coleção de usuários administradores (os dois sócios — PR-023, RF-183).
 * A coleção em si é criada pela Onda 2b em `src/collections/Usuarios.ts`.
 * Exportado para que a Onda 2b use esta constante em vez de repetir a string.
 */
export const ADMIN_USER_SLUG = 'usuarios'

/**
 * Slug da coleção de mídia (RF-187, RNF-012, RNF-085).
 * Criada pela Onda 2b em `src/collections/Midia.ts`.
 */
export const MEDIA_SLUG = 'midia'

/**
 * Idiomas do conteúdo — RNF-083 / Q-011.
 * `pt-BR` é o único idioma publicado no MVP. `en` está DECLARADO e DESLIGADO:
 * existe para que os campos localizados tenham onde guardar o valor em inglês,
 * hoje vazio. Nada em inglês é publicado, roteado ou indexado no MVP — a garantia
 * está na camada de rota e no filtro de publicação, descritos em dev/CONVENCOES.md.
 */
export const LOCALE_PADRAO = 'pt-BR'
export const LOCALE_RESERVADO = 'en'

const requireEnv = (name: string): string => {
  const value = process.env[name]
  if (!value) {
    throw new Error(
      `Variável de ambiente obrigatória ausente: ${name}. Copie .env.example para .env.`,
    )
  }
  return value
}

// -----------------------------------------------------------------------------
// ADAPTADOR DE BANCO — Onda 4c, tarefa 1 do despacho da onda.
//
// O cliente escolheu PostgreSQL e ISSO NÃO MUDA: é o adaptador de produção e de
// homologação, e é o ÚNICO contra o qual uma verificação vale alguma coisa.
// Diferenças reais de esquema, tipo de coluna e comportamento entre adaptadores
// podem mascarar um problema que só aparece em Postgres — rodar em SQLite prova
// que o site FUNCIONA, nunca que ele funciona EM POSTGRES. Todo resultado obtido
// com `DB_ADAPTER=sqlite` precisa ser reconfirmado em Postgres antes de valer
// como evidência de pronto.
//
// SQLite existe só porque, nesta máquina de desenvolvimento, não há Docker, WSL
// nem Postgres instalado (dev/CONVENCOES.md, Onda 1: "npm run dev ainda não
// sobe"). `@payloadcms/db-sqlite` é adaptador OFICIAL do Payload 3, na mesma
// versão exata do restante do pacote (3.88.0) — não é solução paralela.
//
// SELEÇÃO: só por variável de ambiente explícita. Ausência de `DB_ADAPTER`
// escolhe Postgres, que é o padrão seguro — ninguém liga SQLite sem pedir.
//
// IMPOSSÍVEL LIGAR SQLITE EM PRODUÇÃO, por construção: `construirAdaptadorDeBanco`
// lê `SITE_MODE` (src/lib/env.ts, Onda 1) e LANÇA EXCEÇÃO antes mesmo de montar
// o adaptador, se alguém tentar `DB_ADAPTER=sqlite` com `SITE_MODE=producao`. Não
// é aviso nem log: o processo não sobe, nem em desenvolvimento local com
// `SITE_MODE=producao` setado por engano. Não existe outro caminho de código que
// monte o adaptador — `construirAdaptadorDeBanco()` é chamado uma única vez,
// diretamente no `db:` de `buildConfig` abaixo.
// -----------------------------------------------------------------------------

const DB_ADAPTER_PADRAO = 'postgres'
const DB_ADAPTER = (process.env.DB_ADAPTER ?? DB_ADAPTER_PADRAO).trim().toLowerCase()

/** Caminho do arquivo SQLite (fora do controle de versão — ver .gitignore). */
const caminhoDoArquivoSqlite = (): string => {
  const configurado = process.env.SQLITE_DATABASE_PATH?.trim()
  return configurado && configurado !== '' ? configurado : 'var/dev/artzan-dev.sqlite'
}

// -----------------------------------------------------------------------------
// MIGRATIONS — onda de deploy (Docker/VPS). Único acréscimo deste bloco.
//
// Com NODE_ENV=production o Payload NÃO faz `push` do esquema: o banco de
// produção/homologação só ganha tabelas por migration. Os arquivos vivem em
// `src/migrations/` (gerados por `npm run db:migrate:create`, aplicados por
// `npm run db:migrate` — o entrypoint do container faz isso a cada subida).
// O caminho é explícito para não depender da busca automática do Payload, que
// varia com o diretório de trabalho. Ver deploy/README.md.
// -----------------------------------------------------------------------------
const DIRETORIO_DE_MIGRATIONS = path.resolve(dirname, 'migrations')
const DIRETORIO_DE_MIGRATIONS_SQLITE = path.resolve(dirname, 'migrations-sqlite')

const construirAdaptadorDeBanco = () => {
  if (DB_ADAPTER === 'sqlite') {
    if (ehProducao()) {
      throw new Error(
        'DB_ADAPTER=sqlite é proibido quando SITE_MODE=producao (src/payload.config.ts, Onda 4c). ' +
          'SQLite é exclusivo de desenvolvimento local; produção e homologação usam sempre Postgres. ' +
          'Remova DB_ADAPTER do ambiente ou defina DB_ADAPTER=postgres explicitamente.',
      )
    }
    const arquivo = caminhoDoArquivoSqlite()
    return sqliteAdapter({
      client: { url: `file:${arquivo}` },
      // Diretório SEPARADO do de Postgres (ver "MIGRATIONS" abaixo): sem isto o
      // adaptador SQLite encontraria `src/migrations/` e tentaria aplicar SQL de
      // Postgres. SQLite é só desenvolvimento local e segue usando `push`.
      migrationDir: DIRETORIO_DE_MIGRATIONS_SQLITE,
    })
  }

  if (DB_ADAPTER !== DB_ADAPTER_PADRAO) {
    throw new Error(
      `DB_ADAPTER inválido: "${process.env.DB_ADAPTER}". Valores aceitos: "postgres" (padrão) ou ` +
        '"sqlite" (só desenvolvimento local, nunca em produção).',
    )
  }

  return postgresAdapter({
    pool: {
      connectionString: requireEnv('DATABASE_URI'),
    },
    migrationDir: DIRETORIO_DE_MIGRATIONS,
  })
}

export default buildConfig({
  // -------------------------------------------------------------------------
  // COLEÇÕES — PREENCHIDAS PELA ONDA 2b, NÃO POR ESTE ARQUIVO.
  //
  // A Onda 2b cria um arquivo por entidade em `src/collections/` e as importa
  // aqui, na ordem: Usuarios, Midia, Categorias, Produtos, Solucoes, Parceiros,
  // PaginasInstitucionais, ItensDeConteudo.
  //
  // As oito entidades vêm inteiras de 6.7 do PRD, campo a campo — inclusive
  // Solução e Item de conteúdo, cujas PÁGINAS ficam fora do MVP. A decisão D-11
  // (Alternativa C) adia a interface, não o modelo de dados.
  // -------------------------------------------------------------------------
  collections: [
    Usuarios,
    Midia,
    Categorias,
    TiposDeParceria,
    Produtos,
    Solucoes,
    Parceiros,
    PaginasInstitucionais,
    ItensDeConteudo,
    RegistrosDeAuditoria,
  ],

  // Globais (configuração de site, rodapé, navegação) também são da Onda 2b.
  globals: [ConfiguracaoDoSite],

  admin: {
    // Aponta para a coleção com `auth: true` criada pela Onda 2b.
    user: ADMIN_USER_SLUG,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— ArtZan',
    },
    // RNF-110: o painel não é indexável nem descobrível. A exclusão do sitemap
    // (RF-163) e do robots.txt (RF-164) é responsabilidade da Onda 3b.
  },

  editor: lexicalEditor({}),

  // Ver bloco "ADAPTADOR DE BANCO" acima: Postgres é o padrão e o único válido
  // em produção/homologação; SQLite só entra por `DB_ADAPTER=sqlite` explícito,
  // e nunca quando `SITE_MODE=producao`.
  db: construirAdaptadorDeBanco(),

  // RNF-045: o segredo nunca é literal no código nem chega ao navegador.
  secret: requireEnv('PAYLOAD_SECRET'),

  // `serverURL` NÃO é definido na etapa 1. Com ele, o Payload grava a URL de
  // toda mídia como absoluta (`http://<host>/api/midia/file/...`), e o
  // `next/image` recusa a origem porque `next.config.ts` não libera nenhuma
  // origem remota (`remotePatterns: []`, "mídia servida pelo próprio Payload,
  // mesma origem"). Sem ele, a URL sai relativa e mesma origem, como o
  // `next.config.ts` pressupõe; Open Graph a resolve contra `metadataBase`.
  // A etapa 2 (painel, e-mail de redefinição de senha) é quem precisa de URL
  // absoluta — reavaliar ali. Corrigido na verificação pós-Onda 4.

  // RNF-083 — reserva estrutural de idioma, desligada no MVP.
  localization: {
    locales: [
      { label: 'Português (Brasil)', code: LOCALE_PADRAO },
      { label: 'English (reservado — não publicado)', code: LOCALE_RESERVADO },
    ],
    defaultLocale: LOCALE_PADRAO,
    fallback: false, // sem fallback: campo em inglês vazio permanece vazio, nunca herda o português
  },

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  graphQL: {
    disablePlaygroundInProduction: true,
  },

  // RNF-012: limite por arquivo verificado no carregamento da mídia.
  // O valor abaixo é o teto bruto do upload; a regra de 200 KB pós-otimização
  // é validada pela coleção de mídia (Onda 2b).
  // Os dois limites medem coisas diferentes e não se contradizem: 5 MB é o teto do
  // ARQUIVO BRUTO aceito na entrada; os 200 KB de RNF-012 valem para o arquivo
  // JÁ REPROCESSADO (webp, 1600 px), que é o que chega ao navegador.
  upload: {
    limits: {
      fileSize: 5_000_000,
    },
  },

  // Necessário para as variantes de imagem geradas pela coleção de mídia (RNF-012).
  sharp,
})
