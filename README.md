<p align="center">
  <a href="https://limonte.github.io/sweetalert2/">
    <img src="/assets/swal2-logo.png" alt="SweetAlert2">
  </a>
</p>

<br>

<p align="center">
  <a href="https://travis-ci.org/limonte/sweetalert2"><img alt="Build Status" src="https://travis-ci.org/limonte/sweetalert2.svg?branch=master"></a>
  <a href="https://www.npmjs.com/package/sweetalert2"><img alt="Version" src="https://img.shields.io/npm/v/sweetalert2.svg"></a>
  <a href="https://checkgzipcompression.com/?url=https%3A%2F%2Fraw.githubusercontent.com%2Flimonte%2Fsweetalert2%2Fmaster%2Fdist%2Fsweetalert2.all.min.js"><img alt="gzip size" src="http://img.badgesize.io/limonte/sweetalert2/master/dist/sweetalert2.all.min.js.svg?compression=gzip"></a>
  <a href="http://isitmaintained.com/project/limonte/sweetalert2"><img alt="Average time to resolve an issue" src="http://isitmaintained.com/badge/resolution/limonte/sweetalert2.svg"></a>
  <a href="https://gitter.im/sweetalert2/Lobby"><img alt="Gitter" src="https://badges.gitter.im/Join%20Chat.svg"></a>
  <a href="https://www.patreon.com/limonte"><img alt="Support me on Patreon" src="http://ionicabizau.github.io/badges/patreon.svg"></a>
  <a href="https://www.paypal.me/limonte/5eur"><img alt="PayPal Donate" src="http://ionicabizau.github.io/badges/paypal.svg"></a>
</p>

<p align="center">
  A beautiful, responsive, customizable, accessible (WAI-ARIA) replacement for JavaScript's popup boxes. Zero dependencies.
</p>

<p align="center">
  <a href="https://limonte.github.io/sweetalert2/">
    <img src="https://raw.github.com/limonte/sweetalert2/master/assets/sweetalert2.gif" width="515"><br>
    See SweetAlert2 in action ↗
  </a>
</p>

---

