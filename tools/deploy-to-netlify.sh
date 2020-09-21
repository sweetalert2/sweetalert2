#!/bin/sh

yarn build
curl https://sweetalert2.github.io -o index.html
sed -i 's|src="/|src="https://sweetalert2.github.io/|g' index.html
sed -i 's|https://cdn.jsdelivr.net/npm/sweetalert2@10/||g' index.html
sed -i 's|="./|="https://sweetalert2.github.io/|g' index.html
sed -i 's|="/|="https://sweetalert2.github.io/|g' index.html
