const execute = require('../utils/execute')
const fs = require('fs')

const log = console.log // eslint-disable-line

;(async () => {
  log(`Purge jsdelivr cache...`)
  const distFiles = fs.readdirSync('dist')
  for (const distFile of distFiles) {
    log(` - ${distFile}`)
    await execute(`curl --silent https://purge.jsdelivr.net/npm/sweetalert2@latest/dist/${distFile}`, { skipLogging: true })
  }

  log('OK!')
})().catch(console.error)
