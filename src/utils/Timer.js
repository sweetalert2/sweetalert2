export default class Timer {
  constructor(callback, delay) {
    this.callback = callback
    this.remaining = delay
    this.running = false

    this.start()
  }

  start() {
    if (!this.running) {
      this.running = true
      this.started = new Date()
      this.id = setTimeout(this.callback, this.remaining)
    }
    return this.remaining
  }

  stop() {
    if (this.running) {
      this.running = false
      clearTimeout(this.id)
      this.remaining -= new Date().getTime() - this.started.getTime()
    }
    return this.remaining
  }

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

  getTimerLeft() {
    if (this.running) {
      this.stop()
      this.start()
    }
    return this.remaining
  }

  isRunning() {
    return this.running
  }
}
