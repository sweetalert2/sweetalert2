/// <reference types="cypress" />

import jQuery from 'jquery'
import Swal from '../../src/sweetalert2'
import { SHOW_CLASS_TIMEOUT } from '../../src/utils/openPopup'
import {
  $,
  SwalWithoutAnimation,
  TIMEOUT,
  dispatchCustomEvent,
  dispatchMouseEvent,
  dispatchTouchEvent,
  ensureClosed,
  isHidden,
  triggerKeydownEvent,
} from '../utils'
import { isVisible } from '../../src/utils/dom'
import { defaultParams, updatableParams } from '../../src/utils/params'
import defaultInputValidators from '../../src/utils/defaultInputValidators'
import privateMethods from '../../src/privateMethods'
import globalState from '../../src/globalState'
import privateProps from '../../src/privateProps'
import { measureScrollbar } from '../../src/utils/scrollbar'
import { iconTypes, swalClasses } from '../../src/utils/classes'
import { RESTORE_FOCUS_TIMEOUT } from '../../src/constants'

describe('Accessibility', () => {
  it('should restore focus', (done) => {
    const button = document.createElement('button')
    button.innerText = 'I am focused'
    document.body.appendChild(button)
    button.focus()

    SwalWithoutAnimation.fire('swal 1')
    SwalWithoutAnimation.fire('swal 2')
    Swal.clickConfirm()

    setTimeout(() => {
      expect(document.activeElement).to.equal(button)
      document.body.removeChild(button)
      done()
    }, RESTORE_FOCUS_TIMEOUT)
  })

  it('should not restore focus when returnFocus set to false', (done) => {
    const button = document.createElement('button')
    button.innerText = 'I am focused'
    document.body.appendChild(button)
    button.focus()

    SwalWithoutAnimation.fire({
      returnFocus: false,
    })
    Swal.clickConfirm()

    setTimeout(() => {
      expect(document.activeElement).to.equal(document.body)
      document.body.removeChild(button)
      done()
    }, RESTORE_FOCUS_TIMEOUT)
  })

  it('should focus body in there is not previuos active element', (done) => {
    SwalWithoutAnimation.fire('I was called programmatically and will focus body after closing')
    Swal.clickConfirm()

    setTimeout(() => {
      expect(document.activeElement).to.equal(document.body)
      done()
    }, RESTORE_FOCUS_TIMEOUT)
  })

  it('should set aria-hidden="true" to all body children if modal', () => {
    const div = document.createElement('div')
    const divAriaHiddenFalse = document.createElement('div')
    divAriaHiddenFalse.setAttribute('aria-hidden', 'false')
    document.body.appendChild(div)
    document.body.appendChild(divAriaHiddenFalse)

    SwalWithoutAnimation.fire({})
    expect(div.getAttribute('aria-hidden')).to.equal('true')
    expect(divAriaHiddenFalse.getAttribute('aria-hidden')).to.equal('true')

    Swal.close()
    expect(div.hasAttribute('aria-hidden')).to.be.false
    expect(divAriaHiddenFalse.getAttribute('aria-hidden')).to.equal('false')
  })

  it('should not set aria-hidden="true" on the custom container (target)', () => {
    const div = document.createElement('div')
    document.body.appendChild(div)

    SwalWithoutAnimation.fire({
      target: div,
    })
    expect(div.hasAttribute('aria-hidden')).to.be.false
  })

  it('should not set aria-hidden="true" when `backdrop: false`', () => {
    const div = document.createElement('div')
    document.body.appendChild(div)

    SwalWithoutAnimation.fire({
      backdrop: false,
    })
    expect(div.hasAttribute('aria-hidden')).to.be.false
  })

  it('should not set aria-hidden="true" when `toast: true`', (done) => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    const divAriaHiddenTrue = document.createElement('div')
    divAriaHiddenTrue.setAttribute('aria-hidden', 'true')
    document.body.appendChild(divAriaHiddenTrue)
    SwalWithoutAnimation.fire({
      toast: true,
      didClose: () => {
        expect(divAriaHiddenTrue.getAttribute('aria-hidden')).to.equal('true')
        done()
      },
    })
    expect(div.hasAttribute('aria-hidden')).to.be.false
    Swal.close()
  })

  it('should unset aria-hidden="true" when two modals are called one after another', (done) => {
    const div = document.createElement('div')
    div.setAttribute('aria-hidden', 'true')
    document.body.appendChild(div)
    Swal.fire({
      didClose: () => {
        Swal.fire({
          didClose: () => {
            expect(div.hasAttribute('aria-hidden')).to.be.true
            done()
          },
        })
        Swal.close()
      },
    })
    Swal.close()
  })

  it('should unset aria-hidden="true" when modal is called twice', () => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    SwalWithoutAnimation.fire()
    SwalWithoutAnimation.fire()
    SwalWithoutAnimation.close()
    expect(div.hasAttribute('aria-hidden')).to.be.false
  })

  it('should set modal ARIA attributes', () => {
    Swal.fire('Modal dialog')
    expect(Swal.getPopup().getAttribute('role')).to.equal('dialog')
    expect(Swal.getPopup().getAttribute('aria-live')).to.equal('assertive')
    expect(Swal.getPopup().getAttribute('aria-modal')).to.equal('true')
  })

  it('should set toast ARIA attributes', () => {
    Swal.fire({ title: 'Toast', toast: true })
    expect(Swal.getPopup().getAttribute('role')).to.equal('alert')
    expect(Swal.getPopup().getAttribute('aria-live')).to.equal('polite')
    expect(Swal.getPopup().getAttribute('aria-modal')).to.be.null
  })
})

describe('should trap focus in modals', () => {
  it('focus trap forward', (done) => {
    Swal.fire({
      input: 'text',
      showDenyButton: true,
      showCancelButton: true,
      showCloseButton: true,
      didOpen: () => {
        expect(document.activeElement).to.equal(Swal.getInput())
        triggerKeydownEvent(document.activeElement, 'Tab')
        expect(document.activeElement).to.equal(Swal.getConfirmButton())
        triggerKeydownEvent(document.activeElement, 'Tab')
        expect(document.activeElement).to.equal(Swal.getDenyButton())
        triggerKeydownEvent(document.activeElement, 'Tab')
        expect(document.activeElement).to.equal(Swal.getCancelButton())
        triggerKeydownEvent(document.activeElement, 'Tab')
        expect(document.activeElement).to.equal(Swal.getCloseButton())
        triggerKeydownEvent(document.activeElement, 'Tab')
        expect(document.activeElement).to.equal(Swal.getInput())
        done()
      },
    })
  })

  it('focus trap backward', (done) => {
    Swal.fire({
      input: 'text',
      showDenyButton: true,
      showCancelButton: true,
      showCloseButton: true,
      didOpen: () => {
        expect(document.activeElement).to.equal(Swal.getInput())
        triggerKeydownEvent(document.activeElement, 'Tab', { shiftKey: true })
        expect(document.activeElement).to.equal(Swal.getCloseButton())
        triggerKeydownEvent(document.activeElement, 'Tab', { shiftKey: true })
        expect(document.activeElement).to.equal(Swal.getCancelButton())
        triggerKeydownEvent(document.activeElement, 'Tab', { shiftKey: true })
        expect(document.activeElement).to.equal(Swal.getDenyButton())
        triggerKeydownEvent(document.activeElement, 'Tab', { shiftKey: true })
        expect(document.activeElement).to.equal(Swal.getConfirmButton())
        triggerKeydownEvent(document.activeElement, 'Tab', { shiftKey: true })
        expect(document.activeElement).to.equal(Swal.getInput())
        done()
      },
    })
  })

  it('arrow keys with Confirm, Cancel buttons', (done) => {
    Swal.fire({
      showCancelButton: true,
      didOpen: () => {
        triggerKeydownEvent(document.activeElement, 'ArrowRight')
        expect(document.activeElement).to.equal(Swal.getCancelButton())
        triggerKeydownEvent(document.activeElement, 'ArrowLeft')
        expect(document.activeElement).to.equal(Swal.getConfirmButton())
        done()
      },
    })
  })

  it('arrow keys with Confirm, Cancel, Deny buttons', (done) => {
    Swal.fire({
      showDenyButton: true,
      showCancelButton: true,
      didOpen: () => {
        triggerKeydownEvent(document.activeElement, 'ArrowRight')
        expect(document.activeElement).to.equal(Swal.getDenyButton())
        triggerKeydownEvent(document.activeElement, 'ArrowRight')
        expect(document.activeElement).to.equal(Swal.getCancelButton())
        triggerKeydownEvent(document.activeElement, 'ArrowLeft')
        expect(document.activeElement).to.equal(Swal.getDenyButton())
        triggerKeydownEvent(document.activeElement, 'ArrowLeft')
        expect(document.activeElement).to.equal(Swal.getConfirmButton())
        done()
      },
    })
  })
})

describe('Focus', () => {
  it('default focus', (done) => {
    SwalWithoutAnimation.fire('Modal with the Confirm button only')
    expect(document.activeElement).to.equal(document.querySelector('.swal2-confirm'))
    SwalWithoutAnimation.fire({
      text: 'Modal with two buttons',
      showCancelButton: true,
    })
    expect(document.activeElement).to.equal(document.querySelector('.swal2-confirm'))
    SwalWithoutAnimation.fire({
      text: 'Modal with no focusable elements in it',
      showConfirmButton: false,
    })
    expect(document.activeElement).to.equal(document.querySelector('.swal2-modal'))
    SwalWithoutAnimation.fire({
      text: 'Modal with an input',
      input: 'text',
      didOpen: () => {
        expect(document.activeElement).to.equal(document.querySelector('.swal2-input'))
        done()
      },
    })
  })

  it('focusConfirm', () => {
    Swal.fire({
      showCancelButton: true,
    })
    expect(document.activeElement).to.equal(Swal.getConfirmButton())
    const anchor = document.createElement('a')
    anchor.innerText = 'link'
    anchor.href = ''
    Swal.fire({
      html: anchor,
      showCancelButton: true,
      focusConfirm: false,
    })
    expect(document.activeElement.outerHTML).to.equal(anchor.outerHTML)
  })

  it('focusCancel', () => {
    Swal.fire({
      text: 'Modal with Cancel button focused',
      showCancelButton: true,
      focusCancel: true,
    })
    expect(document.activeElement).to.equal(Swal.getCancelButton())
  })

  it('focusDeny', () => {
    Swal.fire({
      text: 'Modal with Deny button focused',
      showDenyButton: true,
      focusDeny: true,
    })
    expect(document.activeElement).to.equal(Swal.getDenyButton())
  })

  it('[autofocus]', () => {
    Swal.fire({
      html: `
        <a href>link 1</a>
        <a href autofocus style="display: none">link 2</a>
        <a href autofocus>link 3</a>
        <a href autofocus>link 4</a>
      `,
    })
    expect(document.activeElement.innerText).to.equal('link 3')
  })
})

describe('allowOutsideClick', () => {
  it('allowOutsideClick: false', (done) => {
    SwalWithoutAnimation.fire({
      title: 'allowOutsideClick: false',
      allowOutsideClick: false,
    })
    Swal.getContainer().click()
    setTimeout(() => {
      expect(Swal.isVisible()).to.be.true
      done()
    })
  })

  it('allowOutsideClick: () => !swal.isLoading()', (done) => {
    SwalWithoutAnimation.fire({
      title: 'allowOutsideClick: () => !swal.isLoading()',
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      expect(result).to.eql({
        dismiss: Swal.DismissReason.backdrop,
        isConfirmed: false,
        isDenied: false,
        isDismissed: true,
      })
      done()
    })
    Swal.showLoading()
    Swal.getContainer().click()
    setTimeout(() => {
      expect(Swal.isVisible()).to.be.true
      Swal.hideLoading()
      Swal.getContainer().click()
    }, TIMEOUT)
  })

  it('should throw console warning for { backdrop: false, allowOutsideClick: true }', () => {
    const spy = cy.spy(console, 'warn')
    SwalWithoutAnimation.fire({
      title: 'allowOutsideClick is not compatible with modeless popups',
      allowOutsideClick: true,
      backdrop: false,
    })
    expect(
      spy.calledWith('SweetAlert2: "allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`')
    ).to.be.true
  })

  it('should not throw console warning for { allowOutsideClick: true }', () => {
    const spy = cy.spy(console, 'warn')
    SwalWithoutAnimation.fire({
      allowOutsideClick: true,
    })
    expect(spy.notCalled).to.be.true
  })

  it('should not throw console warning for { backdrop: false }', () => {
    const spy = cy.spy(console, 'warn')
    SwalWithoutAnimation.fire({
      backdrop: false,
    })
    expect(spy.notCalled).to.be.true
  })
})

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

describe('draggable', () => {
  it('should drag popup with mouse evnets', () => {
    SwalWithoutAnimation.fire({
      title: 'Drag me!',
      draggable: true,
    })

    const popup = Swal.getPopup()
    const initialRect = popup.getBoundingClientRect()
    const initialX = initialRect.left
    const initialY = initialRect.top

    dispatchMouseEvent(popup, 'mousedown', { clientX: initialX, clientY: initialY })
    dispatchMouseEvent(document.body, 'mousemove', { clientX: initialX + 10, clientY: initialY + 10 })
    dispatchMouseEvent(popup, 'mouseup')
    dispatchMouseEvent(document.body, 'mousemove', { clientX: initialX + 20, clientY: initialY + 20 })

    const finalRect = popup.getBoundingClientRect()
    const finalX = finalRect.left
    const finalY = finalRect.top

    expect(finalX).to.equal(initialX + 10)
    expect(finalY).to.equal(initialY + 10)
  })

  // `Touch` and `TouchEvent` are only available in Chrome
  if (Cypress.isBrowser('chrome')) {
    it('should drag popup with touch events', () => {
      SwalWithoutAnimation.fire({
        title: 'Drag me!',
        draggable: true,
      })

      const popup = Swal.getPopup()
      const initialRect = popup.getBoundingClientRect()
      const initialX = initialRect.left
      const initialY = initialRect.top

      dispatchTouchEvent(popup, 'touchstart', { clientX: initialX, clientY: initialY })
      dispatchTouchEvent(document.body, 'touchmove', { clientX: initialX + 10, clientY: initialY + 10 })
      dispatchTouchEvent(popup, 'touchend')
      dispatchTouchEvent(document.body, 'touchmove', { clientX: initialX + 20, clientY: initialY + 20 })

      const finalRect = popup.getBoundingClientRect()
      const finalX = finalRect.left
      const finalY = finalRect.top

      expect(finalX).to.equal(initialX + 10)
      expect(finalY).to.equal(initialY + 10)
    })
  }
})

describe('grow', () => {
  it('grow row', () => {
    Swal.fire({
      grow: 'row',
    })
    const containerStyles = window.getComputedStyle(Swal.getContainer())
    expect(Swal.getPopup().clientWidth).to.equal(
      parseInt(
        Swal.getContainer().clientWidth -
          parseFloat(containerStyles.paddingLeft) -
          parseFloat(containerStyles.paddingRight)
      )
    )
  })

  it('grow column', () => {
    Swal.fire({
      grow: 'column',
    })
    const containerStyles = window.getComputedStyle(Swal.getContainer())
    expect(Swal.getPopup().clientHeight).to.equal(
      parseInt(Swal.getContainer().clientHeight - parseFloat(containerStyles.paddingTop) * 2)
    )
  })

  it('grow fullscreen', () => {
    Swal.fire({
      grow: 'fullscreen',
    })
    const containerStyles = window.getComputedStyle(Swal.getContainer())

    expect(Swal.getPopup().clientWidth).to.equal(
      parseInt(
        Swal.getContainer().clientWidth -
          parseFloat(containerStyles.paddingLeft) -
          parseFloat(containerStyles.paddingRight)
      )
    )

    expect(Swal.getPopup().clientHeight).to.equal(
      parseInt(Swal.getContainer().clientHeight - parseFloat(containerStyles.paddingTop) * 2)
    )
  })
})

describe('html', () => {
  it('HTMLElement as html', () => {
    const form = document.createElement('form')
    const div = document.createElement('div')
    div.appendChild(document.createElement('label'))
    div.appendChild(document.createElement('input'))
    form.appendChild(div)

    Swal.fire({
      html: form,
    })
    expect(Swal.getHtmlContainer().innerHTML).to.equal('<form><div><label></label><input></div></form>')
  })

  it('Error as html', () => {
    const error = new Error()
    error.message = 'something is broken'

    Swal.fire({
      html: error,
    })
    expect(Swal.getHtmlContainer().innerHTML).to.equal('Error: something is broken')
  })
})

