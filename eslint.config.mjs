// Onda 1 — configuração plana do ESLint (RNF-100..107).
import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({ baseDirectory: __dirname })

const config = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'dist/**',
      'build/**',
      'src/payload-types.ts',
      'src/app/(payload)/admin/importMap.js',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
  {
    rules: {
      // RNF-074: nenhum dado de negócio fixo no código. A regra abaixo não
      // detecta isso sozinha — a verificação é de revisão (ver dev/CONVENCOES.md).
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      // RNF-045: `console` deixa rastro no navegador; aviso e erro seguem liberados.
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
]

export default config
