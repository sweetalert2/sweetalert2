var pack = require('../package.json')
var version = process.env.VERSION || pack.version

module.exports =
  '/*!\n' +
  ' * ' + pack.name + ' v' + version + '\n' +
  ' * (c) ' + new Date().getFullYear() + ' ' + pack.author + '\n' +
  ' * Released under the ' + pack.license + ' License.\n' +
  ' */'
