import { Swal, SwalWithoutAnimation } from '../helpers.js'

QUnit.test('preDeny return false', (assert) => {
  SwalWithoutAnimation.fire({
    showDenyButton: true,
    preDeny: (value) => {
      assert.equal(value, false)
      return false
    }
  })
  Swal.clickDeny()
  assert.ok(Swal.isVisible())
})

QUnit.test('preDeny custom value', (assert) => {
  const done = assert.async()
  SwalWithoutAnimation.fire({
    showDenyButton: true,
    input: 'text',
    inputValue: 'Initial input value',
    returnInputValueOnDeny: true,
    preDeny: (value) => `${value} + Some data from preDeny`,
  }).then(result => {
    assert.equal('Initial input value + Some data from preDeny', result.value)
    done()
  })
  Swal.clickDeny()
})

QUnit.test('preDeny returns 0', (assert) => {
  const done = assert.async()
  SwalWithoutAnimation.fire({
    showDenyButton: true,
    preDeny: () => 0
  }).then(result => {
    assert.equal(result.value, 0)
    done()
  })
  Swal.clickDeny()
})

QUnit.test('preDeny returns object containing toPromise', (assert) => {
  const done = assert.async()
  SwalWithoutAnimation.fire({
    showDenyButton: true,
    didOpen: () => Swal.clickDeny(),
    preDeny: () => ({
      toPromise: () => Promise.resolve(0)
    })
  }).then(result => {
    assert.equal(result.value, 0)
    done()
  })
})
