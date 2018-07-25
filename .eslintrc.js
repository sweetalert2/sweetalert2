module.exports = {
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es6: true
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module'
  },
  rules: {
    'quotes': ['error', 'single', { allowTemplateLiterals: true }],
    'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
    'no-var': ['error']
  },
  globals: {
    'QUnit': false
  }
}
