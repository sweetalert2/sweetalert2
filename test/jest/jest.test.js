const Swal = require('../../dist/sweetalert2')

describe('sweetalert2', () => {
  beforeAll(() => {
    // jest (or more precisely, jsdom) doesn't implement `window.scrollTo` so we need to mock it
    window.scrollTo = () => {}
  })

  it('resolves', () => {
    return Promise.resolve()
      .then(() => {
        return Swal.fire({
          animation: false,
          onOpen: () => {
            Swal.clickConfirm()
          }
        })
      })
  })
})
