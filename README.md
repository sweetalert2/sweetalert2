SweetAlert2
-----------

An awesome replacement for JavaScript's alert.

[See it in action!](https://limonte.github.io/sweetalert2/)

![A success modal](https://raw.github.com/limonte/sweetalert2/master/sweetalert.gif)


Why fork?
---------

This fork provides the same functionality as the original by [t4t5](https://github.com/t4t5/sweetalert) but supports HTML code in modal, configuring modal width, padding and some other options.

The old repository seems to be inactive. There's a bunch of Pull Requests without any replies, last merged pull request was on Nov 9, 2014.

SweetAlert2 is backward compatible with [SweetAlert](https://github.com/t4t5/sweetalert).

I will maintain this repo and I will accept pull requests.


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
2. Hack on a separate topic branch created from the latest master.
3. Commit and push the topic branch.
4. Make a pull request.
5. Welcome to the club

Please note that modifications should follow these coding guidelines:

1. Indent is 2 spaces.
2. Javascript code should pass [jscs](http://jscs.info) and [jshint](http://jshint.com) linters with configurations in project repository.
3. SCSS code should pass [scss-lint](https://github.com/causes/scss-lint) with configuration in project repository.
4. Vertical whitespace helps readability, don't be afraid to use it.

Thank you for helping out!


Related projects
----------------

* [SweetAlert](https://github.com/t4t5/sweetalert)
* [SweetAlert for Android](https://github.com/pedant/sweet-alert-dialog)
* [SweetAlert for Bootstrap](https://github.com/lipis/bootstrap-sweetalert)

