const { Swal, initialSwalPropNames } = require('../helpers')

QUnit.test('properties of `Swal` class are consistent', (assert) => {
  const done = assert.async()
  const assertConsistent = postfix => {
    const currentSwalPropNames = Object.keys(Swal)
    const extraPropNames = currentSwalPropNames.filter(key => !initialSwalPropNames.includes(key))
    assert.deepEqual(extraPropNames.length, 0, `# of extra properties ${postfix}`)
    assert.deepEqual(extraPropNames.join(','), '', `extra property names ${postfix}`)
    const missingProps = currentSwalPropNames.filter(key => !currentSwalPropNames.includes(key))
    assert.deepEqual(missingProps.length, 0, `# of missing properties ${postfix}`)
    assert.deepEqual(missingProps.join(','), '', `missing property names ${postfix}`)
  }
  assertConsistent('before first swal')
  Swal.fire({
    title: 'test',
    onOpen: () => {
      assertConsistent('after opening first swal')
      Swal.clickConfirm()
    }
  }).then(() => {
    assertConsistent('after closing first swal')
    done()
  })
})

QUnit.test('ways to instantiate', (assert) => {
  assert.ok((new Swal('foo')) instanceof Swal)
  assert.ok(Swal.fire('foo') instanceof Swal)
})

QUnit.test('instance properties and methods', (assert) => {
  const params = { input: 'text', inputValue: 'foo' }
  const swal = Swal.fire(params)
  assert.deepEqual(Object.keys(swal), ['params'])
  assert.deepEqual(swal.params, params)
  assert.equal(swal.getInput().value, 'foo')
})

QUnit.test('extending swal', (assert) => {
  const done = assert.async()
  const MySwal = class extends Swal {
    static argsToParams (args) {
      assert.deepEqual(args, ['arg'])
      return { title: 'title' }
    }
    _main (params) {
      assert.deepEqual(params, { title: 'title' })
      return super._main({
        input: 'text',
        inputValue: 'inputValue',
        onOpen: () => MySwal.clickConfirm()
      }).then(result => {
        assert.deepEqual(result, { value: 'inputValue' })
        return 'result'
      })
    }
  }
  MySwal.fire('arg').then(result => {
    assert.equal(result, 'result')
    done()
  })
})
