<p align="center">
  <a href="https://sweetalert2.github.io/">
    <img src="/assets/swal2-logo.png" alt="SweetAlert2">
  </a>
</p>

<br>

<p align="center">
  <a href="https://travis-ci.org/sweetalert2/sweetalert2"><img alt="Build Status" src="https://travis-ci.org/sweetalert2/sweetalert2.svg?branch=master"></a>
  <a href="https://www.npmjs.com/package/sweetalert2"><img alt="Version" src="https://img.shields.io/npm/v/sweetalert2.svg"></a>
  <a href="https://www.jsdelivr.com/package/npm/sweetalert2"><img alt="jsdelivr" src="https://data.jsdelivr.com/v1/package/npm/sweetalert2/badge?style=rounded"></a>
  <a href="https://checkgzipcompression.com/?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsweetalert2%2Fsweetalert2%2Fdist%2Fdist%2Fsweetalert2.all.min.js"><img alt="gzip size" src="http://img.badgesize.io/sweetalert2/sweetalert2/dist/dist/sweetalert2.all.min.js.svg?compression=gzip"></a>
  <a href="http://isitmaintained.com/project/sweetalert2/sweetalert2"><img alt="Average time to resolve an issue" src="http://isitmaintained.com/badge/resolution/sweetalert2/sweetalert2.svg"></a>
  <a href="https://gitter.im/sweetalert2/Lobby"><img alt="Gitter" src="https://badges.gitter.im/Join%20Chat.svg"></a>
  <a href="https://www.patreon.com/limonte"><img alt="Support me on Patreon" src="http://ionicabizau.github.io/badges/patreon.svg"></a>
  <a href="https://www.paypal.me/limonte/5eur"><img alt="PayPal Donate" src="http://ionicabizau.github.io/badges/paypal.svg"></a>
</p>

<p align="center">
  A beautiful, responsive, customizable, accessible (WAI-ARIA) replacement for JavaScript's popup boxes. Zero dependencies.
</p>

<p align="center">
  <a href="https://sweetalert2.github.io/">
    <img src="https://raw.github.com/sweetalert2/sweetalert2/master/assets/sweetalert2.gif" width="515"><br>
    See SweetAlert2 in action ↗
  </a>
</p>

---

