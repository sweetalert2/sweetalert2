const execute = require('../utils/execute')
const pushBranch = require('./push-branch')

const log = console.log // eslint-disable-line

;(async () => {
  log('Switching to the master branch...')
  await execute('git checkout -B master origin/master')

  log('Cherry-picking the latest commit from the dist branch...')
  await execute('git cherry-pick dist')

  await pushBranch('master')

  log('OK!')
})().catch(console.error)
