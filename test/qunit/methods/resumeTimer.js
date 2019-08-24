import { Swal, SwalWithoutAnimation } from '../helpers.js'

// TODO (@limonte): flaky test, revisit
// failed, expected argument to be falsy, was: true in the last setTimeout()
// QUnit.test('resumeTimer() method', (assert) => {
//   const done = assert.async()

//   SwalWithoutAnimation.fire({
//     timer: 100
//   })

//   Swal.stopTimer()

//   setTimeout(() => {
//     assert.ok(Swal.isVisible())
//     Swal.resumeTimer()
//   }, 200)

//   setTimeout(() => {
//     assert.notOk(Swal.isVisible())
//     done()
//   }, 700)
// })

QUnit.test('resumeTimer() method called twice', (assert) => {
  const done = assert.async()

  SwalWithoutAnimation.fire({
    timer: 500
  })

  Swal.resumeTimer()
  Swal.resumeTimer()

  Swal.stopTimer()

  setTimeout(() => {
    assert.ok(Swal.isVisible())
    done()
  }, 1000)
})