describe('icon', () => {
  it('The popup should have the icon class', () => {
    for (const icon in iconTypes) {
      SwalWithoutAnimation.fire({ icon })
      expect(Swal.getPopup().classList.contains(swalClasses[`icon-${icon}`])).to.be.true
    }
  })

  it('should throw console error about invalid icon', () => {
    const spy = cy.spy(console, 'error')
    Swal.fire({
      icon: 'invalid-icon',
    })
    expect(
      spy.calledWith(
        'SweetAlert2: Unknown icon! Expected "success", "error", "warning", "info" or "question", got "invalid-icon"'
      )
    ).to.be.true

    // should behave the same way as empty object would be passed
    expect(isVisible(Swal.getConfirmButton())).to.be.true
    expect(isHidden(Swal.getCancelButton())).to.be.true
    expect(Swal.getTitle().textContent).to.equal('')
    expect(Swal.getHtmlContainer().textContent).to.equal('')
    expect(isHidden(Swal.getFooter())).to.be.true
  })

  it('Success icon with custom HTML (iconHtml)', () => {
    Swal.fire({
      icon: 'success',
      iconHtml: '<i class="fa fa-circle"></i>',
    })

    expect(Swal.getIcon().innerHTML).to.equal('<div class="swal2-icon-content"><i class="fa fa-circle"></i></div>')
  })

  it('Undefined icon with custom HTML (iconHtml)', () => {
    Swal.fire({
      icon: undefined,
      iconHtml: '<i class="fa fa-circle"></i>',
    })

    expect(Swal.getIcon().innerHTML).to.equal('<div class="swal2-icon-content"><i class="fa fa-circle"></i></div>')
  })

  it('Question icon with custom color (iconColor)', () => {
    SwalWithoutAnimation.fire({
      icon: 'question',
      iconColor: 'red',
    })
    expect(Swal.getIcon().style.color).to.equal('red')
    expect(Swal.getIcon().style.borderColor).to.equal('red')

    SwalWithoutAnimation.fire({
      icon: 'success',
      iconColor: 'red',
    })
    expect(Swal.getIcon().style.color).to.equal('red')
    expect(Swal.getIcon().style.borderColor).to.equal('red')
    expect(Swal.getIcon().querySelector('.swal2-success-line-tip').style.backgroundColor).to.equal('red')
    expect(Swal.getIcon().querySelector('.swal2-success-line-long').style.backgroundColor).to.equal('red')
    expect(Swal.getIcon().querySelector('.swal2-success-ring').style.borderColor).to.equal('red')

    SwalWithoutAnimation.fire({
      icon: 'error',
      iconColor: 'red',
    })
    expect(Swal.getIcon().style.color).to.equal('red')
    expect(Swal.getIcon().style.borderColor).to.equal('red')
    expect(Swal.getIcon().querySelector('.swal2-x-mark-line-left').style.backgroundColor).to.equal('red')
    expect(Swal.getIcon().querySelector('.swal2-x-mark-line-right').style.backgroundColor).to.equal('red')
  })
})

describe('image', () => {
  it('imageUrl, imageWidth, imageHeight', () => {
    Swal.fire({
      imageUrl: 'https://sweetalert2.github.io/images/swal2-logo.png',
      imageWidth: 498,
      imageHeight: 84,
    })
    expect(Swal.getImage().src).to.equal('https://sweetalert2.github.io/images/swal2-logo.png')
    expect(Swal.getImage().style.width).to.equal('498px')
    expect(Swal.getImage().style.height).to.equal('84px')
  })

  it('image dimensions in custom CSS units', () => {
    Swal.fire({
      imageUrl: 'https://sweetalert2.github.io/images/swal2-logo.png',
      imageWidth: '50%',
      imageHeight: '3em',
    })
    expect(Swal.getImage().style.width).to.equal('50%')
    expect(Swal.getImage().style.height).to.equal('3em')
  })

  it('image alt text', () => {
    Swal.fire({
      imageUrl: '/assets/swal2-logo.png',
      imageAlt: 'Custom icon',
    })
    expect(Swal.getImage().getAttribute('alt')).to.equal('Custom icon')
  })
})

describe('padding', () => {
  it('padding should allow 0', () => {
    Swal.fire({
      padding: 0,
    })
    expect(Swal.getPopup().style.padding).to.equal('0px')
  })

  it('padding should allow a number', () => {
    Swal.fire({
      padding: 15,
    })
    expect(Swal.getPopup().style.padding).to.equal('15px')
  })

  it('padding should allow a string', () => {
    Swal.fire({
      padding: '2rem',
    })
    expect(Swal.getPopup().style.padding).to.equal('2rem')
  })

  it('padding should be empty with undefined', () => {
    Swal.fire({
      padding: undefined,
    })
    expect(Swal.getPopup().style.padding).to.equal('')
  })

  it('padding should be empty with an object', () => {
    Swal.fire({
      padding: {},
    })
    expect(Swal.getPopup().style.padding).to.equal('')
  })

  it('padding should be empty with an array', () => {
    Swal.fire({
      padding: [],
    })
    expect(Swal.getPopup().style.padding).to.equal('')
  })

  it('padding should be empty with `true`', () => {
    Swal.fire({
      padding: true,
    })
    expect(Swal.getPopup().style.padding).to.equal('')
  })
})

describe('position', () => {
  class PositionChecker {
    constructor(container, offset) {
      this._offset = offset
      this._containerTop = container === window ? 0 : container.offsetTop
      this._containerCenter =
        container === window ? window.innerHeight / 2 : container.offsetTop + container.clientHeight / 2
      this._containerBottom = container === window ? window.innerHeight : container.offsetTop + container.clientHeight
      this._containerLeft = container === window ? 0 : container.offsetLeft
      this._containerMiddle =
        container === window ? window.innerWidth / 2 : container.offsetLeft + container.clientWidth / 2
      this._containerRight = container === window ? window.innerWidth : container.offsetLeft + container.clientWidth

      this._checkFunctions = {
        top: this.isTop.bind(this),
        center: this.isCenter.bind(this),
        bottom: this.isBottom.bind(this),
        left: this.isLeft.bind(this),
        middle: this.isMiddle.bind(this),
        right: this.isRight.bind(this),
      }
    }

    isTop(clientRect) {
      return Math.abs(clientRect.top - (this._containerTop + this._offset)) < 1
    }

    isCenter(clientRect) {
      const rectCenter = clientRect.top + clientRect.height / 2
      return Math.abs(rectCenter - this._containerCenter) < 1
    }

    isBottom(clientRect) {
      return Math.abs(clientRect.bottom - (this._containerBottom - this._offset)) < 1
    }

    isLeft(clientRect) {
      return Math.abs(clientRect.left - (this._containerLeft + this._offset)) < 1
    }

    isMiddle(clientRect) {
      const clientMiddle = clientRect.left + clientRect.width / 2
      return Math.abs(clientMiddle - this._containerMiddle) < 1
    }

    isRight(clientRect) {
      return Math.abs(clientRect.right - (this._containerRight - this._offset)) < 1
    }

    check(pos, clientRect) {
      const verPos = pos.split('-')[0]
      const horPos = pos.split('-')[1] || 'middle'
      return this._checkFunctions[verPos](clientRect) && this._checkFunctions[horPos](clientRect)
    }
  }

  const allowedPositions = [
    'top-left',
    'top',
    'top-right',
    'center-left',
    'center',
    'center-right',
    'bottom-left',
    'bottom',
    'bottom-right',
  ]

  it('Modal positions', () => {
    console.warn = () => true // Suppress the warnings

    const checkPosition = new PositionChecker(window, 10)

    allowedPositions.forEach((position) => {
      SwalWithoutAnimation.fire({ position: position })
      const swalRect = document.querySelector('.swal2-popup').getBoundingClientRect()
      expect(
        checkPosition.check(position, swalRect),
        `modal position: ${position} \n Swal: (${swalRect.top}, ${swalRect.right}, ${swalRect.bottom}, ${swalRect.left})x(${swalRect.height}, ${swalRect.width})\n Window: (${window.innerHeight} ${window.innerWidth})`
      ).to.be.true
      Swal.close()
    })
  })

  it('Toast positions', () => {
    console.warn = () => true // Suppress the warnings

    const checkPosition = new PositionChecker(window, 0)

    allowedPositions.forEach((position) => {
      SwalWithoutAnimation.fire({ toast: 'true', position: position })
      const swalRect = document.querySelector('.swal2-container').getBoundingClientRect()
      expect(
        checkPosition.check(position, swalRect),
        `toast position:: ${position} \n Swal: (${swalRect.top}, ${swalRect.right}, ${swalRect.bottom}, ${swalRect.left})x(${swalRect.height}, ${swalRect.width})\n Window: (${window.innerHeight} ${window.innerWidth})`
      ).to.be.true
      Swal.close()
    })
  })

  it('Modal positions with target', () => {
    console.warn = () => true // Suppress the warnings

    const targetWidth = 600
    const targetHeight = 300

    // Add custom style
    const style = document.createElement('style')
    style.innerHTML += '.position-absolute { position: absolute; }'
    document.body.appendChild(style)

    // Create target container
    const dummyTargetElement = Object.assign(document.createElement('div'), { id: 'dummy-target' })
    dummyTargetElement.setAttribute('style', `width: ${targetWidth}px; height: ${targetHeight}px; position: relative;`)
    document.body.appendChild(dummyTargetElement)

    const checkPosition = new PositionChecker(dummyTargetElement, 10)

    allowedPositions.forEach((position) => {
      SwalWithoutAnimation.fire({
        target: '#dummy-target',
        customClass: { container: 'position-absolute' },
        position: position,
      })
      const swalRect = document.querySelector('.swal2-popup').getBoundingClientRect()
      expect(
        checkPosition.check(position, swalRect),
        `modal position with target: ${position} \n Swal: (${swalRect.top}, ${swalRect.right}, ${swalRect.bottom}, ${swalRect.left})x(${swalRect.height}, ${swalRect.width})`
      ).to.be.true
      Swal.close()
    })

    dummyTargetElement.remove() // Remove target element before next test
  })

  it('Toast positions with target', () => {
    console.warn = () => true // Suppress the warnings

    const targetWidth = 600
    const targetHeight = 300

    const style = document.createElement('style')
    style.innerHTML += '.position-absolute { position: absolute; }'
    document.body.appendChild(style)

    const dummyTargetElement = Object.assign(document.createElement('div'), { id: 'dummy-target' })
    dummyTargetElement.setAttribute('style', `width: ${targetWidth}px; height: ${targetHeight}px; position: relative;`)
    document.body.appendChild(dummyTargetElement)

    const checkPosition = new PositionChecker(dummyTargetElement, 0)

    allowedPositions.forEach((position) => {
      SwalWithoutAnimation.fire({
        target: '#dummy-target',
        customClass: { container: 'position-absolute' },
        toast: 'true',
        position: position,
      })
      const swalRect = document.querySelector('.swal2-container').getBoundingClientRect()
      expect(
        checkPosition.check(position, swalRect),
        `toast position with target: ${position}\n Swal: (${swalRect.top}, ${swalRect.right}, ${swalRect.bottom}, ${swalRect.left})x(${swalRect.height}, ${swalRect.width})`
      ).to.be.true
      Swal.close()
    })

    dummyTargetElement.remove() // Remove target element before next test
  })
})

describe('preConfirm', () => {
  it('preConfirm return false', () => {
    SwalWithoutAnimation.fire({
      preConfirm: () => false,
    })
    Swal.clickConfirm()
    expect(Swal.isVisible()).to.be.true
  })

  it('preConfirm custom value', (done) => {
    SwalWithoutAnimation.fire({
      preConfirm: () => 'Some data from preConfirm',
    }).then((result) => {
      expect(result.value).to.equal('Some data from preConfirm')
      done()
    })
    Swal.clickConfirm()
  })

  it('preConfirm returns 0', (done) => {
    SwalWithoutAnimation.fire({
      preConfirm: () => 0,
    }).then((result) => {
      expect(result.value).to.equal(0)
      done()
    })
    Swal.clickConfirm()
  })

  it('preConfirm returns object containing toPromise', (done) => {
    SwalWithoutAnimation.fire({
      didOpen: () => Swal.clickConfirm(),
      preConfirm: () => ({
        toPromise: () => Promise.resolve(0),
      }),
    }).then((result) => {
      expect(result.value).to.equal(0)
      done()
    })
  })

  it('preConfirm promise is rejected', (done) => {
    let thenTriggered = false
    const errorMsg = 'message1'
    SwalWithoutAnimation.fire({
      preConfirm: () => {
        return Promise.reject(new Error(errorMsg))
      },
    })
      .then(() => {
        thenTriggered = true
      })
      .catch((result) => {
        expect(thenTriggered).to.equal(false)
        expect(result.message).to.equal(errorMsg)
        done()
      })
    Swal.clickConfirm()
    expect(Swal.isVisible()).to.be.true
  })

  it('preConfirm promise is rejected with a swal chain inside preConfirm', (done) => {
    let thenTriggered = false
    const errorMsg = 'message1'
    SwalWithoutAnimation.fire({
      preConfirm: () => {
        return SwalWithoutAnimation.fire({
          preConfirm: () => {
            return Promise.reject(new Error(errorMsg))
          },
          didOpen: () => {
            Swal.clickConfirm()
          },
        }).then(() => {
          thenTriggered = true
        })
      },
    })
      .then(() => {
        thenTriggered = true
      })
      .catch((result) => {
        expect(thenTriggered).to.equal(false)
        expect(result.message).to.equal(errorMsg)
        done()
      })
    Swal.clickConfirm()
    expect(Swal.isVisible()).to.be.true
  })

  it('should complete the promise when calling showValidationMessage() inside preConfirm', (done) => {
    Swal.fire({
      showCancelButton: true,
      preConfirm: () => {
        Swal.showValidationMessage('Now click the cancel button')
      },
      didOpen: () => {
        Swal.clickConfirm()
      },
    }).then(() => {
      done()
    })
    Swal.clickCancel()
  })
})

describe('preDeny', () => {
  it('preDeny return false', () => {
    SwalWithoutAnimation.fire({
      showDenyButton: true,
      preDeny: (value) => {
        expect(value).to.be.false
        return false
      },
    })
    Swal.clickDeny()
    expect(Swal.isVisible()).to.be.true
  })

  it('preDeny custom value', (done) => {
    SwalWithoutAnimation.fire({
      showDenyButton: true,
      input: 'text',
      inputValue: 'Initial input value',
      returnInputValueOnDeny: true,
      preDeny: (value) => `${value} + Some data from preDeny`,
    }).then((result) => {
      expect(result.value).to.equal('Initial input value + Some data from preDeny')
      done()
    })
    Swal.clickDeny()
  })

  it('preDeny returns 0', (done) => {
    SwalWithoutAnimation.fire({
      showDenyButton: true,
      preDeny: () => 0,
    }).then((result) => {
      expect(result.value).to.equal(0)
      done()
    })
    Swal.clickDeny()
  })

  it('preDeny returns object containing toPromise', (done) => {
    SwalWithoutAnimation.fire({
      showDenyButton: true,
      didOpen: () => Swal.clickDeny(),
      preDeny: () => ({
        toPromise: () => Promise.resolve(0),
      }),
    }).then((result) => {
      expect(result.value).to.equal(0)
      done()
    })
  })

  it('preDeny promise is rejected', (done) => {
    let thenTriggered = false
    const errorMsg = 'message1'
    SwalWithoutAnimation.fire({
      preDeny: () => {
        return Promise.reject(new Error(errorMsg))
      },
    })
      .then(() => {
        thenTriggered = true
      })
      .catch((result) => {
        expect(thenTriggered).to.equal(false)
        expect(result.message).to.equal(errorMsg)
        done()
      })
    Swal.clickDeny()
    expect(Swal.isVisible()).to.be.true
  })

  it('preDeny promise is rejected with a swal chain inside preDeny', (done) => {
    let thenTriggered = false
    const errorMsg = 'message1'
    SwalWithoutAnimation.fire({
      preDeny: () => {
        return SwalWithoutAnimation.fire({
          preDeny: () => {
            return Promise.reject(new Error(errorMsg))
          },
          didOpen: () => {
            Swal.clickDeny()
          },
        }).then(() => {
          thenTriggered = true
        })
      },
    })
      .then(() => {
        thenTriggered = true
      })
      .catch((result) => {
        expect(thenTriggered).to.equal(false)
        expect(result.message).to.equal(errorMsg)
        done()
      })
    Swal.clickDeny()
    expect(Swal.isVisible()).to.be.true
  })
})

