/* global QUnit */
const {$, Swal, SwalWithoutAnimation} = require('./helpers')

QUnit.test('.swal2-toast-shown', (assert) => {
  Swal({toast: true})
  assert.ok(document.body.classList.contains('swal2-toast-shown'))
  assert.ok(document.documentElement.classList.contains('swal2-toast-shown'))
  Swal({toast: false})
  assert.notOk(document.body.classList.contains('swal2-toast-shown'))
  assert.notOk(document.documentElement.classList.contains('swal2-toast-shown'))
})

QUnit.test('.swal2-toast-column if input', (assert) => {
  var inputs = ['text', 'email', 'password', 'number', 'tel', 'range', 'textarea', 'select', 'radio', 'checkbox', 'file', 'url']
  inputs.forEach((input) => {
    SwalWithoutAnimation({input: input})
    assert.ok(document.body.classList.contains('swal2-toast-column'))
  })
})

QUnit.test('.swal2-toast-column if footer', (assert) => {
  SwalWithoutAnimation({footer: 'footer'})
  assert.ok(document.body.classList.contains('swal2-toast-column'))
})

QUnit.test('.swal2-toast-column if close button', (assert) => {
  SwalWithoutAnimation({showCloseButton: true})
  assert.ok(document.body.classList.contains('swal2-toast-column'))
})

QUnit.test('toast click closes when no buttons or input are specified', (assert) => {
  const done = assert.async()

  SwalWithoutAnimation({
    title: 'toast click close',
    toast: true,
    showConfirmButton: false
  }).then((result) => {
    assert.deepEqual(result, {dismiss: Swal.DismissReason.close})
    done()
  })

  $('.swal2-popup').click()
})

QUnit.test('toast click does not close if cancel button is present', (assert) => {
  const done = assert.async()

  SwalWithoutAnimation({
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

  SwalWithoutAnimation({
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
