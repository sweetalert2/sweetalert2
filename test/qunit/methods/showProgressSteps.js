import { $, Swal, isHidden, isVisible } from '../helpers.js'

QUnit.test('showProgressSteps() method', (assert) => {
  Swal.fire({
    pregressSteps: ['1', '2', '3'],
  })

  Swal.hideProgressSteps()
  assert.ok(isHidden($('.swal2-progress-steps')))

  Swal.showProgressSteps()
  assert.ok(isVisible($('.swal2-progress-steps')))
})
