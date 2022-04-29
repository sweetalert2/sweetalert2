module.exports = {
  extends: ['@sweetalert2/eslint-config', 'plugin:no-unsanitized/DOM'],
  plugins: ['import'],
  rules: {
    'import/extensions': ['error', 'always'],
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/no-empty-interface': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/triple-slash-reference': 0,
  },
}
