export default class Timer {
  constructor (callback, delay) {
    let id, started, remaining = delay
    this.running = false

    this.start = function () {
      this.running = true
      started = new Date()
      id = setTimeout(callback, remaining)
      return remaining
    }

    this.stop = function () {
      this.running = false
      clearTimeout(id)
      remaining -= new Date() - started
      return remaining
    }

    this.increase = function (n) {
      this.stop()
      remaining += n
      return this.start()
    }

    this.getTimerLeft = function () {
      if (this.running) {
        this.stop()
        this.start()
      }
      return remaining
    }

    this.start()
  }
}
