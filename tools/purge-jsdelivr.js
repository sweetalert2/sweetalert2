const execute = require('../utils/execute')
const fs = require('fs')

const log = console.log // eslint-disable-line

;(async () => {
  log(`Purge jsdelivr cache...`)

  log(' - @latest')
  await execute(`curl --silent https://purge.jsdelivr.net/npm/sweetalert2@latest`, { skipLogging: true })
  log(' - @7')
  await execute(`curl --silent https://purge.jsdelivr.net/npm/sweetalert2@7`, { skipLogging: true })

  const distFiles = fs.readdirSync('dist')
  for (const distFile of distFiles) {
    log(` - ${distFile}`)
    await execute(`curl --silent https://purge.jsdelivr.net/npm/sweetalert2@latest/dist/${distFile}`, { skipLogging: true })
    await execute(`curl --silent https://purge.jsdelivr.net/npm/sweetalert2@7/dist/${distFile}`, { skipLogging: true })
  }

  log('OK!')
})().catch(console.error)
