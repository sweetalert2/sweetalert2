import globalState from '../globalState.js'
import EventEmitter from '../utils/EventEmitter.js'

globalState.eventEmitter = new EventEmitter()

/**
 * @param {string} eventName
 * @param {EventHandler} eventHandler
 */
export const on = (eventName, eventHandler) => {
  globalState.eventEmitter.on(eventName, eventHandler)
}

/**
 * @param {string} eventName
 * @param {EventHandler} eventHandler
 */
export const once = (eventName, eventHandler) => {
  globalState.eventEmitter.once(eventName, eventHandler)
}

/**
 * @param {string} [eventName]
 * @param {EventHandler} [eventHandler]
 */
export const off = (eventName, eventHandler) => {
  // Remove all handlers for all events
  if (!eventName) {
    globalState.eventEmitter.reset()
    return
  }

  if (eventHandler) {
    // Remove a specific handler
    globalState.eventEmitter.removeListener(eventName, eventHandler)
  } else {
    // Remove all handlers for a specific event
    globalState.eventEmitter.removeAllListeners(eventName)
  }
}
