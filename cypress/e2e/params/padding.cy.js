/// <reference types="cypress" />

import { Swal } from '../../utils'

describe('padding', () => {
  it('padding should allow 0', () => {
    Swal.fire({
      padding: 0,
    })
    expect(Swal.getPopup().style.padding).to.equal('0px')
  })

  it('padding should allow a number', () => {
    Swal.fire({
      padding: 15,
    })
    expect(Swal.getPopup().style.padding).to.equal('15px')
  })

  it('padding should allow a string', () => {
    Swal.fire({
      padding: '2rem',
    })
    expect(Swal.getPopup().style.padding).to.equal('2rem')
  })

  it('padding should be empty with undefined', () => {
    Swal.fire({
      padding: undefined,
    })
    expect(Swal.getPopup().style.padding).to.equal('')
  })

  it('padding should be empty with an object', () => {
    Swal.fire({
      padding: {},
    })
    expect(Swal.getPopup().style.padding).to.equal('')
  })

  it('padding should be empty with an array', () => {
    Swal.fire({
      padding: [],
    })
    expect(Swal.getPopup().style.padding).to.equal('')
  })

  it('padding should be empty with `true`', () => {
    Swal.fire({
      padding: true,
    })
    expect(Swal.getPopup().style.padding).to.equal('')
  })
})
