import { swalClasses } from '../classes.js'
import { isSafariOrIOS } from '../iosFix.js'

/**
 * Measure scrollbar width for padding body during modal show/hide
 * https://github.com/twbs/bootstrap/blob/master/js/src/modal.js
 *
 * @returns {Promise<number>}
 */
export const measureScrollbar = async () => {
  const scrollDiv = document.createElement('div')
  scrollDiv.className = swalClasses['scrollbar-measure']
  document.body.appendChild(scrollDiv)
  return new Promise((resolve) => {
    setTimeout(
      () => {
        const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth
        document.body.removeChild(scrollDiv)
        resolve(scrollbarWidth)
      },
      isSafariOrIOS ? 50 : 0 // Safari desktop for some reason wants a timeout
    )
  })
}
