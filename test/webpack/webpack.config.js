module.exports = {
  entry: './test/webpack/index.js',
  output: {
    filename: 'bundle.js',
    path: `${__dirname}/dist`,
  },
  mode: 'production',
}
