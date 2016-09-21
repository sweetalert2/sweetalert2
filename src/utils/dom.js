import { swalPrefix, swalClasses } from './classes.js';
import { sweetContainer } from './default.js';

// Remember state in cases where opening and handling a modal will fiddle with it.
export var states = {
  previousWindowKeyDown: null,
  previousActiveElement: null,
  previousBodyPadding: null
};

/*
 * Manipulate DOM
 */
export var elementByClass = function(className) {
  return sweetContainer.querySelector('.' + className);
};

export var getModal = function() {
  return elementByClass(swalClasses.modal);
};

export var getIcons = function() {
  var modal = getModal();
  return modal.querySelectorAll('.' + swalClasses.icon);
};

export var getSpacer = function() {
  return elementByClass(swalClasses.spacer);
};

export var getProgressSteps = function() {
  return elementByClass(swalClasses.progresssteps);
};

export var getConfirmButton = function() {
  return elementByClass(swalClasses.confirm);
};

export var getCancelButton = function() {
  return elementByClass(swalClasses.cancel);
};

export var getCloseButton = function() {
  return elementByClass(swalClasses.close);
};

export var getFocusableElements = function(focusCancel) {
  var buttons = [getConfirmButton(), getCancelButton()];
  if (focusCancel) {
    buttons.reverse();
  }
  return buttons.concat(Array.prototype.slice.call(
    getModal().querySelectorAll('button:not([class^=' + swalPrefix + ']), input:not([type=hidden]), textarea, select')
  ));
};

export var hasClass = function(elem, className) {
  return elem.classList.contains(className);
};

export var focusInput = function(input) {
  input.focus();

  // place cursor at end of text in text input
  if (input.type !== 'file') {
    // http://stackoverflow.com/a/2345915/1331425
    var val = input.value;
    input.value = '';
    input.value = val;
  }
};

export var addClass = function(elem, className) {
  if (!elem || !className) {
    return;
  }
  var classes = className.split(/\s+/);
  classes.forEach(function(className) {
    elem.classList.add(className);
  });
};

export var removeClass = function(elem, className) {
  if (!elem || !className) {
    return;
  }
  var classes = className.split(/\s+/);
  classes.forEach(function(className) {
    elem.classList.remove(className);
  });
};

export var getChildByClass = function(elem, className) {
  for (var i = 0; i < elem.childNodes.length; i++) {
    if (hasClass(elem.childNodes[i], className)) {
      return elem.childNodes[i];
    }
  }
};

export var show = function(elem, display) {
  if (!display) {
    display = 'block';
  }
  elem.style.opacity = '';
  elem.style.display = display;
};

export var hide = function(elem) {
  elem.style.opacity = '';
  elem.style.display = 'none';
};

export var empty = function(elem) {
  while (elem.firstChild) {
    elem.removeChild(elem.firstChild);
  }
};

// borrowed from jqeury $(elem).is(':visible') implementation
export var isVisible = function(elem) {
  return elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length;
};

export var removeStyleProperty = function(elem, property) {
  if (elem.style.removeProperty) {
    elem.style.removeProperty(property);
  } else {
    elem.style.removeAttribute(property);
  }
};

export var getTopMargin = function(elem) {
  var elemDisplay = elem.style.display;
  elem.style.left = '-9999px';
  elem.style.display = 'block';

  var height = elem.clientHeight;

  elem.style.left = '';
  elem.style.display = elemDisplay;
  return ('-' + parseInt(height / 2, 10) + 'px');
};

export var fadeIn = function(elem, interval) {
  if (+elem.style.opacity < 1) {
    interval = interval || 16;
    elem.style.opacity = 0;
    elem.style.display = 'block';
    var last = +new Date();
    var tick = function() {
      var newOpacity = +elem.style.opacity + (new Date() - last) / 100;
      elem.style.opacity = (newOpacity > 1) ? 1 : newOpacity;
      last = +new Date();

      if (+elem.style.opacity < 1) {
        setTimeout(tick, interval);
      }
    };
    tick();
  }
};

export var fadeOut = function(elem, interval) {
  if (+elem.style.opacity > 0) {
    interval = interval || 16;
    var opacity = elem.style.opacity;
    var last = +new Date();
    var tick = function() {
      var change = new Date() - last;
      var newOpacity = +elem.style.opacity - change / (opacity * 100);
      elem.style.opacity = newOpacity;
      last = +new Date();

      if (+elem.style.opacity > 0) {
        setTimeout(tick, interval);
      } else {
        hide(elem);
      }
    };
    tick();
  }
};

export var fireClick = function(node) {
  // Taken from http://www.nonobtrusive.com/2011/11/29/programatically-fire-crossbrowser-click-event-with-javascript/
  // Then fixed for today's Chrome browser.
  if (typeof MouseEvent === 'function') {
    // Up-to-date approach
    var mevt = new MouseEvent('click', {
      view: window,
      bubbles: false,
      cancelable: true
    });
    node.dispatchEvent(mevt);
  } else if (document.createEvent) {
    // Fallback
    var evt = document.createEvent('MouseEvents');
    evt.initEvent('click', false, false);
    node.dispatchEvent(evt);
  } else if (document.createEventObject) {
    node.fireEvent('onclick');
  } else if (typeof node.onclick === 'function') {
    node.onclick();
  }
};

export var stopEventPropagation = function(e) {
  // In particular, make sure the space bar doesn't scroll the main window.
  if (typeof e.stopPropagation === 'function') {
    e.stopPropagation();
    e.preventDefault();
  } else if (window.event && window.event.hasOwnProperty('cancelBubble')) {
    window.event.cancelBubble = true;
  }
};

export var animationEndEvent = (function() {
  var testEl = document.createElement('div'),
    transEndEventNames = {
      'WebkitAnimation': 'webkitAnimationEnd',
      'OAnimation': 'oAnimationEnd oanimationend',
      'msAnimation': 'MSAnimationEnd',
      'animation': 'animationend'
    };
  for (var i in transEndEventNames) {
    if (transEndEventNames.hasOwnProperty(i) &&
      testEl.style[i] !== undefined) {
      return transEndEventNames[i];
    }
  }

  return false;
})();


// Reset the page to its previous state
export var resetPrevState = function() {
  var modal = getModal();
  window.onkeydown = states.previousWindowKeyDown;
  if (states.previousActiveElement && states.previousActiveElement.focus) {
    states.previousActiveElement.focus();
  }
  clearTimeout(modal.timeout);
};

// Measure width of scrollbar
// https://github.com/twbs/bootstrap/blob/master/js/modal.js#L279-L286
export var measureScrollbar = function() {
  var scrollDiv = document.createElement('div');
  scrollDiv.style.width = '50px';
  scrollDiv.style.height = '50px';
  scrollDiv.style.overflow = 'scroll';
  document.body.appendChild(scrollDiv);
  var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);
  return scrollbarWidth;
};

// JavaScript Debounce Function
// https://davidwalsh.name/javascript-debounce-function
export var debounce = function(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};
