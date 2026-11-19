/**
 * Rodapé global de quatro colunas.
 * Implementa: RF-004 (Empresa, Portfólio, Contato, Institucional e legal,
 *   nesta ordem; links sem conteúdo publicado omitidos; empilha na mesma
 *   ordem em tela pequena), RF-028 (identificação da empresa — razão social e
 *   dados de registro "quando disponíveis"), RF-220 (canal direto de
 *   WhatsApp, sempre visível junto da identificação da empresa)
 * Modelo: 6.1 (rodapé não integra o menu principal), 7 (identificação da
 *   empresa comum a todas as páginas)
 * Acessibilidade: 13.5 regra 3 (região `nav` do rodapé rotulada, distinta da
 *   navegação principal)
 * Perguntas abertas que afetam este arquivo:
 *   Q-053 / Q-086 — razão social, CNPJ e endereço a publicar no rodapé (Q-053
 *     decidiu publicá-los; os valores não foram fornecidos). NENHUM dos três
 *     é inventado aqui, nem como exemplo: cada campo vazio de
 *     `ConfiguracaoDoSite.identificacaoDaEmpresa` (Onda 4a, Tarefa 2) aparece
 *     como marca de conteúdo provisório SÓ em homologação
 *     (dev/CONVENCOES.md §7.3) e não aparece em produção, pela mesma lógica
 *     de RF-004 para link sem destino publicado. Campo preenchido é exibido
 *     normalmente, mesmo que os outros dois ainda faltem.
 *   Q-091 — número de WhatsApp comercial e horário de atendimento
 *     declarado. Sem o número, o canal inteiro é omitido (nunca um número de
 *     exemplo); com o número, o horário ainda falta e é marcado à parte.
 *   Q-031 / Q-063 — e-mail institucional no domínio próprio ainda não
 *     existe; o canal fica omitido enquanto `LEAD_INBOX_ADDRESS` não for
 *     preenchido.
 * Visual (Onda 5): 11.13, 11.16 — logotipo na placa clara da coluna Empresa.
 * Dono: Onda 3a (logotipo: Onda 5)
 *
 * POR QUE ESTE ARQUIVO LÊ `src/lib/configuracao-contato.ts` (Onda 3c) E
 * `src/lib/consultas.ts` (Onda 3b). RF-220 e 14.10 exigem que WhatsApp e
 * e-mail apareçam "no rodapé de todas as páginas", com o MESMO valor usado em
 * `/contato`. Duas fontes de verdade divergentes é o erro que 14.10 aponta
 * como o que mais rápido destrói confiança. `configuracao-contato.ts` já é a
 * leitura tipada e sem valor padrão inventado dessas duas variáveis
 * (`NEXT_PUBLIC_WHATSAPP_NUMERO`, `LEAD_INBOX_ADDRESS`); este arquivo importa
 * as duas funções em vez de reabrir uma terceira leitura de `process.env` —
 * o que violaria dev/CONVENCOES.md §2 (um ponto de leitura por variável).
 * `obterConfiguracaoDoSite` é o mesmo ponto único de leitura do global já
 * usado por P-04 (Onda 3b) — nenhuma segunda consulta ao mesmo global é
 * aberta aqui. Leitura, nunca escrita: nenhum arquivo de outra onda é
 * alterado por este componente.
 *
 * A COLUNA "EMPRESA" NÃO VEM DE `montarColunasDoRodape` (navegacao.ts) DE
 * PROPÓSITO — o comentário daquele arquivo já registra que ela "não tem
 * links: é o bloco de identificação, montado em Rodape.tsx a partir de dados
 * que ainda não existem". As outras três colunas (Portfólio, Contato,
 * Institucional e legal) vêm de lá, sem duplicar a regra de omissão
 * condicional de "Parceiros".
 */

import Image from 'next/image'

