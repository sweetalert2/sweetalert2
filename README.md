<p align="center">
  <a href="https://github.com/sponsors/limonte">[= Become the :trophy: Ultimate Sponsor of SweetAlert2 and place your banner here (100K+ unique visitors per month) =]</a>
</p>

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
  <a href="https://github.com/sweetalert2/sweetalert2/actions"><img alt="Build Status" src="https://github.com/sweetalert2/sweetalert2/workflows/build/badge.svg"></a>
  <a href="https://codeclimate.com/github/sweetalert2/sweetalert2/test_coverage"><img alt="Coverage Status" src="https://api.codeclimate.com/v1/badges/eba34bb80477933854d4/test_coverage"></a>
  <a href="https://www.npmjs.com/package/sweetalert2"><img alt="Version" src="https://img.shields.io/npm/v/sweetalert2.svg"></a>
  <a href="https://www.jsdelivr.com/package/npm/sweetalert2"><img alt="jsdelivr" src="https://data.jsdelivr.com/v1/package/npm/sweetalert2/badge?style=rounded"></a>
  <a href="#support-and-donations"><img alt="Support Donate" src="https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=ea4aaa"></a>
</p>

---

:moneybag: [Get $100 in free credits with DigitalOcean!](https://m.do.co/c/12907f2ba0bf)

---

:point_right: **Upgrading from v10.x to v11.x?** [Read the release notes!](https://github.com/sweetalert2/sweetalert2/releases/tag/v11.0.0)
<br>If you're upgrading from v9.x, please [upgrade from v9 to v10](https://github.com/sweetalert2/sweetalert2/releases/tag/v10.0.0) first!
<br>If you're upgrading from v8.x, please [upgrade from v8 to v9](https://github.com/sweetalert2/sweetalert2/releases/tag/v9.0.0) first!
<br>If you're upgrading from v7.x, please [upgrade from v7 to v8](https://github.com/sweetalert2/sweetalert2/releases/tag/v8.0.0) first!
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
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
```


Usage
-----

```html
<script src="sweetalert2/dist/sweetalert2.all.min.js"></script>
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

Or with JS modules:

```html
<link rel="stylesheet" href="sweetalert2/dist/sweetalert2.css">

<script type="module">
  import Swal from 'sweetalert2/src/sweetalert2.js'
</script>
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
  icon: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Yes, delete it!',
  cancelButtonText: 'No, keep it'
}).then((result) => {
  if (result.isConfirmed) {
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

Chrome | Firefox | Safari | Edge
-------|---------|--------|-----
:heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:

If you need IE11 and legacy Edge support, please use [the previous major version](https://github.com/sweetalert2/sweetalert2/releases/tag/v10.16.7).



Themes ([`sweetalert2-themes ↗`](https://github.com/sweetalert2/sweetalert2-themes))
------

- [`Dark`](https://github.com/sweetalert2/sweetalert2-themes/tree/master/dark)
- [`Minimal`](https://github.com/sweetalert2/sweetalert2-themes/tree/master/minimal)
- [`Borderless`](https://github.com/sweetalert2/sweetalert2-themes/tree/master/borderless)
- [`Bootstrap 4`](https://github.com/sweetalert2/sweetalert2-themes/tree/master/bootstrap-4)
- [`Material UI`](https://github.com/sweetalert2/sweetalert2-themes/tree/master/material-ui)
- [`WordPress Admin`](https://github.com/sweetalert2/sweetalert2-themes/tree/master/wordpress-admin)
- [`Bulma`](https://github.com/sweetalert2/sweetalert2-themes/tree/master/bulma)
- [`Default`](https://github.com/sweetalert2/sweetalert2-themes/tree/master/default)


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
- [Basaingeal/Razor.SweetAlert2](https://github.com/Basaingeal/Razor.SweetAlert2) - Blazor Wrapper
- [ElectronAlert](https://electron.guide/electron-alert/) - SweetAlert2 for Electron applications (main process)


Contributing
------------

[![Maintainability](https://api.codeclimate.com/v1/badges/eba34bb80477933854d4/maintainability)](https://codeclimate.com/github/sweetalert2/sweetalert2/maintainability)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/sweetalert2/sweetalert2/blob/master/CHANGELOG.md)

If you would like to contribute enhancements or fixes, please do the following:

1. Fork the `sweetalert2` repository and clone it locally.

2. Make sure you have [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) installed.

3. When in the SweetAlert2 directory, run `npm install` or `yarn install` to install dependencies.

4. To begin active development, run `npm start` or `yarn start`. This does several things for you:
 - Builds the `dist` folder
 - Serves sandbox.html @ http://localhost:8080/ (browser-sync ui:  http://localhost:8081/)
 - Re-builds and re-loads as necessary when files change

5. To run tests, run `npm run cypress:open` or `yarn cypress:open`

Big Thanks
----------

- [FlowCrypt](https://flowcrypt.com/) for continuous support of this project
- [Serena Verni (@serenaperora)](https://serena.verni.xyz) for creating the amazing project logo

Sponsors
--------

For all questions related to sponsorship please contact me via email limon.monte@protonmail.com

[<img src="https://sweetalert2.github.io/images/sponsors/flowcrypt-banner.png">](https://flowcrypt.com/?utm_source=sweetalert2&utm_medium=banner)

[<img src="https://sweetalert2.github.io/images/plus.png" width="80">](SPONSORS.md) | [<img src="https://avatars2.githubusercontent.com/u/28631236?s=80&v=4" width="80">](https://flowcrypt.com/?utm_source=sweetalert2&utm_medium=logo) | [<img src="https://sweetalert2.github.io/images/sponsors/LifeDigital.png" width="80">](https://lifedigitalwiki.org/?utm_source=sweetalert2&utm_medium=logo) | [<img src="https://sweetalert2.github.io/images/sponsors/coderubik.png" width="80">](https://coderubik.com/?utm_source=sweetalert2&utm_medium=logo) | [<img src="https://www.ndchost.com/logos/ndchost-stacked-256x256-transparent.png" width="80">](https://ndchost.com/?utm_campaign=sponsorship&utm_source=github&utm_medium=sweetalert2) | [<img src="https://sweetalert2.github.io/images/sponsors/bitvape.png" width="80">](https://bitvape.com.au/)
-|-|-|-|-|-
[Become a sponsor](SPONSORS.md) | [FlowCrypt](https://flowcrypt.com/?utm_source=sweetalert2&utm_medium=logo) | [life digital](https://lifedigitalwiki.org/?utm_source=sweetalert2&utm_medium=logo) | [Code Rubik](https://coderubik.com/?utm_source=sweetalert2&utm_medium=logo) | [NDCHost](https://ndchost.com/?utm_campaign=sponsorship&utm_source=github&utm_medium=sweetalert2) | [Bitvape](https://bitvape.com.au/)

[<img src="https://sweetalert2.github.io/images/sponsors/halvinlaina.png" width="80">](https://halvinlaina.fi/) | [<img src="https://avatars0.githubusercontent.com/u/3986989?s=80&v=4" width="80">](https://github.com/tiagostutz) | [<img src="https://sweetalert2.github.io/images/sponsors/sebaebc.png" width="80">](https://github.com/sebaebc)
-|-|-
[Halvin Laina](https://halvinlaina.fi/) | [Tiago de Oliveira Stutz](https://github.com/tiagostutz) | [SebaEBC](https://github.com/sebaebc)

NSFW Sponsors
-------------

[<img src="https://sweetalert2.github.io/images/sponsors/sextoywow.png" width="80">](https://sextoywow.com/?utm_source=sweetalert2&utm_medium=logo) | [<img src="https://sweetalert2.github.io/images/sponsors/fresh-materials.png" width="80">](https://www.thefreshmaterials.com/?utm_source=sweetalert2&utm_medium=logo) | [<img src="https://sweetalert2.github.io/images/sponsors/joylovedolls.png" width="80">](https://www.joylovedolls.com/?utm_source=sweetalert2&utm_medium=logo) | [<img src="https://sweetalert2.github.io/images/sponsors/sex-toy-education.png" width="80">](https://sextoyeducation.com/?utm_source=sweetalert2&utm_medium=logo) | [<img src="https://sweetalert2.github.io/images/sponsors/my-sex-toy-guide.jpg" width="80">](https://www.mysextoyguide.com/?utm_source=sweetalert2&utm_medium=logo)
-|-|-|-|-
[Sex Toy WoW](https://sextoywow.com/?utm_source=sweetalert2&utm_medium=logo) | [Fresh Materials](https://www.thefreshmaterials.com/?utm_source=sweetalert2&utm_medium=logo) | [Joy Love Dolls](https://www.joylovedolls.com/?utm_source=sweetalert2&utm_medium=logo) | [STED](https://sextoyeducation.com/?utm_source=sweetalert2&utm_medium=logo) | [My Sex Toy Guide](https://www.mysextoyguide.com/?utm_source=sweetalert2&utm_medium=logo)

[<img src="https://sweetalert2.github.io/images/sponsors/best-blowjob-machines.jpg" width="80">](https://www.bestblowjobmachines.com/?utm_source=sweetalert2&utm_medium=logo) | [<img src="https://sweetalert2.github.io/images/sponsors/sextoycollective.jpg" width="80">](https://sextoycollective.com/?utm_source=sweetalert2&utm_medium=logo) | [<img src="https://sweetalert2.github.io/images/sponsors/doctorclimax.png" width="80">](https://doctorclimax.com/)
-|-|-
[Best Blowjob Machines](https://www.bestblowjobmachines.com/?utm_source=sweetalert2&utm_medium=logo) | [STC](https://sextoycollective.com/?utm_source=sweetalert2&utm_medium=logo) | [DoctorClimax](https://doctorclimax.com/)

Support and Donations
---------------------

Has SweetAlert2 helped you create an amazing application? You can show your support via [GitHub Sponsors](https://github.com/sponsors/limonte)

Alternative ways for donations (PayPal, cryptocurrencies, etc.) are listed here: https://sweetalert2.github.io/#donations

### [Hall of Donators :trophy:](DONATIONS.md)
