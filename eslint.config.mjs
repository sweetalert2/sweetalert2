import jsdoc from 'eslint-plugin-jsdoc'
import sweetAlert2EslintConfig from '@sweetalert2/eslint-config'
import nounsanitized from 'eslint-plugin-no-unsanitized'
import pluginCypress from 'eslint-plugin-cypress/flat'
import globals from 'globals'

export default [
  ...sweetAlert2EslintConfig,
  jsdoc.configs['flat/recommended'],
  nounsanitized.configs.recommended,
  pluginCypress.configs.recommended,
  {
    plugins: {
      jsdoc,
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': 0,
      '@typescript-eslint/no-empty-interface': 0,
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/no-this-alias': 0,
      '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '_' }],
      '@typescript-eslint/triple-slash-reference': 0,
      'jsdoc/require-param-description': 0,
      'jsdoc/require-property-description': 0,
      'jsdoc/require-returns-description': 0,
      'jsdoc/no-undefined-types': 0,
      'jsdoc/tag-lines': 0,
      'jsdoc/valid-types': 0,
    },
  },
  {
    files: ['sweetalert2.d.ts'],
    rules: {
      'jsdoc/require-param': 0,
      'jsdoc/require-returns': 0,
      'jsdoc/require-param-type': 0,
    },
  },
  {
    files: ['cypress/**/*.js'],
    rules: {
      '@typescript-eslint/no-unused-expressions': 0,
      'no-unsanitized/property': 0,
      'no-unused-expressions': 0,
      'jsdoc/require-jsdoc': 0,
    },
  },
  {
    files: ['rollup.config.js', 'release.config.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ['tools/*.mjs'],
    rules: {
      '@typescript-eslint/no-unused-expressions': 0,
    },
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
]
