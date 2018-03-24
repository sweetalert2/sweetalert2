/* global QUnit */
const {Swal} = require('./helpers')
const $ = require('jquery')

QUnit.test('dialog aria attributes', (assert) => {
  Swal('Modal dialog')
  assert.equal($('.swal2-modal').attr('role'), 'dialog')
  assert.equal($('.swal2-modal').attr('aria-live'), 'assertive')
  assert.equal($('.swal2-modal').attr('aria-modal'), 'true')
})

QUnit.test('toast aria attributes', (assert) => {
  Swal({title: 'Toast', toast: true})
  assert.equal($('.swal2-toast').attr('role'), 'alert')
  assert.equal($('.swal2-toast').attr('aria-live'), 'polite')
  assert.notOk($('.swal2-toast').attr('aria-modal'))
})
