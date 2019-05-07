const execute = require('@sweetalert2/execute')
const fs = require('fs')

const log = console.log // eslint-disable-line

;(async () => {
  log(`Purge jsdelivr cache...`)

  const distFiles = fs.readdirSync('dist')

  for (const version of ['8', 'latest']) {
    log(` - @${version}`)
    await execute(`curl --silent https://purge.jsdelivr.net/npm/sweetalert2@${version}`, { skipLogging: true })

    // dist
    for (const distFile of distFiles) {
      log(`   - dist/${distFile}`)
      await execute(`curl --silent https://purge.jsdelivr.net/npm/sweetalert2@${version}/dist/${distFile}`, { skipLogging: true })
    }
  }

  log('OK!')
})().catch(console.error)
