import { Swal } from '../../utils'

describe('image', () => {
  it('imageUrl, imageWidth, imageHeight', () => {
    Swal.fire({
      imageUrl: 'https://sweetalert2.github.io/images/swal2-logo.png',
      imageWidth: 498,
      imageHeight: 84
    })
    expect(Swal.getImage().src).to.equal('https://sweetalert2.github.io/images/swal2-logo.png')
    expect(Swal.getImage().style.width).to.equal('498px')
    expect(Swal.getImage().style.height).to.equal('84px')
  })

  it('image dimentions in custom CSS units', () => {
    Swal.fire({
      imageUrl: 'https://sweetalert2.github.io/images/swal2-logo.png',
      imageWidth: '50%',
      imageHeight: '3em'
    })
    expect(Swal.getImage().style.width).to.equal('50%')
    expect(Swal.getImage().style.height).to.equal('3em')
  })

  it('image alt text', () => {
    Swal.fire({
      imageUrl: '/assets/swal2-logo.png',
      imageAlt: 'Custom icon',
    })
    expect(Swal.getImage().getAttribute('alt')).to.equal('Custom icon')
  })
})
