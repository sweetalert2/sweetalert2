/* global $, QUnit, swal */

QUnit.test('confirm button /w useRejections: true', (assert) => {
  const done = assert.async()

  swal({
    title: 'Confirm me',
    useRejections: true
  }).then((result) => {
    assert.equal(result, true)
    done()
  })

  swal.clickConfirm()
})

QUnit.test('cancel button /w useRejections: true', (assert) => {
  const done = assert.async()

  swal({
    title: 'Cancel me',
    useRejections: true
  }).then(
    () => {},
    (dismiss) => {
      assert.equal(dismiss, 'cancel')
      done()
    }
  )

  swal.clickCancel()
})

QUnit.test('esc key /w useRejections: true', (assert) => {
  const done = assert.async()

  swal({
    title: 'Esc me',
    useRejections: true
  }).then(
    () => {},
    (dismiss) => {
      assert.equal(dismiss, 'esc')
      done()
    }
  )

  $(document).trigger($.Event('keydown', {
    key: 'Escape'
  }))
})

QUnit.test('overlay click /w useRejections: true', (assert) => {
  const done = assert.async()

  swal({
    title: 'Overlay click',
    useRejections: true
  }).then(
    () => {},
    (dismiss) => {
      assert.equal(dismiss, 'overlay')
      done()
    }
  )

  $('.swal2-container').click()
})

QUnit.test('timer /w useRejections: true', (assert) => {
  const done = assert.async()

  swal({
    title: 'Timer test',
    timer: 10,
    animation: false,
    useRejections: true
  }).then(
    () => {},
    (dismiss) => {
      assert.equal(dismiss, 'timer')
      done()
    }
  )
})

QUnit.test('close button /w useRejections: true', (assert) => {
  const done = assert.async()

  swal({
    title: 'Close button test',
    showCloseButton: true,
    useRejections: true
  }).then(
    () => {},
    (dismiss) => {
      assert.equal(dismiss, 'close')
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
  swal({
    input: 'text',
    useRejections: true
  }).then((result) => {
    assert.equal(result, string)
    done()
  })

  $('.swal2-input').val(string)
  swal.clickConfirm()
})

QUnit.test('built-in email validation /w useRejections: true', (assert) => {
  const done = assert.async()

  var validEmailAddress = 'team+support+a.b@example.com'
  swal({
    input: 'email',
    useRejections: true
  }).then((result) => {
    assert.equal(result, validEmailAddress)
    done()
  })

  $('.swal2-input').val(validEmailAddress)
  swal.clickConfirm()
})

QUnit.test('input select /w useRejections: true', (assert) => {
  const done = assert.async()

  const selected = 'dos'
  swal({
    input: 'select',
    inputOptions: {uno: 1, dos: 2},
    useRejections: true
  }).then((result) => {
    assert.equal(result, selected)
    done()
  })

  $('.swal2-select').val(selected)
  swal.clickConfirm()
})

QUnit.test('input checkbox /w useRejections: true', (assert) => {
  const done = assert.async()

  swal({
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
  swal.clickConfirm()
})

QUnit.test('validation error /w expectRejections: true', (assert) => {
  const done = assert.async()
  const inputValidator = (value) => !value ? Promise.reject('no falsy values') : Promise.resolve()

  swal({input: 'text', animation: false, inputValidator, expectRejections: true})
  assert.ok($('.swal2-validationerror').is(':hidden'))
  setTimeout(() => {
    const initialModalHeight = $('.swal2-modal').outerHeight()

    swal.clickConfirm()
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
    })
  }, 60)
})
