let defaults = {}

export function withGlobalDefaults (ParentSwal) {
  class SwalWithGlobalDefaults extends ParentSwal {
    _main (params) {
      return super._main(Object.assign({}, defaults, params))
    }
  }

  return SwalWithGlobalDefaults
}
