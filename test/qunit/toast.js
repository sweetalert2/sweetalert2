const { Swal } = require('./helpers')
const sinon = require('sinon/pkg/sinon')

const Toast = Swal.mixin({ toast: true })
QUnit.test('.swal2-toast-shown', (assert) => {
  Toast.fire()
  assert.ok(document.body.classList.contains('swal2-toast-shown'))
  assert.ok(document.documentElement.classList.contains('swal2-toast-shown'))
  Swal.fire()
  assert.notOk(document.body.classList.contains('swal2-toast-shown'))
  assert.notOk(document.documentElement.classList.contains('swal2-toast-shown'))
})

QUnit.test('should throw console warnings for incompatible parameters', (assert) => {
  const _consoleWarn = console.warn
  const spy = sinon.spy(console, 'warn')

  Toast.fire({
    allowOutsideClick: true
  })
  assert.ok(spy.calledWith('SweetAlert2: The parameter "allowOutsideClick" is incompatible with toasts'))

  console.warn = _consoleWarn
})

QUnit.test('.swal2-toast-column if input', (assert) => {
  const inputs = ['text', 'email', 'password', 'number', 'tel', 'range', 'textarea', 'select', 'radio', 'checkbox', 'file', 'url']
  inputs.forEach((input) => {
    Toast.fire({ input: input })
    assert.ok(document.body.classList.contains('swal2-toast-column'))

    Swal.fire({ input: input })
    assert.notOk(document.body.classList.contains('swal2-toast-column'))
  })
})

QUnit.test('.swal2-toast-column if footer', (assert) => {
  Toast.fire({ footer: 'footer' })
  assert.ok(document.body.classList.contains('swal2-toast-column'))

  Swal.fire({ footer: 'footer' })
  assert.notOk(document.body.classList.contains('swal2-toast-column'))
})

QUnit.test('.swal2-toast-column if close button', (assert) => {
  Toast.fire({ showCloseButton: true })
  assert.ok(document.body.classList.contains('swal2-toast-column'))

  Swal.fire({ showCloseButton: true })
  assert.notOk(document.body.classList.contains('swal2-toast-column'))
})

QUnit.test('toast click closes when no buttons or input are specified', (assert) => {
  const done = assert.async()

  Toast.fire({
    showConfirmButton: false
  }).then((result) => {
    assert.deepEqual(result, {
      dismiss: Toast.DismissReason.close,
      isConfirmed: false,
      isDenied: false,
      isDismissed: true,
    })
    done()
  })

  Toast.getPopup().click()
})

QUnit.test('toast click does not close if cancel button is present', (assert) => {
  const done = assert.async()

  Toast.fire({
    animation: false,
    showConfirmButton: false,
    showCancelButton: true
  })

  Toast.getPopup().click()

  setTimeout(() => {
    assert.ok(Toast.isVisible())
    done()
  })
})

QUnit.test('toast click does not close if input option is specified', (assert) => {
  const done = assert.async()

  Toast.fire({
    animation: false,
    showConfirmButton: false,
    showCancelButton: false,
    input: 'text'
  })

  Toast.getPopup().click()

  setTimeout(() => {
    assert.ok(Toast.isVisible())
    done()
  })
})

QUnit.test('Body classes are removed after closing toats', (assert) => {
  const done = assert.async()

  Toast.fire({
    didOpen: () => {
      Toast.close()
    },
    didClose: () => {
      assert.notOk(document.body.classList.contains('swal2-shown'))
      assert.notOk(document.body.classList.contains('swal2-toast-shown'))
      done()
    }
  })
})