describe('progressSteps', () => {
  it('current .swal2-progress-step', (done) => {
    SwalWithoutAnimation.fire({
      progressSteps: ['1', '2', '3'],
      currentProgressStep: 0,
      didOpen: () => {
        expect(
          Swal.getProgressSteps().querySelector('.swal2-progress-step').classList.contains('swal2-active-progress-step')
        ).to.be.true
        done()
      },
    })
  })
})

describe('showClass + hideClass', () => {
  it('showClass + hideClass', (done) => {
    Swal.fire({
      title: 'Custom animation with Animate.css',
      showClass: {
        popup: 'animated fadeInDown faster',
      },
      hideClass: {
        popup: 'animated fadeOutUp faster',
      },
      didClose: () => {
        expect(Swal.isVisible()).to.be.false
        done()
      },
    })
    Swal.close()
  })
})

describe('stopKeydownPropagation', () => {
  it('stopKeydownPropagation', (done) => {
    document.body.addEventListener('keydown', (e) => {
      expect(e.key).to.equal('Escape')
      done()
    })

    SwalWithoutAnimation.fire({
      title: 'Esc me and I will propagate keydown',
      didOpen: () => triggerKeydownEvent(SwalWithoutAnimation.getPopup(), 'Escape'),
      stopKeydownPropagation: false,
    })
  })
})

describe('target', () => {
  it('target', () => {
    console.warn = () => true // Suppress the warnings
    Swal.fire('Default target')
    expect(document.body).to.equal(Swal.getContainer().parentNode)
    Swal.close()

    const dummyTargetElement = Object.assign(document.createElement('div'), { id: 'dummy-target' })
    document.body.appendChild(dummyTargetElement)

    Swal.fire({ title: 'Custom valid target (string)', target: '#dummy-target' }) // switch targets
    expect(Swal.getContainer().parentNode).to.equal(dummyTargetElement)
    Swal.close()

    Swal.fire({ title: 'Custom invalid target (string)', target: 'lorem_ipsum' }) // switch targets
    expect(Swal.getContainer().parentNode).to.equal(document.body)
    Swal.close()

    Swal.fire({ title: 'Custom valid target (element)', target: dummyTargetElement })
    expect(Swal.getContainer().parentNode).to.equal(dummyTargetElement)
    Swal.close()

    Swal.fire({ title: 'Custom invalid target (element)', target: true })
    expect(document.body).to.equal(Swal.getContainer().parentNode)
    Swal.close()
  })
})

describe('template', () => {
  it('template as HTMLTemplateElement', () => {
    const template = document.createElement('template')
    template.id = 'my-template'
    template.innerHTML = `
      <swal-title>Are you sure?</swal-title>
      <swal-html>You won't be able to revert this!</swal-html>
      <swal-icon type="success"></swal-icon>
      <swal-image src="https://sweetalert2.github.io/images/SweetAlert2.png" width="300" height="60" alt="safdsafd"></swal-image>
      <swal-input type="select" placeholder="placeholderrr" value="b" label="input label">
        <swal-input-option value="a">aa</swal-input-option>
        <swal-input-option value="b">bb</swal-input-option>
      </swal-input>
      <swal-param name="inputAttributes" value='{ "hey": "there" }'></swal-param>
      <swal-param name="customClass" value='{ "popup": "my-popup" }'></swal-param>
      <swal-param name="showConfirmButton" value="false"></swal-param>
      <swal-param name="showCloseButton" value="true"></swal-param>
      <swal-param name="reverseButtons" value="true"></swal-param>
      <swal-param name="width" value="200"></swal-param>
      <swal-param name="closeButtonHtml" value="-"></swal-param>
      <swal-button type="deny" color="red">Denyyy</swal-button>
      <swal-button type="cancel" aria-label="no no">Nooo</swal-button>
      <swal-footer>footerrr</swal-footer>
    `
    document.body.appendChild(template)
    SwalWithoutAnimation.fire({
      template: document.querySelector('#my-template'),
    })
    expect(Swal.getPopup().classList.contains('my-popup')).to.be.true
    expect(Swal.getTitle().textContent).to.equal('Are you sure?')
    expect(Swal.getImage().src).to.equal('https://sweetalert2.github.io/images/SweetAlert2.png')
    expect(Swal.getImage().style.width).to.equal('300px')
    expect(Swal.getImage().style.height).to.equal('60px')
    expect(Swal.getInput().classList.contains('swal2-select')).to.be.true
    expect($('.swal2-input-label').innerHTML).to.equal('input label')
    expect(Swal.getInput().getAttribute('hey')).to.equal('there')
    expect(Swal.getInput().querySelectorAll('option').length).to.equal(3)
    expect($('.swal2-select option:nth-child(1)').innerHTML).to.equal('placeholderrr')
    expect($('.swal2-select option:nth-child(1)').disabled).to.be.true
    expect($('.swal2-select option:nth-child(2)').innerHTML).to.equal('aa')
    expect($('.swal2-select option:nth-child(2)').value).to.equal('a')
    expect($('.swal2-select option:nth-child(3)').innerHTML).to.equal('bb')
    expect($('.swal2-select option:nth-child(3)').value).to.equal('b')
    expect($('.swal2-select option:nth-child(3)').selected).to.be.true
    expect(isHidden(Swal.getConfirmButton())).to.be.true
    expect(isVisible(Swal.getCancelButton())).to.be.true
    expect(Swal.getDenyButton().style.backgroundColor).to.equal('red')
    expect(Swal.getPopup().style.width).to.equal('200px')
    expect(isVisible(Swal.getDenyButton())).to.be.true
    expect(Swal.getCancelButton().nextSibling).to.equal(Swal.getDenyButton())
    expect(Swal.getCancelButton().getAttribute('aria-label')).to.equal('no no')
    expect(isVisible(Swal.getCloseButton())).to.be.true
    expect(Swal.getCloseButton().innerHTML).to.equal('-')
    expect(isVisible(Swal.getFooter())).to.be.true
    expect(Swal.getFooter().innerHTML).to.equal('footerrr')
  })

  it('template as string', () => {
    const template = document.createElement('template')
    template.id = 'my-template-string'
    template.innerHTML = '<swal-title>Are you sure?</swal-title>'
    document.body.appendChild(template)
    const mixin = SwalWithoutAnimation.mixin({
      title: 'this title should be overridden by template',
    })
    mixin.fire({
      template: '#my-template-string',
    })
    expect(Swal.getTitle().textContent).to.equal('Are you sure?')
  })

  it('swal-function-param', (done) => {
    const _consoleLog = console.log // eslint-disable-line no-console
    const spy = cy.spy(console, 'log')
    const template = document.createElement('template')
    template.id = 'my-template-function-param'
    const didOpen = (modal) => {
      console.log(modal.querySelector('.swal2-title').innerText) // eslint-disable-line no-console
    }
    template.innerHTML = `
      <swal-title>Function param</swal-title>
      <swal-function-param name="didOpen" value="${didOpen}"></swal-function-param>
    `
    document.body.appendChild(template)
    SwalWithoutAnimation.fire({
      template: '#my-template-function-param',
    })
    setTimeout(() => {
      expect(spy.calledWith('Function param')).to.be.true
      console.log = _consoleLog // eslint-disable-line no-console
      done()
    })
  })

  it('should throw a warning when attempting to use unrecognized elements and attributes', () => {
    const spy = cy.spy(console, 'warn')
    const template = document.createElement('template')
    template.id = 'my-template-with-unexpected-attributes'
    template.innerHTML = `
      <swal-html>Check out this <a>link</a>!</swal-html>
      <swal-foo>bar</swal-foo>
      <swal-title value="hey!"></swal-title>
      <swal-image src="https://sweetalert2.github.io/images/SweetAlert2.png" width="100" height="100" alt="" foo="1">Are you sure?</swal-image>
      <swal-input bar>Are you sure?</swal-input>
    `
    document.body.appendChild(template)
    const mixin = SwalWithoutAnimation.mixin({
      imageAlt: 'this alt should be overridden by template',
    })
    mixin.fire({
      imageWidth: 200, // user param should override <swal-image width="100">
      template: '#my-template-with-unexpected-attributes',
    })
    expect(Swal.getImage().src).to.equal('https://sweetalert2.github.io/images/SweetAlert2.png')
    expect(Swal.getImage().style.width).to.equal('200px')
    expect(Swal.getImage().style.height).to.equal('100px')
    expect(Swal.getImage().getAttribute('alt')).to.equal('')
    expect(Swal.getInput().type).to.equal('text')
    expect(spy.callCount).to.equal(4)
    expect(spy.getCall(0).calledWith(`SweetAlert2: Unrecognized element <swal-foo>`)).to.be.true
    expect(
      spy
        .getCall(1)
        .calledWith(
          `SweetAlert2: Unrecognized attribute "foo" on <swal-image>. Allowed attributes are: src, width, height, alt`
        )
    ).to.be.true
    expect(
      spy
        .getCall(2)
        .calledWith(
          `SweetAlert2: Unrecognized attribute "bar" on <swal-input>. Allowed attributes are: type, label, placeholder, value`
        )
    ).to.be.true
    expect(
      spy
        .getCall(3)
        .calledWith(
          `SweetAlert2: Unrecognized attribute "value" on <swal-title>. To set the value, use HTML within the element.`
        )
    ).to.be.true
  })
})

describe('validationMessage', () => {
  it('input: email + validationMessage', (done) => {
    SwalWithoutAnimation.fire({
      input: 'email',
      validationMessage: 'custom email validation message',
    })
    Swal.clickConfirm()
    setTimeout(() => {
      expect(isVisible(Swal.getValidationMessage())).to.be.true
      expect(Swal.getValidationMessage().textContent).to.equal('custom email validation message')
      done()
    }, TIMEOUT)
  })

  it('input: url + validationMessage', (done) => {
    SwalWithoutAnimation.fire({
      input: 'url',
      validationMessage: 'custom url validation message',
    })
    Swal.clickConfirm()
    setTimeout(() => {
      expect(isVisible(Swal.getValidationMessage())).to.be.true
      expect(Swal.getValidationMessage().textContent).to.equal('custom url validation message')
      done()
    }, TIMEOUT)
  })
})

describe('clickConfirm()', () => {
  it('clickConfirm() should click the confirm button', (done) => {
    Swal.fire({
      input: 'radio',
      inputOptions: {
        one: 'one',
        two: 'two',
      },
    }).then((result) => {
      expect(result).to.eql({
        value: 'two',
        isConfirmed: true,
        isDenied: false,
        isDismissed: false,
      })
      done()
    })
    $('.swal2-radio').querySelector('input[value="two"]').checked = true
    Swal.clickConfirm()
  })

  it('clickConfirm() should not fail if a popup is not visible', () => {
    SwalWithoutAnimation.fire()
    Swal.close()
    expect(Swal.isVisible()).to.be.false
    Swal.clickConfirm()
  })
})

describe('close()', () => {
  it('should add .swal2-hide to popup', (done) => {
    Swal.fire({
      title: 'Swal.close() test',
      willClose: () => {
        expect(Swal.getPopup().classList.contains('swal2-hide')).to.be.true
        done()
      },
    })
    Swal.close()
  })

  it('resolves when calling Swal.close()', (done) => {
    Swal.fire().then((result) => {
      expect(result).to.be.eql({
        isConfirmed: false,
        isDenied: false,
        isDismissed: true,
      })
      done()
    })
    Swal.close()
  })

  it('should trigger willClose', (done) => {
    Swal.fire({
      willClose: () => {
        expect(Swal.isVisible()).to.be.true
        done()
      },
    })
    Swal.close()
  })

  it('should trigger didClose', (done) => {
    SwalWithoutAnimation.fire({
      didClose: () => {
        expect(Swal.isVisible()).to.be.false
        done()
      },
    })
    Swal.close()
  })

  it('should not fail when calling Swal.fire() inside didClose', (done) => {
    SwalWithoutAnimation.fire({
      didClose: () => {
        expect(Swal.isVisible()).to.be.false
        SwalWithoutAnimation.fire({
          input: 'text',
          didOpen: () => {
            expect(Swal.getInput()).to.not.be.null
            done()
          },
        })
        expect(Swal.isVisible()).to.be.true
      },
    })
    Swal.close()
  })

  it('should not fail inside didClose', (done) => {
    Swal.fire({
      didClose: () => {
        Swal.close()
        expect(Swal.isVisible()).to.be.false
        done()
      },
    })
    Swal.close()
  })
})

describe('_destroy()', () => {
  it('should empty the private methods', (done) => {
    Swal.fire({})
    const instance = globalState.currentInstance
    Swal.fire({})
    expect(privateMethods.swalPromiseResolve.get(instance)).to.equal(undefined)
    done()
  })

  it('should empty the private props', (done) => {
    Swal.fire({})
    const instance = globalState.currentInstance
    Swal.fire({})
    expect(privateProps.innerParams.get(instance)).to.equal(undefined)
    done()
  })

  it('should empty the private methods after having received a reject of an async call', (done) => {
    let instance = null
    Swal.fire({
      preConfirm: () => new Promise((resolve, reject) => cy.wait(TIMEOUT).then(() => reject(new Error('msg3')))),
    })
      .then(() => {
        //
      })
      .catch(() => {
        expect(privateMethods.swalPromiseResolve.get(instance)).to.equal(undefined)
        done()
      })
    instance = globalState.currentInstance
    Swal.clickConfirm()
    Swal.fire({})
    expect(privateMethods.swalPromiseResolve.get(instance)).to.not.equal(undefined)
  })

  it('should empty the private methods after having received a resolve of an async call', (done) => {
    let instance = null
    Swal.fire({
      preConfirm: () => new Promise((resolve) => cy.wait(TIMEOUT).then(resolve)),
    }).then(() => {
      expect(privateMethods.swalPromiseResolve.get(instance)).to.equal(undefined)
      done()
    })
    instance = globalState.currentInstance
    Swal.clickConfirm()
    Swal.fire({})
    expect(privateMethods.swalPromiseResolve.get(instance)).to.not.equal(undefined)
  })

  it('should empty the private methods after the result of an async call in preConfirm even when another unrelated swal is fired', (done) => {
    let instance = null
    Swal.fire({
      preConfirm: () =>
        new Promise((resolve) => {
          Swal.fire({
            test: 'Unrelated Swal',
            didOpen: () => {
              expect(privateProps.innerParams.get(instance)).to.equal(undefined)
              expect(privateMethods.swalPromiseResolve.get(instance)).to.not.equal(undefined)
            },
          })
          cy.wait(TIMEOUT).then(resolve)
        }),
    }).then(() => {
      expect(privateMethods.swalPromiseResolve.get(instance)).to.equal(undefined)
      done()
    })
    instance = globalState.currentInstance
    Swal.clickConfirm()
  })

  it('should destroy privateMethods after the result of an async call in preDeny even when another unrelated swal is fired', (done) => {
    let instance = null
    Swal.fire({
      preDeny: () =>
        new Promise((resolve) => {
          Swal.fire({
            test: 'Unrelated Swal',
            didOpen: () => {
              expect(privateProps.innerParams.get(instance)).to.equal(undefined)
              expect(privateMethods.swalPromiseResolve.get(instance)).to.not.equal(undefined)
            },
          })
          cy.wait(TIMEOUT).then(resolve)
        }),
    }).then(() => {
      expect(privateMethods.swalPromiseResolve.get(instance)).to.equal(undefined)
      done()
    })
    instance = globalState.currentInstance
    Swal.clickDeny()
  })

  it('should destroy privateMethods after having received the result of the chained swal', (done) => {
    let instance = null
    let isResolved = false
    Swal.fire({
      preConfirm: () => {
        return Swal.fire({
          preConfirm: () => {
            return Promise.resolve()
          },
          didOpen: () => {
            expect(isResolved).to.equal(false)
            expect(privateMethods.swalPromiseResolve.get(instance)).to.not.equal(undefined)
            Swal.clickConfirm()
          },
        })
      },
    }).then(() => {
      isResolved = true
      expect(privateMethods.swalPromiseResolve.get(instance)).to.equal(undefined)
      done()
    })
    instance = globalState.currentInstance
    Swal.clickConfirm()
  })
})