import { Container, Texto, MarcaDePlaceholder } from '@/components/ui'
import { MARCA } from '@/lib/ativos-visuais'
import { emailPublicado, whatsappPublicado } from '@/lib/configuracao-contato'
import { obterConfiguracaoDoSite } from '@/lib/consultas'
import { NOME_DA_MARCA } from '@/lib/rotulos'
import { partirWordmark } from '@/lib/wordmark'

import { ControleDeTema } from './ControleDeTema'
import { montarColunasDoRodape, type ContextoDeNavegacao } from './navegacao'

export type PropsDoRodape = ContextoDeNavegacao

// Restyle — palavra do rodapé repousa sem traço, clareia e desenha 1 px
// abaixo na passagem (globals.css, .az-link-nav). Alvo de 44 px (13.9).
const LINK_DE_RODAPE =
  'az-link-nav az-link-nav--rente inline-flex min-h-toque items-center text-corpo leading-corpo ' +
  'text-texto-secundario transition-colors duration-padrao hover:text-texto-principal'

/**
 * Os três campos de `identificacaoDaEmpresa` (src/globals/ConfiguracaoDoSite.ts),
 * com o rótulo usado tanto na etiqueta de placeholder quanto na leitura por
 * tecnologia assistiva. Nenhum valor de exemplo: campo vazio nunca é
 * renderizado como texto, só como placeholder (homologação) ou omissão
 * (produção) — RF-004, dev/CONVENCOES.md §7.3/§7.4.
 */
const CAMPOS_DE_IDENTIFICACAO_DA_EMPRESA = [
  { chave: 'razaoSocial', rotulo: 'Razão social' },
  { chave: 'cnpj', rotulo: 'CNPJ' },
  { chave: 'endereco', rotulo: 'Endereço' },
] as const

/** Restyle — título de coluna do rodapé: rótulo curto em caixa alta (11.14). */
const TITULO_DE_COLUNA =
  'az-rotulo-coluna'

/** Restyle — opções do controle de tema exibido no rodapé (11.13). */
const OPCOES_DE_TEMA = [
  { valor: 'sistema', rotulo: 'Automático' },
  { valor: 'claro', rotulo: 'Claro' },
  { valor: 'escuro', rotulo: 'Escuro' },
] as const

