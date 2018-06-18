const isCi = require('is-ci')

const noLaunch = process.argv.includes('--no-launch')
const isCron = process.env.TRAVIS_EVENT_TYPE === 'cron'
const isWindows = process.platform === 'win32'
const testMinified = process.argv.includes('--minified')
const isSauce = (isCi && isCron) || process.argv.includes('--sauce')

module.exports = function (config) {
  const sauceLabsLaunchers = {
    sauce_safari: {
      base: 'SauceLabs',
      browserName: 'Safari',
      version: '9.0',
      platform: 'OS X 10.11'
    },
    sauce_edge_15: {
      base: 'SauceLabs',
      browserName: 'MicrosoftEdge',
      version: '15.15063'
    },
    sauce_edge_17: {
      base: 'SauceLabs',
      browserName: 'MicrosoftEdge',
      version: '17.17134'
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

  if (!noLaunch) {
    // Cron on Travis or check:qunit --sauce
    if (isSauce) {
      if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
        console.error('SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables must be set')
        process.exit(1)
      }
      browsers = Object.keys(sauceLabsLaunchers)
    } else if (isCi) {
      // AppVeyor
      if (isWindows) {
        browsers = ['IE']
      // Travis
      } else {
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
