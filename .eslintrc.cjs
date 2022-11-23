module.exports = {
  extends: ['@sweetalert2/eslint-config', 'plugin:no-unsanitized/DOM', 'plugin:jsdoc/recommended'],
  plugins: ['jsdoc'],
  rules: {
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/no-empty-interface': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-this-alias': 0,
    '@typescript-eslint/triple-slash-reference': 0,
    'jsdoc/require-param-description': 0,
    'jsdoc/require-property-description': 0,
    'jsdoc/require-returns-description': 0,
    'jsdoc/no-undefined-types': 0,
    'jsdoc/valid-types': 0,
  },
  overrides: [
    {
      files: ['sweetalert2.d.ts'],
      rules: {
        'jsdoc/require-param': 0,
        'jsdoc/require-returns': 0,
        'jsdoc/require-param-type': 0,
      },
    },
  ],
}
