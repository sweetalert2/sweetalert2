const noLaunch = process.argv.includes('--no-launch')
const testMinified = process.argv.includes('--minified')
const isSauce = process.argv.includes('--sauce')
const isNetlify = process.argv.includes('--netlify')

if (isNetlify) {
  process.env.CHROME_BIN = require('puppeteer').executablePath()
}

const webpackConfig = {
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
}

const karmaPlugins = [
  'karma-webpack',
  'karma-qunit',
  'karma-spec-reporter',
  'karma-sourcemap-loader',
  'karma-chrome-launcher',
  'karma-firefox-launcher',
  'karma-ie-launcher',
  'karma-sauce-launcher'
]

const preprocessors = {
  'test/qunit/**/*.js': [
    'webpack',
    'sourcemap'
  ],
}

const sauceLabsLaunchers = {
  safari: {
    base: 'SauceLabs',
    browserName: 'Safari',
    browserVersion: 'latest',
    platformName: 'macOS 10.15'
  },
  edge: {
    base: 'SauceLabs',
    browserName: 'MicrosoftEdge',
    browserVersion: '18.17763',
    platformName: 'Windows 10',
  },
  ie: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    browserVersion: 'latest',
    platformName: 'Windows 7'
  },
}

function checkSauceCredentials () {
  if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
    console.error('SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables must be set')
    process.exit(1)
  }
}

function getFiles () {
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
  return files.concat([
    'node_modules/promise-polyfill/dist/polyfill.min.js',
    'node_modules/@webcomponents/template/template.js',
    'test/qunit/**/*.js'
  ])
}

function getBrowsers () {
  if (noLaunch) {
    return []
  }

  let browsers = ['ChromeHeadless']

  // Cron on GitHub Actions or check:qunit --sauce
  if (isSauce) {
    checkSauceCredentials()
    browsers = Object.keys(sauceLabsLaunchers)

  // GitHub Actions
  } else if (process.env.GITHUB_ACTION) {
    browsers = ['ChromeHeadless', 'FirefoxHeadless']
  }

  return browsers
}

function getReporters () {
  return isSauce ? ['spec', 'saucelabs'] : ['spec']
}

module.exports = function (config) {
  config.set({
    port: 3000,
    plugins: karmaPlugins,

    frameworks: ['qunit'],
    qunit: { reorder: false },

    customLaunchers: sauceLabsLaunchers,

    files: getFiles(),
    browsers: getBrowsers(),
    reporters: getReporters(),
    preprocessors,

    webpack: webpackConfig,
    webpackMiddleware: {
      stats: 'errors-only'
    },

    captureTimeout: 360000,
    browserNoActivityTimeout: 360000
  })
}
