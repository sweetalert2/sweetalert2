const rollup = require('rollup').rollup
const babel = require('rollup-plugin-babel')
const pack = require('../package.json')
const banner = require('./banner.js')
const fs = require('fs')
const uglify = require('uglify-js')
const css = require('rollup-plugin-css-only')

const toUpper = (_, c) => {
  return c ? c.toUpperCase() : ''
}

const classifyRE = /(?:^|[-_/])(\w)/g
const classify = (str) => {
  return str.replace(classifyRE, toUpper)
}

const write = (dest, code) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(dest, code, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}

const packageRollup = (options) => {
  const moduleId = classify(pack.name)
  return rollup({
    input: options.entry || 'src/sweetalert2.js',
    plugins: [
      css({ output: false }),
      babel({
        exclude: 'node_modules/**'
      })
    ]
  })
  .then((bundle) => {
    return bundle.generate({
      format: options.format,
      banner: banner,
      name: classify(pack.name),
      footer: `if (window.${moduleId}) window.sweetAlert = window.swal = window.${moduleId};`
    })
    .then((result) => {
      var code = result.code.replace(
        /(sweetAlert.*?).version = ''/,
        `$1.version = '${pack.version}'`
      )
      if (options.minify) {
        code = uglify.minify(code).code
      }
      return write(options.dest, code)
    })
  })
}

module.exports = {
  packageRollup: packageRollup,
  write: write,
  classify: classify,
  toUpper: toUpper
}
