const rollup = require('rollup').rollup
const babel = require('rollup-plugin-babel')
const fs = require('fs')
const uglify = require('uglify-js')
const sass = require('rollup-plugin-sass')
const pify = require('pify')
const mkdirp = require('mkdirp')
const pack = require('../package')
const banner = require('./banner')
const classify = require('./classify')

const mkdirpAsync = pify(mkdirp)
const writeFileAsync = pify(fs.writeFile)

module.exports = function packageRollup (options) {
  const moduleId = classify(pack.name)
  return mkdirpAsync('./dist').then(() => {
    return rollup({
      input: options.entry,
      plugins: [
        sass({output: false}),
        babel({exclude: 'node_modules/**'})
      ]
    })
  }).then((bundle) => {
    return bundle.generate({
      format: options.format,
      banner: banner,
      name: classify(pack.name),
      footer: `if (typeof window !== 'undefined' && window.${moduleId}) window.sweetAlert = window.swal = window.${moduleId};`
    })
  }).then((result) => {
    let code = result.code.replace(
      /(sweetAlert.*?).version = ''/,
      `$1.version = '${pack.version}'`
    )
    if (options.minify) {
      code = uglify.minify(code).code
    }
    return writeFileAsync(options.dest, code)
  })
}
