const pify = require('pify')
const rimraf = require('rimraf')
const execute = require('../utils/execute')

const log = console.log // eslint-disable-line
const removeDir = pify(rimraf)

;(async () => {
  log('Resetting the branch...')
  await execute('git checkout .')

  log('Deleting the current dist folder...')
  await removeDir('dist')

  log('Running the build...')
  await execute('yarn build')

  log('OK!')
})().catch(console.error)
