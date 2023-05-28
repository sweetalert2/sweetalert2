/// <reference types="cypress" />

import { $, Swal } from '../../utils'

describe('customClass', () => {
  it('customClass as a string', () => {
    Swal.fire({ customClass: 'custom-class' })
    expect(Swal.getPopup().classList.contains('custom-class')).to.be.true
  })

  it('customClass as an object', () => {
    Swal.fire({
      icon: 'question',
      input: 'text',
      imageUrl: '/assets/swal2-logo.png',
      timer: 10000,
      timerProgressBar: true,
      customClass: {
        container: 'container-class',
        popup: 'popup-class',
        title: 'title-class',
        closeButton: 'close-button-class',
        icon: 'icon-class',
        image: 'image-class',
        htmlContainer: 'html-container-class',
        input: 'input-class',
        actions: 'actions-class',
        confirmButton: 'confirm-button-class',
        denyButton: 'deny-button-class',
        cancelButton: 'cancel-button-class',
        loader: 'loader-class',
        footer: 'footer-class',
        timerProgressBar: 'timer-progress-bar-class',
      },
    })
    expect(Swal.getContainer().classList.contains('container-class')).to.be.true
    expect(Swal.getPopup().classList.contains('popup-class')).to.be.true
    expect(Swal.getTitle().classList.contains('title-class')).to.be.true
    expect(Swal.getCloseButton().classList.contains('close-button-class')).to.be.true
    expect(Swal.getIcon().classList.contains('icon-class')).to.be.true
    expect(Swal.getImage().classList.contains('image-class')).to.be.true
    expect(Swal.getHtmlContainer().classList.contains('html-container-class')).to.be.true
    expect(Swal.getInput().classList.contains('input-class')).to.be.true
    expect(Swal.getActions().classList.contains('actions-class')).to.be.true
    expect(Swal.getConfirmButton().classList.contains('confirm-button-class')).to.be.true
    expect(Swal.getDenyButton().classList.contains('deny-button-class')).to.be.true
    expect(Swal.getCancelButton().classList.contains('cancel-button-class')).to.be.true
    expect(Swal.getLoader().classList.contains('loader-class')).to.be.true
    expect(Swal.getFooter().classList.contains('footer-class')).to.be.true
    expect(Swal.getTimerProgressBar().classList.contains('timer-progress-bar-class')).to.be.true
  })

  it('only visible input has custom class', () => {
    Swal.fire({
      input: 'checkbox',
      customClass: {
        input: 'input-class',
      },
    })
    expect($('.swal2-checkbox').classList.contains('input-class')).to.be.true
    expect(Swal.getInput().classList.contains('input-class')).to.be.false
  })

  it('customClass as an object with the only one key', () => {
    Swal.fire({
      title: 'I should have a custom classname',
      customClass: {
        title: 'title-class',
      },
    })
    expect(Swal.getTitle().classList.contains('title-class')).to.be.true
  })

  it('should throw console warning about unexpected type of customClass', () => {
    const spy = cy.spy(console, 'warn')
    Swal.fire({
      customClass: {
        title: {},
        popup: 14,
      },
    })
    expect(
      spy.calledWith('SweetAlert2: Invalid type of customClass.title! Expected string or iterable object, got "object"')
    ).to.be.true
    expect(
      spy.calledWith('SweetAlert2: Invalid type of customClass.popup! Expected string or iterable object, got "number"')
    ).to.be.true
  })
})
