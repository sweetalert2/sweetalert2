import { $, Swal, SwalWithoutAnimation, isVisible, isHidden } from '../../utils'

describe('template', () => {
  it('template as HTMLTemplateElement', () => {
    const template = document.createElement('template')
    template.id = 'my-template'
    template.innerHTML = `
      <swal-title>Are you sure?</swal-title>
      <swal-html>You won't be able to revert this!</swal-html>
      <swal-icon type="success"></swal-icon>
      <swal-image src="https://sweetalert2.github.io/images/SweetAlert2.png" width="300" height="60" alt="safdsafd"></swal-image>
      <swal-input type="select" placeholder="placeholderrr" value="b" label="input label">
        <swal-input-option value="a">aa</swal-input-option>
        <swal-input-option value="b">bb</swal-input-option>
      </swal-input>
      <swal-param name="inputAttributes" value="{ hey: 'there' }"></swal-param>
      <swal-param name="showConfirmButton" value="false"></swal-param>
      <swal-button type="deny" color="red">Denyyy</swal-button>
      <swal-button type="cancel" aria-label="no no">Nooo</swal-button>
      <swal-footer>footerrr</swal-footer>
    `
    document.body.append(template)
    SwalWithoutAnimation.fire({
      template: document.querySelector('#my-template'),
    })
    expect(Swal.getTitle().textContent).to.equal('Are you sure?')
    expect(isVisible(Swal.getCancelButton())).to.be.true

    expect(Swal.getTitle().textContent).to.equal('Are you sure?')
    expect(Swal.getImage().src).to.equal('https://sweetalert2.github.io/images/SweetAlert2.png')
    expect(Swal.getImage().style.width).to.equal('300px')
    expect(Swal.getImage().style.height).to.equal('60px')
    expect(Swal.getInput().classList.contains('swal2-select')).to.be.true
    expect($('.swal2-input-label').innerHTML).to.equal('input label')
    expect(Swal.getInput().getAttribute('hey')).to.equal('there')
    expect(Swal.getInput().querySelectorAll('option').length).to.equal(3)
    expect($('.swal2-select option:nth-child(1)').innerHTML).to.equal('placeholderrr')
    expect($('.swal2-select option:nth-child(1)').disabled).to.be.true
    expect($('.swal2-select option:nth-child(2)').innerHTML).to.equal('aa')
    expect($('.swal2-select option:nth-child(2)').value).to.equal('a')
    expect($('.swal2-select option:nth-child(3)').innerHTML).to.equal('bb')
    expect($('.swal2-select option:nth-child(3)').value).to.equal('b')
    expect($('.swal2-select option:nth-child(3)').selected).to.be.true
    expect(isHidden(Swal.getConfirmButton())).to.be.true
    expect(isVisible(Swal.getCancelButton())).to.be.true
    expect(Swal.getDenyButton().style.backgroundColor).to.equal('red')
    expect(isVisible(Swal.getDenyButton())).to.be.true
    expect(Swal.getCancelButton().getAttribute('aria-label')).to.equal('no no')
    expect(isVisible(Swal.getFooter())).to.be.true
    expect(Swal.getFooter().innerHTML).to.equal('footerrr')
  })

  it('template as string', () => {
    const template = document.createElement('template')
    template.id = 'my-template-string'
    template.innerHTML = '<swal-title>Are you sure?</swal-title>'
    document.body.append(template)
    SwalWithoutAnimation.fire({
      template: '#my-template-string',
    })
    expect(Swal.getTitle().textContent).to.equal('Are you sure?')
  })
})
