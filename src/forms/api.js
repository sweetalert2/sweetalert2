import { closest, getControlsWrapper, getControl } from '../utils/dom'
import { createControl, enableInputLoading } from './builder'
import { prefixItem } from '../utils/classes'
import params from '../utils/params'

const formsApi = {}

/**
 * Add an input to the top of the form
 *
 * @param controlObject
 */
formsApi.prependInput = (controlObject) => {
  let control = createControl(controlObject)
  getControlsWrapper().insertBefore(control, getControlsWrapper().childNodes[0])

  params.inputs.unshift(controlObject)
}

/**
 * Add an input to the bottom of the form
 *
 * @param controlObject
 */
formsApi.addInput = formsApi.appendInput = (controlObject) => {
  let control = createControl(controlObject)
  getControlsWrapper().appendChild(control)
  if (controlObject.options) {
    enableInputLoading(controlObject.name)
  }

  params.inputs.push(controlObject)
}

/**
 * Add control after a specific input
 *
 * @param after
 * @param controlObject
 */
formsApi.addInputAfter = (after, controlObject) => {
  let selectedControl = closest(getControl(after), prefixItem('form-control'))
  let control = createControl(controlObject)
  let index = params.inputs.findIndex((input) => input.name === after)

  selectedControl.parentNode.insertBefore(control, selectedControl.nextSibling)
  params.inputs.splice(index, 0, controlObject)
}

/**
 * Add control before a specific input
 *
 * @param before
 * @param controlObject
 */
formsApi.addInputBefore = (before, controlObject) => {
  let index = params.inputs.findIndex((input) => input.name === before)
  if (index === 0) {
    formsApi.prependInput(controlObject)
    return
  }

  let selectedControl = closest(getControl(before), prefixItem('form-control'))
  let control = createControl(controlObject)

  selectedControl.parentNode.insertBefore(control, selectedControl)

  params.inputs.splice(index - 1, 0, controlObject)
}

/**
 * Remove a specific input
 *
 * @param name
 */
formsApi.removeInput = (name) => {
  let selectedControl = closest(getControl(name), prefixItem('form-control'))
  let index = params.inputs.findIndex((input) => input.name === name)

  selectedControl.remove()
  params.inputs.splice(index, 1)
}

/**
 * Return the inputs array
 *
 * @return {Array}
 */
formsApi.getInputs = () => {
  return params.inputs
}

export default formsApi
