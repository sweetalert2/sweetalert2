var pack = require('../package.json');
var version = process.env.VERSION || pack.version;

module.exports =
  '/*!\n' +
  ' * ' + pack.name + ' v' + version + '\n' +
  ' * Released under the ' + pack.license + ' License.\n' +
  ' */';
