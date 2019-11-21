import { Swal, ensureClosed } from '../helpers.js'

QUnit.test('hideLoading should not fail with closed popup', (assert) => {
  ensureClosed()
  Swal.hideLoading()
  assert.notOk(Swal.isVisible())
})
