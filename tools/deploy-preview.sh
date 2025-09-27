#!/bin/sh

yarn build
ls -la
curl https://sweetalert2.github.io -o index.html
