// Source: https://gist.github.com/mudge/5830382?permalink_comment_id=2691957#gistcomment-2691957

export default class EventEmitter {
  constructor() {
    /** @type {Events} */
    this.events = {}
  }

  /**
   * @param {string} eventName
   * @returns {EventHandlers}
   */
  _getHandlersByEventName(eventName) {
    if (typeof this.events[eventName] === 'undefined') {
      // not Set because we need to keep the FIFO order
      // https://github.com/sweetalert2/sweetalert2/pull/2763#discussion_r1748990334
      this.events[eventName] = []
    }
    return this.events[eventName]
  }

  /**
   * @param {string} eventName
   * @param {EventHandler} eventHandler
   */
  on(eventName, eventHandler) {
    const currentHandlers = this._getHandlersByEventName(eventName)
    if (!currentHandlers.includes(eventHandler)) {
      currentHandlers.push(eventHandler)
    }
  }

  /**
   * @param {string} eventName
   * @param {EventHandler} eventHandler
   */
  once(eventName, eventHandler) {
    /**
     * @param {Array} args
     */
    const onceFn = (...args) => {
      this.removeListener(eventName, onceFn)
      eventHandler.apply(this, args)
    }
    this.on(eventName, onceFn)
  }

  /**
   * @param {string} eventName
   * @param {Array} args
   */
  emit(eventName, ...args) {
    this._getHandlersByEventName(eventName).forEach(
      /**
       * @param {EventHandler} eventHandler
       */
      (eventHandler) => {
        try {
          eventHandler.apply(this, args)
        } catch (error) {
          console.error(error)
        }
      }
    )
  }

  /**
   * @param {string} eventName
   * @param {EventHandler} eventHandler
   */
  removeListener(eventName, eventHandler) {
    const currentHandlers = this._getHandlersByEventName(eventName)
    const index = currentHandlers.indexOf(eventHandler)
    if (index > -1) {
      currentHandlers.splice(index, 1)
    }
  }

  /**
   * @param {string} eventName
   */
  removeAllListeners(eventName) {
    if (this.events[eventName] !== undefined) {
      // https://github.com/sweetalert2/sweetalert2/pull/2763#discussion_r1749239222
      this.events[eventName].length = 0
    }
  }

  reset() {
    this.events = {}
  }
}
