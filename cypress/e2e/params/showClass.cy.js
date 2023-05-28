/// <reference types="cypress" />

import { Swal } from '../../utils'

describe('showClass', () => {
  it('showClass + hideClass', (done) => {
    Swal.fire({
      title: 'Custom animation with Animate.css',
      showClass: {
        popup: 'animated fadeInDown faster',
      },
      hideClass: {
        popup: 'animated fadeOutUp faster',
      },
      didClose: () => {
        expect(Swal.isVisible()).to.be.false
        done()
      },
    })
    Swal.close()
  })
})
