const isCi = require('is-ci')
const execute = require('./utils/execute')

const log = console.log // eslint-disable-line

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

  log('Pushing to Github...')
  if (isCi) {
    await execute('git config --global user.email "semantic-release-bot@martynus.net"')
    await execute('git config --global user.name "semantic-release-bot"')
    await execute(`git remote set-url origin https://${process.env.GH_TOKEN}@github.com/sweetalert2/sweetalert2.git`)
  }
  await execute('git push origin')

  log('OK!')
})().catch(console.error)
