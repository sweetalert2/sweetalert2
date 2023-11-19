/// <reference types="cypress" />

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
})
