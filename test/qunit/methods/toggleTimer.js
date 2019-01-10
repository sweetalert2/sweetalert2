import { Swal, SwalWithoutAnimation } from '../helpers.js'

QUnit.test('toggleTimer() method', (assert) => {
  const done = assert.async()

  SwalWithoutAnimation.fire({
    timer: 500
  })

  Swal.toggleTimer()

  setTimeout(() => {
    assert.ok(Swal.isVisible())
    Swal.toggleTimer()
  }, 700)

  setTimeout(() => {
    assert.notOk(Swal.isVisible())
    done()
  }, 2000)
})

