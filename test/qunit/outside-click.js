/* global QUnit */
const {$, Swal, SwalWithoutAnimation, dispatchCustomEvent, TIMEOUT} = require('./helpers')

const simulateMouseEvent = (x, y, eventType) => {
  dispatchCustomEvent(
    document.elementFromPoint(x, y),
    eventType,
    {clientX: x, clientY: y}
  )
}

QUnit.test('backdrop click', (assert) => {
  const done = assert.async()

  SwalWithoutAnimation('Backdrop click').then((result) => {
    assert.deepEqual(result, {dismiss: Swal.DismissReason.backdrop})
    done()
  })

  $('.swal2-container').click()
})

QUnit.test('popup mousedown, backdrop mouseup', (assert) => {
  const done = assert.async()

  Swal('popup mousedown, backdrop mouseup')

  simulateMouseEvent(1, 1, 'mousedown')
  simulateMouseEvent(window.innerWidth / 2, window.innerHeight / 2, 'mouseup')

  setTimeout(() => {
    assert.ok(Swal.isVisible())
    done()
  })
})

QUnit.test('backdrop mousedown, popup mouseup', (assert) => {
  const done = assert.async()

  SwalWithoutAnimation('backdrop mousedown, popup mouseup')

  simulateMouseEvent(window.innerWidth / 2, window.innerHeight / 2, 'mousedown')
  simulateMouseEvent(1, 1, 'mouseup')

  setTimeout(() => {
    assert.ok(Swal.isVisible())
    done()
  })
})

QUnit.test('allowOutsideClick: false', (assert) => {
  const done = assert.async()

  SwalWithoutAnimation({
    title: 'allowOutsideClick: false',
    allowOutsideClick: false
  })

  $('.swal2-container').click()

  setTimeout(() => {
    assert.ok(Swal.isVisible())
    done()
  })
})

QUnit.test('allowOutsideClick: () => !swal.isLoading()', (assert) => {
  const done = assert.async()

  SwalWithoutAnimation({
    title: 'allowOutsideClick: () => !swal.isLoading()',
    allowOutsideClick: () => !Swal.isLoading()
  }).then((result) => {
    assert.deepEqual(result, {dismiss: Swal.DismissReason.backdrop})
    done()
  })

  Swal.showLoading()

  $('.swal2-container').click()

  setTimeout(() => {
    assert.ok(Swal.isVisible())
    Swal.hideLoading()
    $('.swal2-container').click()
  }, TIMEOUT)
})
