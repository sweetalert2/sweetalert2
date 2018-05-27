const isCi = require('is-ci')

const noLaunch = process.argv.includes('--no-launch')
const isCron = process.env.TRAVIS_EVENT_TYPE === 'cron'
const isWindows = process.platform === 'win32'
const testMinified = process.argv.includes('--minified')

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
      deviceName: 'iPhone 7 Simulator',
      platformName: 'iOS',
      platformVersion: '11.2'
    },
    sauce_android_kitkat: {
      base: 'SauceLabs',
      deviceName: 'Android Emulator',
      browserName: 'Browser',
      platformVersion: '4.4',
      platformName: 'Android'
    },
    sauce_android_marshmallow: {
      base: 'SauceLabs',
      deviceName: 'Android Emulator',
      browserName: 'Chrome',
      platformVersion: '6.0',
      platformName: 'Android'
    }
  }
  let browsers = []

  let files
  if (testMinified) {
    files = [
      'dist/sweetalert2.all.min.js'
    ]
  } else {
    files = [
      'dist/sweetalert2.css',
      'dist/sweetalert2.js'
    ]
  }
  files = files.concat([
    'node_modules/promise-polyfill/dist/polyfill.min.js',
    'test/qunit/**/*.js'
  ])

  let retryLimit = 2
  if (!noLaunch) {
    if (isCi) {
      if (isCron) {
        // Cron on Travis
        browsers = Object.keys(sauceLabsLaunchers)
        retryLimit = 42 // Trying stuff until it works, #1037
      } else if (isWindows) {
        // AppVeyor
        browsers = ['IE']
      } else {
        // Travis
        browsers = ['ChromeHeadless', 'Firefox']
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
    qunit: {
      reorder: false
    },
    customLaunchers: sauceLabsLaunchers,
    browsers,
    retryLimit,
    reporters: ['spec', 'saucelabs'],
    preprocessors: {
      'test/qunit/**/*.js': [
        'webpack',
        'sourcemap'
      ]
    },
    files,
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
    ],
    captureTimeout: 360000,
    browserNoActivityTimeout: 360000
  })
}
