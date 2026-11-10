// Dono: Onda 2a
// Utilidade local dos primitivos: junta classes, descartando o que for falso.
// Não é componente e não carrega valor visual — só concatena.

export const juntarClasses = (...partes: Array<string | false | null | undefined>): string =>
  partes.filter((parte): parte is string => Boolean(parte)).join(' ')