describe('getFocusableElements() method', () => {
  it('getFocusableElements', () => {
    Swal.fire({
      input: 'text',
      html: `
        <button tabindex="-1"> tabindex -1 </button>
        <div tabindex="0">tabindex 0</div>
        <div tabindex="3">tabindex 3</div>
        <div tabindex="2">tabindex 2.1</div>
        <div tabindex="2">tabindex 2.2</div>
        <div tabindex="1">tabindex 1</div>
      `,
      showDenyButton: true,
      showCancelButton: true,
      showCloseButton: true,
    })
    const focusableElements = Swal.getFocusableElements()
    expect(focusableElements.length).to.equal(10)
    expect(focusableElements[0].textContent).to.equal('tabindex 1')
    expect(focusableElements[1].textContent).to.equal('tabindex 2.1')
    expect(focusableElements[2].textContent).to.equal('tabindex 2.2')
    expect(focusableElements[3].textContent).to.equal('tabindex 3')
    expect(focusableElements[4]).to.equal(Swal.getCloseButton())
    expect(focusableElements[5].textContent).to.equal('tabindex 0')
    expect(focusableElements[6]).to.equal(Swal.getInput())
    expect(focusableElements[7]).to.equal(Swal.getConfirmButton())
    expect(focusableElements[8]).to.equal(Swal.getDenyButton())
    expect(focusableElements[9]).to.equal(Swal.getCancelButton())
  })
})

describe('getIcon()', () => {
  it('getIcon()', () => {
    Swal.fire({ icon: 'success' })
    expect(Swal.getIcon()).to.equal($('.swal2-success'))
  })

  it('getIconContent()', () => {
    Swal.fire({ icon: 'success', iconHtml: 'hey' })
    expect(Swal.getIcon()).to.equal($('.swal2-success'))
    expect(Swal.getIconContent()).to.equal($('.swal2-success .swal2-icon-content'))
    expect(Swal.getIconContent().innerHTML).to.equal('hey')
  })
})

describe('getInput()', () => {
  it('Swal.getInput() should return null when a popup is disposed', (done) => {
    SwalWithoutAnimation.fire({
      input: 'text',
      didClose: () => {
        setTimeout(() => {
          expect(Swal.getInput()).to.be.null
          done()
        }, TIMEOUT)
      },
    })
    Swal.close()
  })

  it('Swal.getInput() should be available in .then()', (done) => {
    SwalWithoutAnimation.fire({
      input: 'text',
    }).then(() => {
      expect(Swal.getInput()).to.not.be.null
      done()
    })
    Swal.close()
  })
})

describe('showLoading() and hideLoading()', () => {
  it('showLoading() and hideLoading()', () => {
    Swal.showLoading()
    expect(Swal.getActions().classList.contains('swal2-loading')).to.be.true

    Swal.hideLoading()
    expect(Swal.getActions().classList.contains('swal2-loading')).to.be.false

    Swal.fire({
      title: 'test loading state',
      showConfirmButton: false,
    })

    Swal.showLoading()
    expect(isVisible(Swal.getActions())).to.be.true
    expect(Swal.getActions().classList.contains('swal2-loading')).to.be.true

    Swal.hideLoading()
    expect(isVisible(Swal.getActions())).to.be.false
    expect(Swal.getActions().classList.contains('swal2-loading')).to.be.false
  })

  it('hideLoading()', () => {
    ensureClosed()
    Swal.hideLoading()
    expect(Swal.isVisible()).to.be.false
  })

  it('should open an empty popup with loader', () => {
    ensureClosed()
    Swal.showLoading()
    expect(Swal.isVisible()).to.be.true
    expect(Swal.getActions().classList.contains('swal2-loading')).to.be.true
    expect(isVisible($('.swal2-loader'))).to.be.true
    expect($('.swal2-loader').innerHTML).to.equal('')
  })

  it('showConfirmButton: false + showLoading()', (done) => {
    Swal.fire({
      showConfirmButton: false,
      loaderHtml: '<i>hi</i>',
      didOpen: () => {
        expect(isHidden(Swal.getActions())).to.be.true
        Swal.showLoading()
        expect(isVisible(Swal.getActions())).to.be.true
        expect(Swal.getActions().classList.contains('swal2-loading')).to.be.true
        expect(isVisible($('.swal2-loader'))).to.be.true
        expect($('.swal2-loader').innerHTML).to.equal('<i>hi</i>')
        expect(isHidden(Swal.getConfirmButton())).to.be.true
        expect(isHidden(Swal.getCancelButton())).to.be.true
        done()
      },
    })
  })
})

describe('getTimerLeft()', () => {
  it('should return time left', (done) => {
    Swal.fire({
      timer: 1000,
    })
    setTimeout(() => {
      const timerLeft = Swal.getTimerLeft()
      expect(timerLeft > 0).to.be.true
      expect(timerLeft < 1000).to.be.true
      done()
    }, 1)
  })

  it('should return undefined if popup does not have timer', () => {
    Swal.fire({
      timer: 1000,
    })
    Swal.fire('I do not have timer, I should reset timer')
    const timerLeft = Swal.getTimerLeft()
    expect(timerLeft).to.equal(undefined)
  })
})

describe('timer', () => {
  it('should increase timer', (done) => {
    SwalWithoutAnimation.fire({
      timer: 500,
    })
    expect(Swal.increaseTimer(400) > 0).to.be.true
    setTimeout(() => {
      expect(Swal.isVisible()).to.be.true
    }, 700)
    setTimeout(() => {
      expect(Swal.isVisible()).to.be.false
      done()
    }, 1000)
  })

  it('should increase stopped timer', (done) => {
    SwalWithoutAnimation.fire({
      timer: 500,
    })
    const remainingTime = Swal.stopTimer()
    Swal.increaseTimer(10)
    setTimeout(() => {
      expect(Swal.getTimerLeft()).to.equal(remainingTime + 10)
      done()
    }, 100)
  })

  it('should resume timer', (done) => {
    SwalWithoutAnimation.fire({
      timer: 100,
    })
    Swal.stopTimer()
    setTimeout(() => {
      expect(Swal.isVisible()).to.be.true
      Swal.resumeTimer()
    }, 200)
    setTimeout(() => {
      expect(Swal.isVisible()).to.be.false
      done()
    }, 700)
  })

  it('should not fail when called twice', (done) => {
    SwalWithoutAnimation.fire({
      timer: 500,
    })
    Swal.resumeTimer()
    Swal.resumeTimer()
    Swal.stopTimer()
    setTimeout(() => {
      expect(Swal.isVisible()).to.be.true
      done()
    }, 1000)
  })

  it('should stop timer', (done) => {
    SwalWithoutAnimation.fire({
      timer: 500,
    })
    setTimeout(() => {
      expect(Swal.stopTimer() > 0).to.be.true
    }, 50)
    setTimeout(() => {
      expect(Swal.isVisible()).to.be.true
      done()
    }, 750)
  })

  it('should not fail when called twice', (done) => {
    SwalWithoutAnimation.fire({
      timer: 500,
    })
    const remainingTime = Swal.stopTimer()
    setTimeout(() => {
      expect(Swal.stopTimer()).to.equal(remainingTime)
      done()
    }, 100)
  })

  it('toggleTimer() method', (done) => {
    SwalWithoutAnimation.fire({
      timer: 500,
    })
    Swal.toggleTimer()
    setTimeout(() => {
      expect(Swal.isVisible()).to.be.true
      Swal.toggleTimer()
    }, 700)
    setTimeout(() => {
      expect(Swal.isVisible()).to.be.false
      done()
    }, 2000)
  })

  it('getTimerProgressBar() method', () => {
    SwalWithoutAnimation.fire({
      timer: 500,
      timerProgressBar: true,
    })
    expect(Swal.getTimerProgressBar()).to.equal($('.swal2-timer-progress-bar'))
  })

  it('isTimerRunning() method', (done) => {
    SwalWithoutAnimation.fire({
      timer: 200,
    })
    setTimeout(() => {
      expect(Swal.isTimerRunning()).to.be.true
      Swal.stopTimer()
      expect(!Swal.isTimerRunning()).to.be.true
      done()
    }, 100)
  })
})

describe('timerProgressBar', () => {
  it('should show timer progress bar', () => {
    SwalWithoutAnimation.fire({
      timer: 10,
      timerProgressBar: true,
    })

    const progressBar = document.querySelector('.swal2-timer-progress-bar')
    expect(isVisible(progressBar)).to.be.true
  })

  it('should stop the animation of timer progress bar when timer is stopped', (done) => {
    SwalWithoutAnimation.fire({
      timer: 100,
      timerProgressBar: true,
    })
    Swal.stopTimer()
    setTimeout(() => {
      expect(Swal.getTimerProgressBar().style.transition).to.equal('')
      done()
    }, 20)
  })

  it('should stop the animation of timer progress bar when timer is stopped in didOpen', (done) => {
    SwalWithoutAnimation.fire({
      timer: 100,
      timerProgressBar: true,
      didOpen: Swal.stopTimer,
    })
    setTimeout(() => {
      expect(Swal.getTimerProgressBar().style.transition).to.equal('')
      done()
    }, 20)
  })
})

describe('global events and listeners', () => {
  it('should attach event handlers with .on()', (done) => {
    const spyDidRender = cy.spy()
    const spyWillOpen = cy.spy()
    const spyDidOpen = cy.spy()
    const spyWillClose = cy.spy()
    const spyDidClose = cy.spy()
    const spyDidDestroy = cy.spy()
    Swal.on('didRender', spyDidRender)
    Swal.on('willOpen', spyWillOpen)
    Swal.on('didOpen', spyDidOpen)
    Swal.on('willClose', spyWillClose)
    Swal.on('didClose', spyDidClose)
    Swal.on('didDestroy', spyDidDestroy)
    let popup
    SwalWithoutAnimation.fire({
      didOpen: () => {
        popup = Swal.getPopup()
        expect(spyDidRender).to.be.calledWith(popup)
        expect(spyWillOpen).to.be.calledWith(popup)
        expect(spyDidOpen).to.be.calledWith(popup)
        Swal.clickConfirm()
      },
      didClose: () => {
        expect(spyWillClose).to.be.calledWith()
      },
      didDestroy: () => {
        setTimeout(() => {
          expect(spyDidClose).to.be.calledWith()
          expect(spyDidDestroy).to.be.calledWith()
          done()
        })
      },
    })
  })

  it('should attach multiple handler for the same event', (done) => {
    const spyWillOpen1 = cy.spy()
    const spyWillOpen2 = cy.spy()

    Swal.on('willOpen', spyWillOpen1)
    Swal.on('willOpen', spyWillOpen2)

    SwalWithoutAnimation.fire({
      didOpen: () => {
        expect(spyWillOpen1).to.be.called
        expect(spyWillOpen2).to.be.called
        done()
      },
    })
  })

  it('should handle exeptions from handlers properly', (done) => {
    const spyDidOpen = cy.spy()
    const spyConsoleError = cy.spy(console, 'error')

    Swal.on('willOpen', () => {
      throw new Error('error from willOpen')
    })
    Swal.on('didOpen', spyDidOpen)

    SwalWithoutAnimation.fire({
      didOpen: () => {
        expect(spyConsoleError).to.be.calledOnce
        const calls = spyConsoleError.getCalls()
        expect(calls[0].args[0].toString()).to.equal('Error: error from willOpen')
        expect(spyDidOpen).to.be.called
        done()
      },
    })
  })

  it('should call handlers added with .once()', (done) => {
    const spyDidRender = cy.spy()
    const spyWillOpen = cy.spy()
    const spyDidOpen = cy.spy()
    const spyWillClose = cy.spy()
    const spyDidClose = cy.spy()
    const spyDidDestroy = cy.spy()
    Swal.once('didRender', spyDidRender)
    Swal.once('willOpen', spyWillOpen)
    Swal.once('didOpen', spyDidOpen)
    Swal.once('willClose', spyWillClose)
    Swal.once('didClose', spyDidClose)
    Swal.once('didDestroy', spyDidDestroy)
    let popup
    SwalWithoutAnimation.fire({
      title: 'first swal',
      willOpen: () => {
        popup = Swal.getPopup()
      },
    }).then(() => {
      SwalWithoutAnimation.fire({
        title: 'second swal',
        didOpen: () => {
          expect(spyDidRender).to.be.calledOnceWith(popup)
          expect(spyWillOpen).to.be.calledOnceWith(popup)
          expect(spyDidOpen).to.be.calledOnceWith(popup)
          Swal.clickConfirm()
        },
        didClose: () => {
          expect(spyWillClose).to.be.calledOnceWith()
        },
        didDestroy: () => {
          setTimeout(() => {
            expect(spyDidClose).to.be.calledOnceWith()
            expect(spyDidDestroy).to.be.calledOnceWith()
            done()
          })
        },
      })
    })
    Swal.clickConfirm()
  })

  it('should unset all handlers for all events .off()', (done) => {
    const spyWillOpen = cy.spy()
    const spyDidOpen = cy.spy()
    Swal.on('willOpen', spyWillOpen)
    Swal.on('didOpen', spyDidOpen)
    Swal.off()

    SwalWithoutAnimation.fire({
      didOpen: () => {
        expect(spyWillOpen).not.to.be.called
        expect(spyDidOpen).not.to.be.called
        done()
      },
    })
  })

  it('should unset all handlers for a specifi event .off(eventName)', (done) => {
    const spyWillOpen = cy.spy()
    const spyDidOpen = cy.spy()
    Swal.on('willOpen', spyWillOpen)
    Swal.on('didOpen', spyDidOpen)
    Swal.off('willOpen')

    SwalWithoutAnimation.fire({
      didOpen: () => {
        expect(spyWillOpen).not.to.be.called
        expect(spyDidOpen).to.be.called
        done()
      },
    })
  })

  it('should unset a specific handler for a specifi event .off(eventName, eventHandler)', (done) => {
    const spyWillOpen1 = cy.spy()
    const spyWillOpen2 = cy.spy()

    Swal.on('willOpen', spyWillOpen1)
    Swal.on('willOpen', spyWillOpen2)
    Swal.off('willOpen', spyWillOpen1)

    SwalWithoutAnimation.fire({
      didOpen: () => {
        expect(spyWillOpen1).not.to.be.called
        expect(spyWillOpen2).to.be.called
        done()
      },
    })
  })
})

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

