const pack = require('../package.json')
const version = process.env.VERSION || pack.version

module.exports =
`/*!
 * ${pack.name} v${version}
 * Released under the ${pack.license} License.
 */`
