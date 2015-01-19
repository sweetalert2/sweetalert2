SweetAlert2
-----------

An awesome replacement for JavaScript's alert.

[See it in action!](https://limonte.github.io/sweetalert2/)

![A success modal](https://raw.github.com/limonte/sweetalert2/master/sweetalert.gif)


Usage
-----

You can install SweetAlert2 through bower:

```bash
bower install sweetalert2
```

Alternatively, download the package and reference the JavaScript and CSS files manually:

```html
<script src="dist/sweetalert2.min.js"></script>
<link rel="stylesheet" type="text/css" href="dist/sweetalert2.css">
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
  cancelButtonColor: '#d44',
  confirmButtonText: 'Yes, delete it!',
  cancelButtonText: 'No, keet it',
  closeOnConfirm: false
}, function() {
  swal(
    'Deleted!',
    'Your imaginary file has been deleted.',
    'success'
  );
});
```

[View more examples](https://limonte.github.io/sweetalert2/)


Contributing
------------

If you would like to contribute enhancements or fixes, please do the following:

1. Fork the plugin repository.

1. Make sure you have [Node](http://nodejs.org/) and [NPM](https://www.npmjs.com/) installed.

1. When in the SweetAlert directory, run the command ``npm install`` to install npm packages.

1. Start gulp watcher ``gulp watch`` to automatically minify the SCSS and JS-files.

1. Hack on a separate topic branch created from the latest master.

1. Commit and push the topic branch.

1. Make a pull request and wait for approval.

1. Welcome to the club

Please note that modifications should follow these coding guidelines:

1. Indent is 2 spaces.

1. Javascript code should pass [jscs](http://jscs.info) and [jshint](http://jshint.com) linters with configurations in project repository.

1. SCSS code should pass [scss-lint](https://github.com/causes/scss-lint) with configuration in project repository.

1. Vertical whitespace helps readability, don't be afraid to use it.

Thank you for helping out!


Related projects
----------------

* [SweetAlert](https://github.com/t4t5/sweetalert)
* [SweetAlert for Android](https://github.com/pedant/sweet-alert-dialog)
* [SweetAlert for Bootstrap](https://github.com/lipis/bootstrap-sweetalert)

