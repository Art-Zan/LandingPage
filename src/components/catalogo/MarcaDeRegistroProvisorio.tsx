/**
 * Marca de registro provisório — etiqueta de nível de REGISTRO
 * Contrato: dev/CONVENCOES.md §7.3 ("todo campo ou registro com
 *   `placeholder: true` é marcado visualmente" em homologação)
 * Visual: herdado de `MarcaDePlaceholder` (Onda 2a) — 11.12, 11.14, 11.15
 * Perguntas abertas que afetam este arquivo: 16.6 (os cinco insumos do
 *   lançamento não existem)
 * Dono: Onda 3b (território `src/components/catalogo/**`) — acrescentado na
 *   verificação pós-Onda 4
 *
 * Por que existe. Até aqui só a captura de P-04 e as páginas legais exibiam a
 * etiqueta; a inicial, P-02, P-03, o topo de P-04 e o card de produto
 * renderizavam registro `placeholder: true` sem marca nenhuma, o que deixa o
 * revisor de homologação sem o sinal que §7.3 exige. Um componente só, para
 * que o texto e a regra não se repitam em cinco lugares.
 *
 * Em produção não renderiza nada (a decisão é de `MarcaDePlaceholder`). Não é
 * a trava — a trava é o `prebuild` e o `beforeChange` de §7.4.
 */

import { MarcaDePlaceholder } from '@/components/ui'
import { ROTULO_DE_CONTEUDO_PROVISORIO } from '@/lib/rotulos'

export type PropsDaMarcaDeRegistroProvisorio = {
  registro: { placeholder?: boolean | null } | null | undefined
  className?: string
}

export const MarcaDeRegistroProvisorio = ({
  registro,
  className,
}: PropsDaMarcaDeRegistroProvisorio) =>
  registro?.placeholder ? (
    <MarcaDePlaceholder
      rotulo={ROTULO_DE_CONTEUDO_PROVISORIO}
      detalhe="Registro provisório — não representa o negócio real (16.6)."
      className={className}
    />
  ) : null
