import { Swal } from '../helpers.js'

QUnit.test('setProgressSteps() method', (assert) => {
  Swal.fire({ title: 'I will have a progress steps' })
  Swal.setProgressSteps(['1', '2', '3'])
  const progressSteps = Swal.getProgressSteps()
  assert.deepEqual(progressSteps, ['1', '2', '3'])
})
