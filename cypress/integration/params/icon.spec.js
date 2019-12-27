import { Swal, SwalWithoutAnimation, isVisible, isHidden } from '../../utils'
import { iconTypes, swalClasses } from '../../../src/utils/classes'

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
      icon: 'invalid-icon'
    })
    expect(spy.calledWith('SweetAlert2: Unknown icon! Expected "success", "error", "warning", "info" or "question", got "invalid-icon"')).to.be.true

    // should behave the same way as empty object would be passed
    expect(isVisible(Swal.getConfirmButton())).to.be.true
    expect(isHidden(Swal.getCancelButton())).to.be.true
    expect(Swal.getTitle().textContent).to.equal('')
    expect(Swal.getContent().textContent).to.equal('')
    expect(isHidden(Swal.getFooter())).to.be.true
  })
})
