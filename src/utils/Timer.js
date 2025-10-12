export default class Timer {
  /**
   * @param {() => void} callback
   * @param {number} delay
   */
  constructor(callback, delay) {
    this.callback = callback
    this.remaining = delay
    this.running = false

    this.start()
  }

  /**
   * @returns {number}
   */
  start() {
    if (!this.running) {
      this.running = true
      this.started = new Date()
      this.id = setTimeout(this.callback, this.remaining)
    }
    return this.remaining
  }

  /**
   * @returns {number}
   */
  stop() {
    if (this.started && this.running) {
      this.running = false
      clearTimeout(this.id)
      this.remaining -= new Date().getTime() - this.started.getTime()
    }
    return this.remaining
  }

  /**
   * @param {number} n
   * @returns {number}
   */
  increase(n) {
    const running = this.running
    if (running) {
      this.stop()
    }
    this.remaining += n
    if (running) {
      this.start()
    }
    return this.remaining
  }

  /**
   * @returns {number}
   */
  getTimerLeft() {
    if (this.running) {
      this.stop()
      this.start()
    }
    return this.remaining
  }

  /**
   * @returns {boolean}
   */
  isRunning() {
    return this.running
  }
}
