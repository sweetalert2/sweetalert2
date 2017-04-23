SweetAlert2
-----------

[![Build Status](https://travis-ci.org/limonte/sweetalert2.svg?branch=master)](https://travis-ci.org/limonte/sweetalert2)
[![Version](https://img.shields.io/npm/v/sweetalert2.svg)](https://www.npmjs.com/package/sweetalert2)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/limonte/sweetalert2.svg)](http://isitmaintained.com/project/limonte/sweetalert2 "Average time to resolve an issue")
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/sweetalert2/Lobby)
[![PayPal Donate](https://img.shields.io/badge/donate-PayPal.me-ff69b4.svg)](https://www.paypal.me/limonte/5)

A beautiful, responsive, customizable, accessible (WAI-ARIA) replacement for JavaScript's popup boxes. Zero dependencies.

What's the difference between SweetAlert and SweetAlert2?
---------------------------------------------------------

 - [Reason of creating this fork is inactivity of original SweetAlert plugin](http://stackoverflow.com/a/27842854/1331425)
 - [SweetAlert to SweetAlert2 migration guide](https://github.com/limonte/sweetalert2/wiki/Migration-from-SweetAlert-to-SweetAlert2)

---

[See SweetAlert2 in action!](https://limonte.github.io/sweetalert2/)

<img src="https://raw.github.com/limonte/sweetalert2/master/assets/sweetalert2.gif" width="686">


Installation
------------

```bash
npm install --save sweetalert2
```

Or:

```bash
bower install --save sweetalert2
```

Or download from CDN: [jsdelivr.com](https://www.jsdelivr.com/projects/sweetalert2) | [cdnjs.com](https://cdnjs.com/libraries/limonte-sweetalert2)


Usage
-----

```html
<script src="bower_components/sweetalert2/dist/sweetalert2.min.js"></script>
<link rel="stylesheet" type="text/css" href="bower_components/sweetalert2/dist/sweetalert2.min.css">

<!-- Include a polyfill for ES6 Promises (optional) for IE11, UC Browser and Android browser support -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/core-js/2.4.1/core.js"></script>
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
}).then(function() {
  swal(
    'Deleted!',
    'Your imaginary file has been deleted.',
    'success'
  )
}, function(dismiss) {
  // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
  if (dismiss === 'cancel') {
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

When an alert is dismissed by the user, the Promise returned by `swal()` will reject with a string documenting the reason it was dismissed:

| String      | Description                                             | Related configuration |
| ----------- | ------------------------------------------------------- | --------------------- |
| `'overlay'` | The user clicked the overlay.                           | `allowOutsideClick`   |
| `'cancel'`  | The user clicked the cancel button.                     | `showCancelButton`    |
| `'close'`   | The user clicked the close button.                      | `showCloseButton`     |
| `'esc'`     | The user pressed the <kbd>Esc</kbd> key.                | `allowEscapeKey`      |
| `'timer'`   | The timer ran out, and the alert closed automatically.  | `timer`               |

If rejections are not handled, it will be logged as an error. To avoid this, add a rejection handler to the Promise. Alternatively, you can use `.catch(swal.noop)` as a quick way to simply suppress the errors:

```js
swal(...)
  .catch(swal.noop)
```

Modal Types
-----------

| `success`                                                                       | `error`                                                                       | `warning`                                                                       | `info`                                                                       | `question`                                                                       |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| ![](https://raw.github.com/limonte/sweetalert2/master/assets/swal2-success.png) | ![](https://raw.github.com/limonte/sweetalert2/master/assets/swal2-error.png) | ![](https://raw.github.com/limonte/sweetalert2/master/assets/swal2-warning.png) | ![](https://raw.github.com/limonte/sweetalert2/master/assets/swal2-info.png) | ![](https://raw.github.com/limonte/sweetalert2/master/assets/swal2-question.png) |


Configuration
-------------

| Argument                | Default value        | Description |
| ----------------------- | -------------------- | ----------- |
| `title`                 | `null`               | The title of the modal, as HTML. It can either be added to the object under the key "title" or passed as the first parameter of the function. |
| `titleText`             | `null`               | The title of the modal, as text. Useful to avoid HTML injection. |
| `text`                  | `null`               | A description for the modal. It can either be added to the object under the key "text" or passed as the second parameter of the function. |
| `html`                  | `null`               | A HTML description for the modal. If `text` and `html` parameters are provided in the same time, "text" will be used. |
| `type`                  | `null`               | The type of the modal. SweetAlert2 comes with [5 built-in types](#modal-types) which will show a corresponding icon animation: `warning`, `error`, `success`, `info` and `question`. It can either be put in the array under the key `type` or passed as the third parameter of the function. |
| `target`                | `'body'`             | The container element for adding modal into. |
| `input`                 | `null`               | Input field type, can be `'text'`, `'email'`, `'password'`, `'number'`, `'tel'`, `'range'`, `'textarea'`, `'select'`, `'radio'`, `'checkbox'`, `'file'` and `'url'`. |
| `width`                 | `'500px'`            | Modal window width, including paddings (`box-sizing: border-box`). Can be in `px` or `%`. |
| `padding`               | `20`                 | Modal window padding. |
| `background`            | `'#fff'`             | Modal window background (CSS `background` property). |
| `customClass`           | `null`               | A custom CSS class for the modal. |
| `timer`                 | `null`               | Auto close timer of the modal. Set in ms (milliseconds). |
| `animation`             | `true`               | If set to `false`, modal CSS animation will be disabled. |
| `allowOutsideClick`     | `true`               | If set to `false`, the user can't dismiss the modal by clicking outside it. |
| `allowEscapeKey`        | `true`               | If set to `false`, the user can't dismiss the modal by pressing the <kbd>Esc</kbd> key. |
| `allowEnterKey`         | `true`               | If set to `false`, the user can't confirm the modal by pressing the <kbd>Enter</kbd> or <kbd>Space</kbd> keys, unless they manually focus the confirm button. |
| `showConfirmButton`     | `true`               | If set to `false`, a "Confirm"-button will not be shown. It can be useful when you're using `html` parameter for custom HTML description. |
| `showCancelButton`      | `false`              | If set to `true`, a "Cancel"-button will be shown, which the user can click on to dismiss the modal. |
| `confirmButtonText`     | `'OK'`               | Use this to change the text on the "Confirm"-button. |
| `cancelButtonText`      | `'Cancel'`           | Use this to change the text on the "Cancel"-button. |
| `confirmButtonColor`    | `'#3085d6'`          | Use this to change the background color of the "Confirm"-button (must be a HEX value). |
| `cancelButtonColor`     | `'#aaa'`             | Use this to change the background color of the "Cancel"-button (must be a HEX value). |
| `confirmButtonClass`    | `null`               | A custom CSS class for the "Confirm"-button. |
| `cancelButtonClass`     | `null`               | A custom CSS class for the "Cancel"-button. |
| `buttonsStyling`        | `true`               | Apply default styling to buttons. If you want to use your own classes (e.g. Bootstrap classes) set this parameter to `false`. |
| `reverseButtons`        | `false`              | Set to `true` if you want to invert default buttons positions ("Confirm"-button on the right side). |
| `focusCancel`           | `false`              | Set to `true` if you want to focus the "Cancel"-button by default. |
| `showCloseButton`       | `false`              | Set to `true` to show close button in top right corner of the modal. |
| `showLoaderOnConfirm`   | `false`              | Set to `true` to disable buttons and show that something is loading. Useful for AJAX requests. |
| `preConfirm`            | `null`               | Function to execute before confirm, should return Promise, see <a href="https://limonte.github.io/sweetalert2/#ajax-request">usage example</a>. |
| `imageUrl`              | `null`               | Add an image for the modal. Should contain a string with the path or URL to the image. |
| `imageWidth`            | `null`               | If imageUrl is set, you can specify imageWidth to describes image width in px. |
| `imageHeight`           | `null`               | Custom image height in px. |
| `imageClass`            | `null`               | A custom CSS class for the image. |
| `inputPlaceholder`      | `''`                 | Input field placeholder. |
| `inputValue`            | `''`                 | Input field initial value. |
| `inputOptions`          | `{}` or `Promise`    | If `input` parameter is set to `'select'` or `'radio'`, you can provide options. Object keys will represent options values, object values will represent options text values. |
| `inputAutoTrim`         | `true`               | Automatically remove whitespaces from both ends of a result string. Set this parameter to `false` to disable auto-trimming. |
| `inputAttributes`       | `{}`                 | HTML input attributes (e.g. `'min'`, `'max'`, `'autocomplete'`, `'accept'`), that are added to the input field. Object keys will represent attributes names, object values will represent attributes values. |
| `inputValidator`        | `null`               | Validator for input field, should return Promise, see <a href="https://limonte.github.io/sweetalert2/#select-box">usage example</a>. |
| `inputClass`            | `null`               | A custom CSS class for the input field. |
| `progressSteps`         | `[]`                 | Progress steps, useful for modal queues, see <a href="https://limonte.github.io/sweetalert2/#chaining-modals">usage example</a>. |
| `currentProgressStep`   | `null`               | Current active progress step. The default is `swal.getQueueStep()`. |
| `progressStepsDistance` | `'40px'`             | Distance between progress steps. |
| `onOpen`                | `null`               | Function to run when modal opens, provides modal DOM element as the first argument. |
| `onClose`               | `null`               | Function to run when modal closes, provides modal DOM element as the first argument. |

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


Browser compatibility
---------------------

SweetAlert2 works in most major browsers (yes, even IE). Some details:

- **IE: 11**, Promise polyfill should be included (see [usage example](#usage)).
- **Microsoft Edge: 12+**
- **Safari: 4+**
- **Firefox: 4+**
- **Chrome 14+**
- **Opera: 15+**

Note that SweetAlert2 **does not** and **will not** provide support or functionality of any kind on IE10 and lower.


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

- [toverux/ngsweetalert2](https://github.com/toverux/ngsweetalert2) - SweetAlert2 directive for Angular 2+
- [lishengzxc/vue-sweetalert](https://github.com/lishengzxc/vue-sweetalert) - SweetAlert2 plugin for Vue.js
- [limonte/sweetalert2-webpack-demo](https://github.com/limonte/sweetalert2-webpack-demo) - SweetAlert2 + webpack demo


Donations
---------

If you liked this plugin, you can donate to support it:

- https://www.paypal.me/limonte/5
