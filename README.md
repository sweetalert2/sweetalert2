<p align="center">
  <a href="https://sweetalert2.github.io/">
    <img src="/assets/swal2-logo.png" alt="SweetAlert2">
  </a>
</p>

<p align="center">
  A beautiful, responsive, customizable, accessible (WAI-ARIA) replacement for JavaScript's popup boxes. Zero dependencies.
</p>

<p align="center">
  <a href="https://sweetalert2.github.io/">
    <img src="https://raw.github.com/sweetalert2/sweetalert2/master/assets/sweetalert2.gif" width="562"><br>
    See SweetAlert2 in action ↗
  </a>
</p>

<p align="center">
  <a href="https://travis-ci.org/sweetalert2/sweetalert2"><img alt="Build Status: Linux" src="https://travis-ci.org/sweetalert2/sweetalert2.svg?branch=master"></a>
  <a href="https://ci.appveyor.com/project/limonte/sweetalert2/branch/master"><img alt="Build Status: Windows" src="https://ci.appveyor.com/api/projects/status/paqdtx0snu53w5c1/branch/master?svg=true"></a>
  <a href="https://coveralls.io/github/sweetalert2/sweetalert2?branch=master"><img src="https://coveralls.io/repos/github/sweetalert2/sweetalert2/badge.svg?branch=master&" alt="Coverage Status"></a>
  <a href="https://www.npmjs.com/package/sweetalert2"><img alt="Version" src="https://img.shields.io/npm/v/sweetalert2.svg"></a>
  <a href="https://www.jsdelivr.com/package/npm/sweetalert2"><img alt="jsdelivr" src="https://data.jsdelivr.com/v1/package/npm/sweetalert2/badge?style=rounded"></a>
  <a href="https://www.paypal.me/limonte/5eur"><img alt="PayPal Donate" src="http://ionicabizau.github.io/badges/paypal.svg"></a>
</p>

---

:raised_hands: :raised_hands: :raised_hands: Help wanted!
---------------------------------------------------------

