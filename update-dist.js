const pify = require('pify')
const rimraf = require('rimraf')
const isCi = require('is-ci')
const execute = require('./utils/execute')

const log = console.log // eslint-disable-line
const removeDir = pify(rimraf)

;(async () => {
  log('Resetting the current branch...')
  await execute('git fetch')
  await execute('git checkout .')

  if (isCi) {
    // https://stackoverflow.com/a/47441734
    log('Allow access to other branches...')
    await execute('git config remote.origin.fetch +refs/heads/*:refs/remotes/origin/*')
    await execute('git fetch --unshallow --tags')
  }

  log('Switching to the dist branch...')
  await execute('git checkout -B dist origin/dist')
  await execute('git merge --strategy-option=theirs master --no-ff')

  log('Deleting the current dist folder...')
  await removeDir('dist')

  log('Running the build...')
  await execute('yarn build')

  log('Committing the dist dir...')
  await execute(`git add --force dist/ && git commit -m "chore: add dist"`)

  log('Pushing to Github both master and dist branches...')
  if (isCi) {
    await execute('git config --global user.email "semantic-release-bot@martynus.net"')
    await execute('git config --global user.name "semantic-release-bot"')
    await execute(`git remote set-url origin https://${process.env.GH_TOKEN}@github.com/sweetalert2/sweetalert2.git`)
  }
  await execute('git push origin dist')

  log('OK!')
})().catch(console.error)
