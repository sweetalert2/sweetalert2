SweetAlert2
-----------

An awesome replacement for JavaScript's alert.

What's the difference between SweetAlert and SweetAlert2?
---------------------------------------------------------

Reason of creating this fork is inactivity of original SweetAlert plugin:
[http://stackoverflow.com/a/27842854/1331425](http://stackoverflow.com/a/27842854/1331425)

[See SweetAlert2 in action!](https://limonte.github.io/sweetalert2/)

![SweetAlert2 example](https://raw.github.com/limonte/sweetalert2/master/sweetalert2.gif)


Usage
-----

You can install SweetAlert2 through bower:

```bash
bower install sweetalert2
```

Alternatively, download the package and reference the JavaScript and CSS files manually:

```html
<script src="dist/sweetalert2.min.js"></script>
<link rel="stylesheet" type="text/css" href="dist/sweetalert2.min.css">
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

A warning message, with a function attached to the "Confirm"-button..

```javascript
swal({
  title: 'Are you sure?',
  text: 'You will not be able to recover this imaginary file!',
  type: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#dd6b55',
  cancelButtonColor: '#999',
  confirmButtonText: 'Yes, delete it!',
  cancelButtonText: 'No, keep it',
  closeOnConfirm: false
}).then(function(isConfirm) {
  if (isConfirm === true) {
    swal(
      'Deleted!',
      'Your imaginary file has been deleted.',
      'success'
    );
  }
});
```

[View more examples](https://limonte.github.io/sweetalert2/)


Modal Types
-----------

| `success`                                                                       | `error`                                                                       | `warning`                                                                       | `info`                                                                       | `question`                                                                       |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| ![](https://raw.github.com/limonte/sweetalert2/master/images/swal2-success.png) | ![](https://raw.github.com/limonte/sweetalert2/master/images/swal2-error.png) | ![](https://raw.github.com/limonte/sweetalert2/master/images/swal2-warning.png) | ![](https://raw.github.com/limonte/sweetalert2/master/images/swal2-info.png) | ![](https://raw.github.com/limonte/sweetalert2/master/images/swal2-question.png) |


Configuration
-------------

| Argument             | Default value | Description |
| -------------------- | ------------- | ----- |
| `title`              | `null`        | The title of the modal. It can either be added to the object under the key "title" or passed as the first parameter of the function. |
| `text`               | `null`        | A description for the modal. It can either be added to the object under the key "text" or passed as the second parameter of the function. |
| `html`               | `null`        | A HTML description for the modal. If "text" and "html" parameters are provided in the same time, "text" will be used. |
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
| `closeOnConfirm`     | `true`        | Set to `false` if you want the modal to stay open even if the user presses the "Confirm"-button. This is especially useful if the function attached to the "Confirm"-button is another SweetAlert2. |
| `imageUrl`           | `null`        | Add a customized icon for the modal. Should contain a string with the path or URL to the image. |
| `imageWidth`         | `null`        | If imageUrl is set, you can specify imageWidth to describes image width in px. |
| `imageHeight`        | `null`        | Custom image height in px. |
| `imageClass`         | `null`        | A custom CSS class for the customized icon. |
| `timer`              | `null`        | Auto close timer of the modal. Set in ms (milliseconds). |
| `width`              | `500`         | Modal window width, including paddings (`box-sizing: border-box`). |
| `padding`            | `20`          | Modal window padding. |
| `background`         | `"#fff"`      | Modal window background (CSS `background` property). |

You can redefine default params by using `swal.setDefaults(customParams)` where `customParams` is an object.


Supported browsers
------------------

* Chrome (latest version)
* Firefox (latest version)
* Safari (latest two versions)
* Microsoft Edge (latest version)
* Opera (latest version)

Pay attention: IE is not supported since v1.0.0.


Contributing
------------

If you would like to contribute enhancements or fixes, please do the following:

1. Fork the plugin repository.

1. Make sure you have [Node](http://nodejs.org/) and [NPM](https://www.npmjs.com/) installed.

1. When in the SweetAlert directory, run the command ``npm install`` to install npm packages.

1. Start gulp watcher ``gulp watch`` to automatically minify the SCSS and JS-files.

1. Make a pull request and wait for approval.

Please note that modifications should follow these coding guidelines:

1. Indent is 2 spaces.

1. Javascript code should pass [jscs](http://jscs.info) and [jshint](http://jshint.com) linters with configurations in project repository.

1. SCSS code should pass [scss-lint](https://github.com/causes/scss-lint) with configuration in project repository.

1. Vertical whitespace helps readability, don't be afraid to use it.
