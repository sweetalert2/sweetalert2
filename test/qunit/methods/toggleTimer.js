import { Swal, SwalWithoutAnimation, TIMEOUT } from '../helpers.js'

QUnit.test('toggleTimer() method', (assert) => {
  const done = assert.async()

  SwalWithoutAnimation({
    timer: 5 * TIMEOUT
  })

  Swal.toggleTimer()

  setTimeout(() => {
    assert.ok(Swal.isVisible())
    Swal.toggleTimer()
  }, 7 * TIMEOUT)

  setTimeout(() => {
    assert.notOk(Swal.isVisible())
    done()
  }, 20 * TIMEOUT)
})

