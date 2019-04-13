const { $, Swal, SwalWithoutAnimation, isVisible } = require('../helpers')

QUnit.test('update() method', (assert) => {
  SwalWithoutAnimation.fire({
    type: 'success',
    input: 'text',
    imageUrl: '/assets/swal2-logo.png',
  })

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

  assert.ok(isVisible(Swal.getIcon()))
  assert.equal(Swal.getIcon(), $('.swal2-success'))

  assert.ok(isVisible(Swal.getImage()))
  assert.ok(Swal.getImage().src.indexOf('/assets/swal2-logo.png') > 0)

  assert.notOk(isVisible(Swal.getConfirmButton()))
  assert.ok(isVisible(Swal.getCancelButton()))
  assert.equal(Swal.getCancelButton().textContent, 'New cancel button text')
})

QUnit.test('update customClass', (assert) => {
  SwalWithoutAnimation.fire({
    type: 'success',
    imageUrl: '/assets/swal2-logo.png',
    input: 'text'
  })

  Swal.update({
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

  // new custom classnames should be added, and the previous custom classnames should be removed
  Swal.update({
    customClass: {
      container: 'container-class-NEW',
      popup: 'popup-class-NEW',
      header: 'header-class-NEW',
      title: 'title-class-NEW',
      closeButton: 'close-button-class-NEW',
      icon: 'icon-class-NEW',
      image: 'image-class-NEW',
      content: 'content-class-NEW',
      input: 'input-class-NEW',
      actions: 'actions-class-NEW',
      confirmButton: 'confirm-button-class-NEW',
      cancelButton: 'cancel-button-class-NEW',
      footer: 'footer-class-NEW'
    }
  })

  assert.notOk(Swal.getContainer().classList.contains('container-class'))
  assert.notOk(Swal.getPopup().classList.contains('popup-class'))
  assert.notOk(Swal.getHeader().classList.contains('header-class'))
  assert.notOk(Swal.getTitle().classList.contains('title-class'))
  assert.notOk(Swal.getCloseButton().classList.contains('close-button-class'))
  assert.notOk(Swal.getIcon().classList.contains('icon-class'))
  assert.notOk(Swal.getImage().classList.contains('image-class'))
  assert.notOk(Swal.getContent().classList.contains('content-class'))
  assert.notOk(Swal.getInput().classList.contains('input-class'))
  assert.notOk(Swal.getActions().classList.contains('actions-class'))
  assert.notOk(Swal.getConfirmButton().classList.contains('confirm-button-class'))
  assert.notOk(Swal.getCancelButton().classList.contains('cancel-button-class'))
  assert.notOk(Swal.getFooter().classList.contains('footer-class'))

  assert.ok(Swal.getContainer().classList.contains('container-class-NEW'))
  assert.ok(Swal.getPopup().classList.contains('popup-class-NEW'))
  assert.ok(Swal.getHeader().classList.contains('header-class-NEW'))
  assert.ok(Swal.getTitle().classList.contains('title-class-NEW'))
  assert.ok(Swal.getCloseButton().classList.contains('close-button-class-NEW'))
  assert.ok(Swal.getIcon().classList.contains('icon-class-NEW'))
  assert.ok(Swal.getImage().classList.contains('image-class-NEW'))
  assert.ok(Swal.getContent().classList.contains('content-class-NEW'))
  assert.ok(Swal.getInput().classList.contains('input-class-NEW'))
  assert.ok(Swal.getActions().classList.contains('actions-class-NEW'))
  assert.ok(Swal.getConfirmButton().classList.contains('confirm-button-class-NEW'))
  assert.ok(Swal.getCancelButton().classList.contains('cancel-button-class-NEW'))
  assert.ok(Swal.getFooter().classList.contains('footer-class-NEW'))
})

QUnit.test('isUpdatableParameter() method', (assert) => {
  assert.ok(Swal.isUpdatableParameter('title'))
  assert.notOk(Swal.isUpdatableParameter('preConfirm'))
})

QUnit.test('should update instance\'s params', (assert) => {
  const swal = Swal.fire({ type: 'error' })
  assert.equal(swal.params.type, 'error')
  swal.update({ type: 'warning' })
  assert.equal(swal.params.type, 'warning')
})

QUnit.test('should not affect input', (assert) => {
  Swal.fire({
    input: 'select',
    inputOptions: {
      uno: 'uno',
      dos: 'dos',
      tres: 'tres'
    }
  })
  Swal.getInput().value = 'dos'
  Swal.update({ html: 'hi' })
  assert.equal(Swal.getInput().value, 'dos')
})
