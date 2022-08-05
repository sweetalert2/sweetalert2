import { Swal } from '../../utils'
import privateMethods from '../../../src/privateMethods'
import globalState from '../../../src/globalState'
import privateProps from '../../../src/privateProps'

describe('_destroy()', () => {
  it('should empty the private methods', (done) => {
    Swal.fire({})
    const instance = globalState.currentInstance
    Swal.fire({})
    expect(privateMethods.swalPromiseResolve.get(instance)).to.equal(undefined)
    done()
  })
  it('should empty the private props', (done) => {
    Swal.fire({})
    const instance = globalState.currentInstance
    Swal.fire({})
    expect(privateProps.innerParams.get(instance)).to.equal(undefined)
    done()
  })
  it('should empty the private methods after having received a reject of an async call', (done) => {
    let instance = null
    Swal.fire({
      preConfirm: () => new Promise((resolve, reject) => cy.wait(500).then(() => reject(new Error('msg3')))),
    })
      .then(() => {
        //
      })
      .catch(() => {
        expect(privateMethods.swalPromiseResolve.get(instance)).to.equal(undefined)
        done()
      })
    instance = globalState.currentInstance
    Swal.clickConfirm()
    Swal.fire({})
    expect(privateMethods.swalPromiseResolve.get(instance)).to.not.equal(undefined)
  })
  it('should empty the private methods after having received a resolve of an async call', (done) => {
    let instance = null
    Swal.fire({
      preConfirm: () => new Promise((resolve) => cy.wait(500).then(resolve)),
    }).then(() => {
      expect(privateMethods.swalPromiseResolve.get(instance)).to.equal(undefined)
      done()
    })
    instance = globalState.currentInstance
    Swal.clickConfirm()
    Swal.fire({})
    expect(privateMethods.swalPromiseResolve.get(instance)).to.not.equal(undefined)
  })
  it('should empty the private methods after the result of an async call in preConfirm even when another unrelated swal is fired', (done) => {
    let instance = null
    Swal.fire({
      preConfirm: () =>
        new Promise((resolve) => {
          Swal.fire({
            test: 'Unrelated Swal',
            didOpen: () => {
              expect(privateProps.innerParams.get(instance)).to.equal(undefined)
              expect(privateMethods.swalPromiseResolve.get(instance)).to.not.equal(undefined)
            },
          })
          cy.wait(500).then(resolve)
        }),
    }).then(() => {
      expect(privateMethods.swalPromiseResolve.get(instance)).to.equal(undefined)
      done()
    })
    instance = globalState.currentInstance
    Swal.clickConfirm()
  })
  it('should destroy privateMethods after the result of an async call in preDeny even when another unrelated swal is fired', (done) => {
    let instance = null
    Swal.fire({
      preDeny: () =>
        new Promise((resolve) => {
          Swal.fire({
            test: 'Unrelated Swal',
            didOpen: () => {
              expect(privateProps.innerParams.get(instance)).to.equal(undefined)
              expect(privateMethods.swalPromiseResolve.get(instance)).to.not.equal(undefined)
            },
          })
          cy.wait(500).then(resolve)
        }),
    }).then(() => {
      expect(privateMethods.swalPromiseResolve.get(instance)).to.equal(undefined)
      done()
    })
    instance = globalState.currentInstance
    Swal.clickDeny()
  })
  it('should destroy privateMethods after having received the result of the chained swal', (done) => {
    let instance = null
    let isResolved = false
    Swal.fire({
      preConfirm: () => {
        return Swal.fire({
          preConfirm: () => {
            return Promise.resolve()
          },
          didOpen: () => {
            expect(isResolved).to.equal(false)
            expect(privateMethods.swalPromiseResolve.get(instance)).to.not.equal(undefined)
            Swal.clickConfirm()
          },
        })
      },
    }).then(() => {
      isResolved = true
      expect(privateMethods.swalPromiseResolve.get(instance)).to.equal(undefined)
      done()
    })
    instance = globalState.currentInstance
    Swal.clickConfirm()
  })
})
