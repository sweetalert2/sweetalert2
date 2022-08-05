import { Swal } from '../../utils'

describe('inputAttributes', () => {
  it('input text w/ placeholder', () => {
    Swal.fire({
      input: 'text',
      inputAttributes: {
        placeholder: 'placeholder text',
      },
    })
    expect(Swal.getInput().value).to.equal('')
    expect(Swal.getInput().placeholder).to.equal('placeholder text')
  })

  it('input file w/ placeholder', () => {
    Swal.fire({
      input: 'file',
      inputAttributes: {
        placeholder: 'placeholder text',
      },
    })
    expect(Swal.getInput().value).to.equal('')
    expect(Swal.getInput().placeholder).to.equal('placeholder text')
  })

  it('input textarea w/ placeholder', () => {
    Swal.fire({
      input: 'textarea',
      inputAttributes: {
        placeholder: 'Provide your input here',
      },
    })
    expect(Swal.getInput().value).to.equal('')
    expect(Swal.getInput().placeholder).to.equal('Provide your input here')
  })
})
