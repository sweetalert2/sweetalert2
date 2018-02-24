module.exports = function (config) {
  config.set({
    port: 3000,
    frameworks: [
      'qunit'
    ],
    reporters: ['spec'],
    preprocessors: {
      'test/qunit/**/*.js': [
        'webpack',
        'sourcemap'
      ]
    },
    files: [
      'node_modules/promise-polyfill/dist/polyfill.min.js',
      'dist/sweetalert2.css',
      'dist/sweetalert2.js',
      'test/qunit/**/*.js'
    ],
    webpack: {
      devtool: 'inline-source-map',
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /(node_modules|dist)/,
            use: {
              loader: 'babel-loader',
              options: {/* babel options */}
            }
          }
        ]
      }
    },
    webpackMiddleware: {
      stats: 'errors-only'
    },
    plugins: [
      'karma-webpack',
      'karma-qunit',
      'karma-spec-reporter',
      'karma-sourcemap-loader',
      'karma-chrome-launcher',
      'karma-firefox-launcher'
    ]
  })
}
