module.exports = {
  extends: ['@sweetalert2/eslint-config', 'plugin:no-unsanitized/DOM'],
  rules: {
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/no-empty-interface': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-this-alias': 0,
    '@typescript-eslint/triple-slash-reference': 0,
  },
}
