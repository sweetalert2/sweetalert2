/* global QUnit, swal */

QUnit.test('.swal2-toast-shown', function (assert) {
  swal({toast: true})
  assert.ok(document.body.classList.contains('swal2-toast-shown'))
  swal({toast: false})
  assert.notOk(document.body.classList.contains('swal2-toast-shown'))
})
