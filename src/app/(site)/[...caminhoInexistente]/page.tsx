/**
 * P-15 — encaminhamento de endereço inexistente para a página de 404 do site
 * Implementa: RF-007 (página não encontrada com cabeçalho, rodapé e caminhos
 *   de retorno para QUALQUER endereço inexistente, não só para registro
 *   ausente dentro de uma rota que existe)
 * Dono: Onda 3a (P-15) — acrescentado na verificação pós-Onda 4
 *
 * Por que este arquivo existe. `(site)/not-found.tsx` só é usado quando uma
 * rota DENTRO do grupo `(site)` chama `notFound()`. Um endereço que não casa
 * com rota nenhuma (`/qualquer-coisa`, `/en/...`) cai no 404 padrão do Next,
 * fora do layout do site: sem cabeçalho, sem rodapé, sem os três caminhos de
 * RF-007 e com dois `<title>`. Este segmento pega todo endereço restante e o
 * entrega ao `not-found.tsx` do grupo, que herda o layout.
 *
 * Rotas específicas (páginas, `/api/**`, `(dev)/revisao/**`, sitemap, robots,
 * arquivos de `public/`) têm precedência sobre o segmento catch-all, então
 * nada existente é capturado. A reserva de `/en` (dev/CONVENCOES.md §5.1)
 * continua respondendo 404 — este arquivo não cria rota sob `/en`, só garante
 * que o 404 seja o do site.
 */

import { notFound } from 'next/navigation'

export default function CaminhoInexistente(): never {
  notFound()
}
