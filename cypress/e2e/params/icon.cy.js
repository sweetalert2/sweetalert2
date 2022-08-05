import { isVisible } from '../../../src/utils/dom'
import { Swal, SwalWithoutAnimation, isHidden } from '../../utils'
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

  it('Question icon with custom color (iconColor)', () => {
    SwalWithoutAnimation.fire({
      icon: 'question',
      iconColor: 'red',
    })
    expect(Swal.getIcon().style.color).to.equal('red')
    expect(Swal.getIcon().style.borderColor).to.equal('red')
  })
})
