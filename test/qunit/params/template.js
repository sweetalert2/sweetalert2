const { $, Swal, SwalWithoutAnimation, isVisible, isHidden } = require('../helpers')

QUnit.test('template as HTMLTemplateElement', (assert) => {
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
  assert.equal(Swal.getTitle().textContent, 'Are you sure?')
  assert.equal(Swal.getImage().src, 'https://sweetalert2.github.io/images/SweetAlert2.png')
  assert.equal(Swal.getImage().style.width, '300px')
  assert.equal(Swal.getImage().style.height, '60px')
  assert.ok(Swal.getInput().classList.contains('swal2-select'))
  assert.equal($('.swal2-input-label').innerHTML, 'input label')
  assert.equal(Swal.getInput().getAttribute('hey'), 'there')
  assert.equal(Swal.getInput().querySelectorAll('option').length, 3)
  assert.equal($('.swal2-select option:nth-child(1)').innerHTML, 'placeholderrr')
  assert.ok($('.swal2-select option:nth-child(1)').disabled)
  assert.equal($('.swal2-select option:nth-child(2)').innerHTML, 'aa')
  assert.equal($('.swal2-select option:nth-child(2)').value, 'a')
  assert.equal($('.swal2-select option:nth-child(3)').innerHTML, 'bb')
  assert.equal($('.swal2-select option:nth-child(3)').value, 'b')
  assert.ok($('.swal2-select option:nth-child(3)').selected)
  assert.ok(isHidden(Swal.getConfirmButton()))
  assert.ok(isVisible(Swal.getCancelButton()))
  assert.equal(Swal.getCancelButton().style.backgroundColor, 'red')
  assert.ok(isVisible(Swal.getDenyButton()))
  assert.equal(Swal.getDenyButton().getAttribute('aria-label'), 'no no')
  assert.ok(isVisible(Swal.getFooter()))
  assert.equal(Swal.getFooter().innerHTML, 'footerrr')
})

QUnit.test('template as string', (assert) => {
  const template = document.createElement('template')
  template.id = 'my-template-string'
  template.innerHTML = '<swal-title>Are you sure?</swal-title>'
  document.body.append(template)
  SwalWithoutAnimation.fire({
    template: '#my-template-string',
  })
  assert.equal(Swal.getTitle().textContent, 'Are you sure?')
})
