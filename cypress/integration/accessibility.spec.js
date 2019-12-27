import { Swal, SwalWithoutAnimation, triggerKeydownEvent } from '../utils'
import { RESTORE_FOCUS_TIMEOUT } from '../../src/constants'

describe('Accessibility:', () => {
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
    assert.notOk(div.hasAttribute('aria-hidden'))
    expect(divAriaHiddenFalse.getAttribute('aria-hidden')).to.equal('false')
  })

  it('should not set aria-hidden="true" on the custom container (target)', () => {
    const div = document.createElement('div')
    document.body.appendChild(div)

    SwalWithoutAnimation.fire({
      target: div
    })
    assert.notOk(div.hasAttribute('aria-hidden'))
  })

  it('should not set aria-hidden="true" when `backdrop: false`', () => {
    const div = document.createElement('div')
    document.body.appendChild(div)

    SwalWithoutAnimation.fire({
      backdrop: false
    })
    assert.notOk(div.hasAttribute('aria-hidden'))
  })

  it('should not set aria-hidden="true" when `toast: true`', (done) => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    const divAriaHiddenTrue = document.createElement('div')
    divAriaHiddenTrue.setAttribute('aria-hidden', 'true')
    document.body.appendChild(divAriaHiddenTrue)
    SwalWithoutAnimation.fire({
      toast: true,
      onAfterClose: () => {
        expect(divAriaHiddenTrue.getAttribute('aria-hidden')).to.equal('true')
        done()
      }
    })
    assert.notOk(div.hasAttribute('aria-hidden'))
    Swal.close()
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
    assert.notOk(Swal.getPopup().getAttribute('aria-modal'))
  })
})

describe('should trap focus in modals', () => {
  it('focus trap forward', (done) => {
    Swal.fire({
      input: 'text',
      showCancelButton: true,
      showCloseButton: true,
      onOpen: () => {
        expect(document.activeElement).to.equal(Swal.getInput())
        triggerKeydownEvent(document.activeElement, 'Tab')
        expect(document.activeElement).to.equal(Swal.getConfirmButton())
        triggerKeydownEvent(document.activeElement, 'Tab')
        expect(document.activeElement).to.equal(Swal.getCancelButton())
        triggerKeydownEvent(document.activeElement, 'Tab')
        expect(document.activeElement).to.equal(Swal.getCloseButton())
        triggerKeydownEvent(document.activeElement, 'Tab')
        expect(document.activeElement).to.equal(Swal.getInput())
        done()
      }
    })
  })

  it('focus trap backward', (done) => {
    Swal.fire({
      input: 'text',
      showCancelButton: true,
      showCloseButton: true,
      onOpen: () => {
        expect(document.activeElement).to.equal(Swal.getInput())
        triggerKeydownEvent(document.activeElement, 'Tab', { shiftKey: true })
        expect(document.activeElement).to.equal(Swal.getCloseButton())
        triggerKeydownEvent(document.activeElement, 'Tab', { shiftKey: true })
        expect(document.activeElement).to.equal(Swal.getCancelButton())
        triggerKeydownEvent(document.activeElement, 'Tab', { shiftKey: true })
        expect(document.activeElement).to.equal(Swal.getConfirmButton())
        triggerKeydownEvent(document.activeElement, 'Tab', { shiftKey: true })
        expect(document.activeElement).to.equal(Swal.getInput())
        done()
      }
    })
  })

  it('arrow keys', (done) => {
    Swal.fire({
      showCancelButton: true,
      onOpen: () => {
        triggerKeydownEvent(document.activeElement, 'ArrowRight')
        expect(document.activeElement).to.equal(Swal.getCancelButton())
        triggerKeydownEvent(document.activeElement, 'ArrowLeft')
        expect(document.activeElement).to.equal(Swal.getConfirmButton())
        done()
      }
    })
  })
})

describe('Focus', () => {
  it('default focus', (done) => {
    SwalWithoutAnimation.fire('Modal with the Confirm button only')
    expect(document.activeElement).to.equal(document.querySelector('.swal2-confirm'))
    SwalWithoutAnimation.fire({
      text: 'Modal with two buttons',
      showCancelButton: true
    })
    expect(document.activeElement).to.equal(document.querySelector('.swal2-confirm'))
    SwalWithoutAnimation.fire({
      text: 'Modal with no focusable elements in it',
      showConfirmButton: false
    })
    expect(document.activeElement).to.equal(document.querySelector('.swal2-modal'))
    SwalWithoutAnimation.fire({
      text: 'Modal with an input',
      input: 'text',
      onOpen: () => {
        expect(document.activeElement).to.equal(document.querySelector('.swal2-input'))
        done()
      }
    })
  })

  it('focusConfirm', () => {
    Swal.fire({
      showCancelButton: true
    })
    expect(document.activeElement).to.equal(Swal.getConfirmButton())
    const anchor = document.createElement('a')
    anchor.innerText = 'link'
    anchor.href = ''
    Swal.fire({
      html: anchor,
      showCancelButton: true,
      focusConfirm: false
    })
    expect(document.activeElement.outerHTML).to.equal(anchor.outerHTML)
  })

  it('focusCancel', () => {
    Swal.fire({
      text: 'Modal with Cancel button focused',
      showCancelButton: true,
      focusCancel: true
    })
    expect(document.activeElement).to.equal(Swal.getCancelButton())
  })
})
