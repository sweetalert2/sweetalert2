// Detect Node env
export const isNodeEnv = () => typeof global !== 'undefined' && {}.toString.call(global) === '[object global]'