describe('Miscellaneous tests', function () {
  it('version is correct semver', () => {
    expect(!!Swal.version.match(/\d+\.\d+\.\d+/)).to.be.true
  })

  it('modal shows up', () => {
    Swal.fire('Hello world!')
    expect(Swal.isVisible()).to.be.true
  })

  it('the icon is shown', () => {
    Swal.fire('', '', 'success')
    expect(Swal.getIcon().classList.contains('swal2-success')).to.be.true
  })

  it('should throw console warning about invalid params', () => {
    const spy = cy.spy(console, 'warn')
    Swal.fire({ invalidParam: 'oops' })
    expect(spy.calledWith('SweetAlert2: Unknown parameter "invalidParam"')).to.be.true
  })

  it('should throw console error about unexpected params', () => {
    const spy = cy.spy(console, 'error')
    Swal.fire('Hello world!', { icon: 'success' })
    expect(spy.calledWith('SweetAlert2: Unexpected type of html! Expected "string" or "Element", got object')).to.be
      .true
  })

  it('should not throw console error about undefined params and treat them as empty strings', () => {
    const spy = cy.spy(console, 'error')
    Swal.fire(undefined, 'Hello world!', undefined)
    expect(spy.notCalled).to.be.true
  })

  it('should accept Elements as shorhand params', () => {
    const title = document.createElement('strong')
    title.innerHTML = 'title'
    const content = document.createElement('a')
    content.innerHTML = 'content'
    Swal.fire(title, content, 'success')
    expect(Swal.getTitle().innerHTML).to.equal('<strong>title</strong>')
    expect(Swal.getHtmlContainer().innerHTML).to.equal('<a>content</a>')
  })

  it('should show the popup with OK button in case of empty object passed as an argument', () => {
    Swal.fire({})
    expect(isVisible(Swal.getConfirmButton())).to.be.true
    expect(isHidden(Swal.getDenyButton())).to.be.true
    expect(isHidden(Swal.getCancelButton())).to.be.true
    expect(Swal.getTitle().textContent).to.equal('')
    expect(Swal.getHtmlContainer().textContent).to.equal('')
    expect(isHidden(Swal.getFooter())).to.be.true
  })

  it('should show and hide title, content and footer when dynamically update their innerHTML', (done) => {
    Swal.fire({})
    expect(isHidden(Swal.getTitle())).to.be.true
    expect(isHidden(Swal.getHtmlContainer())).to.be.true
    expect(isHidden(Swal.getFooter())).to.be.true
    Swal.getTitle().textContent = 'title'
    Swal.getHtmlContainer().textContent = 'content'
    Swal.getFooter().textContent = 'footer'
    setTimeout(() => {
      expect(isVisible(Swal.getTitle())).to.be.true
      expect(isVisible(Swal.getHtmlContainer())).to.be.true
      expect(isVisible(Swal.getFooter())).to.be.true
      done()
    })
  })

  it('modal width', () => {
    Swal.fire({ width: 300 })
    expect(Swal.getPopup().style.width).to.equal('300px')

    Swal.fire({ width: '400px' })
    expect(Swal.getPopup().style.width).to.equal('400px')

    Swal.fire({ width: '500' })
    expect(Swal.getPopup().style.width).to.equal('500px')

    Swal.fire({ width: '90%' })
    expect(Swal.getPopup().style.width).to.equal('90%')
  })

  it('heightAuto', () => {
    Swal.fire('I should set .swal2-height-auto class to html and body')
    expect(document.documentElement.classList.contains('swal2-height-auto')).to.be.true

    Swal.fire({
      title: 'I am modeless and should not set .swal2-height-auto',
      backdrop: false,
    })
    expect(document.documentElement.classList.contains('swal2-height-auto')).to.be.true

    Swal.fire({
      title: 'I am toast and should not set .swal2-height-auto',
      toast: true,
    })
    expect(document.documentElement.classList.contains('swal2-height-auto')).to.be.true
  })

  it('getters', () => {
    Swal.fire('Title', 'Content')
    expect(Swal.getTitle().innerText).to.equal('Title')
    expect(Swal.getHtmlContainer().innerText.trim()).to.equal('Content')

    Swal.fire({
      showCancelButton: true,
      showDenyButton: true,
      imageUrl: '/assets/swal2-logo.png',
      confirmButtonText: 'Confirm button',
      confirmButtonAriaLabel: 'Confirm button aria-label',
      denyButtonText: 'Deny button',
      denyButtonAriaLabel: 'Deny button aria-label',
      cancelButtonText: 'Cancel button',
      cancelButtonAriaLabel: 'Cancel button aria-label',
      footer: '<b>Footer</b>',
    })
    expect(Swal.getImage().src.includes('/assets/swal2-logo.png')).to.be.true
    expect(Swal.getActions().textContent).to.equal('Confirm buttonDeny buttonCancel button')
    expect(Swal.getConfirmButton().innerText).to.equal('Confirm button')
    expect(Swal.getDenyButton().innerText).to.equal('Deny button')
    expect(Swal.getCancelButton().innerText).to.equal('Cancel button')
    expect(Swal.getConfirmButton().getAttribute('aria-label')).to.equal('Confirm button aria-label')
    expect(Swal.getDenyButton().getAttribute('aria-label')).to.equal('Deny button aria-label')
    expect(Swal.getCancelButton().getAttribute('aria-label')).to.equal('Cancel button aria-label')
    expect(Swal.getFooter().innerHTML).to.equal('<b>Footer</b>')

    Swal.fire({ input: 'text' })
    Swal.getInput().value = 'input text'
    expect(Swal.getInput().value).to.equal('input text')

    Swal.fire({
      input: 'radio',
      inputOptions: {
        one: 'one',
        two: 'two',
      },
    })
    $('.swal2-radio input[value="two"]').setAttribute('checked', true)
    expect(Swal.getInput().value).to.equal('two')
  })

  it('content/title is set (html)', () => {
    Swal.fire({
      title: '<strong>Strong</strong>, <em>Emphasis</em>',
      html: '<style>p { font-size: 10px; }</style><p>Paragraph</p><img /><button style="width:10px"></button>',
    })

    expect(Swal.getTitle().querySelectorAll('strong, em').length).to.equal(2)
    expect(Swal.getHtmlContainer().querySelectorAll('style, p, img, button').length).to.equal(4)
    expect(Swal.getHtmlContainer().querySelector('button').style.width).to.equal('10px')
    expect(window.getComputedStyle(Swal.getHtmlContainer().querySelector('p')).fontSize).to.equal('10px')
  })

  it('content/title is set (text)', () => {
    Swal.fire({
      titleText: '<strong>Strong</strong>, <em>Emphasis</em>',
      text: '<p>Paragraph</p><img /><button></button>',
    })

    expect(Swal.getTitle().innerHTML, '&lt;strong&gt;Strong&lt;/strong&gt;).to.equal(&lt;em&gt;Emphasis&lt;/em&gt;')
    expect(Swal.getHtmlContainer().innerHTML).to.equal(
      '&lt;p&gt;Paragraph&lt;/p&gt;&lt;img /&gt;&lt;button&gt;&lt;/button&gt;'
    )
    expect(Swal.getTitle().querySelectorAll('strong, em').length).to.equal(0)
    expect(Swal.getHtmlContainer().querySelectorAll('p, img, button').length).to.equal(0)
  })

  it('JS element as html param', () => {
    const p = document.createElement('p')
    p.textContent = 'js element'
    Swal.fire({
      html: p,
    })
    expect(Swal.getHtmlContainer().innerHTML).to.equal('<p>js element</p>')
  })

  it('disable/enable buttons', () => {
    Swal.fire('test disable/enable buttons')

    Swal.disableButtons()
    expect(Swal.getConfirmButton().disabled).to.be.true
    expect(Swal.getDenyButton().disabled).to.be.true
    expect(Swal.getCancelButton().disabled).to.be.true

    Swal.enableButtons()
    expect(Swal.getConfirmButton().disabled).to.be.false
    expect(Swal.getDenyButton().disabled).to.be.false
    expect(Swal.getCancelButton().disabled).to.be.false
  })

  it('reversed buttons', () => {
    Swal.fire({
      text: 'Modal with reversed buttons',
      showCancelButton: true,
      showDenyButton: true,
      reverseButtons: true,
    })
    expect(Swal.getConfirmButton().previousSibling).to.equal(Swal.getDenyButton())
    expect(Swal.getDenyButton().previousSibling).to.equal(Swal.getCancelButton())

    Swal.fire('Modal with buttons')
    expect(Swal.getDenyButton().previousSibling).to.equal(Swal.getConfirmButton())
    expect(Swal.getCancelButton().previousSibling).to.equal(Swal.getDenyButton())
  })

  it('modal vertical offset', (done) => {
    // create a modal with dynamic-height content
    SwalWithoutAnimation.fire({
      imageUrl:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNikAQAACIAHF/uBd8AAAAASUVORK5CYII=',
      title: 'Title',
      html: '<hr><div style="height: 50px"></div><p>Text content</p>',
      icon: 'warning',
      input: 'text',
    })

    // listen for image load
    Swal.getImage().addEventListener('load', () => {
      const box = Swal.getPopup().getBoundingClientRect()
      const delta = box.top - (box.bottom - box.height)
      // allow 1px difference, in case of uneven height
      expect(Math.abs(delta) <= 1).to.be.true
      done()
    })
  })

  it('didOpen', (done) => {
    // create a modal with an didOpen callback
    Swal.fire({
      title: 'didOpen test',
      didOpen: (modal) => {
        expect(Swal.getPopup()).to.equal(modal)
        done()
      },
    })
  })

  it('willOpen', (done) => {
    // create a modal with an willOpen callback
    Swal.fire({
      title: 'willOpen test',
      willOpen: (modal) => {
        expect(Swal.isVisible()).to.be.false
        expect(Swal.getPopup()).to.equal(modal)
      },
    })

    // check that willOpen calls properly
    const dynamicTitle = 'Set willOpen title'
    Swal.fire({
      title: 'willOpen test',
      willOpen: () => {
        Swal.getTitle().innerHTML = dynamicTitle
      },
      didOpen: () => {
        expect(Swal.getTitle().innerHTML).to.equal(dynamicTitle)
        done()
      },
    })
  })

  it('didRender', () => {
    const didRender = cy.spy()

    // create a modal with an didRender callback
    // the didRender hook should be called once here
    Swal.fire({
      title: 'didRender test',
      didRender,
    })

    expect(didRender.calledOnce).to.be.true

    // update the modal, causing a new render
    // the didRender hook should be called once again
    Swal.update({})

    expect(didRender.calledTwice).to.be.true

    // the modal element must always be passed to the didRender hook
    expect(didRender.alwaysCalledWithExactly(Swal.getPopup())).to.be.true
  })

  it('didClose', (done) => {
    let willCloseFinished = false

    // create a modal with an didClose callback
    Swal.fire({
      title: 'didClose test',
      willClose: () => {
        willCloseFinished = true
      },
      didClose: () => {
        expect(willCloseFinished).to.be.true
        expect(Swal.getContainer()).to.be.null
        done()
      },
    })

    Swal.getCloseButton().click()
  })

  it('didDestroy', (done) => {
    let firstPopupDestroyed = false
    Swal.fire({
      title: '1',
      didDestroy: () => {
        firstPopupDestroyed = true
      },
    })
    Swal.fire({
      title: '2',
      didDestroy: () => {
        done()
      },
    })
    expect(firstPopupDestroyed).to.be.true
    Swal.getConfirmButton().click()
  })

  it('willClose', (done) => {
    // create a modal with an willClose callback
    Swal.fire({
      title: 'willClose test',
      willClose: (_modal) => {
        expect(modal).to.equal(_modal)
        expect(Swal.getContainer()).to.equal($('.swal2-container'))
        done()
      },
    })

    const modal = Swal.getPopup()
    Swal.getCloseButton().click()
  })

  it('Swal.fire() in willClose', (done) => {
    Swal.fire({
      title: 'willClose test',
      willClose: () => {
        Swal.fire({
          text: 'WillClose',
          input: 'text',
          customClass: {
            input: 'on-close-swal',
          },
        })
      },
    }).then(() => {
      expect(Swal.isVisible()).to.be.true
      expect(Swal.getInput().classList.contains('on-close-swal')).to.be.true
      done()
    })

    Swal.clickConfirm()
  })

  it('esc key', (done) => {
    document.body.addEventListener('keydown', () => {
      throw new Error('Should not propagate keydown event to body!')
    })

    SwalWithoutAnimation.fire({
      title: 'Esc me',
      didOpen: () => triggerKeydownEvent(Swal.getPopup(), 'Escape'),
    }).then((result) => {
      expect(result).to.eql({
        dismiss: Swal.DismissReason.esc,
        isConfirmed: false,
        isDenied: false,
        isDismissed: true,
      })
      done()
    })
  })

  it('allowEscapeKey as a function', (done) => {
    let functionWasCalled = false

    SwalWithoutAnimation.fire({
      title: 'allowEscapeKey as a function',
      allowEscapeKey: () => {
        functionWasCalled = true
        return false
      },
      didOpen: () => {
        expect(functionWasCalled).to.equal(false)

        triggerKeydownEvent(Swal.getPopup(), 'Escape')

        setTimeout(() => {
          expect(functionWasCalled).to.equal(true)
          expect(Swal.isVisible()).to.be.true

          done()
        })
      },
    })
  })

  it('close button', (done) => {
    Swal.fire({
      title: 'Close button test',
      showCloseButton: true,
    }).then((result) => {
      expect(result).to.eql({
        dismiss: Swal.DismissReason.close,
        isConfirmed: false,
        isDenied: false,
        isDismissed: true,
      })
      done()
    })

    const closeButton = Swal.getCloseButton()
    expect(isVisible(closeButton)).to.be.true
    expect(closeButton.getAttribute('aria-label')).to.equal('Close this dialog')
    closeButton.click()
  })

  it('close button customization', () => {
    Swal.fire({
      title: 'Customized Close button test',
      showCloseButton: true,
      closeButtonHtml: 'c',
    })

    const closeButton = Swal.getCloseButton()
    expect(closeButton.innerHTML).to.equal('c')
  })

  it('cancel button', (done) => {
    Swal.fire({
      showCancelButton: true,
    }).then((result) => {
      expect(result).to.eql({
        dismiss: Swal.DismissReason.cancel,
        isConfirmed: false,
        isDenied: false,
        isDismissed: true,
      })
      done()
    })

    Swal.clickCancel()
  })

  it('deny button', (done) => {
    Swal.fire({
      showDenyButton: true,
    }).then((result) => {
      expect(result).to.eql({
        value: false,
        isConfirmed: false,
        isDenied: true,
        isDismissed: false,
      })
      done()
    })

    Swal.clickDeny()
  })

  it('timer', (done) => {
    SwalWithoutAnimation.fire({
      title: 'Timer test',
      timer: 10,
    }).then((result) => {
      expect(result).to.eql({
        dismiss: Swal.DismissReason.timer,
        isConfirmed: false,
        isDenied: false,
        isDismissed: true,
      })
      done()
    })
  })

  it('swal dismissed by another swal should resolve', (done) => {
    Swal.fire().then((result) => {
      expect(result).to.eql({
        isDismissed: true,
      })
      done()
    })
    Swal.fire()
  })

  it('swal dismissed by another swal should resolve even when another swal was called after clickConfirm()', (done) => {
    Swal.fire().then((result) => {
      expect(result).to.eql({
        value: true,
        isConfirmed: true,
        isDenied: false,
        isDismissed: false,
      })
      done()
    })
    Swal.clickConfirm()
    Swal.fire()
  })

  it('animation enabled', (done) => {
    Swal.fire({
      animation: true,
      didOpen: () => {
        setTimeout(() => {
          expect(Array.from(Swal.getPopup().classList)).to.contain('swal2-show')
          expect(Array.from(Swal.getContainer().classList)).not.to.contain('swal2-noanimation')
          done()
        }, SHOW_CLASS_TIMEOUT)
      },
    })
  })

  it('animation disabled', (done) => {
    Swal.fire({
      animation: false,
      didOpen: () => {
        setTimeout(() => {
          expect(Array.from(Swal.getPopup().classList)).not.to.contain('swal2-show')
          expect(Array.from(Swal.getContainer().classList)).to.contain('swal2-noanimation')
          done()
        }, SHOW_CLASS_TIMEOUT)
      },
    })
  })

  it('params validation', () => {
    expect(Swal.isValidParameter('title')).to.be.true
    expect(Swal.isValidParameter('foobar')).to.be.false
  })

  it('addition and removal of backdrop', () => {
    Swal.fire({ backdrop: false })
    expect(document.body.classList.contains('swal2-no-backdrop')).to.be.true
    expect(document.documentElement.classList.contains('swal2-no-backdrop')).to.be.true
    Swal.fire({ title: 'test' })
    expect(document.body.classList.contains('swal2-no-backdrop')).to.be.false
    expect(document.documentElement.classList.contains('swal2-no-backdrop')).to.be.false
  })

  it('footer', () => {
    Swal.fire({ title: 'Modal with footer', footer: 'I am footer' })
    expect(isVisible(Swal.getFooter())).to.be.true

    Swal.fire('Modal w/o footer')
    expect(isHidden(Swal.getFooter())).to.be.true
  })

  it('visual appearance', () => {
    Swal.fire({
      padding: '2em',
      background: 'red',
      confirmButtonColor: 'green',
      denyButtonColor: 'red',
      cancelButtonColor: 'blue',
    })

    expect(Swal.getPopup().style.padding).to.equal('2em')
    expect(window.getComputedStyle(Swal.getPopup()).backgroundColor, 'rgb(255, 0).to.equal(0)')
    expect(Swal.getConfirmButton().style.backgroundColor).to.equal('green')
    expect(Swal.getDenyButton().style.backgroundColor).to.equal('red')
    expect(Swal.getCancelButton().style.backgroundColor).to.equal('blue')
  })

  it('null values', () => {
    const params = {}
    Object.keys(defaultParams).forEach((key) => {
      params[key] = null
    })
    Swal.fire(params)
    expect(Swal.isVisible()).to.be.true
  })

  it('backdrop accepts css background param', () => {
    Swal.fire({
      title: 'I have no backdrop',
      backdrop: false,
    })
    expect(Swal.getContainer().style.background).to.equal('')

    const backdrop = 'rgb(123, 123, 123)'
    Swal.fire({
      title: 'I have a custom backdrop',
      backdrop,
    })
    expect(Swal.getContainer().style.background.includes(backdrop)).to.be.true
  })

  it('Popup shows with swal2 classes used in html', (done) => {
    Swal.fire({
      html: '<span class="swal2-cancel"></span>',
    })
    setTimeout(() => {
      expect(Swal.getPopup().classList.contains('swal2-show')).to.be.true
      done()
    }, SHOW_CLASS_TIMEOUT)
  })
})

