import { Swal, ensureClosed, isHidden, isVisible } from '../helpers.js'

QUnit.test('should open an empty popup with loader', (assert) => {
  ensureClosed()
  Swal.showLoading()
  assert.ok(Swal.isVisible())
  assert.ok(Swal.getActions().classList.contains('swal2-loading'))
})

QUnit.test('showConfirmButton: false + showLoading()', (assert) => {
  const done = assert.async()
  Swal.fire({
    showConfirmButton: false,
    onOpen: () => {
      Swal.showLoading()
      assert.ok(Swal.getActions().classList.contains('swal2-loading'))
      assert.ok(isVisible(Swal.getConfirmButton()))
      assert.ok(isHidden(Swal.getCancelButton()))
      done()
    },
  })
})
