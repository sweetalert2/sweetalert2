import execute from '@sweetalert2/execute'
import { readFileSync, writeFileSync } from 'fs'

const log = console.log // eslint-disable-line no-console

log('1. Build JS ...')
await execute('./node_modules/.bin/rollup -c --bundleConfigAsCjs')

log('2. Build CSS ...')
await execute('./node_modules/.bin/sass src/sweetalert2.scss dist/sweetalert2.css --no-source-map')
await execute(
  './node_modules/.bin/sass src/sweetalert2.scss dist/sweetalert2.min.css --no-source-map --style=compressed'
)

log('3. Build JS+CSS ...')
const css = readFileSync('dist/sweetalert2.min.css', 'utf8')
const cssInJs = `"undefined"!=typeof document&&function(e,t){var n=e.createElement("style");if(e.getElementsByTagName("head")[0].appendChild(n),n.styleSheet)n.styleSheet.disabled||(n.styleSheet.cssText=t);else try{n.innerHTML=t}catch(e){n.innerText=t}}(document,"${css
  .trim()
  .replace(/"/g, '\\"')}");`
writeFileSync('dist/sweetalert2.all.js', `${readFileSync('dist/sweetalert2.js', 'utf-8')}${cssInJs}`)
writeFileSync('dist/sweetalert2.all.min.js', `${readFileSync('dist/sweetalert2.min.js', 'utf-8')}${cssInJs}`)