export const Rodape = async ({ haParceirosPublicados, idioma }: PropsDoRodape) => {
  const colunas = montarColunasDoRodape({ haParceirosPublicados, idioma })
  const email = emailPublicado()
  const whatsapp = whatsappPublicado()
  const configuracao = await obterConfiguracaoDoSite()
  const identificacao = configuracao.identificacaoDaEmpresa
  const wordmark = partirWordmark(NOME_DA_MARCA)

  const camposDaIdentificacao = CAMPOS_DE_IDENTIFICACAO_DA_EMPRESA.map((campo) => ({
    ...campo,
    valor: identificacao?.[campo.chave]?.trim() || undefined,
  }))
  const camposAusentes = camposDaIdentificacao.filter((campo) => !campo.valor)

  return (
    // Restyle — o rodapé veste a faixa escura (coluna escura de 11.12) e, nas
    // páginas com chamada final, continua a faixa aberta por ela.
    <footer className="closing az-faixa-escura pb-12 pt-respiro">
      <Container className="flex flex-col gap-12 md:gap-16">
        {/* Linha 1: marca e diretório. Linha 2: controle de tema. */}
        <div className="flex flex-col gap-12 md:gap-16">
          {/* Wordmark grande em texto (11.11, 11.16): decorativo — o nome da
            empresa já é lido na coluna "Empresa" logo abaixo. */}
          <p
            aria-hidden="true"
            className="font-titulo text-marca-rodape font-h1 uppercase leading-none tracking-caixa-alta text-texto-principal"
          >
            {wordmark.antes}
            <span className="text-marca-z">{wordmark.z}</span>
            {wordmark.depois}
          </p>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {/* RF-004 — coluna Empresa: identificação, não navegação. */}
            <div className="flex flex-col items-start gap-3">
              <h2 className={TITULO_DE_COLUNA}>Empresa</h2>
              {/* Onda 5 — peça completa do logotipo (11.16: ≥ 120 px de
                largura). O rodapé veste a faixa escura nos dois temas, e o
                arquivo não vai sobre fundo escuro (11.13): fica na placa
                clara com a área de proteção de 15% da altura da peça.
                Alternativo vazio: o nome da empresa é lido logo abaixo. */}
              <span className="az-placa-da-marca az-placa-da-marca--logo">
                <Image
                  src={MARCA.logo.src}
                  width={MARCA.logo.largura}
                  height={MARCA.logo.altura}
                  alt=""
                  unoptimized
                  className="block"
                />
              </span>
              <Texto variante="corpo" tom="principal" limitarLargura={false}>
                {NOME_DA_MARCA}
              </Texto>

              {/* RF-028, Q-053/Q-086 — cada campo preenchido é exibido; nenhum
                valor de exemplo. Campo vazio nunca renderiza texto vazio: some
                da lista e só entra na etiqueta de placeholder abaixo. */}
              {camposDaIdentificacao
                .filter((campo) => campo.valor)
                .map((campo) => (
                  <Texto key={campo.chave} variante="apoio" tom="secundario" limitarLargura={false}>
                    {campo.chave === 'cnpj' ? `CNPJ: ${campo.valor}` : campo.valor}
                  </Texto>
                ))}

              {/* Campo(s) ainda sem valor (Q-053/Q-086): etiqueta visível só em
                homologação; em produção este bloco não renderiza nada
                (dev/CONVENCOES.md §7.3/§7.4). */}
              {camposAusentes.length > 0 ? (
                <MarcaDePlaceholder
                  rotulo="Dado pendente"
                  detalhe={`${camposAusentes.map((campo) => campo.rotulo).join(', ')} (Q-086)`}
                />
              ) : null}

              <ul className="flex flex-col gap-2">
                {email.configurado ? (
                  <li>
                    <a href={`mailto:${email.valor}`} className={LINK_DE_RODAPE}>
                      {email.valor}
                    </a>
                  </li>
                ) : (
                  <li>
                    <MarcaDePlaceholder rotulo="Canal pendente" detalhe={email.perguntaAberta} />
                  </li>
                )}

                {whatsapp.configurado ? (
                  <li className="flex flex-wrap items-center gap-entre-alvos">
                    <a
                      href={`https://wa.me/${whatsapp.valor}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={LINK_DE_RODAPE}
                    >
                      WhatsApp
                    </a>
                    <MarcaDePlaceholder
                      rotulo="Dado pendente"
                      detalhe="Horário de atendimento (Q-091)"
                    />
                  </li>
                ) : (
                  <li>
                    <MarcaDePlaceholder rotulo="Canal pendente" detalhe={whatsapp.perguntaAberta} />
                  </li>
                )}
              </ul>
            </div>

            {/* RF-004 — Portfólio, Contato, Institucional e legal. Um `nav` só,
              com `display: contents`, para manter as três como participantes
              diretos da mesma grade sem abrir uma segunda região de rodapé. */}
            <nav aria-label="Navegação do rodapé" className="contents">
              {colunas.map((coluna) => (
                <div key={coluna.titulo} className="flex flex-col gap-3">
                  <h2 className={TITULO_DE_COLUNA}>{coluna.titulo}</h2>
                  <ul className="flex flex-col">
                    {coluna.itens.map((item) => (
                      <li key={item.href}>
                        <a href={item.href} className={LINK_DE_RODAPE}>
                          {item.rotulo}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Restyle — linha de base: a troca de tema (11.13), que existia como
            componente da Onda 3a mas não estava em nenhuma página. */}
        <div className="flex">
          <ControleDeTema rotulo="Tema de cores" opcoes={OPCOES_DE_TEMA} />
        </div>
      </Container>
    </footer>
  )
}
