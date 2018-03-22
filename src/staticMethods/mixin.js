/**
 * Returns an extended version of `Swal` containing `params` as defaults.
 * Useful for reusing Swal configuration.
 *
 * For example:
 *
 * Before:
 * const textPromptOptions = { input: 'text', showCancelButton: true }
 * const {value: firstName} = await Swal({ ...textPromptOptions, title: 'What is your first name?' })
 * const {value: lastName} = await Swal({ ...textPromptOptions, title: 'What is your last name?' })
 *
 * After:
 * const TextPrompt = Swal.mixin({ input: 'text', showCancelButton: true })
 * const {value: firstName} = await TextPrompt.fire('What is your first name?')
 * const {value: lastName} = await TextPrompt.fire('What is your last name?')
 *
 * @param params
 */
export function mixin (mixinParams) {
  const Swal = this
  return class MixinSwal extends Swal {
    _main (params) {
      return super._main(Object.assign({}, mixinParams, params))
    }
  }
}
