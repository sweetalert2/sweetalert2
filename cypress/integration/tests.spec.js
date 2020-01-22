import jQuery from 'jquery'
import Swal from '../../src/sweetalert2'
import { $, isHidden, isVisible, SwalWithoutAnimation, triggerKeydownEvent, TIMEOUT, dispatchCustomEvent } from '../utils'

describe('Miscellaneous tests', function () {
  it('version is correct semver', () => {
    expect(!!Swal.version.match(/\d+\.\d+\.\d+/)).to.be.true
  })

  it('modal shows up', () => {
    Swal.fire('Hello world!')
    expect(Swal.isVisible()).to.be.true
  })

  it('the icon is shown', () => {
    Swal.fire('', '', 'success')
    expect(Swal.getIcon().classList.contains('swal2-success')).to.be.true
  })

  it('should throw console warning about invalid params', () => {
    const spy = cy.spy(console, 'warn')
    Swal.fire({ invalidParam: 'oops' })
    expect(spy.calledWith('SweetAlert2: Unknown parameter "invalidParam"')).to.be.true
  })

  it('should throw console error about unexpected params', () => {
    const spy = cy.spy(console, 'error')
    Swal.fire('Hello world!', { icon: 'success' })
    expect(spy.calledWith('SweetAlert2: Unexpected type of html! Expected "string" or "Element", got object')).to.be.true
  })

  it('should not throw console error about undefined params and treat them as empty strings', () => {
    const spy = cy.spy(console, 'error')
    Swal.fire(undefined, 'Hello world!', undefined)
    expect(spy.notCalled).to.be.true
  })

  it('should accept Elements as shorhand params', () => {
    const title = document.createElement('strong')
    title.innerHTML = 'title'
    const content = document.createElement('a')
    content.innerHTML = 'content'
    Swal.fire(title, content, 'success')
    expect(Swal.getTitle().innerHTML).to.equal('<strong>title</strong>')
    expect(Swal.getHtmlContainer().innerHTML).to.equal('<a>content</a>')
  })

  it('should not throw console error when <svg> tags are present (#1289)', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    const spy = cy.spy(console, 'error')
    Swal.fire({})
    expect(spy.notCalled).to.be.true
  })

  it('should show the popup with OK button in case of empty object passed as an argument', () => {
    Swal.fire({})
    expect(isVisible(Swal.getConfirmButton())).to.be.true
    expect(isHidden(Swal.getCancelButton())).to.be.true
    expect(Swal.getTitle().textContent).to.equal('')
    expect(Swal.getContent().textContent).to.equal('')
    expect(isHidden(Swal.getFooter())).to.be.true
  })

  it('modal width', () => {
    Swal.fire({ text: '300px', width: 300 })
    expect(Swal.getPopup().style.width).to.equal('300px')

    Swal.fire({ text: '400px', width: '400px' })
    expect(Swal.getPopup().style.width).to.equal('400px')

    Swal.fire({ text: '90%', width: '90%' })
    expect(Swal.getPopup().style.width).to.equal('90%')
  })

  it('heightAuto', () => {
    Swal.fire('I should set .swal2-height-auto class to html and body')
    expect(document.documentElement.classList.contains('swal2-height-auto')).to.be.true

    Swal.fire({
      title: 'I am modeless and should not set .swal2-height-auto',
      backdrop: false
    })
    expect(document.documentElement.classList.contains('swal2-height-auto')).to.be.true

    Swal.fire({
      title: 'I am toast and should not set .swal2-height-auto',
      toast: true
    })
    expect(document.documentElement.classList.contains('swal2-height-auto')).to.be.true
  })

  it('getters', () => {
    Swal.fire('Title', 'Content')
    expect(Swal.getTitle().innerText).to.equal('Title')
    expect(Swal.getContent().innerText.trim()).to.equal('Content')

    Swal.fire({
      showCancelButton: true,
      imageUrl: '/assets/swal2-logo.png',
      confirmButtonText: 'Confirm button',
      confirmButtonAriaLabel: 'Confirm button aria-label',
      cancelButtonText: 'Cancel button',
      cancelButtonAriaLabel: 'Cancel button aria-label',
      footer: '<b>Footer</b>'
    })
    expect(Swal.getImage().src.includes('/assets/swal2-logo.png')).to.be.true
    expect(Swal.getActions().textContent).to.equal('Confirm buttonCancel button')
    expect(Swal.getConfirmButton().innerText).to.equal('Confirm button')
    expect(Swal.getCancelButton().innerText).to.equal('Cancel button')
    expect(Swal.getConfirmButton().getAttribute('aria-label')).to.equal('Confirm button aria-label')
    expect(Swal.getCancelButton().getAttribute('aria-label')).to.equal('Cancel button aria-label')
    expect(Swal.getFooter().innerHTML).to.equal('<b>Footer</b>')

    Swal.fire({ input: 'text' })
    Swal.getInput().value = 'input text'
    expect(Swal.getInput().value).to.equal('input text')

    Swal.fire({
      input: 'radio',
      inputOptions: {
        one: 'one',
        two: 'two'
      }
    })
    $('.swal2-radio input[value="two"]').setAttribute('checked', true)
    expect(Swal.getInput().value).to.equal('two')
  })

  it('content/title is set (html)', () => {
    Swal.fire({
      title: '<strong>Strong</strong>, <em>Emphasis</em>',
      html: '<p>Paragraph</p><img /><button></button>'
    })

    expect(Swal.getTitle().querySelectorAll('strong, em').length).to.equal(2)
    expect(Swal.getContent().querySelectorAll('p, img, button').length).to.equal(3)
  })

  it('content/title is set (text)', () => {
    Swal.fire({
      titleText: '<strong>Strong</strong>, <em>Emphasis</em>',
      text: '<p>Paragraph</p><img /><button></button>'
    })

    expect(Swal.getTitle().innerHTML, '&lt;strong&gt;Strong&lt;/strong&gt;).to.equal(&lt;em&gt;Emphasis&lt;/em&gt;')
    expect(Swal.getHtmlContainer().innerHTML).to.equal('&lt;p&gt;Paragraph&lt;/p&gt;&lt;img /&gt;&lt;button&gt;&lt;/button&gt;')
    expect(Swal.getTitle().querySelectorAll('strong, em').length).to.equal(0)
    expect(Swal.getContent().querySelectorAll('p, img, button').length).to.equal(0)
  })

  it('JS element as html param', () => {
    const p = document.createElement('p')
    p.textContent = 'js element'
    Swal.fire({
      html: p
    })
    expect(Swal.getHtmlContainer().innerHTML).to.equal('<p>js element</p>')
  })

  it('disable/enable buttons', () => {
    Swal.fire('test disable/enable buttons')

    Swal.disableButtons()
    expect(Swal.getConfirmButton().disabled).to.be.true
    expect(Swal.getCancelButton().disabled).to.be.true

    Swal.enableButtons()
    expect(Swal.getConfirmButton().disabled).to.be.false
    expect(Swal.getCancelButton().disabled).to.be.false
  })

  it('reversed buttons', () => {
    Swal.fire({
      text: 'Modal with reversed buttons',
      showCancelButton: true,
      reverseButtons: true
    })
    expect(Swal.getConfirmButton().previousSibling).to.equal(Swal.getCancelButton())

    Swal.fire('Modal with buttons')
    expect(Swal.getCancelButton().previousSibling).to.equal(Swal.getConfirmButton())
  })

  it('modal vertical offset', (done) => {
    // create a modal with dynamic-height content
    SwalWithoutAnimation.fire({
      imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNikAQAACIAHF/uBd8AAAAASUVORK5CYII=',
      title: 'Title',
      html: '<hr><div style="height: 50px"></div><p>Text content</p>',
      icon: 'warning',
      input: 'text'
    })

    // listen for image load
    Swal.getImage().addEventListener('load', () => {
      const box = Swal.getPopup().getBoundingClientRect()
      const delta = box.top - (box.bottom - box.height)
      // allow 1px difference, in case of uneven height
      expect(Math.abs(delta) <= 1).to.be.true
      done()
    })
  })

  it('onOpen', (done) => {
    // create a modal with an onOpen callback
    Swal.fire({
      title: 'onOpen test',
      onOpen: (modal) => {
        expect(Swal.getPopup()).to.equal(modal)
        done()
      }
    })
  })

  it('onBeforeOpen', (done) => {
    // create a modal with an onBeforeOpen callback
    Swal.fire({
      title: 'onBeforeOpen test',
      onBeforeOpen: (modal) => {
        expect(Swal.isVisible()).to.be.false
        expect(Swal.getPopup()).to.equal(modal)
      }
    })

    // check that onBeforeOpen calls properly
    const dynamicTitle = 'Set onBeforeOpen title'
    Swal.fire({
      title: 'onBeforeOpen test',
      onBeforeOpen: () => {
        Swal.getTitle().innerHTML = dynamicTitle
      },
      onOpen: () => {
        expect(Swal.getTitle().innerHTML).to.equal(dynamicTitle)
        done()
      }
    })
  })

  it('onRender', () => {
    const onRender = cy.spy()

    // create a modal with an onRender callback
    // the onRender hook should be called once here
    Swal.fire({
      title: 'onRender test',
      onRender
    })

    expect(onRender.calledOnce).to.be.true

    // update the modal, causing a new render
    // the onRender hook should be called once again
    Swal.update({})

    expect(onRender.calledTwice).to.be.true

    // the modal element must always be passed to the onRender hook
    expect(onRender.alwaysCalledWithExactly(Swal.getPopup())).to.be.true
  })

  it('onAfterClose', (done) => {
    let onCloseFinished = false

    // create a modal with an onAfterClose callback
    Swal.fire({
      title: 'onAfterClose test',
      onClose: () => {
        onCloseFinished = true
      },
      onAfterClose: () => {
        expect(onCloseFinished).to.be.true
        expect(Swal.getContainer()).to.be.null
        done()
      }
    })

    Swal.getCloseButton().click()
  })

  it('onDestroy', (done) => {
    let firstPopupDestroyed = false
    Swal.fire({
      title: '1',
      onDestroy: () => {
        firstPopupDestroyed = true
      }
    })
    Swal.fire({
      title: '2',
      onDestroy: () => {
        done()
      }
    })
    expect(firstPopupDestroyed).to.be.true
    Swal.getConfirmButton().click()
  })

  it('onClose', (done) => {
    // create a modal with an onClose callback
    Swal.fire({
      title: 'onClose test',
      onClose: (_modal) => {
        expect(modal).to.equal(_modal)
        expect(Swal.getContainer()).to.equal($('.swal2-container'))
        done()
      }
    })

    const modal = Swal.getPopup()
    Swal.getCloseButton().click()
  })

  it('Swal.fire() in onClose', (done) => {
    Swal.fire({
      title: 'onClose test',
      onClose: () => {
        Swal.fire({
          text: 'OnClose',
          input: 'text',
          customClass: {
            input: 'on-close-swal'
          }
        })
      }
    }).then(() => {
      expect(Swal.isVisible()).to.be.true
      expect(Swal.getInput().classList.contains('on-close-swal')).to.be.true
      done()
    })

    Swal.clickConfirm()
  })

  it('esc key', (done) => {
    document.body.addEventListener('keydown', () => {
      throw new Error('Should not propagate keydown event to body!')
    })

    SwalWithoutAnimation.fire({
      title: 'Esc me',
      onOpen: () => triggerKeydownEvent(Swal.getPopup(), 'Escape')
    }).then((result) => {
      expect(result).to.eql({ dismiss: Swal.DismissReason.esc })
      done()
    })
  })

  it('allowEscapeKey as a function', (done) => {
    let functionWasCalled = false

    SwalWithoutAnimation.fire({
      title: 'allowEscapeKey as a function',
      allowEscapeKey: () => {
        functionWasCalled = true
        return false
      },
      onOpen: () => {
        expect(functionWasCalled).to.equal(false)

        triggerKeydownEvent(Swal.getPopup(), 'Escape')

        setTimeout(() => {
          expect(functionWasCalled).to.equal(true)
          expect(Swal.isVisible()).to.be.true

          done()
        })
      }
    })
  })

  it('close button', (done) => {
    Swal.fire({
      title: 'Close button test',
      showCloseButton: true
    }).then((result) => {
      expect(result).to.eql({ dismiss: Swal.DismissReason.close })
      done()
    })

    const closeButton = Swal.getCloseButton()
    expect(isVisible(closeButton)).to.be.true
    expect(closeButton.getAttribute('aria-label')).to.equal('Close this dialog')
    closeButton.click()
  })

  it('close button customization', () => {
    Swal.fire({
      title: 'Customized Close button test',
      showCloseButton: true,
      closeButtonHtml: 'c'
    })

    const closeButton = Swal.getCloseButton()
    expect(closeButton.innerHTML).to.equal('c')
  })

  it('cancel button', (done) => {
    Swal.fire({
      title: 'Cancel me'
    }).then((result) => {
      expect(result).to.eql({ dismiss: Swal.DismissReason.cancel })
      done()
    })

    Swal.clickCancel()
  })

  it('timer', (done) => {
    SwalWithoutAnimation.fire({
      title: 'Timer test',
      timer: 10
    }).then((result) => {
      expect(result).to.eql({ dismiss: Swal.DismissReason.timer })
      done()
    })
  })

  it('params validation', () => {
    expect(Swal.isValidParameter('title')).to.be.true
    expect(Swal.isValidParameter('foobar')).to.be.false
  })

  it('addition and removal of backdrop', () => {
    Swal.fire({ backdrop: false })
    expect(document.body.classList.contains('swal2-no-backdrop')).to.be.true
    expect(document.documentElement.classList.contains('swal2-no-backdrop')).to.be.true
    Swal.fire({ title: 'test' })
    expect(document.body.classList.contains('swal2-no-backdrop')).to.be.false
    expect(document.documentElement.classList.contains('swal2-no-backdrop')).to.be.false
  })

  it('footer', () => {
    Swal.fire({ title: 'Modal with footer', footer: 'I am footer' })
    expect(isVisible(Swal.getFooter())).to.be.true

    Swal.fire('Modal w/o footer')
    expect(isHidden(Swal.getFooter())).to.be.true
  })

  it('visual apperarance', () => {
    Swal.fire({
      padding: '2em',
      background: 'red',
      confirmButtonColor: 'green',
      cancelButtonColor: 'blue'
    })

    expect(Swal.getPopup().style.padding).to.equal('2em')
    expect(window.getComputedStyle(Swal.getPopup()).backgroundColor, 'rgb(255, 0).to.equal(0)')
    expect(Swal.getConfirmButton().style.backgroundColor).to.equal('green')
    expect(Swal.getCancelButton().style.backgroundColor).to.equal('blue')
  })

  it('null values', () => {
    const defaultParams = require('../../src/utils/params').default
    const params = {}
    Object.keys(defaultParams).forEach(key => {
      params[key] = null
    })
    Swal.fire(params)
    expect(Swal.isVisible()).to.be.true
  })

  it('backdrop accepts css background param', () => {
    Swal.fire({
      title: 'I have no backdrop',
      backdrop: false
    })
    expect(Swal.getContainer().style.background).to.equal('')

    const backdrop = 'rgb(123, 123, 123)'
    Swal.fire({
      title: 'I have a custom backdrop',
      backdrop
    })
    expect(Swal.getContainer().style.background.includes(backdrop)).to.be.true
  })

  it('preConfirm return false', () => {
    SwalWithoutAnimation.fire({
      preConfirm: () => {
        return false
      }
    })

    Swal.clickConfirm()
    expect(Swal.isVisible()).to.be.true
  })

  it('Custom content', (done) => {
    Swal.fire({
      showCancelButton: true,
      onOpen: () => {
        Swal.getContent().textContent = 'Custom content'
        Swal.clickConfirm()
      },
      preConfirm: () => {
        return 'Some data from custom control'
      }
    }).then(result => {
      expect(result.value).to.equal('Some data from custom control')
      done()
    })
  })

  it('preConfirm returns 0', (done) => {
    SwalWithoutAnimation.fire({
      onOpen: () => {
        Swal.clickConfirm()
      },
      preConfirm: () => {
        return 0
      }
    }).then(result => {
      expect(result.value).to.equal(0)
      done()
    })
  })

  it('Model shows with swal2 classes used in html', () => {
    Swal.fire({
      html: '<span class="swal2-cancel"></span>'
    })
    expect(Swal.getPopup().classList.contains('swal2-show')).to.be.true
    Swal.close()
  })
})

