import { $, Swal, SwalWithoutAnimation } from '../helpers.js'

QUnit.test('isTimerRunning() method', (assert) => {
  SwalWithoutAnimation.fire({
    timer: 500,
    timerProgressBar: true
  })
  assert.equal(Swal.getTimerProgressBar(), $('.swal2-timer-progress-bar'))
})
