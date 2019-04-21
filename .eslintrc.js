module.exports = {
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es6: true
  },
  extends: 'eslint:recommended',
  plugins: [
    'import'
  ],
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module'
  },
  rules: {
    'brace-style': ['error', '1tbs'],
    'curly': ['error', 'all'],
    'import/extensions': ['error', 'always'],
    'indent': ['error', 2, { SwitchCase: 1 }],
    'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
    'no-var': ['error'],
    'object-curly-spacing': ['error', 'always'],
    'quotes': ['error', 'single', { allowTemplateLiterals: true }]
  }
}
