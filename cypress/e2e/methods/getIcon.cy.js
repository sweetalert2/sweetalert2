import { $, Swal } from '../../utils'

describe('getIcon()', () => {
  it('getIcon()', () => {
    Swal.fire({ icon: 'success' })
    expect(Swal.getIcon()).to.equal($('.swal2-success'))
  })
})
