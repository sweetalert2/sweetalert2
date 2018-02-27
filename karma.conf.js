module.exports = function (config) {
  var sauceLabsLaunchers = {
    sauce_safari: {
      base: 'SauceLabs',
      browserName: 'Safari'
    },
    sauce_edge: {
      base: 'SauceLabs',
      browserName: 'MicrosoftEdge'
    },
    sauce_iphone: {
      base: 'SauceLabs',
      browserName: 'Safari',
      deviceName: 'iPhone 7 Simulator'
    },
    sauce_android: {
      base: 'SauceLabs',
      deviceName: 'Android Emulator',
      browserName: 'Chrome',
      platformVersion: '6.0',
      platformName: 'Android'
    }
  }

  config.set({
    port: 3000,
    frameworks: [
      'qunit'
    ],
    customLaunchers: sauceLabsLaunchers,
    reporters: ['spec', 'saucelabs'],
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
      'karma-firefox-launcher',
      'karma-ie-launcher',
      'karma-sauce-launcher'
    ]
  })
}
