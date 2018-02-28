/* global QUnit */
const {swal} = require('./helpers')
const $ = require('jquery')

const simulateMouseEvent = (x, y, eventType) => {
  var event = $.Event(eventType)
  event.clientX = x
  event.clientY = y
  $(document.elementFromPoint(x, y)).trigger(event)
}

QUnit.test('backdrop click', (assert) => {
  const done = assert.async()

  swal({
    title: 'Backdrop click',
    animation: false
  }).then((result) => {
    assert.deepEqual(result, {dismiss: swal.DismissReason.backdrop})
    done()
  })

  $('.swal2-container').click()
})

QUnit.test('popup mousedown, backdrop mouseup', (assert) => {
  const done = assert.async()

  swal({
    title: 'popup mousedown, backdrop mouseup',
    animation: false
  })

  simulateMouseEvent(1, 1, 'mousedown')
  simulateMouseEvent(window.innerWidth / 2, window.innerHeight / 2, 'mouseup')

  setTimeout(() => {
    assert.ok(swal.isVisible())
    done()
  })
})

QUnit.test('backdrop mousedown, popup mouseup', (assert) => {
  const done = assert.async()

  swal({
    title: 'backdrop mousedown, popup mouseup',
    animation: false
  })

  simulateMouseEvent(window.innerWidth / 2, window.innerHeight / 2, 'mousedown')
  simulateMouseEvent(1, 1, 'mouseup')

  setTimeout(() => {
    assert.ok(swal.isVisible())
    done()
  })
})

QUnit.test('allowOutsideClick: false', (assert) => {
  const done = assert.async()

  swal({
    title: 'allowOutsideClick: false',
    allowOutsideClick: false,
    animation: false
  })

  $('.swal2-container').click()

  setTimeout(() => {
    assert.ok(swal.isVisible())
    done()
  })
})

QUnit.test('allowOutsideClick: () => !swal.isLoading()', (assert) => {
  const done = assert.async()

  swal({
    title: 'allowOutsideClick: () => !swal.isLoading()',
    allowOutsideClick: () => !swal.isLoading(),
    animation: false
  }).then((result) => {
    assert.deepEqual(result, {dismiss: swal.DismissReason.backdrop})
    done()
  })

  swal.showLoading()

  $('.swal2-container').click()

  setTimeout(() => {
    assert.ok(swal.isVisible())
    swal.hideLoading()
    $('.swal2-container').click()
  })
})
