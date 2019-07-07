module.exports = {
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es6: true
  },
  extends: 'standard',
  plugins: [
    'import'
  ],
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module'
  },
  rules: {
    'comma-dangle': 0,
    'import/extensions': ['error', 'always'],
    'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
    'no-prototype-builtins': ['error'],
    'no-var': ['error'],
    'prefer-const': ['error'],
  }
}
