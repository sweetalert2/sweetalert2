import Swal from 'sweetalert2'

Swal.fire().then(({ dismiss }) => {
  alert(dismiss === Swal.DismissReason.timer) // #2883
})

Swal.showLoading(Swal.getConfirmButton())