describe('JQuery', () => {
  it('jQuery elements as shorthand params', () => {
    Swal.fire(
      jQuery('<h1>jQuery title</h1>'),
      jQuery('<p>jQuery content</p>')
    )
    expect(Swal.getTitle().innerHTML).to.equal('<h1>jQuery title</h1>')
    expect(Swal.getHtmlContainer().innerHTML).to.equal('<p>jQuery content</p>')
  })

  it('jQuery elements as params', () => {
    Swal.fire({
      title: jQuery('<h1>jQuery title</h1>'),
      html: jQuery('<p>jQuery content</p>'),
      footer: jQuery('<footer>jQuery footer</footer>')
    })
    expect(Swal.getTitle().innerHTML).to.equal('<h1>jQuery title</h1>')
    expect(Swal.getHtmlContainer().innerHTML).to.equal('<p>jQuery content</p>')
    expect(Swal.getFooter().innerHTML).to.equal('<footer>jQuery footer</footer>')
  })
})

describe('Outside click', () => {
  const simulateMouseEvent = (x, y, eventType) => {
    dispatchCustomEvent(
      document.elementFromPoint(x, y),
      eventType,
      { clientX: x, clientY: y }
    )
  }

  it('backdrop click', (done) => {
    SwalWithoutAnimation.fire('Backdrop click').then((result) => {
      expect(result).to.eql({ dismiss: Swal.DismissReason.backdrop })
      done()
    })
    Swal.getContainer().click()
  })

  it('double backdrop click', (done) => {
    const onAfterClose = cy.spy()
    Swal.fire({
      title: 'onAfterClose should be triggered once',
      onAfterClose
    })
    Swal.getContainer().click()
    Swal.getContainer().click()
    setTimeout(() => {
      expect(onAfterClose.calledOnce).to.be.true
      done()
    }, 500)
  })

  it('popup mousedown, backdrop mouseup', (done) => {
    Swal.fire('popup mousedown, backdrop mouseup')
    simulateMouseEvent(1, 1, 'mousedown')
    simulateMouseEvent(window.innerWidth / 2, window.innerHeight / 2, 'mouseup')
    setTimeout(() => {
      expect(Swal.isVisible()).to.be.true
      done()
    })
  })

  it('backdrop mousedown, popup mouseup', (done) => {
    SwalWithoutAnimation.fire('backdrop mousedown, popup mouseup')
    simulateMouseEvent(window.innerWidth / 2, window.innerHeight / 2, 'mousedown')
    simulateMouseEvent(1, 1, 'mouseup')
    setTimeout(() => {
      expect(Swal.isVisible()).to.be.true
      done()
    })
  })

  it('allowOutsideClick: false', (done) => {
    SwalWithoutAnimation.fire({
      title: 'allowOutsideClick: false',
      allowOutsideClick: false
    })
    Swal.getContainer().click()
    setTimeout(() => {
      expect(Swal.isVisible()).to.be.true
      done()
    })
  })

  it('allowOutsideClick: () => !swal.isLoading()', (done) => {
    SwalWithoutAnimation.fire({
      title: 'allowOutsideClick: () => !swal.isLoading()',
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      expect(result).to.eql({ dismiss: Swal.DismissReason.backdrop })
      done()
    })
    Swal.showLoading()
    Swal.getContainer().click()
    setTimeout(() => {
      expect(Swal.isVisible()).to.be.true
      Swal.hideLoading()
      Swal.getContainer().click()
    }, TIMEOUT)
  })

  it('allowOutsideClick: should throw console warning for popups without backdrop', () => {
    const spy = cy.spy(console, 'warn')
    SwalWithoutAnimation.fire({
      title: 'allowOutsideClick is not compatible with modeless popups',
      allowOutsideClick: true,
      backdrop: false
    })
    expect(spy.calledWith('SweetAlert2: "allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`')).to.be.true
  })
})

