const { Swal } = require('../helpers')

QUnit.test('imageUrl, imageWidth, imageHeight', (assert) => {
  Swal.fire({
    imageUrl: 'https://sweetalert2.github.io/images/swal2-logo.png',
    imageWidth: 498,
    imageHeight: 84
  })
  assert.equal(Swal.getImage().src, 'https://sweetalert2.github.io/images/swal2-logo.png')
  assert.equal(Swal.getImage().style.width, '498px')
  assert.equal(Swal.getImage().style.height, '84px')
})

QUnit.test('image dimentions in custom CSS units', (assert) => {
  Swal.fire({
    imageUrl: 'https://sweetalert2.github.io/images/swal2-logo.png',
    imageWidth: '50%',
    imageHeight: '3em'
  })
  assert.equal(Swal.getImage().style.width, '50%')
  assert.equal(Swal.getImage().style.height, '3em')
})

QUnit.test('image alt text and custom class', (assert) => {
  Swal.fire({
    text: 'Custom class is set',
    imageUrl: '/assets/swal2-logo.png',
    imageAlt: 'Custom icon',
    imageClass: 'image-custom-class'
  })
  assert.ok(Swal.getImage().classList.contains('image-custom-class'))
  assert.equal(Swal.getImage().getAttribute('alt'), 'Custom icon')

  Swal.fire({
    text: 'Custom class isn\'t set',
    imageUrl: '/assets/swal2-logo.png'
  })
  assert.notOk(Swal.getImage().classList.contains('image-custom-class'))
})
