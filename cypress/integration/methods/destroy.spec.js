import { Swal, SwalWithoutAnimation } from '../../utils'
import privateMethods from '../../../src/privateMethods'
import globalState from '../../../src/globalState'
import privateProps from '../../../src/privateProps'

describe('_destroy()', () => {
  it('should empty the private methods', (done) => {
    SwalWithoutAnimation.fire({})
    const instance = globalState.currentInstance
    SwalWithoutAnimation.fire({})
    expect(privateMethods.swalPromiseResolve.get(instance)).to.equal(undefined)
    done()
  })
  it('should empty the private props', (done) => {
    SwalWithoutAnimation.fire({})
    const instance = globalState.currentInstance
    SwalWithoutAnimation.fire({})
    expect(privateProps.innerParams.get(instance)).to.equal(undefined)
    done()
  })
  it('should empty the private methods when awaiting a promise only after having received the result', (done) => {
    let instance = null
    SwalWithoutAnimation.fire({
      preConfirm: () => {
        return SwalWithoutAnimation.fire({
          preConfirm: () => {
            return Promise.resolve()
          },
          didOpen: () => {
            expect(privateMethods.swalPromiseResolve.get(instance)).to.not.equal(undefined)
            Swal.clickConfirm()
            expect(privateMethods.swalPromiseResolve.get(instance)).to.equal(undefined)
          }
        })
      }
    })
    instance = globalState.currentInstance
    Swal.clickConfirm()
    done()
  })
})
