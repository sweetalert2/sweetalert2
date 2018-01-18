export default {
  label: '',
  placeholder: '',
  type: '', // text, textarea, select, file, range, checkbox, radio
  value: '',
  options: {}, // For select. checkbox, radio
  config: {}, // Input specific config (currently only for range)
  validator () { // Promise based validation definition
    return Promise.resolve()
  },
  attributes: {}, // Custom input attributes
  classes: '',
  events: {} // Attach custom events to each input (change, keyup, focus, hover)
}
