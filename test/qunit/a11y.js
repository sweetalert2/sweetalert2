/* global QUnit */
const {$, Swal, SwalWithoutAnimation} = require('./helpers')
const {RESTORE_FOCUS_TIMEOUT} = require('../../src/constants')

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
    assert.equal(document.activeElement, button)
    document.body.removeChild(button)
    done()
  }, RESTORE_FOCUS_TIMEOUT)
})

QUnit.test('dialog aria attributes', (assert) => {
  Swal('Modal dialog')
  assert.equal($('.swal2-modal').getAttribute('role'), 'dialog')
  assert.equal($('.swal2-modal').getAttribute('aria-live'), 'assertive')
  assert.equal($('.swal2-modal').getAttribute('aria-modal'), 'true')
})

QUnit.test('toast aria attributes', (assert) => {
  Swal({title: 'Toast', toast: true})
  assert.equal($('.swal2-toast').getAttribute('role'), 'alert')
  assert.equal($('.swal2-toast').getAttribute('aria-live'), 'polite')
  assert.notOk($('.swal2-toast').getAttribute('aria-modal'))
})
