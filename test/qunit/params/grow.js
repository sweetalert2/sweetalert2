const { Swal } = require('../helpers')

QUnit.test('grow row', (assert) => {
  Swal.fire({
    grow: 'row'
  })
  const containerStyles = window.getComputedStyle(Swal.getContainer())
  assert.equal(
    Swal.getPopup().clientWidth,
    parseInt(Swal.getContainer().clientWidth - parseFloat(containerStyles.paddingLeft) - parseFloat(containerStyles.paddingRight))
  )
})

QUnit.test('grow column', (assert) => {
  Swal.fire({
    grow: 'column'
  })
  const containerStyles = window.getComputedStyle(Swal.getContainer())
  assert.equal(
    Swal.getPopup().clientHeight,
    parseInt(Swal.getContainer().clientHeight - parseFloat(containerStyles.paddingTop) - parseFloat(containerStyles.paddingBottom))
  )
})

QUnit.test('grow fullscreen', (assert) => {
  Swal.fire({
    grow: 'fullscreen'
  })
  const containerStyles = window.getComputedStyle(Swal.getContainer())

  assert.equal(
    Swal.getPopup().clientWidth,
    parseInt(Swal.getContainer().clientWidth - parseFloat(containerStyles.paddingLeft) - parseFloat(containerStyles.paddingRight))
  )

  assert.equal(
    Swal.getPopup().clientHeight,
    parseInt(Swal.getContainer().clientHeight - parseFloat(containerStyles.paddingTop) - parseFloat(containerStyles.paddingBottom))
  )
})
