/* global QUnit */
const {$, Swal, SwalWithoutAnimation, triggerEscape, isVisible} = require('./helpers')

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

  const closeButton = $('.swal2-close')
  assert.ok(isVisible(closeButton))
  closeButton.click()
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

  $('.swal2-input').value = string
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

  $('.swal2-input').value = validEmailAddress
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

  $('.swal2-select').value = selected
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
    assert.equal(checkbox.getAttribute('name'), 'test-checkbox')
    assert.equal(result, '1')
    done()
  })

  const checkbox = $('.swal2-checkbox input')
  checkbox.checked = true
  Swal.clickConfirm()
})