We just started the [`sweetalert2-themes`](https://github.com/sweetalert2/sweetalert2-themes) project, for now 2 themes are available: [`dark`](https://github.com/sweetalert2/sweetalert2-themes/tree/master/dark) and [`embed-iframe`](https://github.com/sweetalert2/sweetalert2-themes/tree/master/embed-iframe). Please help us with [other themes](https://github.com/sweetalert2/sweetalert2-themes/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22), I would be happy to donate some :moneybag: for all active contributors. The quick-start contributing guide is [here](#contributing). 

Thank you :heart:

---

:point_right: **Upgrading from v7.x to v8.x?** [Read the release notes!](https://github.com/sweetalert2/sweetalert2/releases/tag/v8.0.0)
<br>If you're upgrading from v6.x, please [upgrade from v6 to v7](https://github.com/sweetalert2/sweetalert2/releases/tag/v7.0.0) first!

:point_right: **Migrating from [SweetAlert](https://github.com/t4t5/sweetalert)?** [SweetAlert 1.x to SweetAlert2 migration guide](https://github.com/sweetalert2/sweetalert2/wiki/Migration-from-SweetAlert-to-SweetAlert2)

---

Installation
------------

```sh
npm install --save sweetalert2
```

Or grab from [jsdelivr CDN](https://www.jsdelivr.com/package/npm/sweetalert2)
:

```html
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@8"></script>
```


Usage
-----

```html
<script src="sweetalert2/dist/sweetalert2.all.min.js"></script>

<!-- Include a polyfill for ES6 Promises (optional) for IE11 -->
<script src="https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.js"></script>
```

You can also include the stylesheet separately if desired:

```html
<script src="sweetalert2/dist/sweetalert2.min.js"></script>
<link rel="stylesheet" href="sweetalert2/dist/sweetalert2.min.css">
```

Or:

```js
// ES6 Modules or TypeScript
import Swal from 'sweetalert2'

// CommonJS
const Swal = require('sweetalert2')
```

It's possible to import JS and CSS separately, e.g. if you need to customize styles:

```js
import Swal from 'sweetalert2/dist/sweetalert2.js'

import 'sweetalert2/src/sweetalert2.scss'
```

Please note that [TypeScript is well-supported](https://github.com/sweetalert2/sweetalert2/blob/master/sweetalert2.d.ts), so you don't have to install a third-party declaration file.


Examples
--------

The most basic message:

```js
Swal.fire('Hello world!')
```

A message signaling an error:

```js
Swal.fire('Oops...', 'Something went wrong!', 'error')
```

Handling the result of SweetAlert2 modal:

```js
Swal.fire({
  title: 'Are you sure?',
  text: 'You will not be able to recover this imaginary file!',
  type: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Yes, delete it!',
  cancelButtonText: 'No, keep it'
}).then((result) => {
  if (result.value) {
    Swal.fire(
      'Deleted!',
      'Your imaginary file has been deleted.',
      'success'
    )
  // For more information about handling dismissals please visit
  // https://sweetalert2.github.io/#handling-dismissals
  } else if (result.dismiss === Swal.DismissReason.cancel) {
    Swal.fire(
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

 IE11* | Edge | Chrome | Firefox | Safari | Opera | UC Browser
-------|------|--------|---------|--------|-------|------------
:heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |

\* ES6 Promise polyfill should be included, see [usage example](#usage).

Note that SweetAlert2 **does not** and **will not** provide support or functionality of any kind on IE10 and lower.


Related projects
-------------------------

- [ngx-sweetalert2](https://github.com/sweetalert2/ngx-sweetalert2) - Angular 4+ integration
- [sweetalert2-react-content](https://github.com/sweetalert2/sweetalert2-react-content) - React integration
- [sweetalert2-webpack-demo](https://github.com/sweetalert2/sweetalert2-webpack-demo) - webpack demo
- [sweetalert2-parcel-demo](https://github.com/sweetalert2/sweetalert2-parcel-demo) - overriding SCSS variables demo


Related community projects
-------------------------

- [avil13/vue-sweetalert2](https://github.com/avil13/vue-sweetalert2) - Vue.js wrapper
- [realrashid/sweet-alert](https://github.com/realrashid/sweet-alert) - Laravel 5 Package


Collaborators
-------------

[![](https://avatars3.githubusercontent.com/u/17089396?v=4&s=80)](https://github.com/gverni) | [![](https://avatars3.githubusercontent.com/u/3198597?v=4&s=80)](https://github.com/zenflow) | [![](https://avatars1.githubusercontent.com/u/1343250?v=4&s=80)](https://github.com/toverux) | [![](https://avatars3.githubusercontent.com/u/9093699?v=4&s=80)](https://github.com/acupajoe) | [![](https://avatars1.githubusercontent.com/u/5918348?v=4&s=80)](https://github.com/samturrell)
-|-|-|-|-
[@gverni](https://github.com/gverni) | [@zenflow](https://github.com/zenflow) | [@toverux](https://github.com/toverux) | [@acupajoe](https://github.com/acupajoe) | [@samturrell](https://github.com/samturrell)


Contributing
------------

[![Maintainability](https://api.codeclimate.com/v1/badges/eba34bb80477933854d4/maintainability)](https://codeclimate.com/github/sweetalert2/sweetalert2/maintainability)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/sweetalert2/sweetalert2/blob/master/CHANGELOG.md)

If you would like to contribute enhancements or fixes, please do the following:

1. Fork the `sweetalert2` repository and clone it locally.

2. Make sure you have [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) installed.

3. When in the SweetAlert2 directory, run `npm install` or `yarn install` to install dependencies.

4. To begin active development, run `npm start` or `yarn start`. This does several things for you:
 - Lints your code
 - Builds the `dist` folder
 - Serves sandbox.html @ http://localhost:8080/ (browser-sync ui:  http://localhost:8081/)
 - Serves unit tests @ http://localhost:3000
 - Re-lints, re-builds, re-loads and re-tests as necessary when files change

Backers
-------

[<img src="https://sweetalert2.github.io/images/backers/PriceListo.png" width="80">](https://www.pricelisto.com/) | [![](https://avatars0.githubusercontent.com/u/5826089?v=4&s=80)](https://sheetjs.com/) | [![](https://avatars2.githubusercontent.com/u/12075795?v=4&s=80)](https://www.unique-p.ch) | [<img src="https://sweetalert2.github.io/images/backers/sextoycollective.jpg" width="80">](https://sextoycollective.com/) | [<img src="https://sweetalert2.github.io/images/plus.png" width="80">](DONATIONS.md#backers)
-|-|-|-|-
[PriceListo](https://www.pricelisto.com/) | [SheetJS LLC](https://sheetjs.com/) | [Unique-P GmbH](https://www.unique-p.ch) | [STC (NSFW)](https://sextoycollective.com/) | [Become a backer](DONATIONS.md#backers)

Donations
---------

Has SweetAlert2 helped you create an amazing application? You can show your support by making a donation:

- PayPal: https://www.paypal.me/limonte
- Bitcoin: `12BxefvPMtHePgfPRDL1SaZYSG4GwQmWoP`
- Ether: `0x36e2b10666e2c0dc343901895ba3697b5d3214d1`
- Bitcoin Cash: `qqxs402qszgwuue00gwxw996lzhpa8up2unqm0y46g`
- Stellar: `GBRS5KGFJO4OBUGW3TRQBIVXTM5YDS53DOSHGA3LKVE2YXKVKNVDONBP`


### [Hall of Donators :trophy:](DONATIONS.md)
