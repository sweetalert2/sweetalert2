const { $, Swal, SwalWithoutAnimation } = require('./helpers')
const sinon = require('sinon/pkg/sinon')

QUnit.test('.swal2-toast-shown', (assert) => {
  Swal.fire({ toast: true })
  assert.ok(document.body.classList.contains('swal2-toast-shown'))
  assert.ok(document.documentElement.classList.contains('swal2-toast-shown'))
  Swal.fire({ toast: false })
  assert.notOk(document.body.classList.contains('swal2-toast-shown'))
  assert.notOk(document.documentElement.classList.contains('swal2-toast-shown'))
})

QUnit.test('should throw console warnings for incompatible parameters', (assert) => {
  const _consoleWarn = console.warn
  const spy = sinon.spy(console, 'warn')

  SwalWithoutAnimation.fire({
    allowOutsideClick: true,
    toast: true
  })
  assert.ok(spy.calledWith('SweetAlert2: The parameter "allowOutsideClick" is incompatible with toasts'))

  console.warn = _consoleWarn
})

QUnit.test('.swal2-toast-column if input', (assert) => {
  const inputs = ['text', 'email', 'password', 'number', 'tel', 'range', 'textarea', 'select', 'radio', 'checkbox', 'file', 'url']
  inputs.forEach((input) => {
    SwalWithoutAnimation.fire({ toast: true, input: input })
    assert.ok(document.body.classList.contains('swal2-toast-column'))

    SwalWithoutAnimation.fire({ input: input })
    assert.notOk(document.body.classList.contains('swal2-toast-column'))
  })
})

QUnit.test('.swal2-toast-column if footer', (assert) => {
  SwalWithoutAnimation.fire({ toast: true, footer: 'footer' })
  assert.ok(document.body.classList.contains('swal2-toast-column'))

  SwalWithoutAnimation.fire({ footer: 'footer' })
  assert.notOk(document.body.classList.contains('swal2-toast-column'))
})

QUnit.test('.swal2-toast-column if close button', (assert) => {
  SwalWithoutAnimation.fire({ toast: true, showCloseButton: true })
  assert.ok(document.body.classList.contains('swal2-toast-column'))

  SwalWithoutAnimation.fire({ showCloseButton: true })
  assert.notOk(document.body.classList.contains('swal2-toast-column'))
})

QUnit.test('toast click closes when no buttons or input are specified', (assert) => {
  const done = assert.async()

  SwalWithoutAnimation.fire({
    title: 'toast click close',
    toast: true,
    showConfirmButton: false
  }).then((result) => {
    assert.deepEqual(result, { dismiss: Swal.DismissReason.close })
    done()
  })

  $('.swal2-popup').click()
})

QUnit.test('toast click does not close if cancel button is present', (assert) => {
  const done = assert.async()

  SwalWithoutAnimation.fire({
    title: 'toast no close with button present',
    toast: true,
    showConfirmButton: false,
    showCancelButton: true
  })

  $('.swal2-popup').click()

  setTimeout(() => {
    assert.ok(Swal.isVisible())
    done()
  })
})

QUnit.test('toast click does not close if input option is specified', (assert) => {
  const done = assert.async()

  SwalWithoutAnimation.fire({
    title: 'toast no close with input present',
    toast: true,
    showConfirmButton: false,
    showCancelButton: false,
    input: 'text'
  })

  $('.swal2-popup').click()

  setTimeout(() => {
    assert.ok(Swal.isVisible())
    done()
  })
})
