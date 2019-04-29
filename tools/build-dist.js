const pify = require('pify')
const rimraf = require('rimraf')
const execute = require('@sweetalert2/execute')
const replaceInFile = require('replace-in-file')

const log = console.log // eslint-disable-line
const removeDir = pify(rimraf)

;(async () => {
  log('Resetting the branch...')
  await execute('git checkout .')

  log('Deleting the current dist folder...')
  await removeDir('dist')

  // the command has been called by semantic-release, bump version in src/SweetAlert.js before building dist
  if (process.env.VERSION) {
    log('Updating the version in src/SweetAlert.js...')
    await replaceInFile({
      files: 'src/SweetAlert.js',
      from: /\.version = '.*?'/,
      to: `.version = '${process.env.VERSION}'`,
    })
    await execute('git add src/SweetAlert.js')
  }

  log('Running the build...')
  await execute('yarn build')

  log('OK!')
})().catch(console.error)
