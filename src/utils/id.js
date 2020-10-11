export const swalPrefix = 'swal2-'

export const swalId = () => {
  return Math.random().toString(36).replace('0.', swalPrefix)
}
