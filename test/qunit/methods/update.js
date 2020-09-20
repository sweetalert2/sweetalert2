const { $, Swal, SwalWithoutAnimation, isVisible } = require('../helpers')
const { defaultParams, updatableParams } = require('../../../src/utils/params')
const sinon = require('sinon/pkg/sinon')

QUnit.test('all updatableParams are valid', (assert) => {
  assert.ok(updatableParams)
  updatableParams.forEach((updatableParam) => {
    if (!(updatableParam in defaultParams)) {
      throw new Error(`Invalid updatable param: ${updatableParam}`)
    }
  })
})

QUnit.test('update() method', (assert) => {
  SwalWithoutAnimation.fire({
    icon: 'success',
    input: 'text',
    imageUrl: '/assets/swal2-logo.png',
  })

  Swal.update({
    background: 'green',
    title: 'New title',
    html: 'New content',
    icon: 'success',
    iconColor: 'blue',
    showConfirmButton: false,
    showDenyButton: true,
    showCancelButton: true,
    denyButtonText: 'New deny button text',
    cancelButtonText: 'New cancel button text',
    imageUrl: '/assets/swal2-logo.png',
    showCloseButton: true,
  })

  assert.equal(window.getComputedStyle(Swal.getPopup()).backgroundColor, 'rgb(0, 128, 0)')

  assert.equal(Swal.getTitle().textContent, 'New title')
  assert.equal(Swal.getContent().textContent, 'New content')

  assert.ok(isVisible(Swal.getIcon()))
  assert.equal(Swal.getIcon(), $('.swal2-success'))
  assert.equal(Swal.getIcon().style.color, 'blue')
  assert.equal(Swal.getIcon().style.borderColor, 'blue')

  assert.ok(isVisible(Swal.getImage()))
  assert.ok(Swal.getImage().src.indexOf('/assets/swal2-logo.png') > 0)

  assert.notOk(isVisible(Swal.getConfirmButton()))
  assert.ok(isVisible(Swal.getDenyButton()))
  assert.equal(Swal.getDenyButton().textContent, 'New deny button text')
  assert.ok(isVisible(Swal.getCancelButton()))
  assert.equal(Swal.getCancelButton().textContent, 'New cancel button text')

  assert.ok(isVisible(Swal.getCloseButton()))
})

QUnit.test('update customClass', (assert) => {
  SwalWithoutAnimation.fire({
    icon: 'success',
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
      denyButton: 'deny-button-class',
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
      denyButton: 'deny-button-class-NEW',
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
  assert.notOk(Swal.getDenyButton().classList.contains('deny-button-class'))
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
  assert.ok(Swal.getDenyButton().classList.contains('deny-button-class-NEW'))
  assert.ok(Swal.getCancelButton().classList.contains('cancel-button-class-NEW'))
  assert.ok(Swal.getFooter().classList.contains('footer-class-NEW'))
})

QUnit.test('isUpdatableParameter() method', (assert) => {
  assert.ok(Swal.isUpdatableParameter('title'))
  assert.notOk(Swal.isUpdatableParameter('preConfirm'))
})

QUnit.test('should update instance\'s params', (assert) => {
  const swal = Swal.fire({ icon: 'error' })
  assert.equal(swal.params.icon, 'error')
  swal.update({ icon: 'warning' })
  assert.equal(swal.params.icon, 'warning')
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

QUnit.test('should not affect showClass', (assert) => {
  const done = assert.async()
  Swal.fire({
    icon: 'success',
    didOpen: () => {
      Swal.update({})
      assert.ok(Swal.getContainer().classList.contains('swal2-backdrop-show'))
      assert.ok(Swal.getPopup().classList.contains('swal2-show'))
      assert.ok(Swal.getIcon().classList.contains('swal2-icon-show'))
      done()
    }
  })
})

QUnit.test('update() method should throw a warning when attempting to update the closing popup', (assert) => {
  const done = assert.async()
  const _consoleWarn = console.warn
  const spy = sinon.spy(console, 'warn')

  Swal.fire().then(() => {
    Swal.update()
    console.warn = _consoleWarn
    assert.ok(spy.calledWith(`SweetAlert2: You're trying to update the closed or closing popup, that won't work. Use the update() method in preConfirm parameter or show a new popup.`))
    done()
  })
  Swal.clickConfirm()
})
