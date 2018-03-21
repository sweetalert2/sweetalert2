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
export const mixin = function (mixinParams) {
  const ParentSwal = this
  function ChildSwal (...args) {
    if (!(this instanceof ChildSwal)) {
      return new ChildSwal(...args)
    }
    ParentSwal.apply(this, args)
  }
  ChildSwal.prototype = Object.create(ParentSwal.prototype)
  ChildSwal.prototype.constructor = ChildSwal
  ChildSwal.prototype._main = function (params) {
    return ParentSwal.prototype._main.call(this, Object.assign({}, mixinParams, params))
  }
  Object.assign(ChildSwal, ParentSwal) // static methods
  return ChildSwal
}
