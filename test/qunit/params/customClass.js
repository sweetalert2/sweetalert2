const { Swal } = require('../helpers')

QUnit.test('customClass as a string', (assert) => {
  Swal.fire({ customClass: 'custom-class' })
  assert.ok(Swal.getPopup().classList.contains('custom-class'))
})

QUnit.test('customClass as an object', (assert) => {
  Swal.fire({
    type: 'question',
    input: 'text',
    imageUrl: '/assets/swal2-logo.png',
    customClass: {
      container: 'container-class',
      popup: 'popup-class',
      header: 'header-class',
      title: 'title-class',
      closeButton: 'close-button-class',
      icon: 'icon-class',
      image: 'image-class',
      content: 'content-class',
      input: 'input-class',
      actions: 'actions-class',
      confirmButton: 'confirm-button-class',
      cancelButton: 'cancel-button-class',
      footer: 'footer-class'
    }
  })
  assert.ok(Swal.getContainer().classList.contains('container-class'))
  assert.ok(Swal.getPopup().classList.contains('popup-class'))
  assert.ok(Swal.getHeader().classList.contains('header-class'))
  assert.ok(Swal.getTitle().classList.contains('title-class'))
  assert.ok(Swal.getCloseButton().classList.contains('close-button-class'))
  assert.ok(Swal.getIcon().classList.contains('icon-class'))
  assert.ok(Swal.getImage().classList.contains('image-class'))
  assert.ok(Swal.getContent().classList.contains('content-class'))
  assert.ok(Swal.getInput().classList.contains('input-class'))
  assert.ok(Swal.getActions().classList.contains('actions-class'))
  assert.ok(Swal.getConfirmButton().classList.contains('confirm-button-class'))
  assert.ok(Swal.getCancelButton().classList.contains('cancel-button-class'))
  assert.ok(Swal.getFooter().classList.contains('footer-class'))
})

QUnit.test('customClass as an object with the only one key', (assert) => {
  Swal.fire({
    title: 'I should have a custom classname',
    customClass: {
      title: 'title-class',
    }
  })
  assert.ok(Swal.getTitle().classList.contains('title-class'))
})
