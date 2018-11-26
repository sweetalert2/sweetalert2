
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

module.exports.split = function () {
  const stream = new Duplex({
    write (chunk, encoding, callback) {
      this.buffer = (this.buffer || '') + chunk.toString()
      if (/\r?\n/.test(chunk.toString())) {
        let splitChunks = this.buffer.split(/\r?\n/)
        for (let i = 0; i < splitChunks.length - 1; i++) {
          this.push(splitChunks[i])
        }        
        this.buffer = splitChunks[splitChunks.length -1]
      }
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
    read() {}
  })
  
  if (toMerge.length) {
    toMerge.forEach(function (e) {
      e.pipe(stream, { end: false })
    })
  } 
  return stream
}