/**
 * Casela de aceite acessível — base de RF-127 (consentimento de tratamento) e
 * RF-221 (aceite separado de comunicações futuras). Um único componente para
 * as duas, porque as duas precisam do mesmo contrato de acessibilidade — o
 * que muda entre elas é só o texto e a obrigatoriedade, decididos por quem usa.
 * Acessibilidade: 13.6 (rótulo associado, erro em texto), 13.9 (alvo de 44 px)
 * Dono: Onda 3c
 *
 * NUNCA pré-marcada por padrão — quem usa este componente decide `checked`
 * explicitamente a cada renderização; não há valor implícito aqui.
 */

import type { ReactNode } from 'react'

import { juntarClasses } from '@/components/ui/juntarClasses'

export type PropsDoCampoDeAceite = {
  id: string
  rotulo: ReactNode
  marcado: boolean
  aoMudar: (marcado: boolean) => void
  erro?: string
  obrigatorio?: boolean
}

export const CampoDeAceite = ({
  id,
  rotulo,
  marcado,
  aoMudar,
  erro,
  obrigatorio = false,
}: PropsDoCampoDeAceite) => {
  const idDoErro = `${id}-erro`

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-entre-alvos">
        <input
          id={id}
          type="checkbox"
          checked={marcado}
          onChange={(evento) => aoMudar(evento.target.checked)}
          required={obrigatorio}
          aria-invalid={erro ? true : undefined}
          aria-describedby={erro ? idDoErro : undefined}
          className={juntarClasses(
            'mt-1 h-6 w-6 shrink-0 rounded-controle border bg-superficie',
            erro ? 'border-erro' : 'border-borda',
          )}
        />
        <label htmlFor={id} className="text-apoio leading-corpo text-texto-principal">
          {rotulo}
        </label>
      </div>

      {erro ? (
        <p id={idDoErro} role="alert" className="text-apoio leading-corpo text-erro">
          {erro}
        </p>
      ) : null}
    </div>
  )
}
