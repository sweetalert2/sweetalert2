import { Swal } from '../../utils'

describe('iconHtml', () => {
  it('Success icon with custom HTML', () => {
    Swal.fire({
      icon: 'success',
      iconHtml: '<i class="fa fa-circle"></i>'
    })

    expect(Swal.getIcon().innerHTML).to.equal('<div class="swal2-icon-content"><i class="fa fa-circle"></i></div>')
  })
})
