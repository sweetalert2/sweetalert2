SweetAlert2 [![Build Status](https://travis-ci.org/limonte/sweetalert2.svg?branch=master)](https://travis-ci.org/limonte/sweetalert2)
-----------

An awesome replacement for JavaScript's popup boxes.

What's the difference between SweetAlert and SweetAlert2?
---------------------------------------------------------

Reason of creating this fork is inactivity of original SweetAlert plugin:
[http://stackoverflow.com/a/27842854/1331425](http://stackoverflow.com/a/27842854/1331425)

[See SweetAlert2 in action!](https://limonte.github.io/sweetalert2/)

![SweetAlert2 example](https://raw.github.com/limonte/sweetalert2/master/sweetalert2.gif)


Usage
-----

To install:

```bash
bower install sweetalert2
```

Or:

```bash
npm install sweetalert2
```

To use:

```html
<script src="bower_components/sweetalert2/dist/sweetalert2.min.js"></script>
<link rel="stylesheet" type="text/css" href="bower_components/sweetalert2/dist/sweetalert2.min.css">

<!-- for IE support -->
<script src="bower_components/es6-promise-polyfill/promise.min.js"></script>
```


Examples
--------

The most basic message:

```javascript
swal('Hello world!');
```

A message signaling an error:

```javascript
swal('Oops...', 'Something went wrong!', 'error');
```

Handling the result of SweetAlert2 modal:

```javascript
swal({
  title: 'Are you sure?',
  text: 'You will not be able to recover this imaginary file!',
  type: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Yes, delete it!',
  cancelButtonText: 'No, keep it',
}).then(function(isConfirm) {
  if (isConfirm === true) {
    swal(
      'Deleted!',
      'Your imaginary file has been deleted.',
      'success'
    );

  } else if (isConfirm === false) {
    swal(
      'Cancelled',
      'Your imaginary file is safe :)',
      'error'
    );

  } else {
    // Esc, close button or outside click
    // isConfirm is undefined
  }
});
```

`swal(...)` returns a Promise Object, `isConfirm` parameter in Promise method `then` will be:

- `true` for "Confirm"-button
- `false` for "Cancel"-button
- `undefined` for <kbd>Esc</kbd> press, close button or outside click

[View more examples](https://limonte.github.io/sweetalert2/)


Modal Types
-----------

| `success`                                                                       | `error`                                                                       | `warning`                                                                       | `info`                                                                       | `question`                                                                       |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| ![](https://raw.github.com/limonte/sweetalert2/master/images/swal2-success.png) | ![](https://raw.github.com/limonte/sweetalert2/master/images/swal2-error.png) | ![](https://raw.github.com/limonte/sweetalert2/master/images/swal2-warning.png) | ![](https://raw.github.com/limonte/sweetalert2/master/images/swal2-info.png) | ![](https://raw.github.com/limonte/sweetalert2/master/images/swal2-question.png) |


Configuration
-------------

| Argument             | Default value | Description |
| -------------------- | ------------- | ----------- |
| `title`              | `null`        | The title of the modal. It can either be added to the object under the key "title" or passed as the first parameter of the function. |
| `text`               | `null`        | A description for the modal. It can either be added to the object under the key "text" or passed as the second parameter of the function. |
| `html`               | `null`        | A HTML description for the modal. If `text` and `html` parameters are provided in the same time, "text" will be used. |
| `type `              | `null`        | The type of the modal. SweetAlert2 comes with [5 built-in types](#modal-types) which will show a corresponding icon animation: `warning`, `error`, `success`, `info` and `question`. It can either be put in the array under the key `type` or passed as the third parameter of the function. |
| `customClass`        | `null`        | A custom CSS class for the modal. |
| `animation`          | `true`        | If set to `false`, modal CSS animation will be disabled. |
| `allowOutsideClick`  | `true`        | If set to `false`, the user can't dismiss the modal by clicking outside it. |
| `allowEscapeKey`     | `true`        | If set to `false`, the user can't dismiss the modal by pressing the Escape key. |
| `showConfirmButton`  | `true`        | If set to `false`, a "Confirm"-button will not be shown. It can be useful when you're using `html` parameter for custom HTML description. |
| `showCancelButton`   | `false`       | If set to `true`, a "Cancel"-button will be shown, which the user can click on to dismiss the modal. |
| `confirmButtonText`  | `"OK"`        | Use this to change the text on the "Confirm"-button. |
| `cancelButtonText`   | `"Cancel"`    | Use this to change the text on the "Cancel"-button. |
| `confirmButtonColor` | `"#3085d6"`   | Use this to change the background color of the "Confirm"-button (must be a HEX value). |
| `cancelButtonColor`  | `"#aaa"`      | Use this to change the background color of the "Cancel"-button (must be a HEX value). |
| `confirmButtonClass` | `null`        | A custom CSS class for the "Confirm"-button. |
| `cancelButtonClass`  | `null`        | A custom CSS class for the "Cancel"-button. |
| `buttonsStyling`     | `true`        | Apply default swal2 styling to buttons. If you want to use your own classes (e.g. Bootstrap classes) set this parameter to `false`. |
| `reverseButtons`     | `false`       | Set this parameter to `true` if you want to invert default buttons positions. |
| `showCloseButton`    | `false`       | Set this parameter to `true` to show close button in top right corner of the modal. |
| `preConfirm`         | `null`        | Function to execute before confirm, should return Promise, see <a href="https://limonte.github.io/sweetalert2/#ajax-request">usage example</a>. |
| `imageUrl`           | `null`        | Add a customized icon for the modal. Should contain a string with the path or URL to the image. |
| `imageWidth`         | `null`        | If imageUrl is set, you can specify imageWidth to describes image width in px. |
| `imageHeight`        | `null`        | Custom image height in px. |
| `imageClass`         | `null`        | A custom CSS class for the customized icon. |
| `timer`              | `null`        | Auto close timer of the modal. Set in ms (milliseconds). |
| `width`              | `500`         | Modal window width, including paddings (`box-sizing: border-box`). |
| `padding`            | `20`          | Modal window padding. |
| `background`         | `"#fff"`      | Modal window background (CSS `background` property). |
| `input`              | `null`        | Input field type, can be `"text"`, `"email"`, `"password"`, `"textarea"`, `"select"`, `"radio"` and `"checkbox"`. |
| `inputPlaceholder`   | `""`          | Input field placeholder. |
| `inputValue`         | `""`          | Input field initial value. |
| `inputOptions`       | `{}`          | If `input` parameter is set to `"select"`, you can provide options. Object keys will represent options values, object values will represent options text values. |
| `inputAutoTrim`      | `true`        | Automatically remove whitespaces from both ends of a result string. Set this parameter to `false` to disable auto-trimming. |
| `inputValidator`     | `null`        | Validator for input field, should return Promise, see <a href="https://limonte.github.io/sweetalert2/#select-box">usage example</a>. |
| `inputClass`         | `null`        | A custom CSS class for the input field. |

You can redefine default params by using `swal.setDefaults(customParams)` where `customParams` is an object.


Methods
-------

| Method             | Description |
| ------------------ | ----------- |
| `swal.setDefaults({Object})`          | If you end up using a lot of the same settings when calling SweetAlert2, you can use setDefaults at the start of your program to set them once and for all! |
| `swal.close()` or `swal.closeModal()` | Close the currently open SweetAlert2 modal programmatically. |
| `swal.enableButtons()`                | Enable confirm and cancel buttons. |
| `swal.disableButtons()`               | Disable confirm and cancel buttons. |
| `swal.enableLoading()`                | Disable buttons and show loader. This is useful with AJAX requests. |
| `swal.disableLoading()`               | Enable buttons and hide loader. |
| `swal.clickConfirm()`                 | Click "Confirm"-button programmatically. |
| `swal.clickCancel()`                  | Click "Cancel"-button programmatically. |
| `swal.showValidationError(error)`     | Show validation error message. |
| `swal.resetValidationError()`         | Hide validation error message. |


Browser compatibility
---------------------

SweetAlert works in most major browsers (yes, even IE). Some details:

- **IE: 10+**, Promise polyfill should be included (see [usage example](#usage)).
- **Microsoft Edge: 12+**
- **Safari: 4+**
- **Firefox: 4+**
- **Chrome 14+**
- **Opera: 15+**


Contributing
------------

If you would like to contribute enhancements or fixes, please do the following:

1. Fork the plugin repository.

1. Make sure you have [Node](http://nodejs.org/) and [NPM](https://www.npmjs.com/) installed.

1. When in the SweetAlert directory, run the command ``npm install`` to install npm packages.

1. Start gulp watcher ``gulp watch`` to automatically minify the SCSS and JS-files.

1. Make a pull request and wait for approval.
