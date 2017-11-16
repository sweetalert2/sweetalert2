/* global QUnit, swal */

QUnit.test('.swal2-toast-shown', function (assert) {
  swal({toast: true})
  assert.ok(document.body.classList.contains('swal2-toast-shown'))
  swal({toast: false})
  assert.notOk(document.body.classList.contains('swal2-toast-shown'))
})

QUnit.test('.swal2-has-input', function (assert) {
  var inputs = ['text', 'email', 'password', 'number', 'tel', 'range', 'textarea', 'select', 'radio', 'checkbox', 'file', 'url']
  inputs.forEach(input => {
    swal({input: input})
    assert.ok(document.body.classList.contains('swal2-has-input'), input)
  })
  swal({input: false})
  assert.notOk(document.body.classList.contains('swal2-has-input'))
})
