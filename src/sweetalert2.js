import SweetAlert from './SweetAlert.js'
import { withGlobalDefaults } from './enhancers.js'

const Swal = withGlobalDefaults(SweetAlert)
Swal.default = Swal

export default Swal
