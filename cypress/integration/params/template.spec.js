import { Swal, SwalWithoutAnimation, isVisible } from '../../utils'

describe('template', () => {
  it('template as HTMLTemplateElement', () => {
    const template = document.createElement('template')
    template.id = 'my-template'
    template.innerHTML = `
      <swal params="{
        title: 'Are you sure?',
        showCancelButton: true,
      }"></swal>
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
      <swal params="{
        title: 'Are you sure?',
        showCancelButton: true,
      }"></swal>
    `
    document.body.append(template)
    SwalWithoutAnimation.fire({
      template: '#my-template-string',
    })
    expect(Swal.getTitle().textContent).to.equal('Are you sure?')
    expect(isVisible(Swal.getCancelButton())).to.be.true
  })
})
