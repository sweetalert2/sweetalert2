const { Swal, SwalWithoutAnimation, isIE } = require('../helpers')

QUnit.test('tall modal', (assert) => {
  SwalWithoutAnimation.fire({
    imageUrl: 'https://placeholder.pics/svg/300x1500',
    imageHeight: 1500
  })

  if (isIE) {
    assert.equal(Swal.getContainer().style.alignItems, 'flex-start')
  } else {
    assert.equal(Swal.getContainer().style.alignItems, '')
  }
})
