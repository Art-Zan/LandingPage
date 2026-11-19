import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('pt-BR', 'en');
  CREATE TYPE "public"."enum_produtos_modelo_de_contratacao" AS ENUM('assinatura-recorrente', 'projeto-sob-encomenda');
  CREATE TYPE "public"."enum_produtos_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__produtos_v_version_modelo_de_contratacao" AS ENUM('assinatura-recorrente', 'projeto-sob-encomenda');
  CREATE TYPE "public"."enum__produtos_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__produtos_v_published_locale" AS ENUM('pt-BR', 'en');
  CREATE TYPE "public"."enum_solucoes_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__solucoes_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__solucoes_v_published_locale" AS ENUM('pt-BR', 'en');
  CREATE TYPE "public"."enum_parceiros_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__parceiros_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__parceiros_v_published_locale" AS ENUM('pt-BR', 'en');
  CREATE TYPE "public"."enum_paginas_institucionais_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__paginas_institucionais_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__paginas_institucionais_v_published_locale" AS ENUM('pt-BR', 'en');
  CREATE TYPE "public"."enum_itens_de_conteudo_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__itens_de_conteudo_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__itens_de_conteudo_v_published_locale" AS ENUM('pt-BR', 'en');
  CREATE TYPE "public"."enum_registros_de_auditoria_acao" AS ENUM('criacao', 'atualizacao', 'publicacao', 'despublicacao', 'exclusao');
  CREATE TABLE "usuarios_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "usuarios" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nome" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "midia" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_miniatura_url" varchar,
  	"sizes_miniatura_width" numeric,
  	"sizes_miniatura_height" numeric,
  	"sizes_miniatura_mime_type" varchar,
  	"sizes_miniatura_filesize" numeric,
  	"sizes_miniatura_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_conteudo_url" varchar,
  	"sizes_conteudo_width" numeric,
  	"sizes_conteudo_height" numeric,
  	"sizes_conteudo_mime_type" varchar,
  	"sizes_conteudo_filesize" numeric,
  	"sizes_conteudo_filename" varchar,
  	"sizes_social_url" varchar,
  	"sizes_social_width" numeric,
  	"sizes_social_height" numeric,
  	"sizes_social_mime_type" varchar,
  	"sizes_social_filesize" numeric,
  	"sizes_social_filename" varchar
  );
  
  CREATE TABLE "categorias" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"ordem_de_exibicao" numeric,
  	"visivel_publicamente" boolean DEFAULT false NOT NULL,
  	"placeholder" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "categorias_locales" (
  	"nome" varchar NOT NULL,
  	"descricao_curta" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "tipos_de_parceria" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"ordem_de_exibicao" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tipos_de_parceria_locales" (
  	"nome" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "produtos_funcionalidades" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titulo" varchar,
  	"descricao" varchar
  );
  
  CREATE TABLE "produtos_beneficios" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"texto" varchar
  );
  
  CREATE TABLE "produtos_modelo_de_contratacao" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_produtos_modelo_de_contratacao",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "produtos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"problema_que_resolve" jsonb,
  	"publico_alvo" varchar,
  	"imagem_destaque_id" integer,
  	"video_demonstracao" varchar,
  	"destaque_na_inicial" boolean DEFAULT false,
  	"ordem_de_destaque" numeric,
  	"placeholder" boolean DEFAULT false,
  	"data_de_publicacao" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_produtos_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "produtos_locales" (
  	"nome" varchar,
  	"resumo_uma_linha" varchar,
  	"descricao_completa" jsonb,
  	"seo_titulo" varchar,
  	"seo_descricao" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "produtos_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "produtos_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categorias_id" integer,
  	"midia_id" integer,
  	"produtos_id" integer
  );
  
  CREATE TABLE "_produtos_v_version_funcionalidades" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar,
  	"descricao" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_produtos_v_version_beneficios" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"texto" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_produtos_v_version_modelo_de_contratacao" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__produtos_v_version_modelo_de_contratacao",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_produtos_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_problema_que_resolve" jsonb,
  	"version_publico_alvo" varchar,
  	"version_imagem_destaque_id" integer,
  	"version_video_demonstracao" varchar,
  	"version_destaque_na_inicial" boolean DEFAULT false,
  	"version_ordem_de_destaque" numeric,
  	"version_placeholder" boolean DEFAULT false,
  	"version_data_de_publicacao" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__produtos_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__produtos_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_produtos_v_locales" (
  	"version_nome" varchar,
  	"version_resumo_uma_linha" varchar,
  	"version_descricao_completa" jsonb,
  	"version_seo_titulo" varchar,
  	"version_seo_descricao" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_produtos_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_produtos_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categorias_id" integer,
  	"midia_id" integer,
  	"produtos_id" integer
  );
  
  CREATE TABLE "solucoes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"necessidade_atendida" jsonb,
  	"ganho_da_combinacao" jsonb,
  	"publico_alvo" varchar,
  	"casos_de_uso" varchar,
  	"adocao_por_etapas" varchar,
  	"imagem_destaque_id" integer,
  	"placeholder" boolean DEFAULT false,
  	"data_de_publicacao" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_solucoes_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "solucoes_locales" (
  	"nome" varchar,
  	"resumo" varchar,
  	"seo_titulo" varchar,
  	"seo_descricao" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "solucoes_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"produtos_id" integer,
  	"categorias_id" integer
  );
  
  CREATE TABLE "_solucoes_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_necessidade_atendida" jsonb,
  	"version_ganho_da_combinacao" jsonb,
  	"version_publico_alvo" varchar,
  	"version_casos_de_uso" varchar,
  	"version_adocao_por_etapas" varchar,
  	"version_imagem_destaque_id" integer,
  	"version_placeholder" boolean DEFAULT false,
  	"version_data_de_publicacao" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__solucoes_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__solucoes_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_solucoes_v_locales" (
  	"version_nome" varchar,
  	"version_resumo" varchar,
  	"version_seo_titulo" varchar,
  	"version_seo_descricao" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_solucoes_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"produtos_id" integer,
  	"categorias_id" integer
  );
  
  CREATE TABLE "parceiros" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"natureza_da_relacao" varchar,
  	"link_externo" varchar,
  	"autorizacao_de_uso_de_marca_autorizada" boolean DEFAULT false,
  	"autorizacao_de_uso_de_marca_data_da_autorizacao" timestamp(3) with time zone,
  	"autorizacao_de_uso_de_marca_responsavel" varchar,
  	"ordem" numeric DEFAULT 0,
  	"placeholder" boolean DEFAULT false,
  	"data_de_publicacao" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_parceiros_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "parceiros_locales" (
  	"nome" varchar,
  	"descricao_curta" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "parceiros_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tipos_de_parceria_id" integer,
  	"produtos_id" integer,
  	"solucoes_id" integer
  );
  
  CREATE TABLE "_parceiros_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_logo_id" integer,
  	"version_natureza_da_relacao" varchar,
  	"version_link_externo" varchar,
  	"version_autorizacao_de_uso_de_marca_autorizada" boolean DEFAULT false,
  	"version_autorizacao_de_uso_de_marca_data_da_autorizacao" timestamp(3) with time zone,
  	"version_autorizacao_de_uso_de_marca_responsavel" varchar,
  	"version_ordem" numeric DEFAULT 0,
  	"version_placeholder" boolean DEFAULT false,
  	"version_data_de_publicacao" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__parceiros_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__parceiros_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_parceiros_v_locales" (
  	"version_nome" varchar,
  	"version_descricao_curta" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_parceiros_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tipos_de_parceria_id" integer,
  	"produtos_id" integer,
  	"solucoes_id" integer
  );
  
  CREATE TABLE "paginas_institucionais_blocks_bloco_de_texto" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titulo" varchar,
  	"corpo" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "paginas_institucionais_blocks_bloco_de_lista_itens" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titulo" varchar,
  	"texto" varchar
  );
  
  CREATE TABLE "paginas_institucionais_blocks_bloco_de_lista" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titulo" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "paginas_institucionais_blocks_bloco_de_imagem" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"imagem_id" integer,
  	"legenda" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "paginas_institucionais_blocks_bloco_de_chamada" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titulo" varchar,
  	"texto" varchar,
  	"rotulo_da_acao" varchar,
  	"destino" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "paginas_institucionais" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"imagem_destaque_id" integer,
  	"indexavel" boolean DEFAULT true,
  	"placeholder" boolean DEFAULT false,
  	"data_de_publicacao" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_paginas_institucionais_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "paginas_institucionais_locales" (
  	"titulo" varchar,
  	"seo_titulo" varchar,
  	"seo_descricao" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_paginas_institucionais_v_blocks_bloco_de_texto" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar,
  	"corpo" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_paginas_institucionais_v_blocks_bloco_de_lista_itens" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar,
  	"texto" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_paginas_institucionais_v_blocks_bloco_de_lista" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_paginas_institucionais_v_blocks_bloco_de_imagem" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"imagem_id" integer,
  	"legenda" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_paginas_institucionais_v_blocks_bloco_de_chamada" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar,
  	"texto" varchar,
  	"rotulo_da_acao" varchar,
  	"destino" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_paginas_institucionais_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_imagem_destaque_id" integer,
  	"version_indexavel" boolean DEFAULT true,
  	"version_placeholder" boolean DEFAULT false,
  	"version_data_de_publicacao" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__paginas_institucionais_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__paginas_institucionais_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_paginas_institucionais_v_locales" (
  	"version_titulo" varchar,
  	"version_seo_titulo" varchar,
  	"version_seo_descricao" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "itens_de_conteudo" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"corpo" jsonb,
  	"tema_editorial" varchar,
  	"imagem_destaque_id" integer,
  	"autor_id" integer,
  	"placeholder" boolean DEFAULT false,
  	"data_de_publicacao" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_itens_de_conteudo_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "itens_de_conteudo_locales" (
  	"titulo" varchar,
  	"resumo" varchar,
  	"seo_titulo" varchar,
  	"seo_descricao" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "itens_de_conteudo_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"produtos_id" integer,
  	"solucoes_id" integer
  );
  
  CREATE TABLE "_itens_de_conteudo_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_corpo" jsonb,
  	"version_tema_editorial" varchar,
  	"version_imagem_destaque_id" integer,
  	"version_autor_id" integer,
  	"version_placeholder" boolean DEFAULT false,
  	"version_data_de_publicacao" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__itens_de_conteudo_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__itens_de_conteudo_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_itens_de_conteudo_v_locales" (
  	"version_titulo" varchar,
  	"version_resumo" varchar,
  	"version_seo_titulo" varchar,
  	"version_seo_descricao" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_itens_de_conteudo_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"produtos_id" integer,
  	"solucoes_id" integer
  );
  
  CREATE TABLE "registros_de_auditoria" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"acao" "enum_registros_de_auditoria_acao" NOT NULL,
  	"colecao" varchar NOT NULL,
  	"documento_id" varchar NOT NULL,
  	"registro" varchar NOT NULL,
  	"autor_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"usuarios_id" integer,
  	"midia_id" integer,
  	"categorias_id" integer,
  	"tipos_de_parceria_id" integer,
  	"produtos_id" integer,
  	"solucoes_id" integer,
  	"parceiros_id" integer,
  	"paginas_institucionais_id" integer,
  	"itens_de_conteudo_id" integer,
  	"registros_de_auditoria_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"usuarios_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "configuracao_do_site" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"identificacao_da_empresa_razao_social" varchar,
  	"identificacao_da_empresa_cnpj" varchar,
  	"identificacao_da_empresa_endereco" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "configuracao_do_site_locales" (
  	"texto_padrao_de_contratacao" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "usuarios_sessions" ADD CONSTRAINT "usuarios_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categorias_locales" ADD CONSTRAINT "categorias_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categorias"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tipos_de_parceria_locales" ADD CONSTRAINT "tipos_de_parceria_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tipos_de_parceria"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "produtos_funcionalidades" ADD CONSTRAINT "produtos_funcionalidades_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."produtos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "produtos_beneficios" ADD CONSTRAINT "produtos_beneficios_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."produtos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "produtos_modelo_de_contratacao" ADD CONSTRAINT "produtos_modelo_de_contratacao_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."produtos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "produtos" ADD CONSTRAINT "produtos_imagem_destaque_id_midia_id_fk" FOREIGN KEY ("imagem_destaque_id") REFERENCES "public"."midia"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "produtos_locales" ADD CONSTRAINT "produtos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."produtos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "produtos_texts" ADD CONSTRAINT "produtos_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."produtos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "produtos_rels" ADD CONSTRAINT "produtos_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."produtos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "produtos_rels" ADD CONSTRAINT "produtos_rels_categorias_fk" FOREIGN KEY ("categorias_id") REFERENCES "public"."categorias"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "produtos_rels" ADD CONSTRAINT "produtos_rels_midia_fk" FOREIGN KEY ("midia_id") REFERENCES "public"."midia"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "produtos_rels" ADD CONSTRAINT "produtos_rels_produtos_fk" FOREIGN KEY ("produtos_id") REFERENCES "public"."produtos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_produtos_v_version_funcionalidades" ADD CONSTRAINT "_produtos_v_version_funcionalidades_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_produtos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_produtos_v_version_beneficios" ADD CONSTRAINT "_produtos_v_version_beneficios_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_produtos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_produtos_v_version_modelo_de_contratacao" ADD CONSTRAINT "_produtos_v_version_modelo_de_contratacao_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_produtos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_produtos_v" ADD CONSTRAINT "_produtos_v_parent_id_produtos_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."produtos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_produtos_v" ADD CONSTRAINT "_produtos_v_version_imagem_destaque_id_midia_id_fk" FOREIGN KEY ("version_imagem_destaque_id") REFERENCES "public"."midia"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_produtos_v_locales" ADD CONSTRAINT "_produtos_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_produtos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_produtos_v_texts" ADD CONSTRAINT "_produtos_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_produtos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_produtos_v_rels" ADD CONSTRAINT "_produtos_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_produtos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_produtos_v_rels" ADD CONSTRAINT "_produtos_v_rels_categorias_fk" FOREIGN KEY ("categorias_id") REFERENCES "public"."categorias"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_produtos_v_rels" ADD CONSTRAINT "_produtos_v_rels_midia_fk" FOREIGN KEY ("midia_id") REFERENCES "public"."midia"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_produtos_v_rels" ADD CONSTRAINT "_produtos_v_rels_produtos_fk" FOREIGN KEY ("produtos_id") REFERENCES "public"."produtos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solucoes" ADD CONSTRAINT "solucoes_imagem_destaque_id_midia_id_fk" FOREIGN KEY ("imagem_destaque_id") REFERENCES "public"."midia"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solucoes_locales" ADD CONSTRAINT "solucoes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solucoes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solucoes_rels" ADD CONSTRAINT "solucoes_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."solucoes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solucoes_rels" ADD CONSTRAINT "solucoes_rels_produtos_fk" FOREIGN KEY ("produtos_id") REFERENCES "public"."produtos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solucoes_rels" ADD CONSTRAINT "solucoes_rels_categorias_fk" FOREIGN KEY ("categorias_id") REFERENCES "public"."categorias"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solucoes_v" ADD CONSTRAINT "_solucoes_v_parent_id_solucoes_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."solucoes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solucoes_v" ADD CONSTRAINT "_solucoes_v_version_imagem_destaque_id_midia_id_fk" FOREIGN KEY ("version_imagem_destaque_id") REFERENCES "public"."midia"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solucoes_v_locales" ADD CONSTRAINT "_solucoes_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solucoes_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solucoes_v_rels" ADD CONSTRAINT "_solucoes_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_solucoes_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solucoes_v_rels" ADD CONSTRAINT "_solucoes_v_rels_produtos_fk" FOREIGN KEY ("produtos_id") REFERENCES "public"."produtos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solucoes_v_rels" ADD CONSTRAINT "_solucoes_v_rels_categorias_fk" FOREIGN KEY ("categorias_id") REFERENCES "public"."categorias"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "parceiros" ADD CONSTRAINT "parceiros_logo_id_midia_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."midia"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "parceiros_locales" ADD CONSTRAINT "parceiros_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."parceiros"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "parceiros_rels" ADD CONSTRAINT "parceiros_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."parceiros"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "parceiros_rels" ADD CONSTRAINT "parceiros_rels_tipos_de_parceria_fk" FOREIGN KEY ("tipos_de_parceria_id") REFERENCES "public"."tipos_de_parceria"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "parceiros_rels" ADD CONSTRAINT "parceiros_rels_produtos_fk" FOREIGN KEY ("produtos_id") REFERENCES "public"."produtos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "parceiros_rels" ADD CONSTRAINT "parceiros_rels_solucoes_fk" FOREIGN KEY ("solucoes_id") REFERENCES "public"."solucoes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_parceiros_v" ADD CONSTRAINT "_parceiros_v_parent_id_parceiros_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."parceiros"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_parceiros_v" ADD CONSTRAINT "_parceiros_v_version_logo_id_midia_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."midia"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_parceiros_v_locales" ADD CONSTRAINT "_parceiros_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_parceiros_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_parceiros_v_rels" ADD CONSTRAINT "_parceiros_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_parceiros_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_parceiros_v_rels" ADD CONSTRAINT "_parceiros_v_rels_tipos_de_parceria_fk" FOREIGN KEY ("tipos_de_parceria_id") REFERENCES "public"."tipos_de_parceria"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_parceiros_v_rels" ADD CONSTRAINT "_parceiros_v_rels_produtos_fk" FOREIGN KEY ("produtos_id") REFERENCES "public"."produtos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_parceiros_v_rels" ADD CONSTRAINT "_parceiros_v_rels_solucoes_fk" FOREIGN KEY ("solucoes_id") REFERENCES "public"."solucoes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "paginas_institucionais_blocks_bloco_de_texto" ADD CONSTRAINT "paginas_institucionais_blocks_bloco_de_texto_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."paginas_institucionais"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "paginas_institucionais_blocks_bloco_de_lista_itens" ADD CONSTRAINT "paginas_institucionais_blocks_bloco_de_lista_itens_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."paginas_institucionais_blocks_bloco_de_lista"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "paginas_institucionais_blocks_bloco_de_lista" ADD CONSTRAINT "paginas_institucionais_blocks_bloco_de_lista_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."paginas_institucionais"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "paginas_institucionais_blocks_bloco_de_imagem" ADD CONSTRAINT "paginas_institucionais_blocks_bloco_de_imagem_imagem_id_midia_id_fk" FOREIGN KEY ("imagem_id") REFERENCES "public"."midia"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "paginas_institucionais_blocks_bloco_de_imagem" ADD CONSTRAINT "paginas_institucionais_blocks_bloco_de_imagem_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."paginas_institucionais"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "paginas_institucionais_blocks_bloco_de_chamada" ADD CONSTRAINT "paginas_institucionais_blocks_bloco_de_chamada_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."paginas_institucionais"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "paginas_institucionais" ADD CONSTRAINT "paginas_institucionais_imagem_destaque_id_midia_id_fk" FOREIGN KEY ("imagem_destaque_id") REFERENCES "public"."midia"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "paginas_institucionais_locales" ADD CONSTRAINT "paginas_institucionais_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."paginas_institucionais"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_paginas_institucionais_v_blocks_bloco_de_texto" ADD CONSTRAINT "_paginas_institucionais_v_blocks_bloco_de_texto_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_paginas_institucionais_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_paginas_institucionais_v_blocks_bloco_de_lista_itens" ADD CONSTRAINT "_paginas_institucionais_v_blocks_bloco_de_lista_itens_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_paginas_institucionais_v_blocks_bloco_de_lista"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_paginas_institucionais_v_blocks_bloco_de_lista" ADD CONSTRAINT "_paginas_institucionais_v_blocks_bloco_de_lista_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_paginas_institucionais_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_paginas_institucionais_v_blocks_bloco_de_imagem" ADD CONSTRAINT "_paginas_institucionais_v_blocks_bloco_de_imagem_imagem_id_midia_id_fk" FOREIGN KEY ("imagem_id") REFERENCES "public"."midia"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_paginas_institucionais_v_blocks_bloco_de_imagem" ADD CONSTRAINT "_paginas_institucionais_v_blocks_bloco_de_imagem_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_paginas_institucionais_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_paginas_institucionais_v_blocks_bloco_de_chamada" ADD CONSTRAINT "_paginas_institucionais_v_blocks_bloco_de_chamada_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_paginas_institucionais_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_paginas_institucionais_v" ADD CONSTRAINT "_paginas_institucionais_v_parent_id_paginas_institucionais_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."paginas_institucionais"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_paginas_institucionais_v" ADD CONSTRAINT "_paginas_institucionais_v_version_imagem_destaque_id_midia_id_fk" FOREIGN KEY ("version_imagem_destaque_id") REFERENCES "public"."midia"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_paginas_institucionais_v_locales" ADD CONSTRAINT "_paginas_institucionais_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_paginas_institucionais_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "itens_de_conteudo" ADD CONSTRAINT "itens_de_conteudo_imagem_destaque_id_midia_id_fk" FOREIGN KEY ("imagem_destaque_id") REFERENCES "public"."midia"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "itens_de_conteudo" ADD CONSTRAINT "itens_de_conteudo_autor_id_usuarios_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."usuarios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "itens_de_conteudo_locales" ADD CONSTRAINT "itens_de_conteudo_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."itens_de_conteudo"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "itens_de_conteudo_rels" ADD CONSTRAINT "itens_de_conteudo_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."itens_de_conteudo"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "itens_de_conteudo_rels" ADD CONSTRAINT "itens_de_conteudo_rels_produtos_fk" FOREIGN KEY ("produtos_id") REFERENCES "public"."produtos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "itens_de_conteudo_rels" ADD CONSTRAINT "itens_de_conteudo_rels_solucoes_fk" FOREIGN KEY ("solucoes_id") REFERENCES "public"."solucoes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_itens_de_conteudo_v" ADD CONSTRAINT "_itens_de_conteudo_v_parent_id_itens_de_conteudo_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."itens_de_conteudo"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_itens_de_conteudo_v" ADD CONSTRAINT "_itens_de_conteudo_v_version_imagem_destaque_id_midia_id_fk" FOREIGN KEY ("version_imagem_destaque_id") REFERENCES "public"."midia"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_itens_de_conteudo_v" ADD CONSTRAINT "_itens_de_conteudo_v_version_autor_id_usuarios_id_fk" FOREIGN KEY ("version_autor_id") REFERENCES "public"."usuarios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_itens_de_conteudo_v_locales" ADD CONSTRAINT "_itens_de_conteudo_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_itens_de_conteudo_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_itens_de_conteudo_v_rels" ADD CONSTRAINT "_itens_de_conteudo_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_itens_de_conteudo_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_itens_de_conteudo_v_rels" ADD CONSTRAINT "_itens_de_conteudo_v_rels_produtos_fk" FOREIGN KEY ("produtos_id") REFERENCES "public"."produtos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_itens_de_conteudo_v_rels" ADD CONSTRAINT "_itens_de_conteudo_v_rels_solucoes_fk" FOREIGN KEY ("solucoes_id") REFERENCES "public"."solucoes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "registros_de_auditoria" ADD CONSTRAINT "registros_de_auditoria_autor_id_usuarios_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."usuarios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_usuarios_fk" FOREIGN KEY ("usuarios_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_midia_fk" FOREIGN KEY ("midia_id") REFERENCES "public"."midia"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categorias_fk" FOREIGN KEY ("categorias_id") REFERENCES "public"."categorias"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tipos_de_parceria_fk" FOREIGN KEY ("tipos_de_parceria_id") REFERENCES "public"."tipos_de_parceria"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_produtos_fk" FOREIGN KEY ("produtos_id") REFERENCES "public"."produtos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_solucoes_fk" FOREIGN KEY ("solucoes_id") REFERENCES "public"."solucoes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parceiros_fk" FOREIGN KEY ("parceiros_id") REFERENCES "public"."parceiros"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_paginas_institucionais_fk" FOREIGN KEY ("paginas_institucionais_id") REFERENCES "public"."paginas_institucionais"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_itens_de_conteudo_fk" FOREIGN KEY ("itens_de_conteudo_id") REFERENCES "public"."itens_de_conteudo"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_registros_de_auditoria_fk" FOREIGN KEY ("registros_de_auditoria_id") REFERENCES "public"."registros_de_auditoria"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_usuarios_fk" FOREIGN KEY ("usuarios_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "configuracao_do_site_locales" ADD CONSTRAINT "configuracao_do_site_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."configuracao_do_site"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "usuarios_sessions_order_idx" ON "usuarios_sessions" USING btree ("_order");
  CREATE INDEX "usuarios_sessions_parent_id_idx" ON "usuarios_sessions" USING btree ("_parent_id");
  CREATE INDEX "usuarios_updated_at_idx" ON "usuarios" USING btree ("updated_at");
  CREATE INDEX "usuarios_created_at_idx" ON "usuarios" USING btree ("created_at");
  CREATE UNIQUE INDEX "usuarios_email_idx" ON "usuarios" USING btree ("email");
  CREATE INDEX "midia_updated_at_idx" ON "midia" USING btree ("updated_at");
  CREATE INDEX "midia_created_at_idx" ON "midia" USING btree ("created_at");
  CREATE UNIQUE INDEX "midia_filename_idx" ON "midia" USING btree ("filename");
  CREATE INDEX "midia_sizes_miniatura_sizes_miniatura_filename_idx" ON "midia" USING btree ("sizes_miniatura_filename");
  CREATE INDEX "midia_sizes_card_sizes_card_filename_idx" ON "midia" USING btree ("sizes_card_filename");
  CREATE INDEX "midia_sizes_conteudo_sizes_conteudo_filename_idx" ON "midia" USING btree ("sizes_conteudo_filename");
  CREATE INDEX "midia_sizes_social_sizes_social_filename_idx" ON "midia" USING btree ("sizes_social_filename");
  CREATE UNIQUE INDEX "categorias_slug_idx" ON "categorias" USING btree ("slug");
  CREATE INDEX "categorias_updated_at_idx" ON "categorias" USING btree ("updated_at");
  CREATE INDEX "categorias_created_at_idx" ON "categorias" USING btree ("created_at");
  CREATE UNIQUE INDEX "categorias_locales_locale_parent_id_unique" ON "categorias_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "tipos_de_parceria_slug_idx" ON "tipos_de_parceria" USING btree ("slug");
  CREATE INDEX "tipos_de_parceria_updated_at_idx" ON "tipos_de_parceria" USING btree ("updated_at");
  CREATE INDEX "tipos_de_parceria_created_at_idx" ON "tipos_de_parceria" USING btree ("created_at");
  CREATE UNIQUE INDEX "tipos_de_parceria_locales_locale_parent_id_unique" ON "tipos_de_parceria_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "produtos_funcionalidades_order_idx" ON "produtos_funcionalidades" USING btree ("_order");
  CREATE INDEX "produtos_funcionalidades_parent_id_idx" ON "produtos_funcionalidades" USING btree ("_parent_id");
  CREATE INDEX "produtos_beneficios_order_idx" ON "produtos_beneficios" USING btree ("_order");
  CREATE INDEX "produtos_beneficios_parent_id_idx" ON "produtos_beneficios" USING btree ("_parent_id");
  CREATE INDEX "produtos_modelo_de_contratacao_order_idx" ON "produtos_modelo_de_contratacao" USING btree ("order");
  CREATE INDEX "produtos_modelo_de_contratacao_parent_idx" ON "produtos_modelo_de_contratacao" USING btree ("parent_id");
  CREATE UNIQUE INDEX "produtos_slug_idx" ON "produtos" USING btree ("slug");
  CREATE INDEX "produtos_imagem_destaque_idx" ON "produtos" USING btree ("imagem_destaque_id");
  CREATE INDEX "produtos_data_de_publicacao_idx" ON "produtos" USING btree ("data_de_publicacao");
  CREATE INDEX "produtos_updated_at_idx" ON "produtos" USING btree ("updated_at");
  CREATE INDEX "produtos_created_at_idx" ON "produtos" USING btree ("created_at");
  CREATE INDEX "produtos__status_idx" ON "produtos" USING btree ("_status");
  CREATE UNIQUE INDEX "produtos_locales_locale_parent_id_unique" ON "produtos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "produtos_texts_order_parent" ON "produtos_texts" USING btree ("order","parent_id");
  CREATE INDEX "produtos_rels_order_idx" ON "produtos_rels" USING btree ("order");
  CREATE INDEX "produtos_rels_parent_idx" ON "produtos_rels" USING btree ("parent_id");
  CREATE INDEX "produtos_rels_path_idx" ON "produtos_rels" USING btree ("path");
  CREATE INDEX "produtos_rels_categorias_id_idx" ON "produtos_rels" USING btree ("categorias_id");
  CREATE INDEX "produtos_rels_midia_id_idx" ON "produtos_rels" USING btree ("midia_id");
  CREATE INDEX "produtos_rels_produtos_id_idx" ON "produtos_rels" USING btree ("produtos_id");
  CREATE INDEX "_produtos_v_version_funcionalidades_order_idx" ON "_produtos_v_version_funcionalidades" USING btree ("_order");
  CREATE INDEX "_produtos_v_version_funcionalidades_parent_id_idx" ON "_produtos_v_version_funcionalidades" USING btree ("_parent_id");
  CREATE INDEX "_produtos_v_version_beneficios_order_idx" ON "_produtos_v_version_beneficios" USING btree ("_order");
  CREATE INDEX "_produtos_v_version_beneficios_parent_id_idx" ON "_produtos_v_version_beneficios" USING btree ("_parent_id");
  CREATE INDEX "_produtos_v_version_modelo_de_contratacao_order_idx" ON "_produtos_v_version_modelo_de_contratacao" USING btree ("order");
  CREATE INDEX "_produtos_v_version_modelo_de_contratacao_parent_idx" ON "_produtos_v_version_modelo_de_contratacao" USING btree ("parent_id");
  CREATE INDEX "_produtos_v_parent_idx" ON "_produtos_v" USING btree ("parent_id");
  CREATE INDEX "_produtos_v_version_version_slug_idx" ON "_produtos_v" USING btree ("version_slug");
  CREATE INDEX "_produtos_v_version_version_imagem_destaque_idx" ON "_produtos_v" USING btree ("version_imagem_destaque_id");
  CREATE INDEX "_produtos_v_version_version_data_de_publicacao_idx" ON "_produtos_v" USING btree ("version_data_de_publicacao");
  CREATE INDEX "_produtos_v_version_version_updated_at_idx" ON "_produtos_v" USING btree ("version_updated_at");
  CREATE INDEX "_produtos_v_version_version_created_at_idx" ON "_produtos_v" USING btree ("version_created_at");
  CREATE INDEX "_produtos_v_version_version__status_idx" ON "_produtos_v" USING btree ("version__status");
  CREATE INDEX "_produtos_v_created_at_idx" ON "_produtos_v" USING btree ("created_at");
  CREATE INDEX "_produtos_v_updated_at_idx" ON "_produtos_v" USING btree ("updated_at");
  CREATE INDEX "_produtos_v_snapshot_idx" ON "_produtos_v" USING btree ("snapshot");
  CREATE INDEX "_produtos_v_published_locale_idx" ON "_produtos_v" USING btree ("published_locale");
  CREATE INDEX "_produtos_v_latest_idx" ON "_produtos_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_produtos_v_locales_locale_parent_id_unique" ON "_produtos_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_produtos_v_texts_order_parent" ON "_produtos_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_produtos_v_rels_order_idx" ON "_produtos_v_rels" USING btree ("order");
  CREATE INDEX "_produtos_v_rels_parent_idx" ON "_produtos_v_rels" USING btree ("parent_id");
  CREATE INDEX "_produtos_v_rels_path_idx" ON "_produtos_v_rels" USING btree ("path");
  CREATE INDEX "_produtos_v_rels_categorias_id_idx" ON "_produtos_v_rels" USING btree ("categorias_id");
  CREATE INDEX "_produtos_v_rels_midia_id_idx" ON "_produtos_v_rels" USING btree ("midia_id");
  CREATE INDEX "_produtos_v_rels_produtos_id_idx" ON "_produtos_v_rels" USING btree ("produtos_id");
  CREATE UNIQUE INDEX "solucoes_slug_idx" ON "solucoes" USING btree ("slug");
  CREATE INDEX "solucoes_imagem_destaque_idx" ON "solucoes" USING btree ("imagem_destaque_id");
  CREATE INDEX "solucoes_data_de_publicacao_idx" ON "solucoes" USING btree ("data_de_publicacao");
  CREATE INDEX "solucoes_updated_at_idx" ON "solucoes" USING btree ("updated_at");
  CREATE INDEX "solucoes_created_at_idx" ON "solucoes" USING btree ("created_at");
  CREATE INDEX "solucoes__status_idx" ON "solucoes" USING btree ("_status");
  CREATE UNIQUE INDEX "solucoes_locales_locale_parent_id_unique" ON "solucoes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "solucoes_rels_order_idx" ON "solucoes_rels" USING btree ("order");
  CREATE INDEX "solucoes_rels_parent_idx" ON "solucoes_rels" USING btree ("parent_id");
  CREATE INDEX "solucoes_rels_path_idx" ON "solucoes_rels" USING btree ("path");
  CREATE INDEX "solucoes_rels_produtos_id_idx" ON "solucoes_rels" USING btree ("produtos_id");
  CREATE INDEX "solucoes_rels_categorias_id_idx" ON "solucoes_rels" USING btree ("categorias_id");
  CREATE INDEX "_solucoes_v_parent_idx" ON "_solucoes_v" USING btree ("parent_id");
  CREATE INDEX "_solucoes_v_version_version_slug_idx" ON "_solucoes_v" USING btree ("version_slug");
  CREATE INDEX "_solucoes_v_version_version_imagem_destaque_idx" ON "_solucoes_v" USING btree ("version_imagem_destaque_id");
  CREATE INDEX "_solucoes_v_version_version_data_de_publicacao_idx" ON "_solucoes_v" USING btree ("version_data_de_publicacao");
  CREATE INDEX "_solucoes_v_version_version_updated_at_idx" ON "_solucoes_v" USING btree ("version_updated_at");
  CREATE INDEX "_solucoes_v_version_version_created_at_idx" ON "_solucoes_v" USING btree ("version_created_at");
  CREATE INDEX "_solucoes_v_version_version__status_idx" ON "_solucoes_v" USING btree ("version__status");
  CREATE INDEX "_solucoes_v_created_at_idx" ON "_solucoes_v" USING btree ("created_at");
  CREATE INDEX "_solucoes_v_updated_at_idx" ON "_solucoes_v" USING btree ("updated_at");
  CREATE INDEX "_solucoes_v_snapshot_idx" ON "_solucoes_v" USING btree ("snapshot");
  CREATE INDEX "_solucoes_v_published_locale_idx" ON "_solucoes_v" USING btree ("published_locale");
  CREATE INDEX "_solucoes_v_latest_idx" ON "_solucoes_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_solucoes_v_locales_locale_parent_id_unique" ON "_solucoes_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_solucoes_v_rels_order_idx" ON "_solucoes_v_rels" USING btree ("order");
  CREATE INDEX "_solucoes_v_rels_parent_idx" ON "_solucoes_v_rels" USING btree ("parent_id");
  CREATE INDEX "_solucoes_v_rels_path_idx" ON "_solucoes_v_rels" USING btree ("path");
  CREATE INDEX "_solucoes_v_rels_produtos_id_idx" ON "_solucoes_v_rels" USING btree ("produtos_id");
  CREATE INDEX "_solucoes_v_rels_categorias_id_idx" ON "_solucoes_v_rels" USING btree ("categorias_id");
  CREATE INDEX "parceiros_logo_idx" ON "parceiros" USING btree ("logo_id");
  CREATE INDEX "parceiros_data_de_publicacao_idx" ON "parceiros" USING btree ("data_de_publicacao");
  CREATE INDEX "parceiros_updated_at_idx" ON "parceiros" USING btree ("updated_at");
  CREATE INDEX "parceiros_created_at_idx" ON "parceiros" USING btree ("created_at");
  CREATE INDEX "parceiros__status_idx" ON "parceiros" USING btree ("_status");
  CREATE UNIQUE INDEX "parceiros_locales_locale_parent_id_unique" ON "parceiros_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "parceiros_rels_order_idx" ON "parceiros_rels" USING btree ("order");
  CREATE INDEX "parceiros_rels_parent_idx" ON "parceiros_rels" USING btree ("parent_id");
  CREATE INDEX "parceiros_rels_path_idx" ON "parceiros_rels" USING btree ("path");
  CREATE INDEX "parceiros_rels_tipos_de_parceria_id_idx" ON "parceiros_rels" USING btree ("tipos_de_parceria_id");
  CREATE INDEX "parceiros_rels_produtos_id_idx" ON "parceiros_rels" USING btree ("produtos_id");
  CREATE INDEX "parceiros_rels_solucoes_id_idx" ON "parceiros_rels" USING btree ("solucoes_id");
  CREATE INDEX "_parceiros_v_parent_idx" ON "_parceiros_v" USING btree ("parent_id");
  CREATE INDEX "_parceiros_v_version_version_logo_idx" ON "_parceiros_v" USING btree ("version_logo_id");
  CREATE INDEX "_parceiros_v_version_version_data_de_publicacao_idx" ON "_parceiros_v" USING btree ("version_data_de_publicacao");
  CREATE INDEX "_parceiros_v_version_version_updated_at_idx" ON "_parceiros_v" USING btree ("version_updated_at");
  CREATE INDEX "_parceiros_v_version_version_created_at_idx" ON "_parceiros_v" USING btree ("version_created_at");
  CREATE INDEX "_parceiros_v_version_version__status_idx" ON "_parceiros_v" USING btree ("version__status");
  CREATE INDEX "_parceiros_v_created_at_idx" ON "_parceiros_v" USING btree ("created_at");
  CREATE INDEX "_parceiros_v_updated_at_idx" ON "_parceiros_v" USING btree ("updated_at");
  CREATE INDEX "_parceiros_v_snapshot_idx" ON "_parceiros_v" USING btree ("snapshot");
  CREATE INDEX "_parceiros_v_published_locale_idx" ON "_parceiros_v" USING btree ("published_locale");
  CREATE INDEX "_parceiros_v_latest_idx" ON "_parceiros_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_parceiros_v_locales_locale_parent_id_unique" ON "_parceiros_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_parceiros_v_rels_order_idx" ON "_parceiros_v_rels" USING btree ("order");
  CREATE INDEX "_parceiros_v_rels_parent_idx" ON "_parceiros_v_rels" USING btree ("parent_id");
  CREATE INDEX "_parceiros_v_rels_path_idx" ON "_parceiros_v_rels" USING btree ("path");
  CREATE INDEX "_parceiros_v_rels_tipos_de_parceria_id_idx" ON "_parceiros_v_rels" USING btree ("tipos_de_parceria_id");
  CREATE INDEX "_parceiros_v_rels_produtos_id_idx" ON "_parceiros_v_rels" USING btree ("produtos_id");
  CREATE INDEX "_parceiros_v_rels_solucoes_id_idx" ON "_parceiros_v_rels" USING btree ("solucoes_id");
  CREATE INDEX "paginas_institucionais_blocks_bloco_de_texto_order_idx" ON "paginas_institucionais_blocks_bloco_de_texto" USING btree ("_order");
  CREATE INDEX "paginas_institucionais_blocks_bloco_de_texto_parent_id_idx" ON "paginas_institucionais_blocks_bloco_de_texto" USING btree ("_parent_id");
  CREATE INDEX "paginas_institucionais_blocks_bloco_de_texto_path_idx" ON "paginas_institucionais_blocks_bloco_de_texto" USING btree ("_path");
  CREATE INDEX "paginas_institucionais_blocks_bloco_de_lista_itens_order_idx" ON "paginas_institucionais_blocks_bloco_de_lista_itens" USING btree ("_order");
  CREATE INDEX "paginas_institucionais_blocks_bloco_de_lista_itens_parent_id_idx" ON "paginas_institucionais_blocks_bloco_de_lista_itens" USING btree ("_parent_id");
  CREATE INDEX "paginas_institucionais_blocks_bloco_de_lista_order_idx" ON "paginas_institucionais_blocks_bloco_de_lista" USING btree ("_order");
  CREATE INDEX "paginas_institucionais_blocks_bloco_de_lista_parent_id_idx" ON "paginas_institucionais_blocks_bloco_de_lista" USING btree ("_parent_id");
  CREATE INDEX "paginas_institucionais_blocks_bloco_de_lista_path_idx" ON "paginas_institucionais_blocks_bloco_de_lista" USING btree ("_path");
  CREATE INDEX "paginas_institucionais_blocks_bloco_de_imagem_order_idx" ON "paginas_institucionais_blocks_bloco_de_imagem" USING btree ("_order");
  CREATE INDEX "paginas_institucionais_blocks_bloco_de_imagem_parent_id_idx" ON "paginas_institucionais_blocks_bloco_de_imagem" USING btree ("_parent_id");
  CREATE INDEX "paginas_institucionais_blocks_bloco_de_imagem_path_idx" ON "paginas_institucionais_blocks_bloco_de_imagem" USING btree ("_path");
  CREATE INDEX "paginas_institucionais_blocks_bloco_de_imagem_imagem_idx" ON "paginas_institucionais_blocks_bloco_de_imagem" USING btree ("imagem_id");
  CREATE INDEX "paginas_institucionais_blocks_bloco_de_chamada_order_idx" ON "paginas_institucionais_blocks_bloco_de_chamada" USING btree ("_order");
  CREATE INDEX "paginas_institucionais_blocks_bloco_de_chamada_parent_id_idx" ON "paginas_institucionais_blocks_bloco_de_chamada" USING btree ("_parent_id");
  CREATE INDEX "paginas_institucionais_blocks_bloco_de_chamada_path_idx" ON "paginas_institucionais_blocks_bloco_de_chamada" USING btree ("_path");
  CREATE UNIQUE INDEX "paginas_institucionais_slug_idx" ON "paginas_institucionais" USING btree ("slug");
  CREATE INDEX "paginas_institucionais_imagem_destaque_idx" ON "paginas_institucionais" USING btree ("imagem_destaque_id");
  CREATE INDEX "paginas_institucionais_data_de_publicacao_idx" ON "paginas_institucionais" USING btree ("data_de_publicacao");
  CREATE INDEX "paginas_institucionais_updated_at_idx" ON "paginas_institucionais" USING btree ("updated_at");
  CREATE INDEX "paginas_institucionais_created_at_idx" ON "paginas_institucionais" USING btree ("created_at");
  CREATE INDEX "paginas_institucionais__status_idx" ON "paginas_institucionais" USING btree ("_status");
  CREATE UNIQUE INDEX "paginas_institucionais_locales_locale_parent_id_unique" ON "paginas_institucionais_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_paginas_institucionais_v_blocks_bloco_de_texto_order_idx" ON "_paginas_institucionais_v_blocks_bloco_de_texto" USING btree ("_order");
  CREATE INDEX "_paginas_institucionais_v_blocks_bloco_de_texto_parent_id_idx" ON "_paginas_institucionais_v_blocks_bloco_de_texto" USING btree ("_parent_id");
  CREATE INDEX "_paginas_institucionais_v_blocks_bloco_de_texto_path_idx" ON "_paginas_institucionais_v_blocks_bloco_de_texto" USING btree ("_path");
  CREATE INDEX "_paginas_institucionais_v_blocks_bloco_de_lista_itens_order_idx" ON "_paginas_institucionais_v_blocks_bloco_de_lista_itens" USING btree ("_order");
  CREATE INDEX "_paginas_institucionais_v_blocks_bloco_de_lista_itens_parent_id_idx" ON "_paginas_institucionais_v_blocks_bloco_de_lista_itens" USING btree ("_parent_id");
  CREATE INDEX "_paginas_institucionais_v_blocks_bloco_de_lista_order_idx" ON "_paginas_institucionais_v_blocks_bloco_de_lista" USING btree ("_order");
  CREATE INDEX "_paginas_institucionais_v_blocks_bloco_de_lista_parent_id_idx" ON "_paginas_institucionais_v_blocks_bloco_de_lista" USING btree ("_parent_id");
  CREATE INDEX "_paginas_institucionais_v_blocks_bloco_de_lista_path_idx" ON "_paginas_institucionais_v_blocks_bloco_de_lista" USING btree ("_path");
  CREATE INDEX "_paginas_institucionais_v_blocks_bloco_de_imagem_order_idx" ON "_paginas_institucionais_v_blocks_bloco_de_imagem" USING btree ("_order");
  CREATE INDEX "_paginas_institucionais_v_blocks_bloco_de_imagem_parent_id_idx" ON "_paginas_institucionais_v_blocks_bloco_de_imagem" USING btree ("_parent_id");
  CREATE INDEX "_paginas_institucionais_v_blocks_bloco_de_imagem_path_idx" ON "_paginas_institucionais_v_blocks_bloco_de_imagem" USING btree ("_path");
  CREATE INDEX "_paginas_institucionais_v_blocks_bloco_de_imagem_imagem_idx" ON "_paginas_institucionais_v_blocks_bloco_de_imagem" USING btree ("imagem_id");
  CREATE INDEX "_paginas_institucionais_v_blocks_bloco_de_chamada_order_idx" ON "_paginas_institucionais_v_blocks_bloco_de_chamada" USING btree ("_order");
  CREATE INDEX "_paginas_institucionais_v_blocks_bloco_de_chamada_parent_id_idx" ON "_paginas_institucionais_v_blocks_bloco_de_chamada" USING btree ("_parent_id");
  CREATE INDEX "_paginas_institucionais_v_blocks_bloco_de_chamada_path_idx" ON "_paginas_institucionais_v_blocks_bloco_de_chamada" USING btree ("_path");
  CREATE INDEX "_paginas_institucionais_v_parent_idx" ON "_paginas_institucionais_v" USING btree ("parent_id");
  CREATE INDEX "_paginas_institucionais_v_version_version_slug_idx" ON "_paginas_institucionais_v" USING btree ("version_slug");
  CREATE INDEX "_paginas_institucionais_v_version_version_imagem_destaqu_idx" ON "_paginas_institucionais_v" USING btree ("version_imagem_destaque_id");
  CREATE INDEX "_paginas_institucionais_v_version_version_data_de_public_idx" ON "_paginas_institucionais_v" USING btree ("version_data_de_publicacao");
  CREATE INDEX "_paginas_institucionais_v_version_version_updated_at_idx" ON "_paginas_institucionais_v" USING btree ("version_updated_at");
  CREATE INDEX "_paginas_institucionais_v_version_version_created_at_idx" ON "_paginas_institucionais_v" USING btree ("version_created_at");
  CREATE INDEX "_paginas_institucionais_v_version_version__status_idx" ON "_paginas_institucionais_v" USING btree ("version__status");
  CREATE INDEX "_paginas_institucionais_v_created_at_idx" ON "_paginas_institucionais_v" USING btree ("created_at");
  CREATE INDEX "_paginas_institucionais_v_updated_at_idx" ON "_paginas_institucionais_v" USING btree ("updated_at");
  CREATE INDEX "_paginas_institucionais_v_snapshot_idx" ON "_paginas_institucionais_v" USING btree ("snapshot");
  CREATE INDEX "_paginas_institucionais_v_published_locale_idx" ON "_paginas_institucionais_v" USING btree ("published_locale");
  CREATE INDEX "_paginas_institucionais_v_latest_idx" ON "_paginas_institucionais_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_paginas_institucionais_v_locales_locale_parent_id_unique" ON "_paginas_institucionais_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "itens_de_conteudo_slug_idx" ON "itens_de_conteudo" USING btree ("slug");
  CREATE INDEX "itens_de_conteudo_imagem_destaque_idx" ON "itens_de_conteudo" USING btree ("imagem_destaque_id");
  CREATE INDEX "itens_de_conteudo_autor_idx" ON "itens_de_conteudo" USING btree ("autor_id");
  CREATE INDEX "itens_de_conteudo_data_de_publicacao_idx" ON "itens_de_conteudo" USING btree ("data_de_publicacao");
  CREATE INDEX "itens_de_conteudo_updated_at_idx" ON "itens_de_conteudo" USING btree ("updated_at");
  CREATE INDEX "itens_de_conteudo_created_at_idx" ON "itens_de_conteudo" USING btree ("created_at");
  CREATE INDEX "itens_de_conteudo__status_idx" ON "itens_de_conteudo" USING btree ("_status");
  CREATE UNIQUE INDEX "itens_de_conteudo_locales_locale_parent_id_unique" ON "itens_de_conteudo_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "itens_de_conteudo_rels_order_idx" ON "itens_de_conteudo_rels" USING btree ("order");
  CREATE INDEX "itens_de_conteudo_rels_parent_idx" ON "itens_de_conteudo_rels" USING btree ("parent_id");
  CREATE INDEX "itens_de_conteudo_rels_path_idx" ON "itens_de_conteudo_rels" USING btree ("path");
  CREATE INDEX "itens_de_conteudo_rels_produtos_id_idx" ON "itens_de_conteudo_rels" USING btree ("produtos_id");
  CREATE INDEX "itens_de_conteudo_rels_solucoes_id_idx" ON "itens_de_conteudo_rels" USING btree ("solucoes_id");
  CREATE INDEX "_itens_de_conteudo_v_parent_idx" ON "_itens_de_conteudo_v" USING btree ("parent_id");
  CREATE INDEX "_itens_de_conteudo_v_version_version_slug_idx" ON "_itens_de_conteudo_v" USING btree ("version_slug");
  CREATE INDEX "_itens_de_conteudo_v_version_version_imagem_destaque_idx" ON "_itens_de_conteudo_v" USING btree ("version_imagem_destaque_id");
  CREATE INDEX "_itens_de_conteudo_v_version_version_autor_idx" ON "_itens_de_conteudo_v" USING btree ("version_autor_id");
  CREATE INDEX "_itens_de_conteudo_v_version_version_data_de_publicacao_idx" ON "_itens_de_conteudo_v" USING btree ("version_data_de_publicacao");
  CREATE INDEX "_itens_de_conteudo_v_version_version_updated_at_idx" ON "_itens_de_conteudo_v" USING btree ("version_updated_at");
  CREATE INDEX "_itens_de_conteudo_v_version_version_created_at_idx" ON "_itens_de_conteudo_v" USING btree ("version_created_at");
  CREATE INDEX "_itens_de_conteudo_v_version_version__status_idx" ON "_itens_de_conteudo_v" USING btree ("version__status");
  CREATE INDEX "_itens_de_conteudo_v_created_at_idx" ON "_itens_de_conteudo_v" USING btree ("created_at");
  CREATE INDEX "_itens_de_conteudo_v_updated_at_idx" ON "_itens_de_conteudo_v" USING btree ("updated_at");
  CREATE INDEX "_itens_de_conteudo_v_snapshot_idx" ON "_itens_de_conteudo_v" USING btree ("snapshot");
  CREATE INDEX "_itens_de_conteudo_v_published_locale_idx" ON "_itens_de_conteudo_v" USING btree ("published_locale");
  CREATE INDEX "_itens_de_conteudo_v_latest_idx" ON "_itens_de_conteudo_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_itens_de_conteudo_v_locales_locale_parent_id_unique" ON "_itens_de_conteudo_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_itens_de_conteudo_v_rels_order_idx" ON "_itens_de_conteudo_v_rels" USING btree ("order");
  CREATE INDEX "_itens_de_conteudo_v_rels_parent_idx" ON "_itens_de_conteudo_v_rels" USING btree ("parent_id");
  CREATE INDEX "_itens_de_conteudo_v_rels_path_idx" ON "_itens_de_conteudo_v_rels" USING btree ("path");
  CREATE INDEX "_itens_de_conteudo_v_rels_produtos_id_idx" ON "_itens_de_conteudo_v_rels" USING btree ("produtos_id");
  CREATE INDEX "_itens_de_conteudo_v_rels_solucoes_id_idx" ON "_itens_de_conteudo_v_rels" USING btree ("solucoes_id");
  CREATE INDEX "registros_de_auditoria_acao_idx" ON "registros_de_auditoria" USING btree ("acao");
  CREATE INDEX "registros_de_auditoria_colecao_idx" ON "registros_de_auditoria" USING btree ("colecao");
  CREATE INDEX "registros_de_auditoria_documento_id_idx" ON "registros_de_auditoria" USING btree ("documento_id");
  CREATE INDEX "registros_de_auditoria_autor_idx" ON "registros_de_auditoria" USING btree ("autor_id");
  CREATE INDEX "registros_de_auditoria_updated_at_idx" ON "registros_de_auditoria" USING btree ("updated_at");
  CREATE INDEX "registros_de_auditoria_created_at_idx" ON "registros_de_auditoria" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_usuarios_id_idx" ON "payload_locked_documents_rels" USING btree ("usuarios_id");
  CREATE INDEX "payload_locked_documents_rels_midia_id_idx" ON "payload_locked_documents_rels" USING btree ("midia_id");
  CREATE INDEX "payload_locked_documents_rels_categorias_id_idx" ON "payload_locked_documents_rels" USING btree ("categorias_id");
  CREATE INDEX "payload_locked_documents_rels_tipos_de_parceria_id_idx" ON "payload_locked_documents_rels" USING btree ("tipos_de_parceria_id");
  CREATE INDEX "payload_locked_documents_rels_produtos_id_idx" ON "payload_locked_documents_rels" USING btree ("produtos_id");
  CREATE INDEX "payload_locked_documents_rels_solucoes_id_idx" ON "payload_locked_documents_rels" USING btree ("solucoes_id");
  CREATE INDEX "payload_locked_documents_rels_parceiros_id_idx" ON "payload_locked_documents_rels" USING btree ("parceiros_id");
  CREATE INDEX "payload_locked_documents_rels_paginas_institucionais_id_idx" ON "payload_locked_documents_rels" USING btree ("paginas_institucionais_id");
  CREATE INDEX "payload_locked_documents_rels_itens_de_conteudo_id_idx" ON "payload_locked_documents_rels" USING btree ("itens_de_conteudo_id");
  CREATE INDEX "payload_locked_documents_rels_registros_de_auditoria_id_idx" ON "payload_locked_documents_rels" USING btree ("registros_de_auditoria_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_usuarios_id_idx" ON "payload_preferences_rels" USING btree ("usuarios_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE UNIQUE INDEX "configuracao_do_site_locales_locale_parent_id_unique" ON "configuracao_do_site_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "usuarios_sessions" CASCADE;
  DROP TABLE "usuarios" CASCADE;
  DROP TABLE "midia" CASCADE;
  DROP TABLE "categorias" CASCADE;
  DROP TABLE "categorias_locales" CASCADE;
  DROP TABLE "tipos_de_parceria" CASCADE;
  DROP TABLE "tipos_de_parceria_locales" CASCADE;
  DROP TABLE "produtos_funcionalidades" CASCADE;
  DROP TABLE "produtos_beneficios" CASCADE;
  DROP TABLE "produtos_modelo_de_contratacao" CASCADE;
  DROP TABLE "produtos" CASCADE;
  DROP TABLE "produtos_locales" CASCADE;
  DROP TABLE "produtos_texts" CASCADE;
  DROP TABLE "produtos_rels" CASCADE;
  DROP TABLE "_produtos_v_version_funcionalidades" CASCADE;
  DROP TABLE "_produtos_v_version_beneficios" CASCADE;
  DROP TABLE "_produtos_v_version_modelo_de_contratacao" CASCADE;
  DROP TABLE "_produtos_v" CASCADE;
  DROP TABLE "_produtos_v_locales" CASCADE;
  DROP TABLE "_produtos_v_texts" CASCADE;
  DROP TABLE "_produtos_v_rels" CASCADE;
  DROP TABLE "solucoes" CASCADE;
  DROP TABLE "solucoes_locales" CASCADE;
  DROP TABLE "solucoes_rels" CASCADE;
  DROP TABLE "_solucoes_v" CASCADE;
  DROP TABLE "_solucoes_v_locales" CASCADE;
  DROP TABLE "_solucoes_v_rels" CASCADE;
  DROP TABLE "parceiros" CASCADE;
  DROP TABLE "parceiros_locales" CASCADE;
  DROP TABLE "parceiros_rels" CASCADE;
  DROP TABLE "_parceiros_v" CASCADE;
  DROP TABLE "_parceiros_v_locales" CASCADE;
  DROP TABLE "_parceiros_v_rels" CASCADE;
  DROP TABLE "paginas_institucionais_blocks_bloco_de_texto" CASCADE;
  DROP TABLE "paginas_institucionais_blocks_bloco_de_lista_itens" CASCADE;
  DROP TABLE "paginas_institucionais_blocks_bloco_de_lista" CASCADE;
  DROP TABLE "paginas_institucionais_blocks_bloco_de_imagem" CASCADE;
  DROP TABLE "paginas_institucionais_blocks_bloco_de_chamada" CASCADE;
  DROP TABLE "paginas_institucionais" CASCADE;
  DROP TABLE "paginas_institucionais_locales" CASCADE;
  DROP TABLE "_paginas_institucionais_v_blocks_bloco_de_texto" CASCADE;
  DROP TABLE "_paginas_institucionais_v_blocks_bloco_de_lista_itens" CASCADE;
  DROP TABLE "_paginas_institucionais_v_blocks_bloco_de_lista" CASCADE;
  DROP TABLE "_paginas_institucionais_v_blocks_bloco_de_imagem" CASCADE;
  DROP TABLE "_paginas_institucionais_v_blocks_bloco_de_chamada" CASCADE;
  DROP TABLE "_paginas_institucionais_v" CASCADE;
  DROP TABLE "_paginas_institucionais_v_locales" CASCADE;
  DROP TABLE "itens_de_conteudo" CASCADE;
  DROP TABLE "itens_de_conteudo_locales" CASCADE;
  DROP TABLE "itens_de_conteudo_rels" CASCADE;
  DROP TABLE "_itens_de_conteudo_v" CASCADE;
  DROP TABLE "_itens_de_conteudo_v_locales" CASCADE;
  DROP TABLE "_itens_de_conteudo_v_rels" CASCADE;
  DROP TABLE "registros_de_auditoria" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "configuracao_do_site" CASCADE;
  DROP TABLE "configuracao_do_site_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_produtos_modelo_de_contratacao";
  DROP TYPE "public"."enum_produtos_status";
  DROP TYPE "public"."enum__produtos_v_version_modelo_de_contratacao";
  DROP TYPE "public"."enum__produtos_v_version_status";
  DROP TYPE "public"."enum__produtos_v_published_locale";
  DROP TYPE "public"."enum_solucoes_status";
  DROP TYPE "public"."enum__solucoes_v_version_status";
  DROP TYPE "public"."enum__solucoes_v_published_locale";
  DROP TYPE "public"."enum_parceiros_status";
  DROP TYPE "public"."enum__parceiros_v_version_status";
  DROP TYPE "public"."enum__parceiros_v_published_locale";
  DROP TYPE "public"."enum_paginas_institucionais_status";
  DROP TYPE "public"."enum__paginas_institucionais_v_version_status";
  DROP TYPE "public"."enum__paginas_institucionais_v_published_locale";
  DROP TYPE "public"."enum_itens_de_conteudo_status";
  DROP TYPE "public"."enum__itens_de_conteudo_v_version_status";
  DROP TYPE "public"."enum__itens_de_conteudo_v_published_locale";
  DROP TYPE "public"."enum_registros_de_auditoria_acao";`)
}
