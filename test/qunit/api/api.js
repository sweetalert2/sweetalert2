/* global QUnit */
const {swal, initialSwalPropNames} = require('../helpers')
const Swal = swal

QUnit.test('properties of `swal` are consistent', (assert) => {
  const done = assert.async()
  const assertConsistent = postfix => {
    const currentSwalPropNames = Object.keys(swal)
    const extraPropNames = currentSwalPropNames.filter(key => !initialSwalPropNames.includes(key))
    assert.deepEqual(extraPropNames.length, 0, `# of extra properties ${postfix}`)
    assert.deepEqual(extraPropNames.join(','), '', `extra property names ${postfix}`)
    const missingProps = currentSwalPropNames.filter(key => !currentSwalPropNames.includes(key))
    assert.deepEqual(missingProps.length, 0, `# of missing properties ${postfix}`)
    assert.deepEqual(missingProps.join(','), '', `missing property names ${postfix}`)
  }
  assertConsistent('before first swal')
  swal({
    title: 'test',
    onOpen: () => {
      assertConsistent('after opening first swal')
      swal.clickConfirm()
    }
  }).then(() => {
    assertConsistent('after closing first swal')
    done()
  })
})

QUnit.test('defaults are applied to undefined arguments in shorthand calls', (assert) => {
  const done = assert.async()
  swal.setDefaults({
    html: 'foo',
    onOpen: () => {
      assert.equal(swal.getTitle().textContent, 'bar')
      assert.equal(swal.getContent().textContent, 'foo')
      swal.resetDefaults()
      done()
    }
  })
  swal('bar')
})

QUnit.test('instantiation with/without new keyword', (assert) => {
  assert.ok(Swal('foo') instanceof Swal)
  assert.ok((new Swal('foo')) instanceof Swal)
})

QUnit.test('instance properties and methods', (assert) => {
  const swal = new Swal({ input: 'text', inputValue: 'foo' })
  assert.equal(swal.params.input, 'text')
  assert.equal(swal.params.inputValue, 'foo')
  assert.equal(swal.getInput().value, 'foo')
})
