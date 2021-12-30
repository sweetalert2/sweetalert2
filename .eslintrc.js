module.exports = {
  extends: [
    '@sweetalert2/eslint-config',
    'plugin:no-unsanitized/DOM'
  ],
  rules: {
    'import/extensions': ['error', 'always'],
    '@typescript-eslint/ban-ts-comment': 0,
  }
}
