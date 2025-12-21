/**
 * Main method to create a new SweetAlert2 popup
 *
 * @this {new (...args: any[]) => any}
 * @param  {...SweetAlertOptions} args
 * @returns {Promise<SweetAlertResult>}
 */
export function fire(...args) {
  return new this(...args)
}
