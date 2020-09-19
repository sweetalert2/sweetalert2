import { $, Swal, ensureClosed, isHidden, isVisible } from '../helpers.js'

QUnit.test('should open an empty popup with loader', (assert) => {
  ensureClosed()
  Swal.showLoading()
  assert.ok(Swal.isVisible())
  assert.ok(Swal.getActions().classList.contains('swal2-loading'))
  assert.ok(isVisible($('.swal2-loader')))
  assert.equal($('.swal2-loader').innerHTML, '')
})

QUnit.test('showConfirmButton: false + showLoading()', (assert) => {
  const done = assert.async()
  Swal.fire({
    showConfirmButton: false,
    loaderHtml: '<i>hi</i>',
    didOpen: () => {
      assert.ok(isHidden(Swal.getActions()))
      Swal.showLoading()
      assert.ok(isVisible(Swal.getActions()))
      assert.ok(Swal.getActions().classList.contains('swal2-loading'))
      assert.ok(isVisible($('.swal2-loader')))
      assert.equal($('.swal2-loader').innerHTML, '<i>hi</i>')
      assert.ok(isHidden(Swal.getConfirmButton()))
      assert.ok(isHidden(Swal.getCancelButton()))
      done()
    },
  })
})
