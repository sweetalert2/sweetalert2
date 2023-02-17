/**
 * Main method to create a new SweetAlert2 popup
 *
 * @param  {...SweetAlertOptions} args
 * @returns {Promise<SweetAlertResult>}
 */
export function fire(...args) {
  const Swal = this // eslint-disable-line @typescript-eslint/no-this-alias
  return new Swal(...args)
}
