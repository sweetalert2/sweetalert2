import { Swal, SwalWithoutAnimation } from '../utils'
import { measureScrollbar } from '../../src/utils/dom/measureScrollbar'

describe('Vertical scrollbar', () => {
  it('should be visible on container and it should be scrolled to top', (done) => {
    SwalWithoutAnimation.fire({
      imageUrl: 'https://placeholder.pics/svg/300x1500',
      imageHeight: 1500,
      imageAlt: 'A tall image',
      onOpen: () => {
        expect(Swal.getContainer().scrollTop).to.equal(0)
        expect(Swal.getContainer().style.overflowY).to.equal('auto')
        done()
      }
    })
  })

  it('should be hidden and the according padding-right should be set', (done) => {
    const talltDiv = document.createElement('div')
    talltDiv.innerHTML = Array(100).join('<div>lorem ipsum</div>')
    document.body.appendChild(talltDiv)
    document.body.style.paddingRight = '30px'

    const scrollbarWidth = measureScrollbar()

    SwalWithoutAnimation.fire({
      title: 'The body has visible scrollbar, I will hide it and adjust padding-right on body',
      onAfterClose: () => {
        expect(bodyStyles.paddingRight).to.equal('30px')
        document.body.removeChild(talltDiv)
        done()
      }
    })
    const bodyStyles = window.getComputedStyle(document.body)

    expect(bodyStyles.paddingRight).to.equal(`${scrollbarWidth + 30}px`)
    expect(bodyStyles.overflow).to.equal('hidden')
    Swal.clickConfirm()
  })

  it('scrollbarPadding disabled', () => {
    const talltDiv = document.createElement('div')
    talltDiv.innerHTML = Array(100).join('<div>lorem ipsum</div>')
    document.body.appendChild(talltDiv)
    document.body.style.paddingRight = '30px'

    SwalWithoutAnimation.fire({
      title: 'Padding right adjustment disabled',
      scrollbarPadding: false,
      onAfterClose: () => {
        document.body.removeChild(talltDiv)
      }
    })

    const bodyStyles = window.getComputedStyle(document.body)
    expect(bodyStyles.paddingRight).to.equal('30px')
    Swal.clickConfirm()
  })

  it('should be restored before a toast is fired after a modal', (done) => {
    const talltDiv = document.createElement('div')
    talltDiv.innerHTML = Array(100).join('<div>lorem ipsum</div>')
    document.body.appendChild(talltDiv)
    document.body.style.paddingRight = '30px'

    SwalWithoutAnimation.fire({
      title: 'The body has visible scrollbar, I will hide it and adjust padding-right on body'
    }).then(() => {
      Swal.fire({
        text: 'Body padding-right should be restored',
        toast: true,
        onOpen: () => {
          expect(bodyStyles.paddingRight).to.equal('30px')
          document.body.removeChild(talltDiv)
          done()
        }
      })
    })

    const bodyStyles = window.getComputedStyle(document.body)
    Swal.clickConfirm()
  })
})
