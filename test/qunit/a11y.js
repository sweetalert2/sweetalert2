const { $, Swal, SwalWithoutAnimation } = require('./helpers')
const { RESTORE_FOCUS_TIMEOUT } = require('../../src/constants')

QUnit.test('previous active element', (assert) => {
  const done = assert.async()

  const button = document.createElement('button')
  button.innerText = 'I am focused'
  document.body.appendChild(button)
  button.focus()

  SwalWithoutAnimation.fire('swal 1')
  SwalWithoutAnimation.fire('swal 2')
  Swal.clickConfirm()

  setTimeout(() => {
    assert.equal(document.activeElement, button)
    document.body.removeChild(button)
    done()
  }, RESTORE_FOCUS_TIMEOUT)
})

QUnit.test('should focus body in there is not previuos active element', (assert) => {
  const done = assert.async()

  SwalWithoutAnimation.fire('I was called programmatically and will focus body after closing')
  Swal.clickConfirm()

  setTimeout(() => {
    assert.equal(document.activeElement, document.body)
    done()
  }, RESTORE_FOCUS_TIMEOUT)
})

QUnit.test('should set aria-hidden="true" to all body children if modal', (assert) => {
  const div = document.createElement('div')
  const divAriaHiddenFalse = document.createElement('div')
  divAriaHiddenFalse.setAttribute('aria-hidden', 'false')
  document.body.appendChild(div)
  document.body.appendChild(divAriaHiddenFalse)

  SwalWithoutAnimation.fire({})
  assert.equal(div.getAttribute('aria-hidden'), 'true')
  assert.equal(divAriaHiddenFalse.getAttribute('aria-hidden'), 'true')

  Swal.close()
  assert.notOk(div.hasAttribute('aria-hidden'))
  assert.equal(divAriaHiddenFalse.getAttribute('aria-hidden'), 'false')
})

QUnit.test('should not set aria-hidden="true" on the custom container (target)', (assert) => {
  const div = document.createElement('div')
  document.body.appendChild(div)

  SwalWithoutAnimation.fire({
    target: div
  })
  assert.notOk(div.hasAttribute('aria-hidden'))
})

QUnit.test('should not set aria-hidden="true" when `backdrop: false`', (assert) => {
  const div = document.createElement('div')
  document.body.appendChild(div)

  SwalWithoutAnimation.fire({
    backdrop: false
  })
  assert.notOk(div.hasAttribute('aria-hidden'))
})

QUnit.test('should not set aria-hidden="true" when `toast: true`', (assert) => {
  const div = document.createElement('div')
  document.body.appendChild(div)

  SwalWithoutAnimation.fire({
    toast: true
  })
  assert.notOk(div.hasAttribute('aria-hidden'))
})

QUnit.test('dialog aria attributes', (assert) => {
  Swal.fire('Modal dialog')
  assert.equal($('.swal2-modal').getAttribute('role'), 'dialog')
  assert.equal($('.swal2-modal').getAttribute('aria-live'), 'assertive')
  assert.equal($('.swal2-modal').getAttribute('aria-modal'), 'true')
})

QUnit.test('toast aria attributes', (assert) => {
  Swal.fire({ title: 'Toast', toast: true })
  assert.equal($('.swal2-toast').getAttribute('role'), 'alert')
  assert.equal($('.swal2-toast').getAttribute('aria-live'), 'polite')
  assert.notOk($('.swal2-toast').getAttribute('aria-modal'))
})
