/// <reference types="cypress" />

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
    }).then((result) => {
      expect(result.value).to.equal('Some data from preConfirm')
      done()
    })
    Swal.clickConfirm()
  })

  it('preConfirm returns 0', (done) => {
    SwalWithoutAnimation.fire({
      preConfirm: () => 0,
    }).then((result) => {
      expect(result.value).to.equal(0)
      done()
    })
    Swal.clickConfirm()
  })

  it('preConfirm returns object containing toPromise', (done) => {
    SwalWithoutAnimation.fire({
      didOpen: () => Swal.clickConfirm(),
      preConfirm: () => ({
        toPromise: () => Promise.resolve(0),
      }),
    }).then((result) => {
      expect(result.value).to.equal(0)
      done()
    })
  })

  it('preConfirm promise is rejected', (done) => {
    let thenTriggered = false
    const errorMsg = 'message1'
    SwalWithoutAnimation.fire({
      preConfirm: () => {
        return Promise.reject(new Error(errorMsg))
      },
    })
      .then(() => {
        thenTriggered = true
      })
      .catch((result) => {
        expect(thenTriggered).to.equal(false)
        expect(result.message).to.equal(errorMsg)
        done()
      })
    Swal.clickConfirm()
    expect(Swal.isVisible()).to.be.true
  })

  it('preConfirm promise is rejected with a swal chain inside preConfirm', (done) => {
    let thenTriggered = false
    const errorMsg = 'message1'
    SwalWithoutAnimation.fire({
      preConfirm: () => {
        return SwalWithoutAnimation.fire({
          preConfirm: () => {
            return Promise.reject(new Error(errorMsg))
          },
          didOpen: () => {
            Swal.clickConfirm()
          },
        }).then(() => {
          thenTriggered = true
        })
      },
    })
      .then(() => {
        thenTriggered = true
      })
      .catch((result) => {
        expect(thenTriggered).to.equal(false)
        expect(result.message).to.equal(errorMsg)
        done()
      })
    Swal.clickConfirm()
    expect(Swal.isVisible()).to.be.true
  })

  it('should complete the promise when calling showValidationMessage() inside preConfirm', (done) => {
    Swal.fire({
      showCancelButton: true,
      preConfirm: () => {
        Swal.showValidationMessage('Now click the cancel button')
      },
      didOpen: () => {
        Swal.clickConfirm()
      },
    }).then(() => {
      done()
    })
    Swal.clickCancel()
  })
})
