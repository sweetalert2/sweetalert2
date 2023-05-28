/// <reference types="cypress" />

import { Swal } from '../../utils'

describe('target', () => {
  it('target', () => {
    console.warn = () => true // Suppress the warnings
    Swal.fire('Default target')
    expect(document.body).to.equal(Swal.getContainer().parentNode)
    Swal.close()

    const dummyTargetElement = Object.assign(document.createElement('div'), { id: 'dummy-target' })
    document.body.appendChild(dummyTargetElement)

    Swal.fire({ title: 'Custom valid target (string)', target: '#dummy-target' }) // switch targets
    expect(Swal.getContainer().parentNode).to.equal(dummyTargetElement)
    Swal.close()

    Swal.fire({ title: 'Custom invalid target (string)', target: 'lorem_ipsum' }) // switch targets
    expect(Swal.getContainer().parentNode).to.equal(document.body)
    Swal.close()

    Swal.fire({ title: 'Custom valid target (element)', target: dummyTargetElement })
    expect(Swal.getContainer().parentNode).to.equal(dummyTargetElement)
    Swal.close()

    Swal.fire({ title: 'Custom invalid target (element)', target: true })
    expect(document.body).to.equal(Swal.getContainer().parentNode)
    Swal.close()
  })
})
