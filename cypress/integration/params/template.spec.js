import { Swal, SwalWithoutAnimation, isVisible } from '../../utils'

describe('template', () => {
  it('template as HTMLTemplateElement', () => {
    const template = document.createElement('template')
    template.id = 'my-template'
    template.innerHTML = `
      <swal-title>Are you sure?</swal-title>
      <swal-show-cancel-button>true</swal-show-cancel-button>
    `
    document.body.append(template)
    SwalWithoutAnimation.fire({
      template: document.querySelector('#my-template'),
    })
    expect(Swal.getTitle().textContent).to.equal('Are you sure?')
    expect(isVisible(Swal.getCancelButton())).to.be.true
  })

  it('template as string', () => {
    const template = document.createElement('template')
    template.id = 'my-template-string'
    template.innerHTML = `
      <swal-title>Are you sure?</swal-title>
      <swal-show-deny-button>false</swal-show-deny-button>
    `
    document.body.append(template)
    SwalWithoutAnimation.fire({
      template: '#my-template-string',
    })
    expect(Swal.getTitle().textContent).to.equal('Are you sure?')
    expect(isVisible(Swal.getDenyButton())).to.be.false
  })
})
