import { Swal, ensureClosed } from '../helpers.js'

QUnit.test('should open an empty popup with loader', (assert) => {
  ensureClosed()
  Swal.showLoading()
  assert.ok(Swal.isVisible())
  assert.ok(Swal.getActions().classList.contains('swal2-loading'))
})
