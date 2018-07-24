/* global QUnit */
import { Swal } from '../helpers.js'

QUnit.test('getFocusableElements() method', (assert) => {
  Swal({
    input: 'text',
    showCancelButton: true,
    showCloseButton: true
  })
  const focusableElements = Swal.getFocusableElements()
  assert.deepEqual(focusableElements, [
    Swal.getCloseButton(),
    Swal.getInput(),
    Swal.getConfirmButton(),
    Swal.getCancelButton(),
  ])
})