describe('JQuery', () => {
  it('jQuery elements as shorthand params', () => {
    Swal.fire(jQuery('<h1>jQuery title</h1>'), jQuery('<p>jQuery content</p>'))
    expect(Swal.getTitle().innerHTML).to.equal('<h1>jQuery title</h1>')
    expect(Swal.getHtmlContainer().innerHTML).to.equal('<p>jQuery content</p>')
  })

  it('jQuery elements as params', () => {
    Swal.fire({
      title: jQuery('<h1>jQuery title</h1>'),
      html: jQuery('<p>jQuery content</p>'),
      footer: jQuery('<footer>jQuery footer</footer>'),
    })
    expect(Swal.getTitle().innerHTML).to.equal('<h1>jQuery title</h1>')
    expect(Swal.getHtmlContainer().innerHTML).to.equal('<p>jQuery content</p>')
    expect(Swal.getFooter().innerHTML).to.equal('<footer>jQuery footer</footer>')
  })
})

describe('Outside click', () => {
  const simulateMouseEvent = (x, y, eventType) => {
    dispatchCustomEvent(document.elementFromPoint(x, y), eventType, { clientX: x, clientY: y })
  }

  it('backdrop click', (done) => {
    SwalWithoutAnimation.fire('Backdrop click').then((result) => {
      expect(result).to.eql({
        dismiss: Swal.DismissReason.backdrop,
        isConfirmed: false,
        isDenied: false,
        isDismissed: true,
      })
      done()
    })
    Swal.getContainer().click()
  })

  it('double backdrop click', (done) => {
    const didClose = cy.spy()
    Swal.fire({
      title: 'didClose should be triggered once',
      didClose,
    })
    Swal.getContainer().click()
    Swal.getContainer().click()
    setTimeout(() => {
      expect(didClose.calledOnce).to.be.true
      done()
    }, 500)
  })

  it('popup mousedown, backdrop mouseup', (done) => {
    Swal.fire('popup mousedown, backdrop mouseup')
    simulateMouseEvent(1, 1, 'mousedown')
    simulateMouseEvent(window.innerWidth / 2, window.innerHeight / 2, 'mouseup')
    setTimeout(() => {
      expect(Swal.isVisible()).to.be.true
      done()
    })
  })

  it('backdrop mousedown, popup mouseup', (done) => {
    SwalWithoutAnimation.fire('backdrop mousedown, popup mouseup')
    simulateMouseEvent(window.innerWidth / 2, window.innerHeight / 2, 'mousedown')
    simulateMouseEvent(1, 1, 'mouseup')
    setTimeout(() => {
      expect(Swal.isVisible()).to.be.true
      done()
    })
  })
})

describe('RTL', () => {
  it('container should have .swal2-rtl in case of <body dir="rtl">', () => {
    document.body.setAttribute('dir', 'rtl')
    SwalWithoutAnimation.fire('hi')
    expect(Swal.getContainer().classList.contains('swal2-rtl')).to.be.true
  })

  it('container should have .swal2-rtl in case of <body style="direction: rtl">', () => {
    document.body.style.direction = 'rtl'
    SwalWithoutAnimation.fire('hi')
    expect(Swal.getContainer().classList.contains('swal2-rtl')).to.be.true
  })

  it('container should have .swal2-rtl in case of <div dir="rtl">', () => {
    const targetDiv = document.createElement('div')
    document.body.appendChild(targetDiv)
    targetDiv.setAttribute('dir', 'rtl')
    SwalWithoutAnimation.fire({ target: targetDiv })
    expect(Swal.getContainer().classList.contains('swal2-rtl')).to.be.true
  })

  it('container should have .swal2-rtl in case of <div style="direction: rtl">', () => {
    const targetDiv = document.createElement('div')
    document.body.appendChild(targetDiv)
    targetDiv.style.direction = 'rtl'
    SwalWithoutAnimation.fire({ target: targetDiv })
    expect(Swal.getContainer().classList.contains('swal2-rtl')).to.be.true
  })
})

describe('Inputs', () => {
  it('should throw console error about unexpected input type', () => {
    const spy = cy.spy(console, 'error')
    Swal.fire({ input: 'invalid-input-type' })
    expect(spy).to.be.calledWith(
      'SweetAlert2: Unexpected type of input! Expected month | week | time | datetime-local | date | search | url | tel | number | password | email | text | file | range | select | radio | checkbox | textarea, got "invalid-input-type"'
    )
  })

  it('input text', (done) => {
    const string = 'Live for yourself'
    Swal.fire({
      input: 'text',
    }).then((result) => {
      expect(result.value).to.equal(string)
      done()
    })

    Swal.getInput().value = string
    Swal.clickConfirm()
  })

  it('input textarea', (done) => {
    Swal.fire({
      input: 'textarea',
    }).then((result) => {
      expect(result.value).to.equal('hola!')
      done()
    })

    // Enter should not submit but put a newline to the textarea
    triggerKeydownEvent(Swal.getInput(), 'Enter')

    Swal.getInput().value = ' hola! '
    Swal.clickConfirm()
  })

  it('input textarea + inputAutoTrim: false', (done) => {
    Swal.fire({
      input: 'textarea',
      inputAutoTrim: false,
    }).then((result) => {
      expect(result.value).to.equal(' hola! ')
      done()
    })

    // Enter should not submit but put a newline to the textarea
    triggerKeydownEvent(Swal.getInput(), 'Enter')

    Swal.getInput().value = ' hola! '
    Swal.clickConfirm()
  })

  it('inputAutoFocus: true (default)', (done) => {
    Swal.fire({
      input: 'textarea',
    })
    setTimeout(() => {
      expect(document.activeElement).to.equal(Swal.getInput())
      done()
    })
  })

  it('inputAutoFocus: false', (done) => {
    Swal.fire({
      input: 'textarea',
      inputAutoFocus: false,
    })
    setTimeout(() => {
      expect(document.activeElement).to.equal(Swal.getConfirmButton())
      done()
    })
  })

  it('browser validation + browser validation message', (done) => {
    SwalWithoutAnimation.fire({ input: 'text', inputAttributes: { pattern: '[0-9]+' } })

    Swal.getInput().value = 'a'
    Swal.clickConfirm()
    setTimeout(() => {
      expect(isVisible(Swal.getValidationMessage())).to.be.true
      // Chrome: Please match the format requested.
      // Firefox: Please match the requested format.
      // Safari: Match the requested format.
      expect(Swal.getValidationMessage().textContent.indexOf('atch the') !== -1).to.be.true
      done()
    }, TIMEOUT)
  })

  it('input email + built-in email validation', (done) => {
    const invalidEmailAddress = 'blah-blah@zzz'
    const validEmailAddress = 'team+support+a.b@example.com'
    SwalWithoutAnimation.fire({ input: 'email' }).then((result) => {
      expect(result.value).to.equal(validEmailAddress)
      done()
    })

    Swal.getInput().value = invalidEmailAddress
    Swal.clickConfirm()
    setTimeout(() => {
      expect(isVisible(Swal.getValidationMessage())).to.be.true
      expect(Swal.getValidationMessage().textContent.indexOf('Invalid email address') !== -1).to.be.true

      Swal.getInput().value = validEmailAddress
      triggerKeydownEvent(Swal.getInput(), 'Enter')
    }, TIMEOUT)
  })

  it('input url + built-in url validation', (done) => {
    const invalidUrl = 'sweetalert2.github.io'
    const validUrl = 'https://sweetalert2.github.io/'
    SwalWithoutAnimation.fire({ input: 'url' }).then((result) => {
      expect(result.value).to.equal(validUrl)
      done()
    })
    Swal.getInput().value = invalidUrl
    Swal.clickConfirm()
    setTimeout(() => {
      expect(isVisible(Swal.getValidationMessage())).to.be.true
      expect(Swal.getValidationMessage().textContent.indexOf('Invalid URL') !== -1).to.be.true

      Swal.getInput().value = validUrl
      triggerKeydownEvent(Swal.getInput(), 'Enter')
    }, TIMEOUT)
  })

  it('input select', (done) => {
    const selected = 'dos'
    Swal.fire({
      input: 'select',
      inputOptions: { uno: 1, dos: 2 },
      inputPlaceholder: 'Choose a number',
    }).then((result) => {
      expect(result.value).to.equal(selected)
      done()
    })
    expect(Swal.getInput().value).to.equal('')
    const placeholderOption = Swal.getInput().querySelector('option')
    expect(placeholderOption.disabled).to.be.true
    expect(placeholderOption.selected).to.be.true
    expect(placeholderOption.textContent).to.equal('Choose a number')
    Swal.getInput().value = selected
    Swal.clickConfirm()
  })

  it('input select with optgroup and root options', (done) => {
    const selected = 'três ponto um'
    Swal.fire({
      input: 'select',
      inputOptions: { um: 1.0, dois: 2.0, três: { 'três ponto um': 3.1, 'três ponto dois': 3.2 } },
      inputPlaceholder: 'Choose an item',
    }).then((result) => {
      expect(result.value).to.equal(selected)
      done()
    })
    expect(Swal.getInput().value).to.equal('')
    const placeholderOption = Swal.getInput().querySelector('option')
    expect(placeholderOption.disabled).to.be.true
    expect(placeholderOption.selected).to.be.true
    expect(placeholderOption.textContent).to.equal('Choose an item')
    Swal.getInput().value = selected
    Swal.clickConfirm()
  })

  it('input select with only optgroups options', (done) => {
    const selected = 'três ponto dois'
    Swal.fire({
      input: 'select',
      inputOptions: {
        dois: { 'dois ponto um': 2.1, 'dois ponto dois': 2.2 },
        três: { 'três ponto um': 3.1, 'três ponto dois': 3.2 },
      },
      inputPlaceholder: 'Choose an item',
    }).then((result) => {
      expect(result.value).to.equal(selected)
      done()
    })
    expect(Swal.getInput().value).to.equal('')
    const placeholderOption = Swal.getInput().querySelector('option')
    expect(placeholderOption.disabled).to.be.true
    expect(placeholderOption.selected).to.be.true
    expect(placeholderOption.textContent).to.equal('Choose an item')
    Swal.getInput().value = selected
    Swal.clickConfirm()
  })

  it('input select with inputOptions as Promise', (done) => {
    Swal.fire({
      input: 'select',
      inputOptions: Promise.resolve({ one: 1, two: 2 }),
      didOpen: () => {
        setTimeout(() => {
          Swal.getInput().value = 'one'
          expect(Swal.getInput().value).to.equal('one')
          done()
        }, TIMEOUT)
      },
    })
  })

  it('input select with inputOptions as object containing toPromise', (done) => {
    Swal.fire({
      input: 'select',
      inputOptions: {
        toPromise: () => Promise.resolve({ three: 3, four: 4 }),
      },
      didOpen: () => {
        setTimeout(() => {
          Swal.getInput().value = 'three'
          expect(Swal.getInput().value).to.equal('three')
          done()
        }, TIMEOUT)
      },
    })
  })

  it('input text w/ inputPlaceholder as configuration', () => {
    Swal.fire({
      input: 'text',
      inputPlaceholder: 'placeholder text',
    })
    expect(Swal.getInput().value).to.equal('')
    expect(Swal.getInput().placeholder).to.equal('placeholder text')
  })

  it('input checkbox', (done) => {
    Swal.fire({ input: 'checkbox', inputAttributes: { name: 'test-checkbox' } }).then((result) => {
      expect(checkbox.getAttribute('name')).to.equal('test-checkbox')
      expect(result.value).to.equal(1)
      done()
    })
    const checkbox = $('.swal2-checkbox input')
    expect(isVisible(checkbox)).to.be.true
    checkbox.checked = true
    Swal.clickConfirm()
  })

  it('input range', () => {
    Swal.fire({ input: 'range', inputAttributes: { min: 1, max: 10 }, inputValue: 5 })
    const input = Swal.getInput()
    const output = $('.swal2-range output')
    expect(isVisible(input)).to.be.true
    expect(isVisible(output)).to.be.true
    expect(input.getAttribute('min')).to.equal('1')
    expect(input.getAttribute('max')).to.equal('10')
    expect(input.value).to.equal('5')
    input.value = 10
    dispatchCustomEvent(input, 'input')
    expect(output.textContent).to.equal('10')
    input.value = 9
    dispatchCustomEvent(input, 'change')
    expect(output.textContent).to.equal('9')
  })

  it('input type "select", inputOptions Map', () => {
    const inputOptions = new Map()
    inputOptions.set(2, 'Richard Stallman')
    inputOptions.set(1, 'Linus Torvalds')
    SwalWithoutAnimation.fire({
      input: 'select',
      inputOptions,
      inputValue: 1,
    })
    expect($('.swal2-select').querySelectorAll('option').length).to.equal(2)
    expect($('.swal2-select option:nth-child(1)').innerHTML).to.equal('Richard Stallman')
    expect($('.swal2-select option:nth-child(1)').value).to.equal('2')
    expect($('.swal2-select option:nth-child(2)').innerHTML).to.equal('Linus Torvalds')
    expect($('.swal2-select option:nth-child(2)').value).to.equal('1')
    expect($('.swal2-select option:nth-child(2)').selected).to.equal(true)
  })

  it('input type "select", inputOptions Map with optgroup and root options', () => {
    const inputOptions = new Map()
    inputOptions.set(2, 'Richard Stallman')
    inputOptions.set(1, 'Linus Torvalds')

    const optGroup1Options = new Map()
    optGroup1Options.set(100, 'jQuery')
    optGroup1Options.set(200, 'ReactJS')
    optGroup1Options.set(300, 'VueJS')
    inputOptions.set('Frameworks optgroup', optGroup1Options)

    SwalWithoutAnimation.fire({
      input: 'select',
      inputOptions,
      inputValue: 1,
    })
    expect($('.swal2-select').querySelectorAll('option').length).to.equal(5)
    expect($('.swal2-select').querySelectorAll('optgroup').length).to.equal(1)
    expect($('.swal2-select option:nth-child(1)').innerHTML).to.equal('Richard Stallman')
    expect($('.swal2-select option:nth-child(1)').value).to.equal('2')
    expect($('.swal2-select option:nth-child(2)').innerHTML).to.equal('Linus Torvalds')
    expect($('.swal2-select option:nth-child(2)').value).to.equal('1')
    expect($('.swal2-select option:nth-child(2)').selected).to.equal(true)
    expect($('.swal2-select optgroup option:nth-child(1)').innerHTML).to.equal('jQuery')
    expect($('.swal2-select optgroup option:nth-child(1)').value).to.equal('100')
    expect($('.swal2-select optgroup option:nth-child(2)').innerHTML).to.equal('ReactJS')
    expect($('.swal2-select optgroup option:nth-child(2)').value).to.equal('200')
    expect($('.swal2-select optgroup option:nth-child(3)').innerHTML).to.equal('VueJS')
    expect($('.swal2-select optgroup option:nth-child(3)').value).to.equal('300')
  })

  it('input type "select", inputOptions Map with only optgroup options', () => {
    const inputOptions = new Map()

    const frameworkOptGroupOptions = new Map()
    frameworkOptGroupOptions.set('100', 'jQuery')
    frameworkOptGroupOptions.set('200', 'ReactJS')
    frameworkOptGroupOptions.set('300', 'VueJS')
    inputOptions.set('Frameworks optgroup', frameworkOptGroupOptions)

    const libOptGroupOptions = new Map()
    libOptGroupOptions.set('1000', 'SweetAlert2')
    libOptGroupOptions.set('2000', 'Bootstrap4')
    inputOptions.set('Library optgroup', libOptGroupOptions)

    SwalWithoutAnimation.fire({
      input: 'select',
      inputOptions,
      inputValue: '1000',
    })
    expect($('.swal2-select').querySelectorAll('option').length).to.equal(5)
    expect($('.swal2-select').querySelectorAll('optgroup').length).to.equal(2)
    expect($('.swal2-select optgroup:nth-child(1) option:nth-child(1)').innerHTML).to.equal('jQuery')
    expect($('.swal2-select optgroup:nth-child(1) option:nth-child(1)').value).to.equal('100')
    expect($('.swal2-select optgroup:nth-child(1) option:nth-child(2)').innerHTML).to.equal('ReactJS')
    expect($('.swal2-select optgroup:nth-child(1) option:nth-child(2)').value).to.equal('200')
    expect($('.swal2-select optgroup:nth-child(1) option:nth-child(3)').innerHTML).to.equal('VueJS')
    expect($('.swal2-select optgroup:nth-child(1) option:nth-child(3)').value).to.equal('300')
    expect($('.swal2-select optgroup:nth-child(2) option:nth-child(1)').innerHTML).to.equal('SweetAlert2')
    expect($('.swal2-select optgroup:nth-child(2) option:nth-child(1)').value).to.equal('1000')
    expect($('.swal2-select optgroup:nth-child(2) option:nth-child(1)').selected).to.equal(true)
    expect($('.swal2-select optgroup:nth-child(2) option:nth-child(2)').innerHTML).to.equal('Bootstrap4')
    expect($('.swal2-select optgroup:nth-child(2) option:nth-child(2)').value).to.equal('2000')
  })

  it('input type "radio", inputOptions Map', () => {
    const inputOptions = new Map()
    inputOptions.set(2, 'Richard Stallman')
    inputOptions.set(1, 'Linus Torvalds')
    Swal.fire({
      input: 'radio',
      inputOptions,
      inputValue: 1,
    })
    expect($('.swal2-radio').querySelectorAll('label').length).to.equal(2)
    expect($('.swal2-radio label:nth-child(1)').textContent).to.equal('Richard Stallman')
    expect($('.swal2-radio label:nth-child(1) input').value).to.equal('2')
    expect($('.swal2-radio label:nth-child(2)').textContent).to.equal('Linus Torvalds')
    expect($('.swal2-radio label:nth-child(2) input').value).to.equal('1')
    expect($('.swal2-radio label:nth-child(2) input').checked).to.equal(true)
  })

  it('input radio', () => {
    Swal.fire({
      input: 'radio',
      inputOptions: {
        one: 'one',
        two: 'two',
      },
    })
    expect($('.swal2-radio').querySelectorAll('label').length).to.equal(2)
    expect($('.swal2-radio').querySelectorAll('input[type="radio"]').length).to.equal(2)
  })

  it('popup should expand and shrink accordingly to textarea width', (done) => {
    SwalWithoutAnimation.fire({
      input: 'textarea',
    })
    setTimeout(() => {
      Swal.getInput().style.width = '600px'
      setTimeout(() => {
        expect(Swal.getPopup().style.width).to.equal('672px')
        Swal.getInput().style.width = '100px'
        setTimeout(() => {
          expect(Swal.getPopup().style.width).to.equal('')
          done()
        })
      })
    })
  })

  it('popup should keep the custom width when textarea value is a promise', (done) => {
    SwalWithoutAnimation.fire({
      input: 'textarea',
      width: 600,
      inputValue: new Promise((resolve) => {
        setTimeout(() => {
          resolve('foo')
        }, 10)
      }),
    })
    setTimeout(() => {
      expect(Swal.getInput().value).to.equal('foo')
      expect(Swal.getPopup().style.width).to.equal('600px')
      done()
    }, 20)
  })

  it('should not fail if textarea value is a promise and popup is closed before the promise is resolved', (done) => {
    SwalWithoutAnimation.fire({
      input: 'textarea',
      width: 600,
      inputValue: new Promise((resolve) => {
        setTimeout(() => {
          resolve('foo')
        }, 10)
      }),
      didOpen: () => {
        Swal.close()
      },
    })
    setTimeout(() => {
      done()
    }, 20)
  })

  it('returnInputValueOnDeny: true should pass the input value as result.value', (done) => {
    SwalWithoutAnimation.fire({
      input: 'text',
      inputValue: 'returnInputValueOnDeny',
      returnInputValueOnDeny: true,
    }).then((result) => {
      expect(result).to.eql({
        value: 'returnInputValueOnDeny',
        isConfirmed: false,
        isDenied: true,
        isDismissed: false,
      })
      done()
    })
    Swal.clickDeny()
  })

  it(`returnInputValueOnDeny: true should throw warning if the input params isn't set`, () => {
    const spy = cy.spy(console, 'error')
    SwalWithoutAnimation.fire({
      showDenyButton: true,
      returnInputValueOnDeny: true,
    })
    Swal.clickDeny()
    expect(spy.calledWith('SweetAlert2: The "input" parameter is needed to be set when using returnInputValueOnDeny'))
      .to.be.true
  })

  it('disable/enable input', () => {
    Swal.fire('(disable/enable)Input should not fail if there is no input')
    Swal.disableInput()
    Swal.enableInput()

    Swal.fire({
      input: 'text',
    })

    Swal.disableInput()
    expect(Swal.getInput().disabled).to.be.true
    Swal.enableInput()
    expect(Swal.getInput().disabled).to.be.false

    Swal.fire({
      input: 'radio',
      inputOptions: {
        one: 'one',
        two: 'two',
      },
    })

    Swal.disableInput()
    Array.from($('.swal2-radio').querySelectorAll('radio')).forEach((radio) => {
      expect(radio.disabled).to.be.true
    })
    Swal.enableInput()
    Array.from($('.swal2-radio').querySelectorAll('radio')).forEach((radio) => {
      expect(radio.disabled).to.be.false
    })
  })

  it('should throw console error about unexpected type of InputOptions', () => {
    const spy = cy.spy(console, 'error')
    Swal.fire({ input: 'select', inputOptions: 'invalid-input-options' })
    expect(spy.calledWith('SweetAlert2: Unexpected type of inputOptions! Expected object, Map or Promise, got string'))
      .to.be.true
  })

  it('multiple inputs', (done) => {
    Swal.fire({
      html: '<input id="swal-input1" class="swal2-input">' + '<input id="swal-input2" class="swal2-input">',
      preConfirm: () => {
        return [document.getElementById('swal-input1').value, document.getElementById('swal-input2').value]
      },
      didOpen: () => {
        document.getElementById('swal-input1').value = 'foo'
        document.getElementById('swal-input2').value = 'bar'
        Swal.clickConfirm()
      },
    }).then((result) => {
      expect(result.value).to.eql(['foo', 'bar'])
      done()
    })
  })
})

