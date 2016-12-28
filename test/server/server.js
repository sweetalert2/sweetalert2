const path = require('path')
const express = require('express')

// CSP test
const headerMiddleware = (req,res,next) => {
  res.header('Content-Security-Policy', 'style-src \'self\'')
  req.headers['if-none-match'] = 'no-match-for-this' // disable 304
  next()
}

const app = express()
app.use(headerMiddleware)
app.use(express.static('../../dist'))
app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})
app.listen(8080, () => {
  console.log('Listening on :8080')
})
