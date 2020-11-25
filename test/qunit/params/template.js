const { Swal, SwalWithoutAnimation, isVisible } = require('../helpers')

QUnit.test('template as HTMLTemplateElement', (assert) => {
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
  assert.equal(Swal.getTitle().textContent, 'Are you sure?')
  assert.ok(isVisible(Swal.getCancelButton()))
})

QUnit.test('template as string', (assert) => {
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
  assert.equal(Swal.getTitle().textContent, 'Are you sure?')
  assert.notOk(isVisible(Swal.getDenyButton()))
})
