import { Swal, SwalWithoutAnimation } from '../../utils'

describe('preConfirm', () => {
  it('preConfirm return false', () => {
    SwalWithoutAnimation.fire({
      preConfirm: () => false,
    })
    Swal.clickConfirm()
    expect(Swal.isVisible()).to.be.true
  })

  it('preConfirm custom value', (done) => {
    SwalWithoutAnimation.fire({
      preConfirm: () => 'Some data from preConfirm',
    }).then(result => {
      expect(result.value).to.equal('Some data from preConfirm')
      done()
    })
    Swal.clickConfirm()
  })

  it('preConfirm returns 0', (done) => {
    SwalWithoutAnimation.fire({
      preConfirm: () => 0,
    }).then(result => {
      expect(result.value).to.equal(0)
      done()
    })
    Swal.clickConfirm()
  })

  it('preConfirm returns object containing toPromise', (done) => {
    SwalWithoutAnimation.fire({
      didOpen: () => Swal.clickConfirm(),
      preConfirm: () => ({
        toPromise: () => Promise.resolve(0)
      })
    }).then(result => {
      expect(result.value).to.equal(0)
      done()
    })
  })
})
