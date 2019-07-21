module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es6: true
  },
  extends: [
    'standard',
    'plugin:@typescript-eslint/recommended'
  ],
  plugins: [
    'import'
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-empty-interface': 0,
    '@typescript-eslint/no-explicit-any': 0,
    'comma-dangle': 0,
    'complexity': ['error', { max: 10 }],
    'import/extensions': ['error', 'always'],
    'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
    'no-prototype-builtins': ['error'],
    'no-var': ['error'],
    'prefer-const': ['error'],
  }
}
