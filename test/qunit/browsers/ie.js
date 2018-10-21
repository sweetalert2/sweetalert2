const { Swal, SwalWithoutAnimation } = require('../helpers')

const isIE11 = !!window.MSInputMethodContext && !!document.documentMode

QUnit.test('tall modal', (assert) => {
  SwalWithoutAnimation({
    imageUrl: 'https://placeholder.pics/svg/300x1500',
    imageHeight: 1500
  })

  if (isIE11) {
    assert.equal(Swal.getContainer().style.alignItems, 'flex-start')
  } else {
    assert.equal(Swal.getContainer().style.alignItems, '')
  }
})
