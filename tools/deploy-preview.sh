#!/bin/sh

yarn build
curl https://sweetalert2.github.io -o index.html
