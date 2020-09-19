import { Swal } from '../utils'

const Toast = Swal.mixin({ toast: true })

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

  it('.swal2-toast-column if input', () => {
    const inputs = ['text', 'email', 'password', 'number', 'tel', 'range', 'textarea', 'select', 'radio', 'checkbox', 'file', 'url']
    inputs.forEach((input) => {
      Toast.fire({ input: input })
      expect(document.body.classList.contains('swal2-toast-column')).to.be.true

      Swal.fire({ input: input })
      expect(document.body.classList.contains('swal2-toast-column')).to.be.false
    })
  })

  it('.swal2-toast-column if footer', () => {
    Toast.fire({ footer: 'footer' })
    expect(document.body.classList.contains('swal2-toast-column')).to.be.true

    Swal.fire({ footer: 'footer' })
    expect(document.body.classList.contains('swal2-toast-column')).to.be.false
  })

  it('.swal2-toast-column if close button', () => {
    Toast.fire({ showCloseButton: true })
    expect(document.body.classList.contains('swal2-toast-column')).to.be.true

    Swal.fire({ showCloseButton: true })
    expect(document.body.classList.contains('swal2-toast-column')).to.be.false
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
    Toast.fire({
      animation: false,
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
    Toast.fire({
      animation: false,
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
})