describe('Queue', () => {
  it('queue', (done) => {
    const steps = ['Step 1', 'Step 2']
    expect(Swal.getQueueStep()).to.equal(null)
    SwalWithoutAnimation.queue(steps).then(() => {
      SwalWithoutAnimation.fire('All done!')
    })
    expect($('.swal2-modal h2').textContent).to.equal('Step 1')
    expect(Swal.getQueueStep()).to.equal('0')
    SwalWithoutAnimation.clickConfirm()
    setTimeout(() => {
      expect($('.swal2-modal h2').textContent).to.equal('Step 2')
      expect(Swal.getQueueStep()).to.equal('1')
      SwalWithoutAnimation.clickConfirm()
      setTimeout(() => {
        expect($('.swal2-modal h2').textContent).to.equal('All done!')
        expect(SwalWithoutAnimation.getQueueStep()).to.equal(null)
        SwalWithoutAnimation.clickConfirm()
        // test queue is cancelled on first step, other steps shouldn't be shown
        SwalWithoutAnimation.queue(steps)
        SwalWithoutAnimation.clickCancel()
        expect(SwalWithoutAnimation.isVisible()).to.be.false
        done()
      }, TIMEOUT)
    }, TIMEOUT)
  })

  it('dynamic queue', (done) => {
    const steps = [
      {
        title: 'Step 1',
        preConfirm: () => {
          return new Promise((resolve) => {
            // insert to the end by default
            Swal.insertQueueStep('Step 3')
            // step to be deleted
            Swal.insertQueueStep('Step to be deleted')
            // insert with positioning
            Swal.insertQueueStep({
              title: 'Step 2',
              preConfirm: () => {
                return new Promise((resolve) => {
                  Swal.deleteQueueStep(3)
                  resolve()
                })
              }
            }, 1)
            resolve()
          })
        }
      }
    ]
    setTimeout(() => {
      SwalWithoutAnimation.queue(steps).then(() => {
        Swal.fire('All done!')
      })

      expect($('.swal2-modal h2').textContent).to.equal('Step 1')
      Swal.clickConfirm()

      setTimeout(() => {
        expect($('.swal2-modal h2').textContent).to.equal('Step 2')
        expect(Swal.getQueueStep()).to.equal('1')
        Swal.clickConfirm()

        setTimeout(() => {
          expect($('.swal2-modal h2').textContent).to.equal('Step 3')
          expect(Swal.getQueueStep()).to.equal('2')
          Swal.clickConfirm()

          setTimeout(() => {
            expect($('.swal2-modal h2').textContent).to.equal('All done!')
            expect(Swal.getQueueStep()).to.equal(null)
            Swal.clickConfirm()
            done()
          }, TIMEOUT)
        }, TIMEOUT)
      }, TIMEOUT)
    }, TIMEOUT)
  })
})