describe('Validation', () => {
  it('input.checkValidity()', (done) => {
    Swal.fire({
      input: 'tel',
      inputAttributes: {
        pattern: '[0-9]{3}-[0-9]{3}-[0-9]{4}',
      },
      validationMessage: 'Invalid phone number',
      customClass: {
        validationMessage: 'my-validation-message',
      },
    }).then((result) => {
      expect(result.value).to.equal('123-456-7890')
      done()
    })
    Swal.getInput().value = 'blah-blah'
    Swal.clickConfirm()
    setTimeout(() => {
      expect(Swal.getConfirmButton().disabled).to.be.false
      expect(Swal.getDenyButton().disabled).to.be.false
      expect(Swal.getCancelButton().disabled).to.be.false
      expect(isVisible(Swal.getValidationMessage())).to.be.true
      expect(Swal.getValidationMessage().textContent).to.equal('Invalid phone number')
      expect(Swal.getValidationMessage().classList.contains('my-validation-message')).to.be.true
      Swal.getInput().value = '123-456-7890'
      Swal.clickConfirm()
    }, TIMEOUT)
  })

  it('validation message', (done) => {
    const inputValidator = (value) => Promise.resolve(!value && 'no falsy values')

    SwalWithoutAnimation.fire({ input: 'text', inputValidator })
    expect(isHidden(Swal.getValidationMessage())).to.be.true
    setTimeout(() => {
      const initialModalHeight = Swal.getPopup().offsetHeight

      Swal.clickConfirm()
      setTimeout(() => {
        expect(isVisible(Swal.getValidationMessage())).to.be.true
        expect(Swal.getValidationMessage().textContent).to.equal('no falsy values')
        expect(Swal.getInput().getAttribute('aria-invalid')).to.equal('true')
        expect(Swal.getPopup().offsetHeight > initialModalHeight).to.be.true

        Swal.getInput().value = 'blah-blah'

        // setting the value programmatically will not trigger the 'input' event,
        // doing that manually
        const event = document.createEvent('Event')
        event.initEvent('input', true, true)
        Swal.getInput().dispatchEvent(event)

        expect(isHidden(Swal.getValidationMessage())).to.be.true
        expect(Swal.getInput().getAttribute('aria-invalid')).to.be.null
        expect(Swal.getPopup().offsetHeight === initialModalHeight).to.be.true
        done()
      }, TIMEOUT)
    }, TIMEOUT)
  })

  it('validation message with object containing toPromise', (done) => {
    SwalWithoutAnimation.fire({
      input: 'text',
      inputValidator: (value, validationMessage) => ({
        toPromise: () => Promise.resolve(!value && validationMessage),
      }),
      validationMessage: 'no falsy values',
    })

    setTimeout(() => {
      Swal.clickConfirm()
      setTimeout(() => {
        expect(isVisible(Swal.getValidationMessage())).to.be.true
        expect(Swal.getValidationMessage().textContent).to.equal('no falsy values')
        done()
      }, TIMEOUT)
    }, TIMEOUT)
  })

  it('default email validator: test@example.com', (done) => {
    defaultInputValidators.email('test@example.com').then((data) => {
      expect(data).be.undefined
      done()
    })
  })

  it(`default email validator: o'test@example.com`, (done) => {
    defaultInputValidators.email(`o'test@example.com`).then((data) => {
      expect(data).be.undefined
      done()
    })
  })

  it(`default email validator: invalid email`, (done) => {
    defaultInputValidators.email(`invalid email@example.com`).then((data) => {
      expect(data).to.equal('Invalid email address')
      done()
    })
  })

  it('default URL validator: https://google.com', (done) => {
    defaultInputValidators.url('https://google.com').then((data) => {
      expect(data).be.undefined
      done()
    })
  })

  it('default URL validator: http://g.co', (done) => {
    defaultInputValidators.url('http://g.co').then((data) => {
      expect(data).be.undefined
      done()
    })
  })

  it('default URL validator: http://foo.localhost/', (done) => {
    defaultInputValidators.url('http://foo.localhost/').then((data) => {
      expect(data).be.undefined
      done()
    })
  })

  it('default URL validator: invalid url', (done) => {
    defaultInputValidators.url('invalid url').then((data) => {
      expect(data).to.equal('Invalid URL')
      done()
    })
  })
})

describe('inputAttributes', () => {
  it('input text w/ placeholder', () => {
    Swal.fire({
      input: 'text',
      inputAttributes: {
        placeholder: 'placeholder text',
      },
    })
    expect(Swal.getInput().value).to.equal('')
    expect(Swal.getInput().placeholder).to.equal('placeholder text')
  })

  it('input file w/ placeholder', () => {
    Swal.fire({
      input: 'file',
      inputAttributes: {
        placeholder: 'placeholder text',
      },
    })
    expect(Swal.getInput().value).to.equal('')
    expect(Swal.getInput().placeholder).to.equal('placeholder text')
  })

  it('input textarea w/ placeholder', () => {
    Swal.fire({
      input: 'textarea',
      inputAttributes: {
        placeholder: 'Provide your input here',
      },
    })
    expect(Swal.getInput().value).to.equal('')
    expect(Swal.getInput().placeholder).to.equal('Provide your input here')
  })
})

describe('inputValue', () => {
  it('inputValue number', () => {
    Swal.fire({ input: 'text', inputValue: 333 })
    expect(Swal.getInput().value).to.equal('333')
  })

  it('inputValue with object containing toPromise', (done) => {
    Swal.fire({
      input: 'text',
      inputValue: {
        toPromise: () => Promise.resolve('test'),
      },
      didOpen: () => {
        setTimeout(() => {
          expect(Swal.getInput().value).to.equal('test')
          done()
        }, TIMEOUT)
      },
    })
  })

  it('inputValue as a Promise', (done) => {
    const spy = cy.spy(console, 'warn')
    const inputTypes = ['text', 'email', 'number', 'tel', 'textarea']
    const value = '1.1 input value'
    const inputValue = new Promise((resolve) => {
      resolve('1.1 input value')
    })

    function showPopupWithInput() {
      const input = inputTypes.pop()
      SwalWithoutAnimation.fire({
        input,
        inputValue,
        didOpen: () => {
          setTimeout(() => {
            expect(Swal.getInput().value).to.equal(input === 'number' ? parseFloat(value).toString() : value)
            if (inputTypes.length) {
              showPopupWithInput()
            } else {
              done()
            }
          }, TIMEOUT)
        },
      })
    }
    showPopupWithInput()
    expect(spy.notCalled).to.be.true
  })

  it('should throw console error when inputValue as a Promise rejects', (done) => {
    const spy = cy.spy(console, 'error')
    SwalWithoutAnimation.fire({
      input: 'text',
      inputValue: new Promise((resolve, reject) => {
        reject(new Error('input promise rejected'))
      }),
      didOpen: () => {
        setTimeout(() => {
          expect(spy.calledWith('SweetAlert2: Error in inputValue promise: Error: input promise rejected')).to.be.true
          done()
        }, TIMEOUT)
      },
    })
  })

  it('should throw console warning about unexpected type of inputValue for input: text', () => {
    const spy = cy.spy(console, 'warn')
    Swal.fire({ input: 'text', inputValue: undefined })
    expect(
      spy.calledWith(
        'SweetAlert2: Unexpected type of inputValue! Expected "string", "number" or "Promise", got "undefined"'
      )
    ).to.be.true
  })

  it('should throw console warning about unexpected type of inputValue for input: textarea', () => {
    const spy = cy.spy(console, 'warn')
    Swal.fire({ input: 'textarea', inputValue: {} })
    expect(
      spy.calledWith(
        'SweetAlert2: Unexpected type of inputValue! Expected "string", "number" or "Promise", got "object"'
      )
    ).to.be.true
  })

  it('inputValue can be null', () => {
    const spy = cy.spy(console, 'error')
    Swal.fire({ input: 'select', inputOptions: { a: 'a' }, inputValue: null })
    expect(spy.notCalled).to.be.true
  })
})

describe('Mixins', () => {
  it('basic mixin', (done) => {
    const MySwal = Swal.mixin({ title: '1_title' })
    const swal = MySwal.fire({
      didOpen: () => {
        expect(MySwal.getTitle().textContent).to.equal('1_title')
        MySwal.clickConfirm()
      },
    })
    expect(swal instanceof MySwal).to.be.true
    expect(swal instanceof Swal).to.be.true
    swal.then((result) => {
      expect(result).to.eql({
        value: true,
        isConfirmed: true,
        isDenied: false,
        isDismissed: false,
      })
      done()
    })
  })

  it('mixins and shorthand calls', (done) => {
    const MySwal = Swal.mixin({
      title: 'no effect',
      html: 'no effect',
      didOpen: () => {
        expect(MySwal.getTitle().textContent).to.equal('2_title')
        expect(MySwal.getHtmlContainer().textContent).to.equal('2_html')
        MySwal.clickConfirm()
        done()
      },
    })
    MySwal.fire('2_title', '2_html')
  })

  it('mixins precedence', () => {
    Swal.mixin({ title: '1' }).mixin({ title: '2' }).fire()
    expect(Swal.getTitle().textContent).to.equal('2')
  })

  it('params from 2nd mixin should override params from 1st mixin', (done) => {
    Swal.mixin({ showClass: { popup: 'i-should-be-overridden' } })
      .mixin({ showClass: { backdrop: 'backdrop-custom-show-class' } })
      .fire({
        didOpen: () => {
          setTimeout(() => {
            expect(Swal.getContainer().classList.contains('backdrop-custom-show-class')).to.be.true
            expect(Swal.getPopup().classList.contains('i-should-be-overridden')).to.be.false
            done()
          }, SHOW_CLASS_TIMEOUT)
        },
      })
  })

  it('params from fire() should override params from mixin()', (done) => {
    Swal.mixin({ showClass: { popup: 'i-should-be-overridden' } }).fire({
      showClass: { backdrop: 'backdrop-custom-show-class' },
      didOpen: () => {
        setTimeout(() => {
          expect(Swal.getContainer().classList.contains('backdrop-custom-show-class')).to.be.true
          expect(Swal.getPopup().classList.contains('i-should-be-overridden')).to.be.false
          done()
        }, SHOW_CLASS_TIMEOUT)
      },
    })
  })
})

