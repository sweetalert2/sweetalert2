import SweetAlert from './SweetAlert.js'
import { withGlobalDefaults, withNoNewKeyword } from './enhancers.js'

const Swal = withNoNewKeyword(withGlobalDefaults(SweetAlert))
Swal.default = Swal

export default Swal