describe('RTL', () => {
  it('container should have .swal2-rtl in case of <body dir="rtl">', () => {
    document.body.setAttribute('dir', 'rtl')
    SwalWithoutAnimation.fire('hi')
    expect(Swal.getContainer().classList.contains('swal2-rtl')).to.be.true
  })

  it('container should have .swal2-rtl in case of <body style="direction: rtl">', () => {
    document.body.style.direction = 'rtl'
    SwalWithoutAnimation.fire('hi')
    expect(Swal.getContainer().classList.contains('swal2-rtl')).to.be.true
  })

  it('container should have .swal2-rtl in case of <div dir="rtl">', () => {
    const targetDiv = document.createElement('div')
    document.body.appendChild(targetDiv)
    targetDiv.setAttribute('dir', 'rtl')
    SwalWithoutAnimation.fire({ target: targetDiv })
    expect(Swal.getContainer().classList.contains('swal2-rtl')).to.be.true
  })

  it('container should have .swal2-rtl in case of <div style="direction: rtl">', () => {
    const targetDiv = document.createElement('div')
    document.body.appendChild(targetDiv)
    targetDiv.style.direction = 'rtl'
    SwalWithoutAnimation.fire({ target: targetDiv })
    expect(Swal.getContainer().classList.contains('swal2-rtl')).to.be.true
  })
})
