const { Swal, SwalWithoutAnimation, isVisible } = require('../helpers')

QUnit.test('update() method', (assert) => {
  SwalWithoutAnimation.fire()

  Swal.update({
    title: 'New title',
    html: 'New content',
    type: 'success',
    showConfirmButton: false,
    showCancelButton: true,
    cancelButtonText: 'New cancel button text',
    imageUrl: '/assets/swal2-logo.png'
  })

  assert.equal(Swal.getTitle().textContent, 'New title')
  assert.equal(Swal.getContent().textContent, 'New content')

  assert.ok(isVisible(Swal.getIcons().filter(icon => icon.classList.contains('swal2-success'))[0]))

  assert.ok(isVisible(Swal.getImage()))
  assert.ok(Swal.getImage().src.indexOf('/assets/swal2-logo.png') > 0)

  assert.notOk(isVisible(Swal.getConfirmButton()))
  assert.ok(isVisible(Swal.getCancelButton()))
  assert.equal(Swal.getCancelButton().textContent, 'New cancel button text')
})

QUnit.test('isUpdatableParameter() method', (assert) => {
  assert.ok(Swal.isUpdatableParameter('title'))
  assert.notOk(Swal.isUpdatableParameter('preConfirm'))
})
