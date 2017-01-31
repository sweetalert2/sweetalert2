import { swalClasses, iconTypes } from './classes.js'

export const defaultParams = {
  title: '',
  titleText: '',
  text: '',
  html: '',
  type: null,
  customClass: '',
  animation: true,
  allowOutsideClick: true,
  allowEscapeKey: true,
  showConfirmButton: true,
  showCancelButton: false,
  preConfirm: null,
  confirmButtonText: 'OK',
  confirmButtonColor: '#3085d6',
  confirmButtonClass: null,
  cancelButtonText: 'Cancel',
  cancelButtonColor: '#aaa',
  cancelButtonClass: null,
  buttonsStyling: true,
  reverseButtons: false,
  focusCancel: false,
  showCloseButton: false,
  showLoaderOnConfirm: false,
  imageUrl: null,
  imageWidth: null,
  imageHeight: null,
  imageClass: null,
  timer: null,
  width: 500,
  padding: 20,
  background: '#fff',
  input: null,
  inputPlaceholder: '',
  inputValue: '',
  inputOptions: {},
  inputAutoTrim: true,
  inputClass: null,
  inputAttributes: {},
  inputValidator: null,
  progressSteps: [],
  currentProgressStep: null,
  progressStepsDistance: '40px',
  onOpen: null,
  onClose: null
}

const sweetHTML = `
  <div  role="dialog" aria-labelledby="modalTitleId" aria-describedby="modalContentId" class="${swalClasses.modal}" tabIndex="-1" >
    <ul class="${swalClasses.progresssteps}"></ul>
    <div class="${swalClasses.icon} ${iconTypes.error}">
      <span class="x-mark"><span class="line left"></span><span class="line right"></span></span>
    </div>
    <div class="${swalClasses.icon} ${iconTypes.question}">?</div>
    <div class="${swalClasses.icon} ${iconTypes.warning}">!</div>
    <div class="${swalClasses.icon} ${iconTypes.info}">i</div>
    <div class="${swalClasses.icon} ${iconTypes.success}">
      <span class="line tip"></span> <span class="line long"></span>
      <div class="placeholder"></div> <div class="fix"></div>
    </div>
    <img class="${swalClasses.image}">
    <h2 class="${swalClasses.title}" id="modalTitleId"></h2>
    <div id="modalContentId" class="${swalClasses.content}"></div>
    <input class="${swalClasses.input}">
    <input type="file" class="${swalClasses.file}">
    <div class="${swalClasses.range}">
      <output></output>
      <input type="range">
    </div>
    <select class="${swalClasses.select}"></select>
    <div class="${swalClasses.radio}"></div>
    <label for="${swalClasses.checkbox}" class="${swalClasses.checkbox}">
      <input type="checkbox">
    </label>
    <textarea class="${swalClasses.textarea}"></textarea>
    <div class="${swalClasses.validationerror}"></div>
    <hr class="${swalClasses.spacer}">
    <button type="button" role="button" tabIndex="0" class="${swalClasses.confirm}">OK</button>
    <button type="button" role="button" tabIndex="0" class="${swalClasses.cancel}">Cancel</button>
    <span class="${swalClasses.close}">&times;</span>
  </div>
`.replace(/(^|\n)\s*/g, '')

export let sweetContainer

const existingSweetContainers = document.getElementsByClassName(swalClasses.container)

if (existingSweetContainers.length) {
  sweetContainer = existingSweetContainers[0]
} else {
  sweetContainer = document.createElement('div')
  sweetContainer.className = swalClasses.container
  sweetContainer.innerHTML = sweetHTML
}
