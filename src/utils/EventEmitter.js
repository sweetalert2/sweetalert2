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
  _getEventListByName(eventName) {
    if (typeof this.events[eventName] === 'undefined') {
      this.events[eventName] = new Set()
    }
    return this.events[eventName]
  }

  /**
   * @param {string} eventName
   * @param {EventHandler} eventHandler
   */
  on(eventName, eventHandler) {
    this._getEventListByName(eventName).add(eventHandler)
  }

  /**
   * @param {string} eventName
   * @param {EventHandler} eventHandler
   */
  one(eventName, eventHandler) {
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
    this._getEventListByName(eventName).forEach(
      /**
       * @param {EventHandler} eventHandler
       */
      function (eventHandler) {
        eventHandler.apply(this, args)
      }.bind(this)
    )
  }

  /**
   * @param {string} eventName
   * @param {EventHandler} eventHandler
   */
  removeListener(eventName, eventHandler) {
    this._getEventListByName(eventName).delete(eventHandler)
  }

  /**
   * @param {string} eventName
   */
  removeAllListeners(eventName) {
    this._getEventListByName(eventName).clear()
  }

  reset() {
    this.events = {}
  }
}
