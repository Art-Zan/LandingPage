'use client'

/**
 * Galeria de revisão visual dos primitivos.
 * Visual: 11.12, 11.13 (troca de tema), 11.14, 11.15, 11.17
 * Acessibilidade: 13.2, 13.3, 13.6, 13.9 — todos os estados visíveis de uma vez
 * Dono: Onda 2a
 *
 * PARA QUE SERVE. Conferir a olho, nos dois temas e numa tela só, todos os
 * primitivos em todos os estados. É instrumento de revisão da própria onda,
 * não superfície do site.
 *
 * ESTA GALERIA NÃO PODE VIRAR ROTA PÚBLICA INDEXADA — e, como componente, ela
 * não é rota: nada neste arquivo responde a um endereço. `src/app/**` não
 * pertence à Onda 2a, então a rota de revisão não é criada aqui. Quem a criar
 * precisa satisfazer as quatro condições abaixo, todas na própria página:
 *   1. viver FORA de `(site)`, em grupo próprio, para não herdar o shell
 *      público nem entrar no mapa de rotas de 4.1;
 *   2. exportar `metadata` com `robots: { index: false, follow: false }`;
 *   3. não constar do sitemap (RF-163) nem de nenhum menu;
 *   4. retornar 404 quando `ehProducao()` — via `notFound()` de
 *      `next/navigation`, lendo o modo por `src/lib/env.ts`. Assim a galeria
 *      não existe em produção nem como endereço.
 *
 * `use client` é indispensável e usado só aqui: a troca de tema declarada
 * (11.13) exige escrever `data-tema` no elemento raiz a partir de um evento.
 * Nenhum primitivo de `src/components/ui/` é cliente.
 *
 * TODO TEXTO ABAIXO É ILUSTRATIVO E EVIDENTEMENTE NEUTRO. Nenhum nome de
 * produto, número, prazo, preço ou afirmação sobre o negócio aparece aqui
 * (dev/CONVENCOES.md, seção 8, itens 1 a 3).
 */

import { useEffect, useState } from 'react'

import { Botao } from '../Botao'
import { Campo } from '../Campo'
import { Card } from '../Card'
import { Container } from '../Container'
import { MarcaDePlaceholder } from '../MarcaDePlaceholder'
import { MolduraCaptura } from '../MolduraCaptura'
import { Secao } from '../Secao'
import { Texto } from '../Texto'
import { Titulo } from '../Titulo'

type PreferenciaDeTema = 'sistema' | 'claro' | 'escuro'

const PREFERENCIAS: ReadonlyArray<{ valor: PreferenciaDeTema; rotulo: string }> = [
  { valor: 'sistema', rotulo: 'Seguir o sistema' },
  { valor: 'claro', rotulo: 'Tema claro' },
  { valor: 'escuro', rotulo: 'Tema escuro' },
]

const Bloco = ({ titulo, children }: { titulo: string; children: React.ReactNode }) => (
  <Secao>
    <Container>
      <Titulo nivel={2} className="mb-card">
        {titulo}
      </Titulo>
      <div className="flex flex-col gap-card">{children}</div>
    </Container>
  </Secao>
)

const Linha = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-wrap items-center gap-card-compacto">{children}</div>
)

