import { error } from '../utils/utils.js'

export const argsToParams = (args) => {
  const params = {}
  switch (typeof args[0]) {
    case 'string':
      ['title', 'html', 'type'].forEach((name, index) => {
        if (args[index] !== undefined) {
          params[name] = args[index]
        }
      })
      break

    case 'object':
      Object.assign(params, args[0])
      break

    default:
      error('Unexpected type of argument! Expected "string" or "object", got ' + typeof args[0])
      return false
  }
  return params
}
