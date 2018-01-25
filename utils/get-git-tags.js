const execute = require('./execute')

async function getGitTags () {
  const {stdout} = await execute('git tag', {skipLogging: true})
  return stdout.split(/\r?\n/).filter(Boolean)
}

module.exports = getGitTags
