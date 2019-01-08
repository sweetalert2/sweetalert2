const isCi = require('is-ci')

const noLaunch = process.argv.includes('--no-launch')
const isWindows = process.platform === 'win32'
const testMinified = process.argv.includes('--minified')
const isSauce = process.argv.includes('--sauce')

module.exports = function (config) {
  const sauceLabsLaunchers = {
    safari: {
      base: 'SauceLabs',
      browserName: 'Safari',
      version: 'latest',
      // TODO(@limonte): remove this line, the current latest 10.14 doesn't work (#1349)
      platform: 'macOS 10.13'
    },
    edge: {
      base: 'SauceLabs',
      browserName: 'MicrosoftEdge',
      version: 'latest'
    },
    iphone: {
      base: 'SauceLabs',
      browserName: 'Safari',
      deviceName: 'iPhone Simulator',
      platformName: 'iOS',
      platformVersion: 'latest'
    },
    android: {
      base: 'SauceLabs',
      deviceName: 'Android GoogleAPI Emulator',
      browserName: 'Chrome',
      platformName: 'Android',
      platformVersion: 'latest'
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

  const reporters = ['spec', 'saucelabs']

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
        browsers = ['IE', 'ChromeHeadless', 'FirefoxHeadless']
      // Travis
      } else {
        browsers = ['ChromeHeadless', 'FirefoxHeadless']
        if (!testMinified) {
          reporters.push('coverage')
        }
      }
    } else {
      // Local development
      browsers = ['ChromeHeadless']
      reporters.push('coverage')
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
    reporters,
    preprocessors: {
      'test/qunit/**/*.js': [
        'webpack',
        'sourcemap'
      ],
      'dist/*.js': [
        'coverage'
      ]
    },
    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'html', subdir: '.' },
        { type: 'lcov', subdir: '.' }
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
      'karma-coverage',
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
