const execute = require('../utils/execute')

const log = console.log // eslint-disable-line

module.exports = async (branchName) => {
  log(`Pushing ${branchName} branch to Github...`)

  await execute('git config --global user.email "semantic-release-bot@martynus.net"')
  await execute('git config --global user.name "semantic-release-bot"')
  await execute(`git remote set-url origin https://${process.env.GH_TOKEN}@github.com/sweetalert2/sweetalert2.git`)

  await execute(`git push origin ${branchName}`)
}
