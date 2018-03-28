/**
 * Extends a Swal class making it able to be instantiated without the `new` keyword (and thus without `Swal.fire`)
 * @param ParentSwal
 * @returns {NoNewKeywordSwal}
 */
export function withNoNewKeyword (ParentSwal) {
  const NoNewKeywordSwal = function (...args) {
    if (!(this instanceof NoNewKeywordSwal)) {
      return new NoNewKeywordSwal(...args)
    }
    Object.getPrototypeOf(NoNewKeywordSwal).apply(this, args)
  }
  NoNewKeywordSwal.prototype = Object.assign(
    Object.create(ParentSwal.prototype),
    { constructor: NoNewKeywordSwal }
  )
  Object.setPrototypeOf(NoNewKeywordSwal, ParentSwal)
  return NoNewKeywordSwal
}
