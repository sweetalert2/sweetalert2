/* global QUnit */
const {Swal, SwalWithoutAnimation} = require('./helpers')
const $ = require('jquery')
import { triggerEscape, TIMEOUT } from './helpers.js'

QUnit.test('confirm button /w useRejections: true', (assert) => {
  const done = assert.async()

  SwalWithoutAnimation({
    title: 'Confirm me',
    useRejections: true
  }).then((result) => {
    assert.equal(result, true)
    done()
  })

  Swal.clickConfirm()
})

QUnit.test('cancel button /w useRejections: true', (assert) => {
  const done = assert.async()

  SwalWithoutAnimation({
    title: 'Cancel me',
    useRejections: true
  }).then(
    () => {},
    (dismiss) => {
      assert.equal(dismiss, Swal.DismissReason.cancel)
      done()
    }
  )

  Swal.clickCancel()
})

QUnit.test('esc key /w useRejections: true', (assert) => {
  const done = assert.async()

  SwalWithoutAnimation({
    title: 'Esc me',
    useRejections: true
  }).then(
    () => {},
    (dismiss) => {
      assert.equal(dismiss, Swal.DismissReason.esc)
      done()
    }
  )

  triggerEscape()
})

QUnit.test('backdrop click /w useRejections: true', (assert) => {
  const done = assert.async()

  Swal({
    title: 'Backdrop click',
    useRejections: true
  }).then(
    () => {},
    (dismiss) => {
      assert.equal(dismiss, Swal.DismissReason.backdrop)
      done()
    }
  )

  $('.swal2-container').click()
})

QUnit.test('timer /w useRejections: true', (assert) => {
  const done = assert.async()

  SwalWithoutAnimation({
    title: 'Timer test',
    timer: 10,
    useRejections: true
  }).then(
    () => {},
    (dismiss) => {
      assert.equal(dismiss, Swal.DismissReason.timer)
      done()
    }
  )
})

QUnit.test('close button /w useRejections: true', (assert) => {
  const done = assert.async()

  Swal({
    title: 'Close button test',
    showCloseButton: true,
    useRejections: true
  }).then(
    () => {},
    (dismiss) => {
      assert.equal(dismiss, Swal.DismissReason.close)
      done()
    }
  )

  const $closeButton = $('.swal2-close')
  assert.ok($closeButton.is(':visible'))
  $closeButton.click()
})

QUnit.test('input text /w useRejections: true', (assert) => {
  const done = assert.async()

  const string = 'Live for yourself'
  Swal({
    input: 'text',
    useRejections: true
  }).then((result) => {
    assert.equal(result, string)
    done()
  })

  $('.swal2-input').val(string)
  Swal.clickConfirm()
})

QUnit.test('built-in email validation /w useRejections: true', (assert) => {
  const done = assert.async()

  var validEmailAddress = 'team+support+a.b@example.com'
  Swal({
    input: 'email',
    useRejections: true
  }).then((result) => {
    assert.equal(result, validEmailAddress)
    done()
  })

  $('.swal2-input').val(validEmailAddress)
  Swal.clickConfirm()
})

QUnit.test('input select /w useRejections: true', (assert) => {
  const done = assert.async()

  const selected = 'dos'
  Swal({
    input: 'select',
    inputOptions: {uno: 1, dos: 2},
    useRejections: true
  }).then((result) => {
    assert.equal(result, selected)
    done()
  })

  $('.swal2-select').val(selected)
  Swal.clickConfirm()
})

QUnit.test('input checkbox /w useRejections: true', (assert) => {
  const done = assert.async()

  Swal({
    input: 'checkbox',
    inputAttributes: {
      name: 'test-checkbox'
    },
    useRejections: true
  }).then((result) => {
    assert.equal(checkbox.attr('name'), 'test-checkbox')
    assert.equal(result, '1')
    done()
  })

  const checkbox = $('.swal2-checkbox input')
  checkbox.prop('checked', true)
  Swal.clickConfirm()
})

QUnit.test('validation error /w expectRejections: true', (assert) => {
  const done = assert.async()
  const inputValidator = (value) => !value ? Promise.reject('no falsy values') : Promise.resolve()

  SwalWithoutAnimation({input: 'text', inputValidator, expectRejections: true})
  assert.ok($('.swal2-validationerror').is(':hidden'))
  setTimeout(() => {
    const initialModalHeight = $('.swal2-modal').outerHeight()

    Swal.clickConfirm()
    setTimeout(() => {
      assert.ok($('.swal2-validationerror').is(':visible'))
      assert.equal($('.swal2-validationerror').text(), 'no falsy values')
      assert.ok($('.swal2-input').attr('aria-invalid'))
      assert.ok($('.swal2-modal').outerHeight() > initialModalHeight)

      $('.swal2-input').val('blah-blah').trigger('input')
      assert.ok($('.swal2-validationerror').is(':hidden'))
      assert.notOk($('.swal2-input').attr('aria-invalid'))
      assert.ok($('.swal2-modal').outerHeight() === initialModalHeight)
      done()
    }, TIMEOUT)
  }, TIMEOUT)
})
