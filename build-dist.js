const pify = require('pify')
const rimraf = require('rimraf')
const isCi = require('is-ci')
const execute = require('./utils/execute')

const log = console.log // eslint-disable-line
const removeDir = pify(rimraf)

const version = process.argv[2]

;(async () => {
  log('Deleting the current dist folder...')
  await removeDir('dist')

  log('Running the build...')
  await execute('yarn build')

  log('Committing the dist dir...')
  await execute(`git add --force dist/ && git commit -m "chore: add dist for ${version}"`)

  log('Pushing to Github ...')
  if (isCi) {
    await execute('git config --global user.email "semantic-release-bot@martynus.net"')
    await execute('git config --global user.name "semantic-release-bot"')
    await execute(`git remote set-url origin https://${process.env.GH_TOKEN}@github.com/sweetalert2/sweetalert2.git`)
  }
  await execute('git push origin')

  log('OK!')
})().catch(console.error)
