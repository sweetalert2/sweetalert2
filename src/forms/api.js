import { closest, getInput, getInputsWrapper } from '../utils/dom'
import { createControl } from './builder'
import { swalClasses } from '../utils/classes'

const formsApi = {}

/**
 * Add an input to the top of the form
 *
 * @param name
 * @param controlObject
 */
formsApi.prependInput = (name, controlObject) => {
  let control = createControl(name, controlObject)
  getInputsWrapper().insertBefore(control, getInputsWrapper().childNodes[0])
}

/**
 * Add an input to the bottom of the form
 *
 * @param name
 * @param controlObject
 */
formsApi.addInput = formsApi.appendInput = (name, controlObject) => {
  let control = createControl(name, controlObject)
  getInputsWrapper().appendChild(control)
}

/**
 * Add control after a specific input
 *
 * @param after
 * @param name
 * @param controlObject
 */
formsApi.addInputAfter = (after, name, controlObject) => {
  let selectedControl = closest(getInput(after), swalClasses['form-control'])
  let control = createControl(name, controlObject)

  selectedControl.parentNode.insertBefore(control, selectedControl.nextSibling)
}

/**
 * Add control before a specific input
 *
 * @param before
 * @param name
 * @param controlObject
 */
formsApi.addInputBefore = (before, name, controlObject) => {
  let selectedControl = closest(getInput(before), swalClasses['form-control'])
  let control = createControl(name, controlObject)

  selectedControl.parentNode.insertBefore(control, selectedControl)
}

/**
 * Remove a specific input
 *
 * @param name
 */
formsApi.removeInput = (name) => {
  let selectedControl = closest(getInput(name), swalClasses['form-control'])

  selectedControl.remove()
}

export default formsApi
