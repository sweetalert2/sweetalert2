import * as dom from './dom/index.js'

export const fixScrollbar = () => {
  // for queues, do not do this more than once
  if (dom.states.previousBodyPadding !== null) {
    return
  }
  // if the body has overflow
  if (document.body.scrollHeight > window.innerHeight) {
    // add padding so the content doesn't shift after removal of scrollbar
    const t0 = performance.now()
    dom.states.previousBodyPadding = parseInt(window.getComputedStyle(document.body).getPropertyValue('padding-right'))
    document.body.style.paddingRight = `${dom.states.previousBodyPadding + dom.measureScrollbar()}px`
    const t1 = performance.now()
    const div = document.createElement('div')
    div.innerHTML = `${(t1 - t0)}`
    document.querySelector('#performance').appendChild(div)
  }
}

export const undoScrollbar = () => {
  if (dom.states.previousBodyPadding !== null) {
    document.body.style.paddingRight = `${dom.states.previousBodyPadding}px`
    dom.states.previousBodyPadding = null
  }
}