export const GaleriaDePrimitivos = () => {
  const [preferencia, setPreferencia] = useState<PreferenciaDeTema>('sistema')

  useEffect(() => {
    const raiz = document.documentElement
    if (preferencia === 'sistema') delete raiz.dataset.tema
    else raiz.dataset.tema = preferencia
  }, [preferencia])

  return (
    <>
      <Secao superficie="elevada" rotulo="Controle de tema desta revisão">
        <Container>
          <Titulo nivel={1} className="mb-card-compacto">
            Primitivos de interface
          </Titulo>
          <Texto tom="secundario" className="mb-card">
            Página de revisão visual. Todo texto é ilustrativo e não representa o negócio.
          </Texto>
          <Linha>
            {PREFERENCIAS.map(({ valor, rotulo }) => (
              <Botao
                key={valor}
                variante={preferencia === valor ? 'primaria' : 'secundaria'}
                aria-pressed={preferencia === valor}
                onClick={() => setPreferencia(valor)}
              >
                {rotulo}
              </Botao>
            ))}
          </Linha>
        </Container>
      </Secao>

      <Bloco titulo="Tipografia">
        <Titulo nivel={2} visual="h1">
          Título de nível 1
        </Titulo>
        <Titulo nivel={2}>Título de nível 2</Titulo>
        <Titulo nivel={3}>Título de nível 3</Titulo>
        <Texto>
          Parágrafo de corpo, em dezesseis pixels, com altura de linha de um vírgula cinco e
          largura limitada à faixa de sessenta a setenta e cinco caracteres, para que o olho não
          perca o retorno da linha em tela larga.
        </Texto>
        <Texto tom="secundario">Parágrafo em tom secundário, mesma escala de corpo.</Texto>
        <Texto variante="apoio" tom="secundario">
          Texto de apoio, em quatorze pixels. Rótulo de campo, legenda e mensagem de erro.
        </Texto>
      </Bloco>

      <Bloco titulo="Ação — as três variantes de 14.1">
        <Linha>
          <Botao variante="primaria">Ação primária</Botao>
          <Botao variante="secundaria">Ação secundária</Botao>
          <Botao variante="discreta">Ação discreta</Botao>
        </Linha>
        <Linha>
          <Botao variante="primaria" desabilitado>
            Primária desabilitada
          </Botao>
          <Botao variante="secundaria" desabilitado>
            Secundária desabilitada
          </Botao>
          <Botao variante="discreta" desabilitado>
            Discreta desabilitada
          </Botao>
        </Linha>
        <Linha>
          <Botao variante="primaria" carregando rotuloDeCarregamento="Processando">
            Primária processando
          </Botao>
          <Botao variante="secundaria" carregando rotuloDeCarregamento="Processando">
            Secundária processando
          </Botao>
        </Linha>
        <Linha>
          <Botao variante="secundaria" href="#tipografia">
            Link com aparência de botão
          </Botao>
        </Linha>
        <div className="max-w-texto">
          <Botao variante="primaria" larguraTotal>
            Largura total, para tela pequena
          </Botao>
        </div>
        <Texto variante="apoio" tom="secundario">
          Percorra os botões com a tecla de tabulação: o contorno de foco tem dois pixels e fica
          afastado do preenchimento, de modo que o par medido é sempre contorno contra a
          superfície da página.
        </Texto>
      </Bloco>

      <Bloco titulo="Campo">
        <div className="grid gap-card md:grid-cols-2">
          <Campo id="demo-simples" rotulo="Rótulo do campo" />
          <Campo
            id="demo-obrigatorio"
            rotulo="Campo obrigatório"
            obrigatorio
            textoDeObrigatoriedade="(obrigatório)"
            textoDeApoio="A instrução aparece antes do campo, nunca depois."
          />
          <Campo
            id="demo-erro"
            rotulo="Campo com erro"
            tipo="email"
            erro="Informe um endereço no formato nome@dominio."
            defaultValue="texto sem arroba"
          />
          <Campo id="demo-desabilitado" rotulo="Campo desabilitado" disabled defaultValue="Sem edição" />
          <div className="md:col-span-2">
            <Campo
              id="demo-area"
              tipo="textarea"
              linhas={4}
              rotulo="Área de texto"
              textoDeApoio="Sem limite de tempo para preencher."
            />
          </div>
        </div>
      </Bloco>

      <Bloco titulo="Card">
        <div className="grid gap-card md:grid-cols-3">
          <Card>
            <Titulo nivel={3} className="mb-2">
              Card estático
            </Titulo>
            <Texto variante="apoio" tom="secundario" limitarLargura={false}>
              Superfície elevada mais borda de um pixel. Sem sombra.
            </Texto>
          </Card>
          <Card superficie="base">
            <Titulo nivel={3} className="mb-2">
              Card em superfície base
            </Titulo>
            <Texto variante="apoio" tom="secundario" limitarLargura={false}>
              Mesma borda, sobre o fundo da página.
            </Texto>
          </Card>
          <Card href="#tipografia" rotuloAcessivel="Ver o exemplo de tipografia">
            <Titulo nivel={3} className="mb-2">
              Card acionável
            </Titulo>
            <Texto variante="apoio" tom="secundario" limitarLargura={false}>
              O card inteiro é o alvo. Nenhum link menor aninhado dentro dele.
            </Texto>
          </Card>
        </div>
      </Bloco>

      <Bloco titulo="Moldura de captura de tela">
        <div className="grid gap-card md:grid-cols-2">
          <MolduraCaptura legenda="Legenda opcional, que nunca repete o texto alternativo.">
            <div className="flex items-center justify-center bg-superficie">
              <Texto variante="apoio" tom="secundario" limitarLargura={false}>
                Espaço da captura de tela real
              </Texto>
            </div>
          </MolduraCaptura>
          <MolduraCaptura>
            <div className="flex items-center justify-center bg-superficie">
              <Texto variante="apoio" tom="secundario" limitarLargura={false}>
                Mesma proporção, sem legenda
              </Texto>
            </div>
          </MolduraCaptura>
        </div>
        <Texto variante="apoio" tom="secundario">
          A proporção é idêntica para todo produto e não é configurável. Nenhuma captura real
          existe hoje.
        </Texto>
      </Bloco>

      <Bloco titulo="Marca de conteúdo provisório">
        <Linha>
          <MarcaDePlaceholder rotulo="Conteúdo provisório" />
          <MarcaDePlaceholder rotulo="Conteúdo provisório" detalhe="imagem ainda não entregue" />
        </Linha>
        <Texto variante="apoio" tom="secundario">
          As etiquetas acima aparecem apenas em homologação. Se esta linha estiver vazia, o modo
          do ambiente é produção.
        </Texto>
      </Bloco>

      <Bloco titulo="Estados de cor">
        <Linha>
          <Texto como="span" className="text-sucesso">
            Sucesso
          </Texto>
          <Texto como="span" className="text-atencao">
            Atenção
          </Texto>
          <Texto como="span" className="text-erro">
            Erro
          </Texto>
          <Texto como="span" className="text-destaque">
            Destaque
          </Texto>
        </Linha>
        <Texto variante="apoio" tom="secundario">
          Estados não são ações e não competem com a ação primária. Nenhum deles é usado como
          único portador de significado.
        </Texto>
      </Bloco>
    </>
  )
}
