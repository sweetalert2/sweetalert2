/* global QUnit */
const {Swal, SwalWithoutAnimation} = require('./helpers')
const $ = require('jquery')

QUnit.test('previous active element', (assert) => {
  const done = assert.async()

  const button = document.createElement('button')
  button.innerText = 'I am focused'
  document.body.appendChild(button)
  button.focus()

  SwalWithoutAnimation('swal 1')
  SwalWithoutAnimation('swal 2')
  Swal.clickConfirm()

  setTimeout(() => {
    assert.ok(document.activeElement === button)
    document.body.removeChild(button)
    done()
  }, 100) // issues/900
})

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
