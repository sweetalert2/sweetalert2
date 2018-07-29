const { Swal } = require('../helpers')

QUnit.test('grow row', (assert) => {
  Swal({
    grow: 'row'
  })
  const containerStyles = window.getComputedStyle(Swal.getContainer())
  assert.equal(
    Swal.getPopup().clientWidth,
    Swal.getContainer().clientWidth - parseInt(containerStyles.paddingLeft) - parseInt(containerStyles.paddingRight)
  )
})

QUnit.test('grow column', (assert) => {
  Swal({
    grow: 'column'
  })
  const containerStyles = window.getComputedStyle(Swal.getContainer())
  assert.equal(
    Swal.getPopup().clientHeight,
    Swal.getContainer().clientHeight - parseInt(containerStyles.paddingTop) - parseInt(containerStyles.paddingBottom)
  )
})

QUnit.test('grow fullscreen', (assert) => {
  Swal({
    grow: 'fullscreen'
  })
  const containerStyles = window.getComputedStyle(Swal.getContainer())

  assert.equal(
    Swal.getPopup().clientWidth,
    Swal.getContainer().clientWidth - parseInt(containerStyles.paddingLeft) - parseInt(containerStyles.paddingRight)
  )

  assert.equal(
    Swal.getPopup().clientHeight,
    Swal.getContainer().clientHeight - parseInt(containerStyles.paddingTop) - parseInt(containerStyles.paddingBottom)
  )
})
