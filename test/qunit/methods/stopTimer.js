import { Swal } from '../helpers.js'

QUnit.test('stopTimer() method', (assert) => {
  const done = assert.async()

  Swal({
    timer: 500
  })

  setTimeout(() => {
    assert.ok(Swal.stopTimer() > 0)
  }, 250)

  setTimeout(() => {
    assert.ok(Swal.isVisible())
    done()
  }, 750)
})

