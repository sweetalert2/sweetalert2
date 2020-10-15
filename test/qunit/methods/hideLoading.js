import { Swal, ensureClosed, SwalWithoutAnimation } from '../helpers.js'

QUnit.test('hideLoading should set display: inline-block to confirmButton', (assert) => {
  SwalWithoutAnimation.fire()
  Swal.hideLoading()
  assert.equal(Swal.getConfirmButton().style.display, 'inline-block')
})

QUnit.test('hideLoading should not fail with closed popup', (assert) => {
  ensureClosed()
  Swal.hideLoading()
  assert.notOk(Swal.isVisible())
})
