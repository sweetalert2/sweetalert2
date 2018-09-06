const isCi = require('is-ci')
const execute = require('../utils/execute')
const pushBranch = require('./push-branch')

const log = console.log // eslint-disable-line

;(async () => {
  log('Resetting the current branch...')
  await execute('git fetch')
  await execute('git checkout .')

  if (isCi) {
    // https://stackoverflow.com/a/47441734
    log('Allow access to other branches...')
    await execute('git config remote.origin.fetch +refs/heads/*:refs/remotes/origin/*')
    await execute('git fetch --tags')
  }

  log('Switching to the master branch...')
  await execute('git checkout -B master origin/master')

  log('Cherry-picking the latest commit from the dist branch...')
  await execute('git cherry-pick dist')

  await pushBranch('master')

  log('OK!')
})().catch(console.error)
