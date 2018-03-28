import SweetAlert from './SweetAlert'
import { withGlobalDefaults, withNoNewKeyword } from './extensions'

const Swal = withNoNewKeyword(withGlobalDefaults(SweetAlert))
Swal.default = Swal

export default Swal
