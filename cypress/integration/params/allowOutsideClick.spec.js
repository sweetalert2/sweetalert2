import { Swal, SwalWithoutAnimation, TIMEOUT } from '../../utils'

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

  it('should not throw console warning for { backdrop: false }', () => {
    const spy = cy.spy(console, 'warn')
    SwalWithoutAnimation.fire({
      backdrop: false,
    })
    expect(spy.notCalled).to.be.true
  })
})
