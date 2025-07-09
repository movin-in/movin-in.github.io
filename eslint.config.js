import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    ignores: [
      'node_modules/',
      'public/',
      'dist/',
      '.vite/',
    ],
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
    rules: {
      semi: ['error', 'never'],          // no semicolons at end of statements
      quotes: ['error', 'single'],       // enforce single quotes
      'no-unused-vars': 'warn',          // unused vars
      'no-unused-expressions': 'warn',   // unused expressions
    },
  },
])
