module.exports = {
  plugins: ['cypress'],
  env: {
    'cypress/globals': true,
  },
  rules: {
    'no-unsanitized/property': 0,
    'no-unused-expressions': 0,
    'import/extensions': 0,
  },
}
