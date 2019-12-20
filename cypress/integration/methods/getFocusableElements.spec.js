import { Swal } from '../../utils'

describe('getFocusableElements()', () => {
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
      showCancelButton: true,
      showCloseButton: true
    })
    const focusableElements = Swal.getFocusableElements()
    expect(focusableElements.length).to.equal(9)
    expect(focusableElements[0].textContent).to.equal('tabindex 1')
    expect(focusableElements[1].textContent).to.equal('tabindex 2.1')
    expect(focusableElements[2].textContent).to.equal('tabindex 2.2')
    expect(focusableElements[3].textContent).to.equal('tabindex 3')
    expect(focusableElements[4]).to.equal(Swal.getCloseButton())
    expect(focusableElements[5].textContent).to.equal('tabindex 0')
    expect(focusableElements[6]).to.equal(Swal.getInput())
    expect(focusableElements[7]).to.equal(Swal.getConfirmButton())
    expect(focusableElements[8]).to.equal(Swal.getCancelButton())
  })
})
