const toUpper = (_, c) => c ? c.toUpperCase() : ''
const classifyRE = /(?:^|[-_/])(\w)/g

function classify (str) {
  return str.replace(classifyRE, toUpper)
}

module.exports = classify
