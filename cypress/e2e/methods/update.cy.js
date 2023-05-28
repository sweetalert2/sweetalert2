/// <reference types="cypress" />

import { $, Swal, SwalWithoutAnimation } from '../../utils'
import { isVisible } from '../../../src/utils/dom'
import { defaultParams, updatableParams } from '../../../src/utils/params'

describe('update()', () => {
  it('all updatableParams are valid', () => {
    expect(updatableParams.length).not.to.equal(0)
    updatableParams.forEach((updatableParam) => {
      if (!(updatableParam in defaultParams)) {
        throw new Error(`Invalid updatable param: ${updatableParam}`)
      }
    })
  })

  it('update() method', () => {
    SwalWithoutAnimation.fire({
      icon: 'success',
      input: 'text',
      showConfirmButton: false,
      imageUrl: '/assets/swal2-logo.png',
      preConfirm: () => console.log('1'), // eslint-disable-line no-console
    })

    Swal.update({
      background: 'green',
      title: 'New title',
      html: 'New content',
      icon: 'success',
      iconColor: 'blue',
      showConfirmButton: true,
      showDenyButton: true,
      showCancelButton: true,
      denyButtonText: 'New deny button text',
      cancelButtonText: 'New cancel button text',
      imageUrl: '/assets/swal2-logo.png',
      showCloseButton: true,
      preConfirm: () => console.log('2'), // eslint-disable-line no-console
    })

    expect(window.getComputedStyle(Swal.getPopup()).backgroundColor).to.equal('rgb(0, 128, 0)')

    expect(Swal.getTitle().textContent).to.equal('New title')
    expect(Swal.getHtmlContainer().textContent).to.equal('New content')

    expect(isVisible(Swal.getIcon())).to.be.true
    expect(Swal.getIcon()).to.equal($('.swal2-success'))
    expect(Swal.getIcon().style.color).to.equal('blue')
    expect(Swal.getIcon().style.borderColor).to.equal('blue')

    expect(isVisible(Swal.getImage())).to.be.true
    expect(Swal.getImage().src.indexOf('/assets/swal2-logo.png') > 0).to.be.true

    expect(isVisible(Swal.getConfirmButton())).to.be.true
    expect(isVisible(Swal.getCancelButton())).to.be.true
    expect(isVisible(Swal.getDenyButton())).to.be.true
    expect(Swal.getCancelButton().textContent).to.equal('New cancel button text')
    expect(Swal.getDenyButton().textContent).to.equal('New deny button text')

    expect(isVisible(Swal.getCloseButton())).to.be.true

    setTimeout(() => {
      const spy = cy.spy(console, 'warn')
      Swal.clickConfirm()
      expect(spy.calledWith('1')).to.be.false
      expect(spy.calledWith('2')).to.be.true
    })
  })

  it('update customClass', () => {
    SwalWithoutAnimation.fire({
      icon: 'success',
      imageUrl: '/assets/swal2-logo.png',
      input: 'text',
    })

    Swal.update({
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
        footer: 'footer-class',
      },
    })

    // new custom classnames should be added, and the previous custom classnames should be removed
    Swal.update({
      customClass: {
        container: 'container-class-NEW',
        popup: 'popup-class-NEW',
        title: 'title-class-NEW',
        closeButton: 'close-button-class-NEW',
        icon: 'icon-class-NEW',
        image: 'image-class-NEW',
        htmlContainer: 'html-container-class-NEW',
        input: 'input-class-NEW',
        actions: 'actions-class-NEW',
        confirmButton: 'confirm-button-class-NEW',
        denyButton: 'deny-button-class-NEW',
        cancelButton: 'cancel-button-class-NEW',
        footer: 'footer-class-NEW',
      },
    })

    expect(Swal.getContainer().classList.contains('container-class')).to.be.false
    expect(Swal.getPopup().classList.contains('popup-class')).to.be.false
    expect(Swal.getTitle().classList.contains('title-class')).to.be.false
    expect(Swal.getCloseButton().classList.contains('close-button-class')).to.be.false
    expect(Swal.getIcon().classList.contains('icon-class')).to.be.false
    expect(Swal.getImage().classList.contains('image-class')).to.be.false
    expect(Swal.getHtmlContainer().classList.contains('html-container-class')).to.be.false
    expect(Swal.getInput().classList.contains('input-class')).to.be.false
    expect(Swal.getActions().classList.contains('actions-class')).to.be.false
    expect(Swal.getConfirmButton().classList.contains('confirm-button-class')).to.be.false
    expect(Swal.getDenyButton().classList.contains('deny-button-class')).to.be.false
    expect(Swal.getCancelButton().classList.contains('cancel-button-class')).to.be.false
    expect(Swal.getFooter().classList.contains('footer-class')).to.be.false

    expect(Swal.getContainer().classList.contains('container-class-NEW')).to.be.true
    expect(Swal.getPopup().classList.contains('popup-class-NEW')).to.be.true
    expect(Swal.getTitle().classList.contains('title-class-NEW')).to.be.true
    expect(Swal.getCloseButton().classList.contains('close-button-class-NEW')).to.be.true
    expect(Swal.getIcon().classList.contains('icon-class-NEW')).to.be.true
    expect(Swal.getImage().classList.contains('image-class-NEW')).to.be.true
    expect(Swal.getHtmlContainer().classList.contains('html-container-class-NEW')).to.be.true
    expect(Swal.getInput().classList.contains('input-class-NEW')).to.be.true
    expect(Swal.getActions().classList.contains('actions-class-NEW')).to.be.true
    expect(Swal.getConfirmButton().classList.contains('confirm-button-class-NEW')).to.be.true
    expect(Swal.getDenyButton().classList.contains('deny-button-class-NEW')).to.be.true
    expect(Swal.getCancelButton().classList.contains('cancel-button-class-NEW')).to.be.true
    expect(Swal.getFooter().classList.contains('footer-class-NEW')).to.be.true
  })

  it('isUpdatableParameter() method', () => {
    expect(Swal.isUpdatableParameter('title')).to.be.true
    expect(Swal.isUpdatableParameter('willOpen')).to.be.false
  })

  it("should update instance's params", () => {
    const swal = Swal.fire({ icon: 'error' })
    expect(swal.params.icon).to.equal('error')
    swal.update({ icon: 'warning' })
    expect(swal.params.icon).to.equal('warning')
  })

  it('should not affect input', () => {
    Swal.fire({
      input: 'select',
      inputOptions: {
        uno: 'uno',
        dos: 'dos',
        tres: 'tres',
      },
    })
    Swal.getInput().value = 'dos'
    Swal.update({ html: 'hi' })
    expect(Swal.getInput().value).to.equal('dos')
  })

  it('should not affect showClass', (done) => {
    Swal.fire({
      icon: 'success',
      didOpen: () => {
        Swal.update({})
        expect(Swal.getContainer().classList.contains('swal2-backdrop-show')).to.be.true
        expect(Swal.getPopup().classList.contains('swal2-show')).to.be.true
        expect(Swal.getIcon().classList.contains('swal2-icon-show')).to.be.true
        done()
      },
    })
  })

  it('should not re-render the same success icon', (done) => {
    SwalWithoutAnimation.fire({
      icon: 'success',
      didOpen: () => {
        const oldIcon = Swal.getIcon().querySelector('.swal2-success-ring')
        Swal.update({})
        const newIcon = Swal.getIcon().querySelector('.swal2-success-ring')
        expect(newIcon).to.equal(oldIcon)
        done()
      },
    })
  })

  it('should not re-render the same error icon', (done) => {
    SwalWithoutAnimation.fire({
      icon: 'success',
      didOpen: () => {
        const oldIcon = Swal.getIcon().querySelector('.swal2-x-mark')
        Swal.update({})
        const newIcon = Swal.getIcon().querySelector('.swal2-x-mark')
        expect(newIcon).to.equal(oldIcon)
        done()
      },
    })
  })

  it('should not re-render the same info icon', (done) => {
    SwalWithoutAnimation.fire({
      icon: 'info',
      didOpen: () => {
        const oldIcon = Swal.getIcon().querySelector('.swal2-icon-content')
        Swal.update({})
        const newIcon = Swal.getIcon().querySelector('.swal2-icon-content')
        expect(newIcon).to.equal(oldIcon)
        done()
      },
    })
  })

  it('should not re-render the same icon with a custom content', (done) => {
    SwalWithoutAnimation.fire({
      icon: 'success',
      iconHtml: '<span>custom content</span>',
      didOpen: () => {
        const oldIcon = Swal.getIcon().querySelector('.swal2-icon-content')
        Swal.update({})
        const newIcon = Swal.getIcon().querySelector('.swal2-icon-content')
        expect(newIcon).to.equal(oldIcon)
        done()
      },
    })
  })

  it('update() method should throw a warning when attempting to update the closing popup', (done) => {
    const spy = cy.spy(console, 'warn')
    Swal.fire().then(() => {
      Swal.update()
      expect(
        spy.calledWith(
          `SweetAlert2: You're trying to update the closed or closing popup, that won't work. Use the update() method in preConfirm parameter or show a new popup.`
        )
      ).to.be.true
      done()
    })
    Swal.clickConfirm()
  })
})
