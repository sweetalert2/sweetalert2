/**
 * Adapt a legacy inputValidator for use with expectRejections=false
 */
export const adaptInputValidator = (legacyValidator) => {
  return function adaptedInputValidator (inputValue, validationMessage) {
    return legacyValidator.call(this, inputValue, validationMessage)
      .then(() => undefined, validationMessage => validationMessage)
  }
}