:point_right: **Upgrading from v6.x to v7.x?** [Read the release notes!](https://github.com/sweetalert2/sweetalert2/releases/tag/v7.0.0)

:point_right: **Migrating from [SweetAlert](https://github.com/t4t5/sweetalert)?** [SweetAlert 1.x to SweetAlert2 migration guide](https://github.com/sweetalert2/sweetalert2/wiki/Migration-from-SweetAlert-to-SweetAlert2)

---

Installation
------------

```bash
npm install --save sweetalert2
```

Or:

```bash
bower install --save sweetalert2
```

Or download from CDN: [unpkg.com/sweetalert2](https://unpkg.com/sweetalert2) | [jsdelivr.net/npm/sweetalert2](https://cdn.jsdelivr.net/npm/sweetalert2)


Usage
-----

```html
<script src="sweetalert2/dist/sweetalert2.all.min.js"></script>

<!-- Include a polyfill for ES6 Promises (optional) for IE11, UC Browser and Android browser support -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/core-js/2.4.1/core.js"></script>
```

You can also include the stylesheet separately if desired:

```html
<script src="sweetalert2/dist/sweetalert2.min.js"></script>
<link rel="stylesheet" href="sweetalert2/dist/sweetalert2.min.css">
```

Or:

```js
// ES6 Modules or TypeScript
import swal from 'sweetalert2'

// CommonJS
const swal = require('sweetalert2')
```

Please note that TypeScript is supported, so you don't have to install a third-party declaration file.


Examples
--------

The most basic message:

```js
swal('Hello world!')
```

A message signaling an error:

```js
swal('Oops...', 'Something went wrong!', 'error')
```

Handling the result of SweetAlert2 modal:

```js
swal({
  title: 'Are you sure?',
  text: 'You will not be able to recover this imaginary file!',
  type: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Yes, delete it!',
  cancelButtonText: 'No, keep it'
}).then((result) => {
  if (result.value) {
    swal(
      'Deleted!',
      'Your imaginary file has been deleted.',
      'success'
    )
  // For more information about handling dismissals please visit
  // https://sweetalert2.github.io/#handling-dismissals
  } else if (result.dismiss === swal.DismissReason.cancel) {
    swal(
      'Cancelled',
      'Your imaginary file is safe :)',
      'error'
    )
  }
})
```

## [Go here to see the docs and more examples ↗](https://sweetalert2.github.io/)


Browser compatibility
---------------------

| IE11* | Edge | Chrome | Firefox | Safari | Opera | Android Browser* | UC Browser* |
|-------|------|--------|---------|--------|-------|------------------|-------------|
|  ✅   |   ✅  |   ✅   |     ✅   |   ✅   |    ✅   |        ✅        |      ✅      |

\* ES6 Promise polyfill should be included, see [usage example](#usage).

Note that SweetAlert2 **does not** and **will not** provide support or functionality of any kind on IE10 and lower.


Collaborators
-------------

| [![](https://avatars1.githubusercontent.com/u/1343250?v=4&s=80)](https://github.com/toverux) | [![](https://avatars2.githubusercontent.com/u/4542461?v=4&s=80)](https://github.com/birjolaxew) | [![](https://avatars1.githubusercontent.com/u/5918348?v=4&s=80)](https://github.com/samturrell) | [![](https://avatars3.githubusercontent.com/u/9093699?v=4&s=80)](https://github.com/acupajoe) | [![](https://avatars3.githubusercontent.com/u/3198597?v=4&s=80)](https://github.com/zenflow) | [![](https://avatars2.githubusercontent.com/u/895831?v=4&s=80)](https://github.com/patrickhlauke) |
|-|-|-|-|-|-|
| [@toverux](https://github.com/toverux) | [@birjolaxew](https://github.com/birjolaxew) | [@samturrell](https://github.com/samturrell) | [@acupajoe](https://github.com/acupajoe) | [@zenflow](https://github.com/zenflow) | [@patrickhlauke](https://github.com/patrickhlauke) |


Contributing
------------

If you would like to contribute enhancements or fixes, please do the following:

1. Fork the `sweetalert2` repository and clone it locally.

2. Make sure you have [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) installed.

3. When in the SweetAlert2 directory, run `npm install` or `yarn install` to install dependencies.

4. Start gulp watcher `gulp watch` to automatically serve, build, and minify the SCSS and JS-files.

5. Ensure that you didn't break any of tests:

  - in browser: http://localhost:8080/test/qunit/
  - via CLI: `npm test`


Related projects
-------------------------

- [ngx-sweetalert2](https://github.com/sweetalert2/ngx-sweetalert2) - Angular 4+ integration
- [sweetalert2-adonisjs-nuxtjs](https://github.com/sweetalert2/sweetalert2-adonisjs-nuxtjs) - AdonisJS + Nuxt.js demo
- [sweetalert2-webpack-demo](https://github.com/sweetalert2/sweetalert2-webpack-demo) - webpack demo


Related community projects
-------------------------

- [avil13/vue-sweetalert2](https://github.com/avil13/vue-sweetalert2) - Vue.js wrapper
- [softon/sweetalert](https://github.com/softon/sweetalert) - Laravel 5 Package
- [alex-shamshurin/sweetalert2-react](https://github.com/alex-shamshurin/sweetalert2-react) - React component

Donations
---------

Has SweetAlert2 helped you create an amazing application? You can show your support by making a donation in one of two ways:

- https://www.paypal.me/limonte/5eur
- https://www.patreon.com/limonte

### [Hall of Donators :trophy:](DONATIONS.md)
