// Onda 1 — configuração base do Next.
// Requisitos do PRD atendidos aqui: RNF-012 (formatos modernos de imagem),
// RNF-041 (cabeçalhos de segurança do navegador — parcial, ver nota de CSP),
// RNF-040 (HSTS; o redirecionamento http->https em si é da camada de hospedagem, D-15).

import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

/**
 * Cabeçalhos de segurança aplicados a toda resposta (RNF-041).
 *
 * NOTA DE ESCOPO — Content-Security-Policy NÃO está aqui de propósito.
 * Uma CSP correta para este projeto depende de duas coisas que ainda não existem:
 *   1. a lista final de origens de terceiro (medição — D-08; e-mail/WhatsApp — 14.10);
 *   2. o painel Payload em `/(payload)`, que precisa de diretivas próprias, mais
 *      permissivas que as do site público.
 * A CSP é entregável da onda de deploy/hardening, com escopo por rota.
 * Enquanto não existir, RNF-041 está PARCIALMENTE atendido — registrado como lacuna.
 */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
]

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // RNF-012: formato moderno com alternativa compatível, negociado pelo navegador.
  // RNF-011/RNF-013: os tamanhos abaixo limitam o número de variantes geradas.
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [64, 96, 128, 256, 384],
    // Mídia servida pelo próprio Payload (mesma origem). Origem externa só entra
    // aqui com decisão registrada — nenhuma existe hoje.
    remotePatterns: [],
  },

  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },

  // A reserva estrutural de inglês (RNF-083, Q-011) NÃO usa `i18n` do Next:
  // App Router não tem essa opção e o segmento de idioma é rota explícita.
  // Ver dev/CONVENCOES.md, seção "Reserva de inglês".

  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
