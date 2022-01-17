/**
 * Detect Node env
 *
 * @returns {boolean}
 */
export const isNodeEnv = () => typeof window === 'undefined' || typeof document === 'undefined'
