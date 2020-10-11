const { Swal } = require('../helpers')

QUnit.test('inputLabel: text input with label', (assert) => {
  const done = assert.async()
  const inputLabel = 'My Text Input Label'

  Swal.fire({
    input: 'text',
    inputLabel
  })

  const input = Swal.getInput()
  const label = Swal.getLabel()
  assert.equal(input.id, label.htmlFor)
  assert.equal(label.innerText, inputLabel)

  done()
})

QUnit.test('inputLabel: password input with label', (assert) => {
  const done = assert.async()
  const inputLabel = 'My Password Label'

  Swal.fire({
    input: 'password',
    inputLabel
  })

  const input = Swal.getInput()
  const label = Swal.getLabel()
  assert.equal(input.id, label.htmlFor)
  assert.equal(label.innerText, inputLabel)

  done()
})

QUnit.test('inputLabel: textarea input with label', (assert) => {
  const done = assert.async()
  const inputLabel = 'My Text Area Label'

  Swal.fire({
    input: 'textarea',
    inputLabel,
    inputPlaceholder: 'Type your message here...',
    inputAttributes: {
      'aria-label': 'Type your message here'
    }
  })

  const input = Swal.getInput()
  const label = Swal.getContent().querySelector(`[for=${input.id}]`)
  assert.equal(label.innerText, inputLabel)

  done()
})

QUnit.test('inputLabel: select/options input with label', (assert) => {
  const done = assert.async()
  const inputLabel = 'My Dropdown List Label'

  Swal.fire({
    input: 'select',
    inputLabel,
    inputOptions: {
      'action': 'Action',
      'comedy': 'Comedy',
      'documentary': 'Documentary'
    },
  })

  const input = Swal.getInput()
  const label = Swal.getContent().querySelector(`[for=${input.id}]`)
  assert.equal(label.innerText, inputLabel)

  done()
})

QUnit.test('inputLabel: range input with label', (assert) => {
  const done = assert.async()
  const inputLabel = 'My Range Input Label'

  Swal.fire({
    input: 'range',
    inputLabel,
    inputAttributes: {
      min: 8,
      max: 120,
      step: 1
    }
  })

  const input = Swal.getInput()
  const label = Swal.getLabel()
  assert.equal(input.id, label.htmlFor)
  assert.equal(label.innerText, inputLabel)

  done()
})
