import { swalClasses } from '../classes.js'
import { getContainer, getPopup } from './getters.js'
import { addClass, getDirectChildByClass, removeClass, setInnerHtml } from './domUtils.js'
import { isNodeEnv } from '../isNodeEnv.js'
import { error, getRandomElement } from '../utils.js'
import globalState from '../../globalState.js'

const sweetHTML = `
 <div aria-labelledby="${swalClasses.title}" aria-describedby="${swalClasses['html-container']}" class="${swalClasses.popup}" tabindex="-1">
   <button type="button" class="${swalClasses.close}"></button>
   <ul class="${swalClasses['progress-steps']}"></ul>
   <div class="${swalClasses.icon}"></div>
   <img class="${swalClasses.image}" />
   <h2 class="${swalClasses.title}" id="${swalClasses.title}"></h2>
   <div class="${swalClasses['html-container']}" id="${swalClasses['html-container']}"></div>
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
   <div class="${swalClasses.actions}">
     <div class="${swalClasses.loader}"></div>
     <button type="button" class="${swalClasses.confirm}"></button>
     <button type="button" class="${swalClasses.deny}"></button>
     <button type="button" class="${swalClasses.cancel}"></button>
   </div>
   <div class="${swalClasses.footer}"></div>
   <div class="${swalClasses['timer-progress-bar-container']}">
     <div class="${swalClasses['timer-progress-bar']}"></div>
   </div>
 </div>
`.replace(/(^|\n)\s*/g, '')

/**
 * @returns {boolean}
 */
const resetOldContainer = () => {
  const oldContainer = getContainer()
  if (!oldContainer) {
    return false
  }

  oldContainer.remove()
  removeClass(
    [document.documentElement, document.body],
    [swalClasses['no-backdrop'], swalClasses['toast-shown'], swalClasses['has-column']]
  )

  return true
}

const resetValidationMessage = () => {
  globalState.currentInstance.resetValidationMessage()
}

const addInputChangeListeners = () => {
  const popup = getPopup()

  const input = getDirectChildByClass(popup, swalClasses.input)
  const file = getDirectChildByClass(popup, swalClasses.file)
  /** @type {HTMLInputElement} */
  const range = popup.querySelector(`.${swalClasses.range} input`)
  /** @type {HTMLOutputElement} */
  const rangeOutput = popup.querySelector(`.${swalClasses.range} output`)
  const select = getDirectChildByClass(popup, swalClasses.select)
  /** @type {HTMLInputElement} */
  const checkbox = popup.querySelector(`.${swalClasses.checkbox} input`)
  const textarea = getDirectChildByClass(popup, swalClasses.textarea)

  input.oninput = resetValidationMessage
  file.onchange = resetValidationMessage
  select.onchange = resetValidationMessage
  checkbox.onchange = resetValidationMessage
  textarea.oninput = resetValidationMessage

  range.oninput = () => {
    resetValidationMessage()
    rangeOutput.value = range.value
  }

  range.onchange = () => {
    resetValidationMessage()
    rangeOutput.value = range.value
  }
}

/**
 * @param {string | HTMLElement} target
 * @returns {HTMLElement}
 */
const getTarget = (target) => (typeof target === 'string' ? document.querySelector(target) : target)

/**
 * @param {SweetAlertOptions} params
 */
const setupAccessibility = (params) => {
  const popup = getPopup()

  popup.setAttribute('role', params.toast ? 'alert' : 'dialog')
  popup.setAttribute('aria-live', params.toast ? 'polite' : 'assertive')
  if (!params.toast) {
    popup.setAttribute('aria-modal', 'true')
  }
}

/**
 * @param {HTMLElement} targetElement
 */
const setupRTL = (targetElement) => {
  if (window.getComputedStyle(targetElement).direction === 'rtl') {
    addClass(getContainer(), swalClasses.rtl)
  }
}

/**
 * Add modal + backdrop + no-war message for Russians to DOM
 *
 * @param {SweetAlertOptions} params
 */
export const init = (params) => {
  // Clean up the old popup container if it exists
  const oldContainerExisted = resetOldContainer()

  /* istanbul ignore if */
  if (isNodeEnv()) {
    error('SweetAlert2 requires document to initialize')
    return
  }

  const container = document.createElement('div')
  container.className = swalClasses.container
  if (oldContainerExisted) {
    addClass(container, swalClasses['no-transition'])
  }
  setInnerHtml(container, sweetHTML)

  const targetElement = getTarget(params.target)
  targetElement.appendChild(container)

  setupAccessibility(params)
  setupRTL(targetElement)
  addInputChangeListeners()

  noWarMessageForRussians(container, params)
}

/**
 * @param {HTMLElement} container
 * @param {SweetAlertOptions} params
 */
const noWarMessageForRussians = (container, params) => {
  if (params.toast) {
    return
  }
  // This message is targeted at people who are corrupted by propaganda, everybody else
  // is already against war either silently or actively.
  //
  // The point is to wrap the truth-bomb into a patriotic title so they will actually click it
  // and listen to the uncomfortable truth about the war from the people they love or respect.
  const message = getRandomElement([
    {
      text: 'ШВАРЦЕНЕГГЕР обратился <br> к РУССКОМУ НАРОДУ о войне',
      // Arnold is loved in Russia by all people including those who are for this war
      // His speech might change the mind of those who are brainwashed by propaganda
      youtubeId: 'fWClXZd9c78',
    },
    {
      text: 'РУССКИЙ ПАТРИОТ <br> открыл главную тайну спецоперации',
      // In this video one of the most famous Russian nationalist leaders, Dmitry Demushkin,
      // explains that this war has no sense and produces the exact opposite result of what
      // it was intended to do.
      youtubeId: '_RjBNkn88yA',
    },
    {
      text: 'ГЕРОЙ НОВОРОССИИ СТРЕЛКОВ <br> дал оценку ходу спецоперации',
      // In this video Igor Girkin, who played a key role in the annexation of Crimea,
      // explains that this war has failed already and all possible outcomes are bad for Russia.
      youtubeId: 'yUmzQT4C8JY',
    },
    {
      text: 'ФИНСКИЙ ДРУГ РОССИИ <br> говорит ПО-РУССКИ о спецоперации',
      youtubeId: 'hkCYb6edUrQ',
    },
    {
      text: 'ЮРИЙ ПОДОЛЯКА честно <br> о генералах РУССКОЙ АРМИИ',
      youtubeId: 'w4-_8BJKfpk',
    },
    {
      text: 'Полковник ФСБ СТРЕЛКОВ <br> об успехах РОССИИ в спецоперации',
      youtubeId: 'saK5UTKroDA',
    },
  ])
  // The message will only be shown to Russian users visiting Russian sites
  if (/^ru\b/.test(navigator.language) && location.host.match(/\.(ru|su|xn--p1ai)$/)) {
    const noWar = document.createElement('div')
    noWar.className = swalClasses['no-war']
    setInnerHtml(
      noWar,
      `<a href="https://www.youtube.com/watch?v=${message.youtubeId}" target="_blank">${message.text}</a>`
    )
    container.appendChild(noWar)
    container.style.paddingTop = '4em'
  }
}
