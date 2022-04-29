import pify from 'pify'
import rimraf from 'rimraf'
import execute from '@sweetalert2/execute'
import replaceInFile from 'replace-in-file'

const log = console.log // eslint-disable-line no-console
const removeDir = pify(rimraf)

;(async () => {
  log('Resetting the branch...')
  await execute('git checkout .')

  log('Deleting the current dist folder...')
  await removeDir('dist')

  // the command has been called by semantic-release, bump version in src/SweetAlert.js before building dist
  if (process.env.VERSION) {
    log('Updating the version in src/SweetAlert.js...')
    replaceInFile.sync({
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
