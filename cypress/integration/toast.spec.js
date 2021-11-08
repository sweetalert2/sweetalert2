import { Swal, SwalWithoutAnimation } from '../utils'

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
      allowOutsideClick: true
    })
    expect(spy.calledWith('SweetAlert2: The parameter "allowOutsideClick" is incompatible with toasts')).to.be.true

    console.warn = _consoleWarn
  })

  it('toast click closes when no buttons or input are specified', (done) => {
    Toast.fire({
      showConfirmButton: false
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
      showCancelButton: true
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
      input: 'text'
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
      }
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
