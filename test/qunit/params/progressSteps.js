const { Swal, SwalWithoutAnimation } = require('../helpers')

QUnit.test('first .swal2-progress-step is active by default', (assert) => {
  const done = assert.async()

  SwalWithoutAnimation.queue([{
    progressSteps: ['1', '2', '3'],
    didOpen: () => {
      assert.ok(Swal.getProgressSteps().querySelector('.swal2-progress-step').classList.contains('swal2-active-progress-step'))
      done()
    }
  }])
})
