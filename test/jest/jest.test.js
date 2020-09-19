const Swal = require('../../dist/sweetalert2')

describe('sweetalert2', () => {
  beforeAll(() => {
    // jest (or more precisely, jsdom) doesn't implement `window.scrollTo` so we need to mock it
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    window.scrollTo = () => {}
  })

  it('resolves', () => {
    return Promise.resolve()
      .then(() => {
        return Swal.fire({
          showClass: {
            popup: '',
            container: ''
          },
          didOpen: () => {
            Swal.clickConfirm()
          }
        })
      })
  })
})
