/**
 * Campo de seleção acessível — assunto e interesse do formulário de contato.
 * Acessibilidade: 13.6 (rótulo persistente e associado, erro em texto,
 *   `aria-invalid`/`aria-describedby`), 13.9 (alvo de toque 44 px), 13.3
 *   (erro nunca só por cor)
 * Visual: 11.14 (rótulo 14 px, controle 16 px), 11.15 (raio e borda)
 * Dono: Onda 3c
 *
 * Não vive em `src/components/ui/` (Onda 2a) porque `Campo` cobre só entrada
 * de texto/área de texto (13.6 regra combinada com o inventário fechado de
 * `TipoDeCampo`); um primitivo de seleção não existe ainda. Em vez de alterar
 * arquivo de outra onda, este componente fica no território do formulário de
 * contato e replica deliberadamente o mesmo contrato visual e de
 * acessibilidade de `Campo`, para que os dois sejam indistinguíveis para
 * quem preenche.
 */

import type { ReactNode, SelectHTMLAttributes } from 'react'

import { juntarClasses } from '@/components/ui/juntarClasses'

export type OpcaoDeSelecao = { valor: string; rotulo: string }

export type PropsDoCampoDeSelecao = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'id' | 'className' | 'aria-invalid' | 'aria-describedby'
> & {
  id: string
  rotulo: string
  opcoes: readonly OpcaoDeSelecao[]
  /** Primeira opção, sem valor selecionável — instrui a escolher (13.6 regra 3). */
  rotuloDaOpcaoVazia?: string
  erro?: string
  obrigatorio?: boolean
  textoDeObrigatoriedade?: string
}

const CONTROLE = juntarClasses(
  'w-full min-h-toque',
  'px-card-compacto py-2',
  'text-corpo leading-corpo text-texto-principal',
  'bg-superficie border rounded-controle',
  'transition-colors duration-padrao',
)

export const CampoDeSelecao = ({
  id,
  rotulo,
  opcoes,
  rotuloDaOpcaoVazia,
  erro,
  obrigatorio = false,
  textoDeObrigatoriedade,
  ...resto
}: PropsDoCampoDeSelecao): ReactNode => {
  const idDoErro = `${id}-erro`

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-apoio font-rotulo leading-corpo text-texto-principal">
        {rotulo}
        {obrigatorio && textoDeObrigatoriedade ? (
          <span className="text-texto-secundario"> {textoDeObrigatoriedade}</span>
        ) : null}
      </label>

      <select
        id={id}
        required={obrigatorio}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? idDoErro : undefined}
        className={juntarClasses(CONTROLE, erro ? 'border-erro' : 'border-borda')}
        {...resto}
      >
        {rotuloDaOpcaoVazia ? (
          <option value="" disabled>
            {rotuloDaOpcaoVazia}
          </option>
        ) : null}
        {opcoes.map((opcao) => (
          <option key={opcao.valor} value={opcao.valor}>
            {opcao.rotulo}
          </option>
        ))}
      </select>

      {erro ? (
        <p id={idDoErro} role="alert" className="text-apoio leading-corpo text-erro">
          {erro}
        </p>
      ) : null}
    </div>
  )
}
