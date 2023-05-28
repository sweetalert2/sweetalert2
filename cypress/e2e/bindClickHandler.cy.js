/// <reference types="cypress" />

import { Swal, SwalWithoutAnimation } from '../utils'

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
