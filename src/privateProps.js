/**
 * This module containts `WeakMap`s for each effectively-"private  property" that a `swal` has.
 * For example, to set the private property "foo" of `this` to "bar", you can `privateProps.foo.set(this, 'bar')`
 * This is the approach that Babel will probably take to implement private methods/fields
 *   https://github.com/tc39/proposal-private-methods
 *   https://github.com/babel/babel/pull/7555
 * Once we have the changes from that PR in Babel, and our core class fits reasonable in *one module*
 *   then we can use that language feature.
 */

// WeakMap polyfill, needed for Android 4.4
// Related issue: https://github.com/sweetalert2/sweetalert2/issues/1071
if (typeof window !== 'undefined' && typeof window.WeakMap !== 'function') {
  // https://github.com/Riim/symbol-polyfill/blob/master/index.js
  let idCounter = 0
  window.Symbol = function Symbol (key) {
    return '__' + key + '_' + Math.floor(Math.random() * 1e9) + '_' + (++idCounter) + '__'
  }
  Symbol.iterator = Symbol('Symbol.iterator')

  // http://webreflection.blogspot.fi/2015/04/a-weakmap-polyfill-in-20-lines-of-code.html
  window.WeakMap = (function (s, dP, hOP) {
    function WeakMap () {
      dP(this, s, {value: Symbol('WeakMap')})
    }
    WeakMap.prototype = {
      'delete': function del (o) {
        delete o[this[s]]
      },
      get: function get (o) {
        return o[this[s]]
      },
      has: function has (o) {
        return hOP.call(o, this[s])
      },
      set: function set (o, v) {
        dP(o, this[s], {configurable: true, value: v})
      }
    }
    return WeakMap
  }(Symbol('WeakMap'), Object.defineProperty, {}.hasOwnProperty))
}

export default {
  promise: new WeakMap(),
  innerParams: new WeakMap(),
  domCache: new WeakMap()
}
