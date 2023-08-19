/// <reference types="cypress" />

import { Swal, SwalWithoutAnimation, ensureClosed } from '../utils'
import { measureScrollbar } from '../../src/utils/scrollbar'
import { SHOW_CLASS_TIMEOUT } from '../../src/utils/openPopup'

describe('Vertical scrollbar', () => {
  it('should be visible on container and it should be scrolled to top', (done) => {
    SwalWithoutAnimation.fire({
      imageUrl: 'https://placeholder.pics/svg/300x1500',
      imageHeight: 1500,
      imageAlt: 'A tall image',
      didOpen: () => {
        expect(Swal.getContainer().scrollTop).to.equal(0)
        setTimeout(() => {
          expect(Swal.getContainer().style.overflowY).to.equal('auto')
          Swal.close()
          done()
        }, SHOW_CLASS_TIMEOUT)
      },
    })
  })

  it('should be hidden and the according padding-right should be set', (done) => {
    ensureClosed()
    const talltDiv = document.createElement('div')
    talltDiv.innerHTML = Array(100).join('<div>lorem ipsum</div>')
    document.body.appendChild(talltDiv)
    document.body.style.paddingRight = '30px'

    const scrollbarWidth = measureScrollbar()

    SwalWithoutAnimation.fire({
      title: 'The body has visible scrollbar, I will hide it and adjust padding-right on body',
      didClose: () => {
        expect(bodyStyles.paddingRight).to.equal('30px')
        document.body.removeChild(talltDiv)
        done()
      },
    })

    const bodyStyles = window.getComputedStyle(document.body)
    expect(bodyStyles.paddingRight).to.equal(`${scrollbarWidth + 30}px`)
    expect(bodyStyles.overflow).to.equal('hidden')
    Swal.close()
  })

  it('scrollbarPadding disabled', () => {
    const talltDiv = document.createElement('div')
    talltDiv.innerHTML = Array(100).join('<div>lorem ipsum</div>')
    document.body.appendChild(talltDiv)
    document.body.style.paddingRight = '30px'

    SwalWithoutAnimation.fire({
      title: 'Padding right adjustment disabled',
      scrollbarPadding: false,
      didClose: () => {
        document.body.removeChild(talltDiv)
      },
    })

    const bodyStyles = window.getComputedStyle(document.body)
    expect(bodyStyles.paddingRight).to.equal('30px')
    Swal.close()
  })

  it('should adjust body padding if overflow-y: scroll is set on body', () => {
    document.body.innerHTML = ''
    document.body.style.overflowY = 'scroll'
    document.body.style.paddingRight = '30px'

    const scrollbarWidth = measureScrollbar()

    SwalWithoutAnimation.fire({
      title: 'no padding right adjustment when overflow-y: scroll is set on body',
      didClose: () => {
        document.body.removeChild(talltDiv)
      },
    })

    const bodyStyles = window.getComputedStyle(document.body)
    expect(bodyStyles.paddingRight).to.equal(`${scrollbarWidth + 30}px`)
  })

  it('should be restored before a toast is fired after a modal', (done) => {
    const talltDiv = document.createElement('div')
    talltDiv.innerHTML = Array(100).join('<div>lorem ipsum</div>')
    document.body.appendChild(talltDiv)
    document.body.style.paddingRight = '30px'

    SwalWithoutAnimation.fire({
      title: 'The body has visible scrollbar, I will hide it and adjust padding-right on body',
    }).then(() => {
      Swal.fire({
        text: 'Body padding-right should be restored',
        toast: true,
        didOpen: () => {
          expect(bodyStyles.paddingRight).to.equal('30px')
          document.body.removeChild(talltDiv)
          done()
        },
      })
    })

    const bodyStyles = window.getComputedStyle(document.body)
    Swal.close()
  })

  it('should not add body padding if body has overflow-y: hidden', () => {
    const talltDiv = document.createElement('div')
    talltDiv.innerHTML = Array(100).join('<div>lorem ipsum</div>')
    document.body.appendChild(talltDiv)
    document.body.style.paddingRight = '0px'
    document.body.style.overflowY = 'hidden'

    SwalWithoutAnimation.fire()

    const bodyStyles = window.getComputedStyle(document.body)
    expect(bodyStyles.paddingRight).to.equal('0px')
    document.body.removeChild(talltDiv)
    Swal.close()
  })
})
