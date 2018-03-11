/* global QUnit */
const { swal } = require('../helpers')

QUnit.test('basic plugin', (assert) => {
  const originalSwal = swal
  const mySwal = swal.plugin(swal => {
    assert.equal(swal, originalSwal)
    return params => {
      assert.deepEqual(params, { title: 'title' })
      // normally here we would call `swal` and return the result, while working in the plugin's magic
      // but there's really no need to use `swal` here since we know `swal === originalSwal` and it should behave as such
      // whatever we return here should be the return value of `mySwal()`, so lets just return a simple sync value
      return { value: 'value' }
    }
  })
  assert.deepEqual(Object.assign({}, mySwal), Object.assign({}, swal))
  const result = mySwal({ title: 'title' })
  assert.deepEqual(result, { value: 'value' })
})

QUnit.test('plugins and shorthand calls', (assert) => {
  const done = assert.async()
  const mySwal = swal.plugin(swal => params => {
    assert.deepEqual(params, { title: 'title', html: 'html', type: 'info' })
    done()
  })
  mySwal('title', 'html', 'info')
})

QUnit.test('plugins with static properties & methods', (assert) => {
  const staticMembers = {
    property: 'property',
    method: () => 'method'
  }
  const mySwal = swal.plugin(swal => [
    params => params, // `swal()` result will just be `params` (non-Promise)
    staticMembers
  ])
  assert.deepEqual(Object.assign({}, mySwal), Object.assign({}, swal, staticMembers))
  assert.deepEqual(mySwal('title'), { title: 'title' })
})

QUnit.test('extending argsToParams works while layering on more plugins/mixins', (assert) => {
  const done = assert.async()
  const promptPlugin = swal => [
    params => swal(Object.assign({input: 'text'}, params)),
    {
      argsToParams: args => typeof args[1] === 'string'
        ? {title: args[0], inputValue: args[1]}
        : swal.argsToParams(args)
    }
  ]

  const copyrightFooterMixin = { footer: 'Copyright' }
  const capitalizeTitlePlugin = swal => params => swal(Object.assign({}, params, {title: params.title.toUpperCase()}))
  const mySwal = swal
    .plugin(swal => params => {
      assert.deepEqual(params, {input: 'text', footer: 'Copyright', title: 'TITLE', inputValue: 'inputValue'})
      done()
    })
    .plugin(promptPlugin)
    .mixin(copyrightFooterMixin)
    .plugin(capitalizeTitlePlugin)
  mySwal('title', 'inputValue')
})
