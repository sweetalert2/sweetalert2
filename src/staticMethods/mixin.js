/**
 * Returns a wrapped instance of `swal` containing `params` as defaults.
 * Useful for reusing swal configuration.
 *
 * For example:
 *
 * Before:
 * const textPromptOptions = { input: 'text', showCancelButton: true }
 * const {value: firstName} = await swal({ ...textPromptOptions, title: 'What is your first name?' })
 * const {value: lastName} = await swal({ ...textPromptOptions, title: 'What is your last name?' })
 *
 * After:
 * const myTextPrompt = swal.mixin({ input: 'text', showCancelButton: true })
 * const {value: firstName} = await myTextPrompt('What is your first name?')
 * const {value: lastName} = await myTextPrompt('What is your last name?')
 *
 * @param params
 */
export const mixin = function (params) {
  const parentSwal = this
  const childSwal = (...args) =>
    parentSwal(Object.assign({}, params, parentSwal.argsToParams(args)))
  return Object.assign(childSwal, parentSwal)
}
