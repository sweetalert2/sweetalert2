import { Swal, SwalWithoutAnimation, TIMEOUT } from '../helpers.js'

QUnit.test('resumeTimer() method', (assert) => {
  const done = assert.async()

  SwalWithoutAnimation({
    timer: 5 * TIMEOUT
  })

  Swal.stopTimer()

  setTimeout(() => {
    assert.ok(Swal.isVisible())
    Swal.resumeTimer()
  }, 7 * TIMEOUT)

  setTimeout(() => {
    assert.notOk(Swal.isVisible())
    done()
  }, 15 * TIMEOUT)
})

