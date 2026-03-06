import pluginVue from 'eslint-plugin-vue'
import js from '@eslint/js'

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    languageOptions: {
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        fetch: 'readonly',
        Image: 'readonly',
        IntersectionObserver: 'readonly',
        MutationObserver: 'readonly',
      },
    },
    rules: {
      // Component naming
      'vue/multi-word-component-names': 'off',

      // Formatting rules (handled by Prettier)
      'vue/max-attributes-per-line': 'off',
      'vue/html-self-closing': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/attributes-order': 'off',

      // Code quality
      'vue/no-unused-vars': 'warn',
      'no-console': 'warn',
      'no-debugger': 'warn',
      'no-unused-vars': 'warn',
    },
  },
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'public/**',
      'old-static-site/**',
      '*.config.js',
      'lambda/**',
    ],
  },
]
