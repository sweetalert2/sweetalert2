import { Swal, SwalWithoutAnimation } from '../helpers.js'

QUnit.test('increaseTimer() method', (assert) => {
  const done = assert.async()

  SwalWithoutAnimation.fire({
    timer: 500
  })

  assert.ok(Swal.increaseTimer(400) > 0)

  setTimeout(() => {
    assert.ok(Swal.isVisible())
  }, 700)

  setTimeout(() => {
    assert.notOk(Swal.isVisible())
    done()
  }, 1000)
})

QUnit.test('increaseTimer() after stopTimer()', (assert) => {
  const done = assert.async()

  SwalWithoutAnimation.fire({
    timer: 500
  })

  const remainingTime = Swal.stopTimer()

  Swal.increaseTimer(10)

  setTimeout(() => {
    assert.equal(Swal.getTimerLeft(), remainingTime + 10)
    done()
  }, 100)
})

