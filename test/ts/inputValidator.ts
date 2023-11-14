import Swal from 'sweetalert2'

// https://www.totaltypescript.com/how-to-test-your-types
type Expect<T extends true> = T
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false

Swal.fire({
  input: 'text',
  inputValidator: (inputValue) => {
    type _ = Expect<Equal<typeof inputValue, string>>
  },
})

Swal.fire({
  input: 'file',
  inputValidator: (inputValue) => {
    type _ = Expect<Equal<typeof inputValue, File | FileList | null>>
  },
})
