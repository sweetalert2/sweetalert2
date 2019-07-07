const { Swal } = require('../helpers')

QUnit.test('inputAttributes: input text w/ placeholder', (assert) => {
  const done = assert.async()

  Swal.fire({
    input: 'text',
    inputAttributes: {
      placeholder: 'placeholder text',
    },
  })

  assert.equal(Swal.getInput().value, '')
  assert.equal(Swal.getInput().placeholder, 'placeholder text')

  done()
})

QUnit.test('inputAttributes: input file w/ placeholder', (assert) => {
  const done = assert.async()

  Swal.fire({
    input: 'file',
    inputAttributes: {
      placeholder: 'placeholder text',
    },
  })

  assert.equal(Swal.getInput().value, '')
  assert.equal(Swal.getInput().placeholder, 'placeholder text')

  done()
})

QUnit.test('inputAttributes: input textarea w/ placeholder', (assert) => {
  const done = assert.async()

  Swal.fire({
    input: 'textarea',
    inputAttributes: {
      placeholder: 'Provide your input here',
    },
  })

  assert.equal(Swal.getInput().value, '')
  assert.equal(Swal.getInput().placeholder, 'Provide your input here')

  done()
})
