import { Swal } from '../../utils'

describe('getIcons()', () => {
  it('getIcons()', () => {
    Swal.fire({ icon: 'success' })
    const icons = Swal.getIcons()
    expect(icons.length).to.equal(5)
    expect(icons.filter(icon => icon.className.match('success'))[0].style.display).to.equal('flex')
    expect(icons.filter(icon => icon.className.match('error'))[0].style.display).to.equal('none')
    expect(icons.filter(icon => icon.className.match('question'))[0].style.display).to.equal('none')
    expect(icons.filter(icon => icon.className.match('warning'))[0].style.display).to.equal('none')
    expect(icons.filter(icon => icon.className.match('info'))[0].style.display).to.equal('none')
  })
})
