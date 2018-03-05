/* global QUnit */
const {swal, initialSwalPropNames} = require('./helpers')

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
