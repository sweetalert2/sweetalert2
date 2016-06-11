import { swalPrefix, swalClasses } from './classes.js';


export var mediaqueryId = swalPrefix + 'mediaquery';

// Remember state in cases where opening and handling a modal will fiddle with it.
export var states = {
    previousDocumentClick: null,
    previousWindowKeyDown: null,
    previousActiveElement: null
};

/*
 * Manipulate DOM
 */
export var elementByClass = function(className) {
  return document.querySelector('.' + className);
};

export var getModal = function() {
  return elementByClass(swalClasses.modal);
};

export var getOverlay = function() {
  return elementByClass(swalClasses.overlay);
};

export var getConfirmButton = function() {
  return elementByClass(swalClasses.confirm);
};

export var getCancelButton = function() {
  return elementByClass(swalClasses.cancel);
};

export var hasClass = function(elem, className) {
  return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
};

export var focusInput = function(input) {
  input.focus();

  // http://stackoverflow.com/a/2345915/1331425
  var val = input.value;
  input.value = '';
  input.value = val;
};

export var addClass = function(elem, className) {
  if (className && !hasClass(elem, className)) {
    elem.className += ' ' + className;
  }
};

export var removeClass = function(elem, className) {
  var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, ' ') + ' ';
  if (hasClass(elem, className)) {
    while (newClass.indexOf(' ' + className + ' ') >= 0) {
      newClass = newClass.replace(' ' + className + ' ', ' ');
    }
    elem.className = newClass.replace(/^\s+|\s+$/g, '');
  }
};

export var getChildByClass = function(elem, className) {
  for (var i = 0; i < elem.childNodes.length; i++) {
    if (elem.childNodes[i].classList.contains(className)) {
      return elem.childNodes[i];
    }
  }
};

export var _show = function(elem) {
  elem.style.opacity = '';
  elem.style.display = 'block';
};

export var show = function(elems) {
  if (elems && !elems.length) {
    return _show(elems);
  }
  for (var i = 0; i < elems.length; ++i) {
    _show(elems[i]);
  }
};

export var _hide = function(elem) {
  elem.style.opacity = '';
  elem.style.display = 'none';
};

export var hide = function(elems) {
  if (elems && !elems.length) {
    return _hide(elems);
  }
  for (var i = 0; i < elems.length; ++i) {
    _hide(elems[i]);
  }
};

export var removeStyleProperty = function(elem, property) {
  if (elem.style.removeProperty) {
    elem.style.removeProperty(property);
  } else {
    elem.style.removeAttribute(property);
  }
};

export var getTopMargin = function(elem) {
  elem.style.left = '-9999px';
  elem.style.display = 'block';

  var height = elem.clientHeight;
  var paddingTop = parseInt(getComputedStyle(elem).getPropertyValue('padding-top'), 10);

  elem.style.left = '';
  elem.style.display = 'none';
  return ('-' + parseInt(height / 2 + paddingTop, 10) + 'px');
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
        _hide(elem);
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
      'MozAnimation': 'animationend',
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
  document.onclick = states.previousDocumentClick;
  if (states.previousActiveElement) {
    states.previousActiveElement.focus();
  }
  clearTimeout(modal.timeout);

  // Remove dynamically created media query
  var head = document.getElementsByTagName('head')[0];
  var mediaquery = document.getElementById(mediaqueryId);
  if (mediaquery) {
    head.removeChild(mediaquery);
  }
};
