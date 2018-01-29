const execute = require('./execute')
const assert = require('assert')

async function getGitStatus () {
  const lines = (await execute('git status')).stdout.split(/\r?\n/)

  const match = lines[0].match(/^On branch (\S+)$/)
  assert.ok(match, 'Unable to determine current branch')
  const currentBranch = match[1]

  const isCleanWorkingTree = Boolean(lines.find(line => line.startsWith('nothing to commit,')))

  return {currentBranch, isCleanWorkingTree}
}

module.exports = getGitStatus
