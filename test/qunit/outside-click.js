const { Swal, SwalWithoutAnimation, dispatchCustomEvent, TIMEOUT } = require('./helpers')
const sinon = require('sinon/pkg/sinon')

const simulateMouseEvent = (x, y, eventType) => {
  dispatchCustomEvent(
    document.elementFromPoint(x, y),
    eventType,
    { clientX: x, clientY: y }
  )
}

QUnit.test('backdrop click', (assert) => {
  const done = assert.async()

  SwalWithoutAnimation.fire('Backdrop click').then((result) => {
    assert.deepEqual(result, { dismiss: Swal.DismissReason.backdrop })
    done()
  })

  Swal.getContainer().click()
})

QUnit.test('double backdrop click', (assert) => {
  const done = assert.async()
  const onAfterClose = sinon.fake()

  Swal.fire({
    title: 'onAfterClose should be triggered once',
    onAfterClose
  })

  Swal.getContainer().click()
  Swal.getContainer().click()

  setTimeout(() => {
    assert.ok(onAfterClose.calledOnce)
    done()
  }, 500)
})

QUnit.test('popup mousedown, backdrop mouseup', (assert) => {
  const done = assert.async()

  Swal.fire('popup mousedown, backdrop mouseup')

  simulateMouseEvent(1, 1, 'mousedown')
  simulateMouseEvent(window.innerWidth / 2, window.innerHeight / 2, 'mouseup')

  setTimeout(() => {
    assert.ok(Swal.isVisible())
    done()
  })
})

QUnit.test('backdrop mousedown, popup mouseup', (assert) => {
  const done = assert.async()

  SwalWithoutAnimation.fire('backdrop mousedown, popup mouseup')

  simulateMouseEvent(window.innerWidth / 2, window.innerHeight / 2, 'mousedown')
  simulateMouseEvent(1, 1, 'mouseup')

  setTimeout(() => {
    assert.ok(Swal.isVisible())
    done()
  })
})

QUnit.test('allowOutsideClick: false', (assert) => {
  const done = assert.async()

  SwalWithoutAnimation.fire({
    title: 'allowOutsideClick: false',
    allowOutsideClick: false
  })

  Swal.getContainer().click()

  setTimeout(() => {
    assert.ok(Swal.isVisible())
    done()
  })
})

QUnit.test('allowOutsideClick: () => !swal.isLoading()', (assert) => {
  const done = assert.async()

  SwalWithoutAnimation.fire({
    title: 'allowOutsideClick: () => !swal.isLoading()',
    allowOutsideClick: () => !Swal.isLoading()
  }).then((result) => {
    assert.deepEqual(result, { dismiss: Swal.DismissReason.backdrop })
    done()
  })

  Swal.showLoading()

  Swal.getContainer().click()

  setTimeout(() => {
    assert.ok(Swal.isVisible())
    Swal.hideLoading()
    Swal.getContainer().click()
  }, TIMEOUT)
})

QUnit.test('allowOutsideClick: should throw console warning for popups without backdrop', (assert) => {
  const _consoleWarn = console.warn
  const spy = sinon.spy(console, 'warn')

  SwalWithoutAnimation.fire({
    title: 'allowOutsideClick is not compatible with modeless popups',
    allowOutsideClick: true,
    backdrop: false
  })

  console.warn = _consoleWarn
  assert.ok(spy.calledWith('SweetAlert2: "allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`'))
})
