const { Swal } = require('../helpers')

QUnit.test('first .swal2-progress-step is active by default', (assert) => {
  const done = assert.async()

  Swal.queue([{
    progressSteps: ['1', '2', '3'],
    onOpen: () => {
      assert.ok(Swal.getProgressSteps().querySelector('.swal2-progress-step').classList.contains('swal2-active-progress-step'))
      done()
    }
  }])
})
