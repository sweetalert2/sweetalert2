const execute = require('./execute')
const assert = require('assert')

async function getGitStatus () {
  const lines = (await execute('git status')).stdout.split(/\r?\n/)

  const match = lines[0].match(/^On branch (\S+)$/)
  assert.ok(match, 'Unable to determine current branch')
  const currentBranch = match[1]

  const cleanWorkingTree = lines.includes('nothing to commit, working tree clean')

  return {currentBranch, cleanWorkingTree}
}

module.exports = getGitStatus
