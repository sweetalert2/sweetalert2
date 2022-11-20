#!/usr/bin/env zx
import { $, echo, fs } from 'zx'

echo`1. Build JS ...`
await $`rollup -c --bundleConfigAsCjs`
echo``

echo`2. Build CSS ...`
await $`sass src/sweetalert2.scss dist/sweetalert2.css --no-source-map`
await $`sass src/sweetalert2.scss dist/sweetalert2.min.css --no-source-map --style=compressed`
echo``

echo`3. Build JS+CSS ...`
const css = fs.readFileSync('dist/sweetalert2.min.css', 'utf8')
const cssInJs = `"undefined"!=typeof document&&function(e,t){var n=e.createElement("style");if(e.getElementsByTagName("head")[0].appendChild(n),n.styleSheet)n.styleSheet.disabled||(n.styleSheet.cssText=t);else try{n.innerHTML=t}catch(e){n.innerText=t}}(document,"${css
  .trim()
  .replace(/"/g, '\\"')}");`
fs.writeFileSync('dist/sweetalert2.all.js', `${fs.readFileSync('dist/sweetalert2.js', 'utf-8')}${cssInJs}`)
fs.writeFileSync('dist/sweetalert2.all.min.js', `${fs.readFileSync('dist/sweetalert2.min.js', 'utf-8')}${cssInJs}`)
echo`OK!`
echo``
