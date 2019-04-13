
const { Duplex } = require('stream')

module.exports.map = function (mapfn) {
  const stream = new Duplex({
    write (chunk, encoding, callback) {
      this.push(mapfn(chunk))
      callback()
    },
    read () {}
  })
  return stream
}

function splitBuffer (stream) {
  if (/\r?\n/.test(stream.buffer.toString())) {
    let splitChunks = stream.buffer.split(/\r?\n/)
    for (let i = 0; i < splitChunks.length - 1; i++) {
      stream.push(splitChunks[i])
    }
    stream.buffer = splitChunks[splitChunks.length - 1]
  }
}

module.exports.split = function () {
  const stream = new Duplex({
    write (chunk, encoding, callback) {
      this.buffer = (this.buffer || '') + chunk.toString()
      splitBuffer(this)
      callback()
    },
    read () {}
  })
  return stream
}

module.exports.merge = function (/* streams... */) {
  let toMerge = [].slice.call(arguments)

  const stream = new Duplex({
    write (chunk, encoding, callback) {
      this.push(chunk)
      callback()
    },
    read () {}
  })

  if (toMerge.length) {
    toMerge.forEach(function (e) {
      e.pipe(stream, { end: false })
    })
  }
  return stream
}
