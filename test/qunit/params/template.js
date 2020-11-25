const { Swal, SwalWithoutAnimation, isVisible } = require('../helpers')

QUnit.test('template as HTMLTemplateElement', (assert) => {
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
  assert.equal(Swal.getTitle().textContent, 'Are you sure?')
  assert.ok(isVisible(Swal.getCancelButton()))
})

QUnit.test('template as string', (assert) => {
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
  assert.equal(Swal.getTitle().textContent, 'Are you sure?')
  assert.ok(isVisible(Swal.getCancelButton()))
})
