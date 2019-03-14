import { $, Swal } from '../helpers.js'

QUnit.test('getIcon() method', (assert) => {
  Swal.fire({ type: 'success' })
  assert.equal(Swal.getIcon(), $('.swal2-success'))
})