:point_right: **Upgrading from v6.x to v7.x?** [Read the release notes!](https://github.com/limonte/sweetalert2/releases/tag/v7.0.0)

:point_right: **Migrating from [SweetAlert](https://github.com/t4t5/sweetalert)?** [SweetAlert 1.x to SweetAlert2 migration guide](https://github.com/limonte/sweetalert2/wiki/Migration-from-SweetAlert-to-SweetAlert2)

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

Or download from CDN: [unpkg.com/sweetalert2](https://unpkg.com/sweetalert2)


Usage
-----

```html
<script src="bower_components/sweetalert2/dist/sweetalert2.all.min.js"></script>

<!-- Include a polyfill for ES6 Promises (optional) for IE11, UC Browser and Android browser support -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/core-js/2.4.1/core.js"></script>
```

You can also include the stylesheet separately if desired:

```html
<script src="bower_components/sweetalert2/dist/sweetalert2.min.js"></script>
<link rel="stylesheet" href="bower_components/sweetalert2/dist/sweetalert2.min.css">
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
  // result.dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
  } else if (result.dismiss === 'cancel') {
    swal(
      'Cancelled',
      'Your imaginary file is safe :)',
      'error'
    )
  }
})
```

[View more examples](https://limonte.github.io/sweetalert2/)


Handling Dismissals
-------------------

When an alert is dismissed by the user, the Promise returned by `swal()` will be resolved with an object `{dismiss: reason}` documenting the reason it was dismissed:

| String      | Description                                             | Related configuration |
| ----------- | ------------------------------------------------------- | --------------------- |
| `'overlay'` | The user clicked the overlay.                           | `allowOutsideClick`   |
| `'cancel'`  | The user clicked the cancel button.                     | `showCancelButton`    |
| `'close'`   | The user clicked the close button.                      | `showCloseButton`     |
| `'esc'`     | The user pressed the <kbd>Esc</kbd> key.                | `allowEscapeKey`      |
| `'timer'`   | The timer ran out, and the alert closed automatically.  | `timer`               |


Modal Types
-----------

| `success`                                                                       | `error`                                                                       | `warning`                                                                       | `info`                                                                       | `question`                                                                       |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| ![](https://raw.github.com/limonte/sweetalert2/master/assets/swal2-success.png) | ![](https://raw.github.com/limonte/sweetalert2/master/assets/swal2-error.png) | ![](https://raw.github.com/limonte/sweetalert2/master/assets/swal2-warning.png) | ![](https://raw.github.com/limonte/sweetalert2/master/assets/swal2-info.png) | ![](https://raw.github.com/limonte/sweetalert2/master/assets/swal2-question.png) |


Configuration
-------------

| Argument                 | Default value         | Description |
| ------------------------ | --------------------- | ----------- |
| `title`                  | `null`                | The title of the modal, as HTML. It can either be added to the object under the key "title" or passed as the first parameter of the function. |
| `titleText`              | `null`                | The title of the modal, as text. Useful to avoid HTML injection. |
| `text`                   | `null`                | A description for the modal. It can either be added to the object under the key "text" or passed as the second parameter of the function. |
| `html`                   | `null`                | A HTML description for the modal. If `text` and `html` parameters are provided in the same time, "text" will be used. |
| `type`                   | `null`                | The type of the modal. SweetAlert2 comes with [5 built-in types](#modal-types) which will show a corresponding icon animation: `warning`, `error`, `success`, `info` and `question`. It can either be put in the array under the key `type` or passed as the third parameter of the function. |
| `backdrop`               | `true`                | Whether or not SweetAlert2 should show a full screen click-to-dismiss backdrop
| `toast`                  | `false`               | Whether or not an alert should be treated as a toast notification. This option is normally coupled with the `position` parameter and a timer. Toasts are NEVER autofocused.
| `target`                 | `'body'`              | The container element for adding modal into. |
| `input`                  | `null`                | Input field type, can be `'text'`, `'email'`, `'password'`, `'number'`, `'tel'`, `'range'`, `'textarea'`, `'select'`, `'radio'`, `'checkbox'`, `'file'` and `'url'`. |
| `width`                  | `'500px'`             | Modal window width, including paddings (`box-sizing: border-box`). Can be in `px` or `%`. |
| `padding`                | `20`                  | Modal window padding. |
| `background`             | `'#fff'`              | Modal window background (CSS `background` property). |
| `position`               | `'center'`            | Modal window position, can be `'top'`, `'top-left'`, `'top-right'`, `'center'`, `'center-left'`, `'center-right'`, `'bottom'`, `'bottom-left'`, or `'bottom-right'`.  |
| `grow`                   | `false`               | Paired with window position, sets the direction the modal should grow in, can be set to `'row'`, `'column'`, `'fullscreen'`, or `false`. |
| `customClass`            | `null`                | A custom CSS class for the modal. |
| `timer`                  | `null`                | Auto close timer of the modal. Set in ms (milliseconds). |
| `animation`              | `true`                | If set to `false`, modal CSS animation will be disabled. |
| `allowOutsideClick`      | `true`                | If set to `false`, the user can't dismiss the modal by clicking outside it. |
| `allowEscapeKey`         | `true`                | If set to `false`, the user can't dismiss the modal by pressing the <kbd>Esc</kbd> key. |
| `allowEnterKey`          | `true`                | If set to `false`, the user can't confirm the modal by pressing the <kbd>Enter</kbd> or <kbd>Space</kbd> keys, unless they manually focus the confirm button. |
| `showConfirmButton`      | `true`                | If set to `false`, a "Confirm"-button will not be shown. It can be useful when you're using `html` parameter for custom HTML description. |
| `showCancelButton`       | `false`               | If set to `true`, a "Cancel"-button will be shown, which the user can click on to dismiss the modal. |
| `confirmButtonText`      | `'OK'`                | Use this to change the text on the "Confirm"-button. |
| `cancelButtonText`       | `'Cancel'`            | Use this to change the text on the "Cancel"-button. |
| `confirmButtonColor`     | `'#3085d6'`           | Use this to change the background color of the "Confirm"-button (must be a HEX value). |
| `cancelButtonColor`      | `'#aaa'`              | Use this to change the background color of the "Cancel"-button (must be a HEX value). |
| `confirmButtonClass`     | `null`                | A custom CSS class for the "Confirm"-button. |
| `cancelButtonClass`      | `null`                | A custom CSS class for the "Cancel"-button. |
| `confirmButtonAriaLabel` | `''`                  | Use this to change the `aria-label` for the "Confirm"-button. |
| `cancelButtonAriaLabel`  | `''`                  | Use this to change the `aria-label` for the "Cancel"-button. |
| `buttonsStyling`         | `true`                | Apply default styling to buttons. If you want to use your own classes (e.g. Bootstrap classes) set this parameter to `false`. |
| `reverseButtons`         | `false`               | Set to `true` if you want to invert default buttons positions ("Confirm"-button on the right side). |
| `focusConfirm`           | `true`                | Set to `false` if you want to focus the first element in tab order instead of "Confirm"-button by default. |
| `focusCancel`            | `false`               | Set to `true` if you want to focus the "Cancel"-button by default. |
| `showCloseButton`        | `false`               | Set to `true` to show close button in top right corner of the modal. |
| `closeButtonAriaLabel`   | `'Close this dialog'` | Use this to change the `aria-label` for the close button. |
| `showLoaderOnConfirm`    | `false`               | Set to `true` to disable buttons and show that something is loading. Use it in combination with the `preConfirm` parameter. |
| `preConfirm`             | `null`                | Function to execute before confirm, may be async (Promise-returning) or sync, see <a href="https://limonte.github.io/sweetalert2/#ajax-request">usage example</a>. |
| `imageUrl`               | `null`                | Add an image for the modal. Should contain a string with the path or URL to the image. |
| `imageWidth`             | `null`                | If imageUrl is set, you can specify imageWidth to describes image width in px. |
| `imageHeight`            | `null`                | Custom image height in px. |
| `imageAlt`               | `''`                  | An alternative text for the custom image icon. |
| `imageClass`             | `null`                | A custom CSS class for the image. |
| `inputPlaceholder`       | `''`                  | Input field placeholder. |
| `inputValue`             | `''`                  | Input field initial value. |
| `inputOptions`           | `{}` or `Promise`     | If `input` parameter is set to `'select'` or `'radio'`, you can provide options. Object keys will represent options values, object values will represent options text values. |
| `inputAutoTrim`          | `true`                | Automatically remove whitespaces from both ends of a result string. Set this parameter to `false` to disable auto-trimming. |
| `inputAttributes`        | `{}`                  | HTML input attributes (e.g. `'min'`, `'max'`, `'autocomplete'`, `'accept'`), that are added to the input field. Object keys will represent attributes names, object values will represent attributes values. |
| `inputValidator`         | `null`                | Validator for input field, may be async (Promise-returning) or sync, see <a href="https://limonte.github.io/sweetalert2/#input-select">usage example</a>. |
| `inputClass`             | `null`                | A custom CSS class for the input field. |
| `progressSteps`          | `[]`                  | Progress steps, useful for modal queues, see <a href="https://limonte.github.io/sweetalert2/#chaining-modals">usage example</a>. |
| `currentProgressStep`    | `null`                | Current active progress step. The default is `swal.getQueueStep()`. |
| `progressStepsDistance`  | `'40px'`              | Distance between progress steps. |
| `onBeforeOpen`           | `null`                | Function to run when modal built, but not shown yet. Provides modal DOM element as the first argument. |
| `onOpen`                 | `null`                | Function to run when modal opens, provides modal DOM element as the first argument. |
| `onClose`                | `null`                | Function to run when modal closes, provides modal DOM element as the first argument. |
| `useRejections`          | `false`               | **Deprecated and will be removed in the next major release.** Determines whether dismissals (outside click, cancel button, close button, <kdb>Esc</kbd> key, timer) should resolve with an object of the format `{dismiss: reason}` or reject the promise. |
| `expectRejections`       | `false`               | **Deprecated and will be removed in the next major release.** Determines whether given `inputValidator` and `preConfirm` functions should be expected to to signal validation errors by rejecting, or by their respective means (see documentation for each option). |

You can redefine default params by using `swal.setDefaults(customParams)` where `customParams` is an object.


Methods
-------

| Method                                          | Description |
| ----------------------------------------------- | ----------- |
| `swal.isVisible()`                              | Determine if modal is shown. |
| `swal.setDefaults({Object})`                    | If you end up using a lot of the same settings when calling SweetAlert2, you can use setDefaults at the start of your program to set them once and for all! |
| `swal.resetDefaults()`                          | Resets settings to their default value. |
| `swal.close()` or `swal.closeModal()`           | Close the currently open SweetAlert2 modal programmatically. |
| `swal.getTitle()`                               | Get the modal title. |
| `swal.getContent()`                             | Get the modal content. |
| `swal.getImage()`                               | Get the image. |
| `swal.getConfirmButton()`                       | Get the "Confirm" button. |
| `swal.getCancelButton()`                        | Get the "Cancel" button. |
| `swal.getButtonsWrapper()`                      | Get the buttons wrapper. |
| `swal.enableButtons()`                          | Enable "Confirm" and "Cancel" buttons. |
| `swal.disableButtons()`                         | Disable "Confirm" and "Cancel" buttons. |
| `swal.enableConfirmButton()`                    | Enable the "Confirm"-button only. |
| `swal.disableConfirmButton()`                   | Disable the "Confirm"-button only. |
| `swal.enableLoading()` or `swal.showLoading()`  | Disable buttons and show loader. This is useful with AJAX requests. |
| `swal.disableLoading()` or `swal.hideLoading()` | Enable buttons and hide loader. |
| `swal.clickConfirm()`                           | Click the "Confirm"-button programmatically. |
| `swal.clickCancel()`                            | Click the "Cancel"-button programmatically. |
| `swal.showValidationError(error)`               | Show validation error message. |
| `swal.resetValidationError()`                   | Hide validation error message. |
| `swal.getInput()`                               | Get the input DOM node, this method works with `input` parameter. |
| `swal.disableInput()`                           | Disable input. A disabled input element is unusable and un-clickable. |
| `swal.enableInput()`                            | Enable input. |
| `swal.queue([Array])`                           | Provide array of SweetAlert2 parameters to show multiple modals, one modal after another or a function that returns alert parameters given modal number. See [usage example](https://limonte.github.io/sweetalert2/#chaining-modals).  |
| `swal.getQueueStep()`                           | Get the index of current modal in queue. When there's no active queue, `null` will be returned. |
| `swal.insertQueueStep()`                        | Insert a modal to queue, you can specify modal positioning with second parameter. By default a modal will be added to the end of a queue. |
| `swal.deleteQueueStep(index)`                   | Delete a modal at `index` from queue. |
| `swal.getProgressSteps()`                       | Progress steps getter. |
| `swal.setProgressSteps([])`                     | Progress steps setter. |
| `swal.showProgressSteps()`                      | Show progress steps. |
| `swal.hideProgressSteps()`                      | Hide progress steps. |
| `swal.isValidParameter({String})`               | Determine if parameter name is valid. |


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

4. Start gulp watcher `gulp watch` to automatically build and minify the SCSS and JS-files.

5. Check that your code is compliant with code linters: `gulp lint`.

6. Ensure that you didn't break any of tests: `npm test`.

7. Make sure that `dist/*` files aren't committed and create a pull request.


Related projects
----------------

- [toverux/ngx-sweetalert2](https://github.com/toverux/ngx-sweetalert2) - Angular 4+ integration
- [lishengzxc/vue-sweetalert](https://github.com/lishengzxc/vue-sweetalert) - Vue.js plugin
- [softon/sweetalert](https://github.com/softon/sweetalert) - Laravel 5 Package
- [limonte/sweetalert2-polymer](https://github.com/limonte/sweetalert2-polymer) - Polymer wrapper
- [limonte/sweetalert2-webpack-demo](https://github.com/limonte/sweetalert2-webpack-demo) - webpack demo


Donations
---------

Has SweetAlert2 helped you create an amazing application? You can show your support by making a donation in one of two ways:

- https://www.paypal.me/limonte/5eur
- https://www.patreon.com/limonte
