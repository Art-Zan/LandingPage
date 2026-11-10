/**
 * Composição do menu principal e dos rótulos fixos de navegação.
 * Implementa: RF-002 (cinco itens fixos que não crescem com o portfólio),
 *             RF-004 (colunas do rodapé), RF-005 (rótulos da trilha)
 * Modelo: 6.1 (menu e justificativa), 6.2 (regras de submenu), 6.4 (rotas)
 * Perguntas abertas que afetam este arquivo: Q-006 (nenhuma solução composta
 *   existe — o item "Soluções" fica oculto), Q-025 / D-05 (parceiro com
 *   autorização de marca — o item "Parceiros" é condicional a dado publicado)
 * Dono: Onda 3a
 *
 * POR QUE OS RÓTULOS ESTÃO EM CÓDIGO E ISSO NÃO VIOLA RNF-074. A regra proíbe
 * texto de NEGÓCIO fixo — nome de produto, de solução, de parceiro, número,
 * prazo. Os rótulos abaixo são a estrutura de navegação fixada por 6.1, que
 * explicitamente "não cresce com o portfólio": remover um registro não deixa
 * vestígio nenhum aqui, porque nenhum registro é citado aqui.
 *
 * DUAS AUSÊNCIAS DELIBERADAS, E AS DUAS SÃO DECISÃO DE DADO, NÃO DE CÓDIGO
 * COMENTADO (dev/CONVENCOES.md, seção 4):
 *   · "Soluções" (P-05) é Futuro — nenhuma solução composta existe no
 *     lançamento (Q-006). Não há rota, então não há item. Quando a primeira
 *     solução for publicada, o item volta pelo mesmo mecanismo do de parceiros.
 *   · "Parceiros" (P-07) só é montado quando `haParceirosPublicados` é
 *     verdadeiro. A consulta que produz esse valor está em `consultas.ts`;
 *     aqui não há condição escrita à mão nem link comentado.
 * Item de menu para listagem vazia destrói credibilidade mais que a ausência
 * dele (6.1, princípio 2).
 */

import { ROTAS, type Idioma } from '@/lib/rotas'

export type ItemDeMenu = {
  rotulo: string
  href: string
  /** 6.1 — "Contato" é ação destacada e permanece visível com o menu recolhido. */
  destacado?: boolean
}

/** 6.1 e 6.2 — rótulos fixos da navegação. Nenhum deles nomeia um registro. */
export const ROTULOS = {
  softwares: 'Softwares',
  parceiros: 'Parceiros',
  sobre: 'Sobre',
  contato: 'Contato',
  inicio: 'Início',
} as const

export type ContextoDeNavegacao = {
  /** Existe ao menos um parceiro publicado E com autorização de marca (Q-025). */
  haParceirosPublicados: boolean
  idioma?: Idioma
}

/**
 * RF-002 — o menu principal. A ordem é a de 6.1 e é idêntica em qualquer
 * largura de tela (RF-003).
 *
 * SEM SUBMENU, e é o comportamento exigido: 6.2 regra 3 só ativa o submenu de
 * "Softwares" quando as categorias forem exibidas publicamente, o que depende
 * do gatilho de 6.6 — não atingido com quatro produtos. Abaixo do gatilho, o
 * item leva direto ao catálogo. Nenhum código de submenu é escrito antes disso,
 * porque 6.2 regra 1 proíbe submenu de um destino só.
 */
export const montarItensDoMenu = ({
  haParceirosPublicados,
  idioma,
}: ContextoDeNavegacao): ItemDeMenu[] => {
  const itens: ItemDeMenu[] = [{ rotulo: ROTULOS.softwares, href: ROTAS.catalogo(idioma) }]

  if (haParceirosPublicados) {
    itens.push({ rotulo: ROTULOS.parceiros, href: ROTAS.parceiros(idioma) })
  }

  itens.push({ rotulo: ROTULOS.sobre, href: ROTAS.sobre(idioma) })
  itens.push({ rotulo: ROTULOS.contato, href: ROTAS.contato(idioma), destacado: true })

  return itens
}

export type ColunaDoRodape = {
  titulo: string
  itens: ItemDeMenu[]
}

/**
 * RF-004 — as quatro colunas do rodapé, nesta ordem: Empresa, Portfólio,
 * Contato, Institucional e legal. Empilham na mesma sequência em tela pequena.
 *
 * Links para destino sem conteúdo publicado são OMITIDOS (RF-004): `/parceiros`
 * some do rodapé pela mesma condição que o tira do menu, e a coluna Portfólio
 * não lista categorias enquanto elas não forem exibidas publicamente (6.6).
 * A coluna Empresa não tem links: ela é o bloco de identificação, montado em
 * `Rodape.tsx` a partir de dados que ainda não existem (Q-086).
 */
export const montarColunasDoRodape = ({
  haParceirosPublicados,
  idioma,
}: ContextoDeNavegacao): ColunaDoRodape[] => {
  const portfolio: ItemDeMenu[] = [{ rotulo: ROTULOS.softwares, href: ROTAS.catalogo(idioma) }]
  if (haParceirosPublicados) {
    portfolio.push({ rotulo: ROTULOS.parceiros, href: ROTAS.parceiros(idioma) })
  }

  return [
    { titulo: 'Portfólio', itens: portfolio },
    { titulo: 'Contato', itens: [{ rotulo: ROTULOS.contato, href: ROTAS.contato(idioma) }] },
    {
      titulo: 'Institucional e legal',
      itens: [
        { rotulo: ROTULOS.sobre, href: ROTAS.sobre(idioma) },
        { rotulo: 'Política de privacidade', href: ROTAS.privacidade(idioma) },
        { rotulo: 'Termos de uso', href: ROTAS.termos(idioma) },
      ],
    },
  ]
}
