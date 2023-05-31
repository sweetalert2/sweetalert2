/// <reference types="cypress" />

import { Swal } from '../utils'

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
      }
      .my-deny-button {
        padding: 3px;
      }
      .my-cancel-button {
        padding: 4px;
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
        expect(window.getComputedStyle(Swal.getImage()).maxWidth).to.equal('13px')
        expect(window.getComputedStyle(Swal.getInput()).fontSize).to.equal('14px')
        expect(window.getComputedStyle(Swal.getInputLabel()).margin).to.equal('0px')
        Swal.showValidationMessage('validationMessage')
        expect(window.getComputedStyle(Swal.getValidationMessage()).padding).to.equal('0px')
        expect(window.getComputedStyle(Swal.getActions()).padding).to.equal('1px')
        expect(window.getComputedStyle(Swal.getConfirmButton()).padding).to.equal('2px')
        expect(window.getComputedStyle(Swal.getDenyButton()).padding).to.equal('3px')
        expect(window.getComputedStyle(Swal.getCancelButton()).padding).to.equal('4px')
        Swal.showLoading()
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
