import SweetAlert from './SweetAlert'
import { withNoNewKeyword } from './extensions'

const Swal = withNoNewKeyword(SweetAlert)
Swal.default = Swal

export default Swal
