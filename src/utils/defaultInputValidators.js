export default {
  email: (string, validationMessage) => {
    return /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]{2,24}$/.test(string)
      ? Promise.resolve()
      : Promise.resolve(validationMessage || 'Invalid email address')
  },
  url: (string, validationMessage) => {
    try {
      new URL(string) // eslint-disable-line no-new
      return Promise.resolve()
    } catch (e) {
      return Promise.resolve(validationMessage || 'Invalid URL')
    }
  }
}
