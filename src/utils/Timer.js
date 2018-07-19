import * as dom from './dom/index'
import { warn } from './utils.js'
import { swalClasses } from './classes'

export default class Timer {
  constructor (callback, delay, format) {
    let id
    let needTip = false
    let remaining = delay
    let tip = dom.getTimerTip()
    this.init = function () {
      let self = this
      if (typeof format === 'string') {
        if (format) {
          if (format.indexOf('{%d}') > -1) {
            needTip = true
          } else {
            warn('wrong time format, please use {%d} instead of your timer delay')
          }
        }
      } else {
        warn('wrong time format, it should be String')
      }
      function timeout () {
        if (id) {
          clearTimeout(id)
        }
        if (remaining <= 0) {
          callback()
          return
        }
        if (needTip) {
          self.addTip()
        }
        if (remaining < 1000) {
          id = setTimeout(timeout, remaining)
          remaining = 0
        } else {
          id = setTimeout(timeout, 1000)
          remaining -= 1000
        }
      }
      timeout()
    }
    this.addTip = function () {
      if (!tip) {
        tip = document.createElement('span')
        dom.addClass(tip, swalClasses['timer-tip'])
        let parent = dom.getActions()
        if (parent) {
          parent.appendChild(tip)
          parent.style.position = 'relative'
          tip.style.position = 'absolute'
        }
      }
      let html = format.replace('{%d}', parseInt(remaining / 1000))
      tip.innerHTML = html
    }
    this.init()
  }
}
