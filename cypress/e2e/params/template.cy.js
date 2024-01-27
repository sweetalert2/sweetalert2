/// <reference types="cypress" />

import { isVisible } from '../../../src/utils/dom'
import { $, Swal, SwalWithoutAnimation, isHidden } from '../../utils'

describe('template', () => {
  it('template as HTMLTemplateElement', () => {
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
      <swal-param name="inputAttributes" value='{ "hey": "there" }'></swal-param>
      <swal-param name="customClass" value='{ "popup": "my-popup" }'></swal-param>
      <swal-param name="showConfirmButton" value="false"></swal-param>
      <swal-param name="showCloseButton" value="true"></swal-param>
      <swal-param name="reverseButtons" value="true"></swal-param>
      <swal-param name="width" value="200"></swal-param>
      <swal-param name="closeButtonHtml" value="-"></swal-param>
      <swal-button type="deny" color="red">Denyyy</swal-button>
      <swal-button type="cancel" aria-label="no no">Nooo</swal-button>
      <swal-footer>footerrr</swal-footer>
    `
    document.body.appendChild(template)
    SwalWithoutAnimation.fire({
      template: document.querySelector('#my-template'),
    })
    expect(Swal.getPopup().classList.contains('my-popup')).to.be.true
    expect(Swal.getTitle().textContent).to.equal('Are you sure?')
    expect(Swal.getImage().src).to.equal('https://sweetalert2.github.io/images/SweetAlert2.png')
    expect(Swal.getImage().style.width).to.equal('300px')
    expect(Swal.getImage().style.height).to.equal('60px')
    expect(Swal.getInput().classList.contains('swal2-select')).to.be.true
    expect($('.swal2-input-label').innerHTML).to.equal('input label')
    expect(Swal.getInput().getAttribute('hey')).to.equal('there')
    expect(Swal.getInput().querySelectorAll('option').length).to.equal(3)
    expect($('.swal2-select option:nth-child(1)').innerHTML).to.equal('placeholderrr')
    expect($('.swal2-select option:nth-child(1)').disabled).to.be.true
    expect($('.swal2-select option:nth-child(2)').innerHTML).to.equal('aa')
    expect($('.swal2-select option:nth-child(2)').value).to.equal('a')
    expect($('.swal2-select option:nth-child(3)').innerHTML).to.equal('bb')
    expect($('.swal2-select option:nth-child(3)').value).to.equal('b')
    expect($('.swal2-select option:nth-child(3)').selected).to.be.true
    expect(isHidden(Swal.getConfirmButton())).to.be.true
    expect(isVisible(Swal.getCancelButton())).to.be.true
    expect(Swal.getDenyButton().style.backgroundColor).to.equal('red')
    expect(Swal.getPopup().style.width).to.equal('200px')
    expect(isVisible(Swal.getDenyButton())).to.be.true
    expect(Swal.getCancelButton().nextSibling).to.equal(Swal.getDenyButton())
    expect(Swal.getCancelButton().getAttribute('aria-label')).to.equal('no no')
    expect(isVisible(Swal.getCloseButton())).to.be.true
    expect(Swal.getCloseButton().innerHTML).to.equal('-')
    expect(isVisible(Swal.getFooter())).to.be.true
    expect(Swal.getFooter().innerHTML).to.equal('footerrr')
  })

  it('template as string', () => {
    const template = document.createElement('template')
    template.id = 'my-template-string'
    template.innerHTML = '<swal-title>Are you sure?</swal-title>'
    document.body.appendChild(template)
    const mixin = SwalWithoutAnimation.mixin({
      title: 'this title should be overridden by template',
    })
    mixin.fire({
      template: '#my-template-string',
    })
    expect(Swal.getTitle().textContent).to.equal('Are you sure?')
  })

  it('swal-function-param', (done) => {
    const _consoleLog = console.log // eslint-disable-line no-console
    const spy = cy.spy(console, 'log')
    const template = document.createElement('template')
    template.id = 'my-template-function-param'
    const didOpen = (modal) => {
      console.log(modal.querySelector('.swal2-title').innerText) // eslint-disable-line no-console
    }
    template.innerHTML = `
      <swal-title>Function param</swal-title>
      <swal-function-param name="didOpen" value="${didOpen}"></swal-function-param>
    `
    document.body.appendChild(template)
    SwalWithoutAnimation.fire({
      template: '#my-template-function-param',
    })
    setTimeout(() => {
      expect(spy.calledWith('Function param')).to.be.true
      console.log = _consoleLog // eslint-disable-line no-console
      done()
    })
  })

  it('should throw a warning when attempting to use unrecognized elements and attributes', () => {
    const spy = cy.spy(console, 'warn')
    const template = document.createElement('template')
    template.id = 'my-template-with-unexpected-attributes'
    template.innerHTML = `
      <swal-html>Check out this <a>link</a>!</swal-html>
      <swal-foo>bar</swal-foo>
      <swal-title value="hey!"></swal-title>
      <swal-image src="https://sweetalert2.github.io/images/SweetAlert2.png" width="100" height="100" alt="" foo="1">Are you sure?</swal-image>
      <swal-input bar>Are you sure?</swal-input>
    `
    document.body.appendChild(template)
    const mixin = SwalWithoutAnimation.mixin({
      imageAlt: 'this alt should be overridden by template',
    })
    mixin.fire({
      imageWidth: 200, // user param should override <swal-image width="100">
      template: '#my-template-with-unexpected-attributes',
    })
    expect(Swal.getImage().src).to.equal('https://sweetalert2.github.io/images/SweetAlert2.png')
    expect(Swal.getImage().style.width).to.equal('200px')
    expect(Swal.getImage().style.height).to.equal('100px')
    expect(Swal.getImage().getAttribute('alt')).to.equal('')
    expect(Swal.getInput().type).to.equal('text')
    expect(spy.callCount).to.equal(4)
    expect(spy.getCall(0).calledWith(`SweetAlert2: Unrecognized element <swal-foo>`)).to.be.true
    expect(
      spy
        .getCall(1)
        .calledWith(
          `SweetAlert2: Unrecognized attribute "foo" on <swal-image>. Allowed attributes are: src, width, height, alt`
        )
    ).to.be.true
    expect(
      spy
        .getCall(2)
        .calledWith(
          `SweetAlert2: Unrecognized attribute "bar" on <swal-input>. Allowed attributes are: type, label, placeholder, value`
        )
    ).to.be.true
    expect(
      spy
        .getCall(3)
        .calledWith(
          `SweetAlert2: Unrecognized attribute "value" on <swal-title>. To set the value, use HTML within the element.`
        )
    ).to.be.true
  })
})
