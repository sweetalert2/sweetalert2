/* global QUnit, swal */

QUnit.test('.swal2-toast-shown', (assert) => {
  swal({toast: true})
  assert.ok(document.body.classList.contains('swal2-toast-shown'))
  assert.ok(document.documentElement.classList.contains('swal2-toast-shown'))
  swal({toast: false})
  assert.notOk(document.body.classList.contains('swal2-toast-shown'))
  assert.notOk(document.documentElement.classList.contains('swal2-toast-shown'))
})

QUnit.test('.swal2-has-input', (assert) => {
  var inputs = ['text', 'email', 'password', 'number', 'tel', 'range', 'textarea', 'select', 'radio', 'checkbox', 'file', 'url']
  inputs.forEach((input) => {
    swal({input: input})
    assert.ok(document.body.classList.contains('swal2-has-input'), input)
  })
})

QUnit.test('should not overrie window.onkeydown', (assert) => {
  swal({toast: true})
  assert.equal(null, window.onkeydown)
})