describe('Vertical scrollbar', () => {
  it('should be visible on container and it should be scrolled to top', (done) => {
    SwalWithoutAnimation.fire({
      imageUrl: 'https://placeholder.pics/svg/300x1500',
      imageHeight: 1500,
      imageAlt: 'A tall image',
      didOpen: () => {
        expect(Swal.getContainer().scrollTop).to.equal(0)
        setTimeout(() => {
          expect(Swal.getContainer().style.overflowY).to.equal('auto')
          Swal.close()
          done()
        }, SHOW_CLASS_TIMEOUT)
      },
    })
  })

  it('should be hidden and the according padding-right should be set', (done) => {
    ensureClosed()
    const talltDiv = document.createElement('div')
    talltDiv.innerHTML = Array(100).join('<div>lorem ipsum</div>')
    document.body.appendChild(talltDiv)
    document.body.style.paddingRight = '30px'

    const scrollbarWidth = measureScrollbar()

    SwalWithoutAnimation.fire({
      title: 'The body has visible scrollbar, I will hide it and adjust padding-right on body',
      didClose: () => {
        expect(bodyStyles.paddingRight).to.equal('30px')
        document.body.removeChild(talltDiv)
        done()
      },
    })

    const bodyStyles = window.getComputedStyle(document.body)
    expect(bodyStyles.paddingRight).to.equal(`${scrollbarWidth + 30}px`)
    expect(bodyStyles.overflow).to.equal('hidden')
    Swal.close()
  })

  it('scrollbarPadding disabled', () => {
    const talltDiv = document.createElement('div')
    talltDiv.innerHTML = Array(100).join('<div>lorem ipsum</div>')
    document.body.appendChild(talltDiv)
    document.body.style.paddingRight = '30px'

    SwalWithoutAnimation.fire({
      title: 'Padding right adjustment disabled',
      scrollbarPadding: false,
      didClose: () => {
        document.body.removeChild(talltDiv)
      },
    })

    const bodyStyles = window.getComputedStyle(document.body)
    expect(bodyStyles.paddingRight).to.equal('30px')
    Swal.close()
  })

  it('should adjust body padding if overflow-y: scroll is set on body', () => {
    document.body.innerHTML = ''
    document.body.style.overflowY = 'scroll'
    document.body.style.paddingRight = '30px'

    const scrollbarWidth = measureScrollbar()

    SwalWithoutAnimation.fire({
      title: 'no padding right adjustment when overflow-y: scroll is set on body',
    })

    const bodyStyles = window.getComputedStyle(document.body)
    expect(bodyStyles.paddingRight).to.equal(`${scrollbarWidth + 30}px`)
  })

  it('should be restored before a toast is fired after a modal', (done) => {
    const talltDiv = document.createElement('div')
    talltDiv.innerHTML = Array(100).join('<div>lorem ipsum</div>')
    document.body.appendChild(talltDiv)
    document.body.style.paddingRight = '30px'

    SwalWithoutAnimation.fire({
      title: 'The body has visible scrollbar, I will hide it and adjust padding-right on body',
    }).then(() => {
      Swal.fire({
        text: 'Body padding-right should be restored',
        toast: true,
        didOpen: () => {
          expect(bodyStyles.paddingRight).to.equal('30px')
          document.body.removeChild(talltDiv)
          done()
        },
      })
    })

    const bodyStyles = window.getComputedStyle(document.body)
    Swal.close()
  })

  it('should not add body padding if body has overflow-y: hidden', () => {
    const talltDiv = document.createElement('div')
    talltDiv.innerHTML = Array(100).join('<div>lorem ipsum</div>')
    document.body.appendChild(talltDiv)
    document.body.style.paddingRight = '0px'
    document.body.style.overflowY = 'hidden'

    SwalWithoutAnimation.fire()

    const bodyStyles = window.getComputedStyle(document.body)
    expect(bodyStyles.paddingRight).to.equal('0px')
    document.body.removeChild(talltDiv)
    Swal.close()
  })
})

describe('Styling', () => {
  it('overriding styles with customClass', (done) => {
    const style = document.createElement('style')
    style.textContent = `
      .my-container {
        z-index: 9999;
      }
      .my-popup {
        width: 500px;
      }
      .my-title {
        font-size: 10px;
      }
      .my-close-button {
        font-size: 11px;
      }
      .my-icon {
        width: 12px;
      }
      .my-html-container {
        padding: 0;
      }
      .my-image {
        max-width: 13px;
      }
      .my-input {
        font-size: 14px;
      }
      .my-input-label {
        margin: 0;
      }
      .my-validation-message {
        padding: 0;
      }
      .my-actions {
        padding: 1px;
      }
      .my-confirm-button {
        padding: 2px;
        color: red;
      }
      .my-deny-button {
        padding: 3px;
        color: red;
      }
      .my-cancel-button {
        padding: 4px;
        color: red;
      }
      .my-loader {
        border-width: 7px;
      }
      .my-footer {
        padding: 8px;
      }
      .my-timer-progress-bar {
        height: 9px;
      }
    `
    document.head.prepend(style)
    Swal.fire({
      title: 'title',
      icon: 'success',
      imageUrl: '/assets/swal2-logo.png',
      input: 'text',
      inputLabel: 'inputLabel',
      showDenyButton: true,
      showCancelButton: true,
      footer: 'footer',
      timer: 1000,
      timerProgressBar: true,
      customClass: {
        container: 'my-container',
        popup: 'my-popup',
        title: 'my-title',
        closeButton: 'my-close-button',
        icon: 'my-icon',
        htmlContainer: 'my-html-container',
        image: 'my-image',
        input: 'my-input',
        inputLabel: 'my-input-label',
        validationMessage: 'my-validation-message',
        actions: 'my-actions',
        confirmButton: 'my-confirm-button',
        denyButton: 'my-deny-button',
        cancelButton: 'my-cancel-button',
        loader: 'my-loader',
        footer: 'my-footer',
        timerProgressBar: 'my-timer-progress-bar',
      },
      didOpen: () => {
        expect(window.getComputedStyle(Swal.getContainer()).zIndex).to.equal('9999')
        expect(window.getComputedStyle(Swal.getPopup()).width).to.equal('500px')
        expect(window.getComputedStyle(Swal.getTitle()).fontSize).to.equal('10px')
        expect(window.getComputedStyle(Swal.getCloseButton()).fontSize).to.equal('11px')
        expect(window.getComputedStyle(Swal.getIcon()).width).to.equal('12px')
        expect(window.getComputedStyle(Swal.getHtmlContainer()).paddingTop).to.equal('0px')
        expect(window.getComputedStyle(Swal.getHtmlContainer()).paddingLeft).to.equal('0px')
        expect(window.getComputedStyle(Swal.getImage()).maxWidth).to.equal('13px')
        expect(window.getComputedStyle(Swal.getInput()).fontSize).to.equal('14px')
        expect(window.getComputedStyle(Swal.getInputLabel()).margin).to.equal('0px')
        Swal.showValidationMessage('validationMessage')
        expect(window.getComputedStyle(Swal.getValidationMessage()).padding).to.equal('0px')
        expect(window.getComputedStyle(Swal.getActions()).padding).to.equal('1px')
        expect(window.getComputedStyle(Swal.getConfirmButton()).padding).to.equal('2px')
        expect(window.getComputedStyle(Swal.getConfirmButton()).color).to.equal('rgb(255, 0, 0)')
        expect(window.getComputedStyle(Swal.getDenyButton()).padding).to.equal('3px')
        expect(window.getComputedStyle(Swal.getDenyButton()).color).to.equal('rgb(255, 0, 0)')
        expect(window.getComputedStyle(Swal.getCancelButton()).padding).to.equal('4px')
        Swal.showLoading()
        expect(window.getComputedStyle(Swal.getCancelButton()).color).to.equal('rgb(255, 0, 0)')
        expect(window.getComputedStyle(Swal.getLoader()).borderWidth).to.equal('7px')
        expect(window.getComputedStyle(Swal.getFooter()).padding).to.equal('8px')
        expect(window.getComputedStyle(Swal.getTimerProgressBar()).height).to.equal('9px')
        done()
      },
    })
  })

  it('should not allow frameworks like bulma to ovrrride default styles', (done) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/bulma/0.9.4/css/bulma.min.css'
    document.head.appendChild(link)
    Swal.fire({
      title: 'title',
      icon: 'success',
      imageUrl: '/assets/swal2-logo.png',
      input: 'text',
      inputLabel: 'inputLabel',
      showDenyButton: true,
      showCancelButton: true,
      footer: 'footer',
      timer: 1000,
      timerProgressBar: true,
      didOpen: () => {
        expect(window.getComputedStyle(Swal.getContainer()).zIndex).to.equal('1060')
        expect(window.getComputedStyle(Swal.getPopup()).width).to.equal('512px')
        expect(window.getComputedStyle(Swal.getTitle()).fontSize).to.equal('30px')
        expect(window.getComputedStyle(Swal.getCloseButton()).fontSize).to.equal('40px')
        expect(window.getComputedStyle(Swal.getIcon()).width).to.equal('80px')
        expect(window.getComputedStyle(Swal.getImage()).maxWidth).to.equal('100%')
        expect(window.getComputedStyle(Swal.getInput()).fontSize).to.equal('18px')
        expect(window.getComputedStyle(Swal.getInputLabel()).marginTop).to.equal('16px')
        Swal.showValidationMessage('validationMessage')
        expect(window.getComputedStyle(Swal.getValidationMessage()).padding).to.equal('10px')
        expect(window.getComputedStyle(Swal.getActions()).padding).to.equal('0px')
        expect(window.getComputedStyle(Swal.getConfirmButton()).paddingTop).to.equal('10px')
        expect(window.getComputedStyle(Swal.getDenyButton()).paddingLeft).to.equal('17.6px')
        expect(window.getComputedStyle(Swal.getCancelButton()).paddingBottom).to.equal('10px')
        Swal.showLoading()
        expect(window.getComputedStyle(Swal.getLoader()).borderWidth).to.equal('4px')
        expect(window.getComputedStyle(Swal.getFooter()).paddingTop).to.equal('16px')
        expect(window.getComputedStyle(Swal.getTimerProgressBar()).height).to.equal('4px')
        done()
      },
    })
  })
})

const Toast = SwalWithoutAnimation.mixin({ toast: true })
const ToastWithoutAnimation = SwalWithoutAnimation.mixin({ toast: true })

describe('Toast', () => {
  it('.swal2-toast-shown', () => {
    Toast.fire()
    expect(document.body.classList.contains('swal2-toast-shown')).to.be.true
    expect(document.documentElement.classList.contains('swal2-toast-shown')).to.be.true
    Swal.fire()
    expect(document.body.classList.contains('swal2-toast-shown')).to.be.false
    expect(document.documentElement.classList.contains('swal2-toast-shown')).to.be.false
  })

  it('should throw console warnings for incompatible parameters', () => {
    const _consoleWarn = console.warn
    const spy = cy.spy(console, 'warn')

    Toast.fire({
      allowOutsideClick: true,
    })
    expect(spy.calledWith('SweetAlert2: The parameter "allowOutsideClick" is incompatible with toasts')).to.be.true

    console.warn = _consoleWarn
  })

  it('toast click closes when no buttons or input are specified', (done) => {
    Toast.fire({
      showConfirmButton: false,
    }).then((result) => {
      expect(result).to.eql({
        dismiss: Toast.DismissReason.close,
        isConfirmed: false,
        isDenied: false,
        isDismissed: true,
      })
      done()
    })
    Toast.getPopup().click()
  })

  it('toast click does not close if cancel button is present', (done) => {
    ToastWithoutAnimation.fire({
      showConfirmButton: false,
      showCancelButton: true,
    })
    Toast.getPopup().click()
    setTimeout(() => {
      expect(Toast.isVisible()).to.be.true
      done()
    })
  })

  it('toast click does not close if input option is specified', (done) => {
    ToastWithoutAnimation.fire({
      showConfirmButton: false,
      showCancelButton: false,
      input: 'text',
    })
    Toast.getPopup().click()
    setTimeout(() => {
      expect(Toast.isVisible()).to.be.true
      done()
    })
  })

  it('Body classes are removed after closing toats', (done) => {
    Toast.fire({
      didOpen: () => {
        Toast.close()
      },
      didClose: () => {
        expect(document.body.classList.contains('swal2-shown')).to.be.false
        expect(document.body.classList.contains('swal2-toast-shown')).to.be.false
        done()
      },
    })
  })

  it('Percentage width should work for toasts', () => {
    const targetDiv = document.createElement('div')
    document.body.appendChild(targetDiv)
    targetDiv.style.width = '300px'
    targetDiv.style.position = 'relative'

    ToastWithoutAnimation.fire({
      target: targetDiv,
      width: '50%',
    })

    Swal.getContainer().style.position = 'absolute'
    expect(window.getComputedStyle(Swal.getContainer()).width).to.equal('150px')
  })

  it('Should be possible to reverse buttons', () => {
    Swal.fire({
      toast: true,
      showCancelButton: true,
      reverseButtons: true,
    })
    expect(Swal.getCancelButton().nextElementSibling.innerText).to.equal('No')
    expect(Swal.getCancelButton().nextElementSibling.nextElementSibling.innerText).to.equal('OK')
  })
})

describe('API', () => {
  it('properties of `Swal` class are consistent', (done) => {
    const assertConsistent = (postfix) => {
      const currentSwalPropNames = Object.keys(Swal)
      const missingProps = currentSwalPropNames.filter((key) => !currentSwalPropNames.includes(key))
      expect(missingProps.length).to.equal(0, `# of missing properties ${postfix}`)
      expect(missingProps.join(',')).to.equal('', `missing property names ${postfix}`)
    }
    assertConsistent('before first swal')
    Swal.fire({
      title: 'test',
      didOpen: () => {
        assertConsistent('after opening first swal')
        Swal.clickConfirm()
      },
    }).then(() => {
      assertConsistent('after closing first swal')
      done()
    })
  })

  it('ways to instantiate', () => {
    expect(new Swal('foo') instanceof Swal).to.be.true
    expect(Swal.fire('foo') instanceof Swal).to.be.true
  })

  it('instance properties and methods', () => {
    const params = { input: 'text', inputValue: 'foo' }
    const swal = Swal.fire(params)
    expect(Object.keys(swal)).contain.members(['params'])
    expect(swal.params).to.be.eql(params)
    expect(swal.getInput().value).to.equal('foo')
  })

  it('extending swal', (done) => {
    const MySwal = class extends Swal {
      static argsToParams(args) {
        expect(args).to.be.eql(['arg'])
        return { title: 'title' }
      }

      _main(params) {
        expect(params).to.be.eql({ title: 'title' })
        return super
          ._main({
            input: 'text',
            inputValue: 'inputValue',
            didOpen: () => MySwal.clickConfirm(),
          })
          .then((result) => {
            expect(result).to.be.eql({
              value: 'inputValue',
              isConfirmed: true,
              isDenied: false,
              isDismissed: false,
            })
            return 'result'
          })
      }
    }
    MySwal.fire('arg').then((result) => {
      expect(result).to.equal('result')
      done()
    })
  })
})

describe('bindClickHandler', () => {
  it('bindClickHandler', () => {
    SwalWithoutAnimation.bindClickHandler()
    SwalWithoutAnimation.mixin({
      toast: true,
    }).bindClickHandler('data-swal-toast-template')

    const template = document.createElement('template')
    template.id = 'my-template-for-declarative-triggering'
    template.innerHTML = '<swal-title>Are you sure?</swal-title>'
    document.body.appendChild(template)

    const buttonTriggerPopup = document.createElement('button')
    buttonTriggerPopup.setAttribute('data-swal-template', '#my-template-for-declarative-triggering')
    document.body.appendChild(buttonTriggerPopup)

    const buttonTriggerToast = document.createElement('button')
    buttonTriggerToast.setAttribute('data-swal-toast-template', '#my-template-for-declarative-triggering')
    const imgInsideButtonTriggerToast = document.createElement('img')
    imgInsideButtonTriggerToast.src = 'https://sweetalert2.github.io/images/SweetAlert2.png'
    buttonTriggerToast.appendChild(imgInsideButtonTriggerToast)
    document.body.appendChild(buttonTriggerToast)

    buttonTriggerPopup.click()
    expect(Swal.isVisible()).to.be.true
    expect(Swal.getPopup().classList.contains('swal2-toast')).to.be.false
    expect(Swal.getTitle().innerHTML).to.equal('Are you sure?')

    Swal.close()
    imgInsideButtonTriggerToast.click()
    expect(Swal.isVisible()).to.be.true
    expect(Swal.getPopup().classList.contains('swal2-toast')).to.be.true
    expect(Swal.getTitle().innerHTML).to.equal('Are you sure?')

    document.body.removeChild(buttonTriggerPopup)
    document.body.removeChild(buttonTriggerToast)
  })
})
