#!/usr/bin/env zx
import { $, echo, fs } from 'zx'

echo`Purge jsdelivr cache...`

const distFiles = fs.readdirSync('dist')

for (const version of ['@11', '@latest']) {
  echo` - ${version}`
  await $`curl --silent https://purge.jsdelivr.net/npm/sweetalert2${version}`

  // dist
  for (const distFile of distFiles) {
    echo`   - dist/${distFile}`
    await $`curl --silent https://purge.jsdelivr.net/npm/sweetalert2${version}/dist/${distFile}`
  }
}

echo`OK!`
