/* global QUnit */
const {Swal} = require('./helpers')
const $ = require('jquery')

const simulateMouseEvent = (x, y, eventType) => {
  var event = $.Event(eventType)
  event.clientX = x
  event.clientY = y
  $(document.elementFromPoint(x, y)).trigger(event)
}

QUnit.test('backdrop click', (assert) => {
  const done = assert.async()

  Swal({
    title: 'Backdrop click',
    animation: false
  }).then((result) => {
    assert.deepEqual(result, {dismiss: Swal.DismissReason.backdrop})
    done()
  })

  $('.swal2-container').click()
})

QUnit.test('popup mousedown, backdrop mouseup', (assert) => {
  const done = assert.async()

  Swal({
    title: 'popup mousedown, backdrop mouseup',
    animation: false
  })

  simulateMouseEvent(1, 1, 'mousedown')
  simulateMouseEvent(window.innerWidth / 2, window.innerHeight / 2, 'mouseup')

  setTimeout(() => {
    assert.ok(Swal.isVisible())
    done()
  })
})

QUnit.test('backdrop mousedown, popup mouseup', (assert) => {
  const done = assert.async()

  Swal({
    title: 'backdrop mousedown, popup mouseup',
    animation: false
  })

  simulateMouseEvent(window.innerWidth / 2, window.innerHeight / 2, 'mousedown')
  simulateMouseEvent(1, 1, 'mouseup')

  setTimeout(() => {
    assert.ok(Swal.isVisible())
    done()
  })
})

QUnit.test('allowOutsideClick: false', (assert) => {
  const done = assert.async()

  Swal({
    title: 'allowOutsideClick: false',
    allowOutsideClick: false,
    animation: false
  })

  $('.swal2-container').click()

  setTimeout(() => {
    assert.ok(Swal.isVisible())
    done()
  })
})

QUnit.test('allowOutsideClick: () => !swal.isLoading()', (assert) => {
  const done = assert.async()

  Swal({
    title: 'allowOutsideClick: () => !swal.isLoading()',
    allowOutsideClick: () => !Swal.isLoading(),
    animation: false
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
  })
})
