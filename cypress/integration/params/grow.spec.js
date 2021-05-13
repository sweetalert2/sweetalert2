import { Swal } from '../../utils'

describe('grow', () => {
  it('grow row', () => {
    Swal.fire({
      grow: 'row'
    })
    const containerStyles = window.getComputedStyle(Swal.getContainer())
    expect(Swal.getPopup().clientWidth).to.equal(
      parseInt(Swal.getContainer().clientWidth - parseFloat(containerStyles.paddingLeft) - parseFloat(containerStyles.paddingRight))
    )
  })

  it('grow column', () => {
    Swal.fire({
      grow: 'column'
    })
    const containerStyles = window.getComputedStyle(Swal.getContainer())
    expect(Swal.getPopup().clientHeight).to.equal(
      parseInt(Swal.getContainer().clientHeight - parseFloat(containerStyles.paddingTop) * 2)
    )
  })

  it('grow fullscreen', () => {
    Swal.fire({
      grow: 'fullscreen'
    })
    const containerStyles = window.getComputedStyle(Swal.getContainer())

    expect(Swal.getPopup().clientWidth).to.equal(
      parseInt(Swal.getContainer().clientWidth - parseFloat(containerStyles.paddingLeft) - parseFloat(containerStyles.paddingRight))
    )

    expect(Swal.getPopup().clientHeight).to.equal(
      parseInt(Swal.getContainer().clientHeight - parseFloat(containerStyles.paddingTop) * 2)
    )
  })
})
