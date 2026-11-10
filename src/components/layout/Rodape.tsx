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
 * Dono: Onda 3a
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

import { Container, Titulo, Texto, MarcaDePlaceholder } from '@/components/ui'
import { emailPublicado, whatsappPublicado } from '@/lib/configuracao-contato'
import { obterConfiguracaoDoSite } from '@/lib/consultas'
import { NOME_DA_MARCA } from '@/lib/rotulos'

import { montarColunasDoRodape, type ContextoDeNavegacao } from './navegacao'

export type PropsDoRodape = ContextoDeNavegacao

const LINK_DE_RODAPE =
  'inline-flex min-h-toque items-center text-apoio leading-corpo text-texto-secundario ' +
  'transition-colors duration-padrao hover:text-texto-principal'

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

export const Rodape = async ({ haParceirosPublicados, idioma }: PropsDoRodape) => {
  const colunas = montarColunasDoRodape({ haParceirosPublicados, idioma })
  const email = emailPublicado()
  const whatsapp = whatsappPublicado()
  const configuracao = await obterConfiguracaoDoSite()
  const identificacao = configuracao.identificacaoDaEmpresa

  const camposDaIdentificacao = CAMPOS_DE_IDENTIFICACAO_DA_EMPRESA.map((campo) => ({
    ...campo,
    valor: identificacao?.[campo.chave]?.trim() || undefined,
  }))
  const camposAusentes = camposDaIdentificacao.filter((campo) => !campo.valor)

  return (
    <Container
      como="footer"
      className="mt-secao-meio border-t border-borda bg-superficie-elevada py-secao"
    >
      <div className="grid gap-card sm:grid-cols-2 md:grid-cols-4">
        {/* RF-004 — coluna Empresa: identificação, não navegação. */}
        <div className="flex flex-col gap-2">
          <Titulo nivel={2} visual="h3">
            Empresa
          </Titulo>
          <Texto variante="apoio" tom="secundario" limitarLargura={false}>
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

          <ul className="flex flex-col gap-1">
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
            <div key={coluna.titulo} className="flex flex-col gap-2">
              <Titulo nivel={2} visual="h3">
                {coluna.titulo}
              </Titulo>
              <ul className="flex flex-col gap-1">
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
    </Container>
  )
}
