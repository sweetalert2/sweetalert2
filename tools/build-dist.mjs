#!/usr/bin/env zx
import { $, echo, fs } from 'zx'

echo`Resetting the branch...`
await $`git checkout .`
echo``

// the command has been called by semantic-release, bump version in src/SweetAlert.js before building dist
if (process.env.VERSION) {
  echo`Updating the version in src/SweetAlert.js...`
  fs.writeFileSync(
    'src/SweetAlert.js',
    fs.readFileSync('src/SweetAlert.js', 'utf8').replace(/version = '(.*?)'/, `version = '${process.env.VERSION}'`)
  )
  await $`git add src/SweetAlert.js`
  echo``
}

echo`Running the build...`
await $`yarn build`
echo``

echo`OK!`
