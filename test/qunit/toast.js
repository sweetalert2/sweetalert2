/* global QUnit */
const {swal} = require('./helpers')
const $ = require('jquery')

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

QUnit.test('toast click closes when no buttons or input are specified', (assert) => {
  const done = assert.async()

  swal({
    title: 'toast click close',
    animation: false,
    toast: true,
    showConfirmButton: false
  }).then((result) => {
    assert.deepEqual(result, {dismiss: swal.DismissReason.close})
    done()
  })

  $('.swal2-popup').click()
})

QUnit.test('toast click does not close if cancel button is present', (assert) => {
  const done = assert.async()

  swal({
    title: 'toast no close with button present',
    animation: false,
    toast: true,
    showConfirmButton: false,
    showCancelButton: true
  })

  $('.swal2-popup').click()

  setTimeout(() => {
    assert.ok(swal.isVisible())
    done()
  })
})

QUnit.test('toast click does not close if input option is specified', (assert) => {
  const done = assert.async()

  swal({
    title: 'toast no close with input present',
    animation: false,
    toast: true,
    showConfirmButton: false,
    showCancelButton: false,
    input: 'text'
  })

  $('.swal2-popup').click()

  setTimeout(() => {
    assert.ok(swal.isVisible())
    done()
  })
})
