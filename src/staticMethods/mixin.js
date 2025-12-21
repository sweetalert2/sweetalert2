/**
 * Returns an extended version of `Swal` containing `params` as defaults.
 * Useful for reusing Swal configuration.
 *
 * For example:
 *
 * Before:
 * const textPromptOptions = { input: 'text', showCancelButton: true }
 * const {value: firstName} = await Swal.fire({ ...textPromptOptions, title: 'What is your first name?' })
 * const {value: lastName} = await Swal.fire({ ...textPromptOptions, title: 'What is your last name?' })
 *
 * After:
 * const TextPrompt = Swal.mixin({ input: 'text', showCancelButton: true })
 * const {value: firstName} = await TextPrompt('What is your first name?')
 * const {value: lastName} = await TextPrompt('What is your last name?')
 *
 * @param {SweetAlertOptions} mixinParams
 * @returns {SweetAlert}
 * @this {typeof import('../SweetAlert.js').SweetAlert}
 */
export function mixin(mixinParams) {
  // @ts-ignore: 'this' refers to the SweetAlert constructor
  class MixinSwal extends this {
    /**
     * @param {any} params
     * @param {any} priorityMixinParams
     */
    _main(params, priorityMixinParams) {
      return super._main(params, Object.assign({}, mixinParams, priorityMixinParams))
    }
  }
  // @ts-ignore
  return MixinSwal
}
