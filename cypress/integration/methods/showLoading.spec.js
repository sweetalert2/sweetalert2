import { $, Swal, ensureClosed, isVisible, isHidden } from '../../utils'

describe('showLoading() and hideLoading()', () => {
  it('showLoading() and hideLoading()', () => {
    Swal.showLoading()
    expect(Swal.getActions().classList.contains('swal2-loading')).to.be.true

    Swal.hideLoading()
    expect(Swal.getActions().classList.contains('swal2-loading')).to.be.false

    Swal.fire({
      title: 'test loading state',
      showConfirmButton: false
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
