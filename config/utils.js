var rollup = require('rollup').rollup
var pack = require('../package.json')
var banner = require('./banner.js')
var fs = require('fs')
var zlib = require('zlib')
var uglify = require('uglify-js')

var toUpper = function (_, c) {
  return c ? c.toUpperCase() : ''
}

const classifyRE = /(?:^|[-_\/])(\w)/g
var classify = function (str) {
  return str.replace(classifyRE, toUpper)
}

var zip = function () {
  return new Promise(function (resolve, reject) {
    fs.readFile('dist/' + pack.name + '.min.js', function (err, buf) {
      if (err) return reject(err)
      zlib.gzip(buf, function (err, buf) {
        if (err) return reject(err)
        write('dist/' + pack.name + '.min.js.gz', buf).then(resolve)
      })
    })
  })
}

var write = function (dest, code) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(dest, code, function (err) {
      if (err) return reject(err)
      resolve()
    })
  })
}

var packageRollup = function (options) {
  const moduleId = classify(pack.name)
  return rollup({
    entry: 'src/sweetalert2.js'
  })
  .then(function (bundle) {
    var code = bundle.generate({
      format: options.format,
      banner: banner,
      moduleName: classify(pack.name),
      footer: `if (window.${moduleId}) window.sweetAlert = window.swal = window.${moduleId};`
    }).code.replace(/sweetAlert\.version = '(.*)'/, "sweetAlert.version = '" + pack.version + "'")

    if (options.minify) {
      code = uglify.minify(code, {
        fromString: true
      }).code
    }
    return write(options.dest, code)
  })
}

module.exports = {
  packageRollup: packageRollup,
  write: write,
  zip: zip,
  classify: classify,
  toUpper: toUpper
}
