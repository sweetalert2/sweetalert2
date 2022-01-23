export function fire(...args) {
  const Swal = this // eslint-disable-line @typescript-eslint/no-this-alias
  return new Swal(...args)
}
