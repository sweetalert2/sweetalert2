const { $, Swal } = require('../helpers')
const sinon = require('sinon/pkg/sinon')

QUnit.test('customClass as a string', (assert) => {
  Swal.fire({ customClass: 'custom-class' })
  assert.ok(Swal.getPopup().classList.contains('custom-class'))
})

QUnit.test('customClass as an object', (assert) => {
  Swal.fire({
    icon: 'question',
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
      denyButton: 'deny-button-class',
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
  assert.ok(Swal.getDenyButton().classList.contains('deny-button-class'))
  assert.ok(Swal.getCancelButton().classList.contains('cancel-button-class'))
  assert.ok(Swal.getFooter().classList.contains('footer-class'))
})

QUnit.test('only visible input has custom class', (assert) => {
  Swal.fire({
    input: 'checkbox',
    customClass: {
      input: 'input-class',
    }
  })
  assert.ok($('.swal2-checkbox').classList.contains('input-class'))
  assert.notOk(Swal.getInput().classList.contains('input-class'))
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

QUnit.test('should throw console warning about unexpected type of customClass', (assert) => {
  const _consoleWarn = console.warn
  const spy = sinon.spy(console, 'warn')
  Swal.fire({
    customClass: {
      title: {},
      popup: 14,
    }
  })
  console.warn = _consoleWarn
  assert.ok(spy.calledWith('SweetAlert2: Invalid type of customClass.title! Expected string or iterable object, got "object"'))
  assert.ok(spy.calledWith('SweetAlert2: Invalid type of customClass.popup! Expected string or iterable object, got "number"'))
})
