import { $, Swal, SwalWithoutAnimation, isVisible, isHidden, triggerKeydownEvent, dispatchCustomEvent, TIMEOUT } from '../../utils'
import { toArray } from '../../../src/utils/utils'
import defaultInputValidators from '../../../src/utils/defaultInputValidators'

describe('Input', () => {
  it('should throw console error about unexpected input type', () => {
    const spy = cy.spy(console, 'error')
    Swal.fire({ input: 'invalid-input-type' })
    expect(spy).to.be.calledWith('SweetAlert2: Unexpected type of input! Expected "text", "email", "password", "number", "tel", "select", "radio", "checkbox", "textarea", "file" or "url", got "invalid-input-type"')
  })

  it('input text', (done) => {
    const string = 'Live for yourself'
    Swal.fire({
      input: 'text',
    }).then((result) => {
      expect(result.value).to.equal(string)
      done()
    })

    Swal.getInput().value = string
    Swal.clickConfirm()
  })

  it('input textarea', (done) => {
    Swal.fire({
      input: 'textarea',
      inputAutoTrim: false
    }).then((result) => {
      expect(result.value).to.equal('hola!')
      done()
    })

    // Enter should not submit but put a newline to the textarea
    triggerKeydownEvent(Swal.getInput(), 'Enter')

    Swal.getInput().value = 'hola!'
    Swal.clickConfirm()
  })

  it('input email + built-in email validation', (done) => {
    const invalidEmailAddress = 'blah-blah@zzz'
    const validEmailAddress = 'team+support+a.b@example.com'
    SwalWithoutAnimation.fire({ input: 'email' }).then((result) => {
      expect(result.value).to.equal(validEmailAddress)
      done()
    })

    Swal.getInput().value = invalidEmailAddress
    Swal.clickConfirm()
    setTimeout(() => {
      expect(isVisible(Swal.getValidationMessage())).to.be.true
      expect(Swal.getValidationMessage().textContent.indexOf('Invalid email address') !== -1).to.be.true

      Swal.getInput().value = validEmailAddress
      triggerKeydownEvent(Swal.getInput(), 'Enter')
    }, TIMEOUT)
  })

  it('input url + built-in url validation', (done) => {
    const invalidUrl = 'sweetalert2.github.io'
    const validUrl = 'https://sweetalert2.github.io/'
    SwalWithoutAnimation.fire({ input: 'url' }).then((result) => {
      expect(result.value).to.equal(validUrl)
      done()
    })
    Swal.getInput().value = invalidUrl
    Swal.clickConfirm()
    setTimeout(() => {
      expect(isVisible(Swal.getValidationMessage())).to.be.true
      expect(Swal.getValidationMessage().textContent.indexOf('Invalid URL') !== -1).to.be.true

      Swal.getInput().value = validUrl
      triggerKeydownEvent(Swal.getInput(), 'Enter')
    }, TIMEOUT)
  })

  it('input select', (done) => {
    const selected = 'dos'
    Swal.fire({
      input: 'select',
      inputOptions: { uno: 1, dos: 2 },
      inputPlaceholder: 'Choose a number'
    }).then((result) => {
      expect(result.value).to.equal(selected)
      done()
    })
    expect(Swal.getInput().value).to.equal('')
    const placeholderOption = Swal.getInput().querySelector('option')
    expect(placeholderOption.disabled).to.be.true
    expect(placeholderOption.selected).to.be.true
    expect(placeholderOption.textContent).to.equal('Choose a number')
    Swal.getInput().value = selected
    Swal.clickConfirm()
  })

  it('input text w/ inputPlaceholder as configuration', () => {
    Swal.fire({
      input: 'text',
      inputPlaceholder: 'placeholder text'
    })
    expect(Swal.getInput().value).to.equal('')
    expect(Swal.getInput().placeholder).to.equal('placeholder text')
  })

  it('input checkbox', (done) => {
    Swal.fire({ input: 'checkbox', inputAttributes: { name: 'test-checkbox' } }).then((result) => {
      expect(checkbox.getAttribute('name')).to.equal('test-checkbox')
      expect(result.value).to.equal(1)
      done()
    })
    const checkbox = $('.swal2-checkbox input')
    checkbox.checked = true
    Swal.clickConfirm()
  })

  it('input range', () => {
    Swal.fire({ input: 'range', inputAttributes: { min: 1, max: 10 }, inputValue: 5 })
    const input = Swal.getInput()
    const output = $('.swal2-range output')
    expect(input.getAttribute('min')).to.equal('1')
    expect(input.getAttribute('max')).to.equal('10')
    expect(input.value).to.equal('5')
    input.value = 10
    dispatchCustomEvent(input, 'input')
    expect(output.textContent).to.equal('10')
    input.value = 9
    dispatchCustomEvent(input, 'change')
    expect(output.textContent).to.equal('9')
  })

  it('input type "select", inputOptions Map', () => {
    const inputOptions = new Map()
    inputOptions.set(2, 'Richard Stallman')
    inputOptions.set(1, 'Linus Torvalds')
    SwalWithoutAnimation.fire({
      input: 'select',
      inputOptions,
      inputValue: 1
    })
    expect($('.swal2-select').querySelectorAll('option').length).to.equal(2)
    expect($('.swal2-select option:nth-child(1)').innerHTML).to.equal('Richard Stallman')
    expect($('.swal2-select option:nth-child(1)').value).to.equal('2')
    expect($('.swal2-select option:nth-child(2)').innerHTML).to.equal('Linus Torvalds')
    expect($('.swal2-select option:nth-child(2)').value).to.equal('1')
    expect($('.swal2-select option:nth-child(2)').selected).to.equal(true)
  })

  it('input type "radio", inputOptions Map', () => {
    const inputOptions = new Map()
    inputOptions.set(2, 'Richard Stallman')
    inputOptions.set(1, 'Linus Torvalds')
    Swal.fire({
      input: 'radio',
      inputOptions,
      inputValue: 1
    })
    expect($('.swal2-radio').querySelectorAll('label').length).to.equal(2)
    expect($('.swal2-radio label:nth-child(1)').textContent).to.equal('Richard Stallman')
    expect($('.swal2-radio label:nth-child(1) input').value).to.equal('2')
    expect($('.swal2-radio label:nth-child(2)').textContent).to.equal('Linus Torvalds')
    expect($('.swal2-radio label:nth-child(2) input').value).to.equal('1')
    expect($('.swal2-radio label:nth-child(2) input').checked).to.equal(true)
  })

  it('input radio', () => {
    Swal.fire({
      input: 'radio',
      inputOptions: {
        one: 'one',
        two: 'two'
      }
    })
    expect($('.swal2-radio').querySelectorAll('label').length).to.equal(2)
    expect($('.swal2-radio').querySelectorAll('input[type="radio"]').length).to.equal(2)
  })

  it('popup should expand and shrink accordingly to textarea width', (done) => {
    SwalWithoutAnimation.fire({
      input: 'textarea',
    })
    Swal.getInput().style.width = '600px'
    setTimeout(() => {
      expect(Swal.getPopup().style.width).to.equal('640px')
      Swal.getInput().style.width = '100px'
      setTimeout(() => {
        expect(Swal.getPopup().style.width).to.equal('')
        done()
      })
    })
  })

  it('disable/enable input', () => {
    Swal.fire('(disable/enable)Input should not fail if there is no input')
    Swal.disableInput()
    Swal.enableInput()

    Swal.fire({
      input: 'text'
    })

    Swal.disableInput()
    expect(Swal.getInput().disabled).to.be.true
    Swal.enableInput()
    expect(Swal.getInput().disabled).to.be.false

    Swal.fire({
      input: 'radio',
      inputOptions: {
        one: 'one',
        two: 'two'
      }
    })

    Swal.disableInput()
    toArray($('.swal2-radio').querySelectorAll('radio')).forEach((radio) => {
      expect(radio.disabled).to.be.true
    })
    Swal.enableInput()
    toArray($('.swal2-radio').querySelectorAll('radio')).forEach((radio) => {
      expect(radio.disabled).to.be.false
    })
  })

  it('should throw console error about unexpected type of InputOptions', () => {
    const spy = cy.spy(console, 'error')
    Swal.fire({ input: 'select', inputOptions: 'invalid-input-options' })
    expect(spy.calledWith('SweetAlert2: Unexpected type of inputOptions! Expected object, Map or Promise, got string')).to.be.true
  })
})

