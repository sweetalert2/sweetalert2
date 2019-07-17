import { swalClasses, iconTypes } from '../classes.js'
import { getContainer, getPopup, getContent } from './getters.js'
import { addClass, removeClass, getChildByClass } from './domUtils.js'
import { isNodeEnv } from '../isNodeEnv.js'
import { error } from '../utils.js'
import sweetAlert from '../../sweetalert2.js'

const sweetHTML = `
 <div aria-labelledby="${swalClasses.title}" aria-describedby="${swalClasses.content}" class="${swalClasses.popup}" tabindex="-1">
   <div class="${swalClasses.header}">
     <ul class="${swalClasses['progress-steps']}"></ul>
     <div class="${swalClasses.icon} ${iconTypes.error}">
       <span class="swal2-x-mark"><span class="swal2-x-mark-line-left"></span><span class="swal2-x-mark-line-right"></span></span>
     </div>
     <div class="${swalClasses.icon} ${iconTypes.question}"></div>
     <div class="${swalClasses.icon} ${iconTypes.warning}"></div>
     <div class="${swalClasses.icon} ${iconTypes.info}"></div>
     <div class="${swalClasses.icon} ${iconTypes.success}">
       <div class="swal2-success-circular-line-left"></div>
       <span class="swal2-success-line-tip"></span> <span class="swal2-success-line-long"></span>
       <div class="swal2-success-ring"></div> <div class="swal2-success-fix"></div>
       <div class="swal2-success-circular-line-right"></div>
     </div>
     <img class="${swalClasses.image}" />
     <h2 class="${swalClasses.title}" id="${swalClasses.title}"></h2>
     <button type="button" class="${swalClasses.close}"></button>
   </div>
   <div class="${swalClasses.content}">
     <div id="${swalClasses.content}"></div>
     <input class="${swalClasses.input}" />
     <input type="file" class="${swalClasses.file}" />
     <div class="${swalClasses.range}">
       <input type="range" />
       <output></output>
     </div>
     <select class="${swalClasses.select}"></select>
     <div class="${swalClasses.radio}"></div>
     <label for="${swalClasses.checkbox}" class="${swalClasses.checkbox}">
       <input type="checkbox" />
       <span class="${swalClasses.label}"></span>
     </label>
     <textarea class="${swalClasses.textarea}"></textarea>
     <div class="${swalClasses['validation-message']}" id="${swalClasses['validation-message']}"></div>
   </div>
   <div class="${swalClasses.actions}">
     <button type="button" class="${swalClasses.confirm}">OK</button>
     <button type="button" class="${swalClasses.cancel}">Cancel</button>
   </div>
   <div class="${swalClasses.footer}">
   </div>
 </div>
`.replace(/(^|\n)\s*/g, '')

const resetOldContainer = () => {
  const oldContainer = getContainer()
  if (!oldContainer) {
    return
  }

  oldContainer.parentNode.removeChild(oldContainer)
  removeClass(
    [document.documentElement, document.body],
    [
      swalClasses['no-backdrop'],
      swalClasses['toast-shown'],
      swalClasses['has-column']
    ]
  )
}

let oldInputVal // IE11 workaround, see #1109 for details
const resetValidationMessage = (e) => {
  if (sweetAlert.isVisible() && oldInputVal !== e.target.value) {
    sweetAlert.resetValidationMessage()
  }
  oldInputVal = e.target.value
}

const addInputChangeListeners = () => {
  const content = getContent()

  const input = getChildByClass(content, swalClasses.input)
  const file = getChildByClass(content, swalClasses.file)
  const range = content.querySelector(`.${swalClasses.range} input`)
  const rangeOutput = content.querySelector(`.${swalClasses.range} output`)
  const select = getChildByClass(content, swalClasses.select)
  const checkbox = content.querySelector(`.${swalClasses.checkbox} input`)
  const textarea = getChildByClass(content, swalClasses.textarea)

  input.oninput = resetValidationMessage
  file.onchange = resetValidationMessage
  select.onchange = resetValidationMessage
  checkbox.onchange = resetValidationMessage
  textarea.oninput = resetValidationMessage

  range.oninput = (e) => {
    resetValidationMessage(e)
    rangeOutput.value = range.value
  }

  range.onchange = (e) => {
    resetValidationMessage(e)
    range.nextSibling.value = range.value
  }
}

const getTarget = (target) => typeof target === 'string' ? document.querySelector(target) : target

const setupAccessibility = (params) => {
  const popup = getPopup()

  popup.setAttribute('role', params.toast ? 'alert' : 'dialog')
  popup.setAttribute('aria-live', params.toast ? 'polite' : 'assertive')
  if (!params.toast) {
    popup.setAttribute('aria-modal', 'true')
  }
}

const setupRTL = (targetElement) => {
  if (window.getComputedStyle(targetElement).direction === 'rtl') {
    addClass(getContainer(), swalClasses.rtl)
  }
}

/*
 * Add modal + backdrop to DOM
 */
export const init = (params) => {
  // Clean up the old popup container if it exists
  resetOldContainer()

  /* istanbul ignore if */
  if (isNodeEnv()) {
    error('SweetAlert2 requires document to initialize')
    return
  }

  const container = document.createElement('div')
  container.className = swalClasses.container
  container.innerHTML = sweetHTML

  const targetElement = getTarget(params.target)
  targetElement.appendChild(container)

  setupAccessibility(params)
  setupRTL(targetElement)
  addInputChangeListeners()
}
