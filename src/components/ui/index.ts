// Dono: Onda 2a
// Ponto de entrada dos primitivos. Importar daqui, nunca do caminho do arquivo:
// mantém o inventário de primitivos visível num lugar só e evita que um
// template importe um componente interno por engano.
//
// A galeria de revisão (`demonstracao/GaleriaDePrimitivos`) NÃO é reexportada
// de propósito: ela não é primitivo e não deve ser importada por nenhuma
// página do site.

export { Botao } from './Botao'
export type { PropsDoBotao, VarianteDeBotao } from './Botao'

export { Campo } from './Campo'
export type { PropsDoCampo, TipoDeCampo } from './Campo'

export { Card } from './Card'
export type { PropsDoCard, SuperficieDoCard } from './Card'

export { Container } from './Container'
export type { PropsDoContainer } from './Container'

export { MarcaDePlaceholder } from './MarcaDePlaceholder'
export type { PropsDaMarcaDePlaceholder } from './MarcaDePlaceholder'

export { MolduraCaptura } from './MolduraCaptura'
export type { PropsDaMolduraCaptura } from './MolduraCaptura'

export { Secao } from './Secao'
export type { PropsDaSecao, SuperficieDaSecao } from './Secao'

export { Texto } from './Texto'
export type { PropsDoTexto, TomDeTexto, VarianteDeTexto } from './Texto'

export { Titulo } from './Titulo'
export type { NivelDeTitulo, PesoVisualDeTitulo, PropsDoTitulo } from './Titulo'
