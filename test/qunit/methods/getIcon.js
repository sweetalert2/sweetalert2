import { $, Swal } from '../helpers.js'

QUnit.test('getIcon() method', (assert) => {
  Swal.fire({ icon: 'success' })
  assert.equal(Swal.getIcon(), $('.swal2-icon.swal2-success'))
})
