const { Swal } = require('../helpers')

QUnit.test('imageUrl, imageWidth, imageHeight', (assert) => {
  Swal.fire({
    imageUrl: 'https://sweetalert2.github.io/images/swal2-logo.png',
    imageWidth: 498,
    imageHeight: 84
  })
  assert.equal(Swal.getImage().src, 'https://sweetalert2.github.io/images/swal2-logo.png')
  assert.equal(Swal.getImage().getAttribute('width'), '498')
  assert.equal(Swal.getImage().getAttribute('height'), '84')
})