describe('Validation', () => {
  it('input.checkValidity()', (done) => {
    Swal.fire({
      input: 'tel',
      inputAttributes: {
        pattern: '[0-9]{3}-[0-9]{3}-[0-9]{4}'
      },
      validationMessage: 'Invalid phone number'
    }).then(result => {
      expect(result.value).to.equal('123-456-7890')
      done()
    })
    Swal.getInput().value = 'blah-blah'
    Swal.clickConfirm()
    setTimeout(() => {
      expect(isVisible(Swal.getValidationMessage())).to.be.true
      expect(Swal.getValidationMessage().textContent).to.equal('Invalid phone number')
      Swal.getInput().value = '123-456-7890'
      Swal.clickConfirm()
    }, TIMEOUT)
  })

  it('validation message', (done) => {
    const inputValidator = (value) => Promise.resolve(!value && 'no falsy values')

    SwalWithoutAnimation.fire({ input: 'text', inputValidator })
    expect(isHidden(Swal.getValidationMessage())).to.be.true
    setTimeout(() => {
      const initialModalHeight = Swal.getPopup().offsetHeight

      Swal.clickConfirm()
      setTimeout(() => {
        expect(isVisible(Swal.getValidationMessage())).to.be.true
        expect(Swal.getValidationMessage().textContent).to.equal('no falsy values')
        expect(Swal.getInput().getAttribute('aria-invalid')).to.equal('true')
        expect(Swal.getPopup().offsetHeight > initialModalHeight).to.be.true

        Swal.getInput().value = 'blah-blah'

        // setting the value programmatically will not trigger the 'input' event,
        // doing that manually
        const event = document.createEvent('Event')
        event.initEvent('input', true, true)
        Swal.getInput().dispatchEvent(event)

        expect(isHidden(Swal.getValidationMessage())).to.be.true
        expect(Swal.getInput().getAttribute('aria-invalid')).to.be.null
        expect(Swal.getPopup().offsetHeight === initialModalHeight).to.be.true
        done()
      }, TIMEOUT)
    }, TIMEOUT)
  })

  it('default URL validator: https://google.com', (done) => {
    defaultInputValidators.url('https://google.com').then(() => {
      done()
    })
  })

  it('default URL validator: http://foo.localhost/', (done) => {
    defaultInputValidators.url('http://foo.localhost/').then(() => {
      done()
    })
  })

  it('default URL validator: invalid url', (done) => {
    defaultInputValidators.url('invalid url').then(data => {
      expect(data).to.equal('Invalid URL')
      done()
    })
  })
})
