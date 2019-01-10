import { Swal, SwalWithoutAnimation } from '../helpers.js'

QUnit.test('isTimerRunning() method', (assert) => {
  const done = assert.async()

  SwalWithoutAnimation.fire({
    timer: 200
  })

  setTimeout(() => {
    assert.ok(Swal.isTimerRunning())
    Swal.stopTimer()
    assert.ok(!Swal.isTimerRunning())
    done()
  }, 100)
})
