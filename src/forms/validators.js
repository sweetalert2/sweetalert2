/**
 * Perform a basic regex text against a value
 *
 * @param value
 * @param regex
 * @param errorMessage
 *
 * @return {Promise<any>}
 */
export const regexTest = (value, regex, errorMessage) => {
  return new Promise((resolve, reject) => {
    if (!regex.test(value)) {
      return reject(errorMessage)
    }
    resolve()
  })
}

/**
 * Validate an email address
 *
 * @param value
 *
 * @return {Promise<any>}
 */
export const email = (value) => {
  return regexTest(
    value,
    /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]{2,24}$/,
    'Invalid email address'
  )
}

/**
 * Validate a url
 *
 * @param value
 *
 * @return {Promise<any>}
 */
export const url = (value) => {
  return regexTest(
    value,
    // taken from https://stackoverflow.com/a/3809435/1331425
    /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/,
    'Invalid URL'
  )
}
