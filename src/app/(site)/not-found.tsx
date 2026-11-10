/**
 * P-15 — Página não encontrada
 * Implementa: RF-007 (mensagem objetiva, ao menos três caminhos de retorno,
 *   resposta de recurso inexistente, página não indexável), RF-006
 *   (navegação cruzada — nenhuma página é beco sem saída)
 * Conversão: 14.1 (rótulos do inventário de chamadas para ação — mesmo texto
 *   em todo o site, RNF-074)
 * Perguntas abertas que afetam este arquivo: Q-006 ("Soluções" não é
 *   oferecida como caminho de retorno — nenhuma solução composta existe no
 *   lançamento, e 6.3 só acrescenta esse destino quando a rota existir),
 *   P-17 busca (Futuro — não é oferecida como caminho por não estar ativa)
 * Dono: Onda 3a
 *
 * HERDA CABEÇALHO, RODAPÉ E IDENTIDADE de `(site)/layout.tsx` — RF-007 exige
 * exatamente isso, e é automático por este arquivo viver dentro do grupo
 * `(site)`. O código de resposta HTTP de recurso inexistente também é
 * automático: `not-found.tsx` é o mecanismo do próprio App Router para isso,
 * sem necessidade de manipular `Response` aqui.
 *
 * OS TRÊS CAMINHOS SÃO OS MÍNIMOS EXIGIDOS POR RF-007 — inicial, catálogo e
 * contato — construídos por `src/lib/rotas.ts`, nunca por caminho literal.
 */

import type { Metadata } from 'next'

import { Botao, Container, Secao, Texto, Titulo } from '@/components/ui'
import { ACOES } from '@/lib/rotulos'
import { IDIOMA_PADRAO, ROTAS } from '@/lib/rotas'

export const metadata: Metadata = {
  title: 'Página não encontrada',
  // RF-007 — não indexável, e fora do mapa do site (RF-163, RF-172).
  robots: { index: false, follow: false },
}

export default function NaoEncontrada() {
  return (
    <Secao>
      <Container>
        <Titulo nivel={1} className="mb-card-compacto">
          Página não encontrada
        </Titulo>
        <Texto tom="secundario" className="mb-card">
          O endereço acessado não existe ou não está mais disponível. Veja alguns caminhos para
          continuar:
        </Texto>
        <div className="flex flex-wrap gap-card-compacto">
          <Botao href={ROTAS.inicial(IDIOMA_PADRAO)} variante="secundaria">
            Ir para a página inicial
          </Botao>
          <Botao href={ROTAS.catalogo(IDIOMA_PADRAO)} variante="secundaria">
            {ACOES.verSoftwares}
          </Botao>
          <Botao href={ROTAS.contato(IDIOMA_PADRAO)} variante="secundaria">
            {ACOES.falarComEquipe}
          </Botao>
        </div>
      </Container>
    </Secao>
  )
}
