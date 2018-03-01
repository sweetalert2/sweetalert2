const isCi = require('is-ci')

const noLaunch = process.argv.includes('--no-launch')
const isCron = process.env.TRAVIS_EVENT_TYPE === 'cron'
const isWindows = process.platform === 'win32'

module.exports = function (config) {
  const sauceLabsLaunchers = {
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
  let browsers = []
  if (!noLaunch) {
    if (isCi) {
      if (isCron) {
        // Cron on Travis
        browsers = Object.keys(sauceLabsLaunchers)
      } else if (isWindows) {
        // AppVeyor
        browsers = ['IE']
      } else {
        // Travis
        browsers = ['Chrome', 'Firefox']
      }
    } else {
      // Local development
      browsers = ['Chrome']
    }
  }
  config.set({
    port: 3000,
    frameworks: [
      'qunit'
    ],
    customLaunchers: sauceLabsLaunchers,
    browsers,
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
