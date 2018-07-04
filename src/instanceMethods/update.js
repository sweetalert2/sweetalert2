import privateProps from '../privateProps'

/**
 * Updates popup options. The popup will be reinitialized and
 * all user changes (e.g. input values) will be lost.
 */
export function update (params) {
  const innerParams = privateProps.innerParams.get(this)
  const updatedParams = Object.assign({}, innerParams, params)

  // The whole another popup will be initialized by this._main(updatedParams)
  // But, because of disabled animations, for end-users it will look like
  // it's the same popup with the dynamically updated content.
  const previousAnimation = updatedParams.animation
  updatedParams.animation = false
  this._main(updatedParams)
  updatedParams.animation = previousAnimation

  privateProps.innerParams.set(this, updatedParams)
}
