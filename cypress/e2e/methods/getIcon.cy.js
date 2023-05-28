/// <reference types="cypress" />

import { $, Swal } from '../../utils'

describe('getIcon()', () => {
  it('getIcon()', () => {
    Swal.fire({ icon: 'success' })
    expect(Swal.getIcon()).to.equal($('.swal2-success'))
  })

  it('getIconContent()', () => {
    Swal.fire({ icon: 'success', iconHtml: 'hey' })
    expect(Swal.getIcon()).to.equal($('.swal2-success'))
    expect(Swal.getIconContent()).to.equal($('.swal2-success .swal2-icon-content'))
    expect(Swal.getIconContent().innerHTML).to.equal('hey')
  })
})
