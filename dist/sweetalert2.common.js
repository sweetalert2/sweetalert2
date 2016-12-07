/*!
 * sweetalert2 v6.2.1
 * Released under the MIT License.
 */
'use strict';

var swalPrefix = 'swal2-';

var prefix = function prefix(items) {
  var result = {};
  for (var i in items) {
    result[items[i]] = swalPrefix + items[i];
  }
  return result;
};

var swalClasses = prefix(['container', 'in', 'iosfix', 'modal', 'overlay', 'fade', 'show', 'hide', 'noanimation', 'close', 'title', 'content', 'spacer', 'confirm', 'cancel', 'icon', 'image', 'input', 'file', 'range', 'select', 'radio', 'checkbox', 'textarea', 'inputerror', 'validationerror', 'progresssteps', 'activeprogressstep', 'progresscircle', 'progressline', 'loading', 'styled']);

var iconTypes = prefix(['success', 'warning', 'info', 'question', 'error']);

var defaultParams = {
  title: '',
  text: '',
  html: '',
  type: null,
  customClass: '',
  animation: true,
  allowOutsideClick: true,
  allowEscapeKey: true,
  showConfirmButton: true,
  showCancelButton: false,
  preConfirm: null,
  confirmButtonText: 'OK',
  confirmButtonColor: '#3085d6',
  confirmButtonClass: null,
  cancelButtonText: 'Cancel',
  cancelButtonColor: '#aaa',
  cancelButtonClass: null,
  buttonsStyling: true,
  reverseButtons: false,
  focusCancel: false,
  showCloseButton: false,
  showLoaderOnConfirm: false,
  imageUrl: null,
  imageWidth: null,
  imageHeight: null,
  imageClass: null,
  timer: null,
  width: 500,
  padding: 20,
  background: '#fff',
  input: null,
  inputPlaceholder: '',
  inputValue: '',
  inputOptions: {},
  inputAutoTrim: true,
  inputClass: null,
  inputAttributes: {},
  inputValidator: null,
  progressSteps: [],
  currentProgressStep: null,
  progressStepsDistance: '40px',
  onOpen: null,
  onClose: null
};

var sweetHTML = ('\n  <div class="' + swalClasses.modal + '" style="display: none" tabIndex="-1">\n    <ul class="' + swalClasses.progresssteps + '"></ul>\n    <div class="' + swalClasses.icon + ' ' + iconTypes.error + '">\n      <span class="x-mark"><span class="line left"></span><span class="line right"></span></span>\n    </div>\n    <div class="' + swalClasses.icon + ' ' + iconTypes.question + '">?</div>\n    <div class="' + swalClasses.icon + ' ' + iconTypes.warning + '">!</div>\n    <div class="' + swalClasses.icon + ' ' + iconTypes.info + '">i</div>\n    <div class="' + swalClasses.icon + ' ' + iconTypes.success + '">\n      <span class="line tip"></span> <span class="line long"></span>\n      <div class="placeholder"></div> <div class="fix"></div>\n    </div>\n    <img class="' + swalClasses.image + '">\n    <h2 class="' + swalClasses.title + '"></h2>\n    <div class="' + swalClasses.content + '"></div>\n    <input class="' + swalClasses.input + '">\n    <input type="file" class="' + swalClasses.file + '">\n    <div class="' + swalClasses.range + '">\n      <output></output>\n      <input type="range">\n    </div>\n    <select class="' + swalClasses.select + '"></select>\n    <div class="' + swalClasses.radio + '"></div>\n    <label for="' + swalClasses.checkbox + '" class="' + swalClasses.checkbox + '">\n      <input type="checkbox">\n    </label>\n    <textarea class="' + swalClasses.textarea + '"></textarea>\n    <div class="' + swalClasses.validationerror + '"></div>\n    <hr class="' + swalClasses.spacer + '">\n    <button type="button" class="' + swalClasses.confirm + '">OK</button>\n    <button type="button" class="' + swalClasses.cancel + '">Cancel</button>\n    <span class="' + swalClasses.close + '">&times;</span>\n  </div>\n').replace(/(^|\n)\s*/g, '');

var sweetContainer = void 0;

var existingSweetContainers = document.getElementsByClassName(swalClasses.container);

if (existingSweetContainers.length) {
  sweetContainer = existingSweetContainers[0];
} else {
  sweetContainer = document.createElement('div');
  sweetContainer.className = swalClasses.container;
  sweetContainer.innerHTML = sweetHTML;
}

/*
 * Set hover, active and focus-states for buttons (source: http://www.sitepoint.com/javascript-generate-lighter-darker-color)
 */
var colorLuminance = function colorLuminance(hex, lum) {
  // Validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, '');
  if (hex.length < 6) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  lum = lum || 0;

  // Convert to decimal and change luminosity
  var rgb = '#';
  for (var i = 0; i < 3; i++) {
    var c = parseInt(hex.substr(i * 2, 2), 16);
    c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
    rgb += ('00' + c).substr(c.length);
  }

  return rgb;
};

/* global MouseEvent */

// Remember state in cases where opening and handling a modal will fiddle with it.
var states = {
  previousWindowKeyDown: null,
  previousActiveElement: null,
  previousBodyPadding: null
};

/*
 * Add modal + overlay to DOM
 */
var init = function init() {
  if (typeof document === 'undefined') {
    console.error('SweetAlert2 requires document to initialize');
    return;
  } else if (document.getElementsByClassName(swalClasses.container).length) {
    return;
  }

  document.body.appendChild(sweetContainer);

  var modal = getModal();
  var input = getChildByClass(modal, swalClasses.input);
  var file = getChildByClass(modal, swalClasses.file);
  var range = modal.querySelector('.' + swalClasses.range + ' input');
  var rangeOutput = modal.querySelector('.' + swalClasses.range + ' output');
  var select = getChildByClass(modal, swalClasses.select);
  var checkbox = modal.querySelector('.' + swalClasses.checkbox + ' input');
  var textarea = getChildByClass(modal, swalClasses.textarea);

  input.oninput = function () {
    sweetAlert.resetValidationError();
  };

  input.onkeydown = function (event) {
    setTimeout(function () {
      if (event.keyCode === 13) {
        event.stopPropagation();
        sweetAlert.clickConfirm();
      }
    }, 0);
  };

  file.onchange = function () {
    sweetAlert.resetValidationError();
  };

  range.oninput = function () {
    sweetAlert.resetValidationError();
    rangeOutput.value = range.value;
  };

  range.onchange = function () {
    sweetAlert.resetValidationError();
    range.previousSibling.value = range.value;
  };

  select.onchange = function () {
    sweetAlert.resetValidationError();
  };

  checkbox.onchange = function () {
    sweetAlert.resetValidationError();
  };

  textarea.oninput = function () {
    sweetAlert.resetValidationError();
  };

  return modal;
};

/*
 * Manipulate DOM
 */
var elementByClass = function elementByClass(className) {
  return sweetContainer.querySelector('.' + className);
};

var getModal = function getModal() {
  return document.body.querySelector('.' + swalClasses.modal) || init();
};

var getIcons = function getIcons() {
  var modal = getModal();
  return modal.querySelectorAll('.' + swalClasses.icon);
};

var getTitle = function getTitle() {
  return elementByClass(swalClasses.title);
};

var getContent = function getContent() {
  return elementByClass(swalClasses.content);
};

var getImage = function getImage() {
  return elementByClass(swalClasses.image);
};

var getSpacer = function getSpacer() {
  return elementByClass(swalClasses.spacer);
};

var getProgressSteps = function getProgressSteps() {
  return elementByClass(swalClasses.progresssteps);
};

var getValidationError = function getValidationError() {
  return elementByClass(swalClasses.validationerror);
};

var getConfirmButton = function getConfirmButton() {
  return elementByClass(swalClasses.confirm);
};

var getCancelButton = function getCancelButton() {
  return elementByClass(swalClasses.cancel);
};

var getCloseButton = function getCloseButton() {
  return elementByClass(swalClasses.close);
};

var getFocusableElements = function getFocusableElements(focusCancel) {
  var buttons = [getConfirmButton(), getCancelButton()];
  if (focusCancel) {
    buttons.reverse();
  }
  return buttons.concat(Array.prototype.slice.call(getModal().querySelectorAll('button:not([class^=' + swalPrefix + ']), input:not([type=hidden]), textarea, select')));
};

var hasClass = function hasClass(elem, className) {
  if (elem.classList) {
    return elem.classList.contains(className);
  }
  return false;
};

var focusInput = function focusInput(input) {
  input.focus();

  // place cursor at end of text in text input
  if (input.type !== 'file') {
    // http://stackoverflow.com/a/2345915/1331425
    var val = input.value;
    input.value = '';
    input.value = val;
  }
};

var addClass = function addClass(elem, className) {
  if (!elem || !className) {
    return;
  }
  var classes = className.split(/\s+/).filter(Boolean);
  classes.forEach(function (className) {
    elem.classList.add(className);
  });
};

var removeClass = function removeClass(elem, className) {
  if (!elem || !className) {
    return;
  }
  var classes = className.split(/\s+/).filter(Boolean);
  classes.forEach(function (className) {
    elem.classList.remove(className);
  });
};

var getChildByClass = function getChildByClass(elem, className) {
  for (var i = 0; i < elem.childNodes.length; i++) {
    if (hasClass(elem.childNodes[i], className)) {
      return elem.childNodes[i];
    }
  }
};

var show = function show(elem, display) {
  if (!display) {
    display = 'block';
  }
  elem.style.opacity = '';
  elem.style.display = display;
};

var hide = function hide(elem) {
  elem.style.opacity = '';
  elem.style.display = 'none';
};

var empty = function empty(elem) {
  while (elem.firstChild) {
    elem.removeChild(elem.firstChild);
  }
};

// borrowed from jqeury $(elem).is(':visible') implementation
var isVisible = function isVisible(elem) {
  return elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length;
};

var removeStyleProperty = function removeStyleProperty(elem, property) {
  if (elem.style.removeProperty) {
    elem.style.removeProperty(property);
  } else {
    elem.style.removeAttribute(property);
  }
};







var fireClick = function fireClick(node) {
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

var animationEndEvent = function () {
  var testEl = document.createElement('div');
  var transEndEventNames = {
    'WebkitAnimation': 'webkitAnimationEnd',
    'OAnimation': 'oAnimationEnd oanimationend',
    'msAnimation': 'MSAnimationEnd',
    'animation': 'animationend'
  };
  for (var i in transEndEventNames) {
    if (transEndEventNames.hasOwnProperty(i) && testEl.style[i] !== undefined) {
      return transEndEventNames[i];
    }
  }

  return false;
}();

// Reset the page to its previous state
var resetPrevState = function resetPrevState() {
  var modal = getModal();
  window.onkeydown = states.previousWindowKeyDown;
  if (states.previousActiveElement && states.previousActiveElement.focus) {
    states.previousActiveElement.focus();
  }
  clearTimeout(modal.timeout);
};

// Measure width of scrollbar
// https://github.com/twbs/bootstrap/blob/master/js/modal.js#L279-L286
var measureScrollbar = function measureScrollbar() {
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
// Simplivied version of https://davidwalsh.name/javascript-debounce-function
var debounce = function debounce(func, wait) {
  var timeout = void 0;
  return function () {
    var later = function later() {
      timeout = null;
      func();
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();















var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var modalParams = _extends({}, defaultParams);
var queue = [];
var swal2Observer = void 0;

/*
 * Set type, text and actions on modal
 */
var setParameters = function setParameters(params) {
  var modal = getModal();

  for (var param in params) {
    if (!defaultParams.hasOwnProperty(param) && param !== 'extraParams') {
      console.warn('SweetAlert2: Unknown parameter "' + param + '"');
    }
  }

  // set modal width and margin-left
  modal.style.width = typeof params.width === 'number' ? params.width + 'px' : params.width;

  modal.style.padding = params.padding + 'px';
  modal.style.background = params.background;

  var title = getTitle();
  var content = getContent();
  var confirmButton = getConfirmButton();
  var cancelButton = getCancelButton();
  var closeButton = getCloseButton();

  // Title
  title.innerHTML = params.title.split('\n').join('<br>');

  // Content
  if (params.text || params.html) {
    if (_typeof(params.html) === 'object') {
      content.innerHTML = '';
      if (0 in params.html) {
        for (var i = 0; i in params.html; i++) {
          content.appendChild(params.html[i].cloneNode(true));
        }
      } else {
        content.appendChild(params.html.cloneNode(true));
      }
    } else if (params.html) {
      content.innerHTML = params.html;
    } else if (params.text) {
      content.innerHTML = ('' + params.text).split('\n').join('<br>');
    }
    show(content);
  } else {
    hide(content);
  }

  // Close button
  if (params.showCloseButton) {
    show(closeButton);
  } else {
    hide(closeButton);
  }

  // Custom Class
  modal.className = swalClasses.modal;
  if (params.customClass) {
    addClass(modal, params.customClass);
  }

  // Progress steps
  var progressStepsContainer = getProgressSteps();
  var currentProgressStep = parseInt(params.currentProgressStep === null ? sweetAlert.getQueueStep() : params.currentProgressStep, 10);
  if (params.progressSteps.length) {
    show(progressStepsContainer);
    empty(progressStepsContainer);
    if (currentProgressStep >= params.progressSteps.length) {
      console.warn('SweetAlert2: Invalid currentProgressStep parameter, it should be less than progressSteps.length ' + '(currentProgressStep like JS arrays starts from 0)');
    }
    params.progressSteps.forEach(function (step, index) {
      var circle = document.createElement('li');
      addClass(circle, swalClasses.progresscircle);
      circle.innerHTML = step;
      if (index === currentProgressStep) {
        addClass(circle, swalClasses.activeprogressstep);
      }
      progressStepsContainer.appendChild(circle);
      if (index !== params.progressSteps.length - 1) {
        var line = document.createElement('li');
        addClass(line, swalClasses.progressline);
        line.style.width = params.progressStepsDistance;
        progressStepsContainer.appendChild(line);
      }
    });
  } else {
    hide(progressStepsContainer);
  }

  // Icon
  var icons = getIcons();
  for (var _i = 0; _i < icons.length; _i++) {
    hide(icons[_i]);
  }
  if (params.type) {
    var validType = false;
    for (var iconType in iconTypes) {
      if (params.type === iconType) {
        validType = true;
        break;
      }
    }
    if (!validType) {
      console.error('SweetAlert2: Unknown alert type: ' + params.type);
      return false;
    }
    var icon = modal.querySelector('.' + swalClasses.icon + '.' + iconTypes[params.type]);
    show(icon);

    // Animate icon
    switch (params.type) {
      case 'success':
        addClass(icon, 'animate');
        addClass(icon.querySelector('.tip'), 'animate-success-tip');
        addClass(icon.querySelector('.long'), 'animate-success-long');
        break;
      case 'error':
        addClass(icon, 'animate-error-icon');
        addClass(icon.querySelector('.x-mark'), 'animate-x-mark');
        break;
      case 'warning':
        addClass(icon, 'pulse-warning');
        break;
      default:
        break;
    }
  }

  // Custom image
  var image = getImage();
  if (params.imageUrl) {
    image.setAttribute('src', params.imageUrl);
    show(image);

    if (params.imageWidth) {
      image.setAttribute('width', params.imageWidth);
    } else {
      image.removeAttribute('width');
    }

    if (params.imageHeight) {
      image.setAttribute('height', params.imageHeight);
    } else {
      image.removeAttribute('height');
    }

    image.className = swalClasses.image;
    if (params.imageClass) {
      addClass(image, params.imageClass);
    }
  } else {
    hide(image);
  }

  // Cancel button
  if (params.showCancelButton) {
    cancelButton.style.display = 'inline-block';
  } else {
    hide(cancelButton);
  }

  // Confirm button
  if (params.showConfirmButton) {
    removeStyleProperty(confirmButton, 'display');
  } else {
    hide(confirmButton);
  }

  // Buttons spacer
  var spacer = getSpacer();
  if (!params.showConfirmButton && !params.showCancelButton) {
    hide(spacer);
  } else {
    show(spacer);
  }

  // Edit text on cancel and confirm buttons
  confirmButton.innerHTML = params.confirmButtonText;
  cancelButton.innerHTML = params.cancelButtonText;

  // Set buttons to selected background colors
  if (params.buttonsStyling) {
    confirmButton.style.backgroundColor = params.confirmButtonColor;
    cancelButton.style.backgroundColor = params.cancelButtonColor;
  }

  // Add buttons custom classes
  confirmButton.className = swalClasses.confirm;
  addClass(confirmButton, params.confirmButtonClass);
  cancelButton.className = swalClasses.cancel;
  addClass(cancelButton, params.cancelButtonClass);

  // Buttons styling
  if (params.buttonsStyling) {
    addClass(confirmButton, swalClasses.styled);
    addClass(cancelButton, swalClasses.styled);
  } else {
    removeClass(confirmButton, swalClasses.styled);
    removeClass(cancelButton, swalClasses.styled);

    confirmButton.style.backgroundColor = confirmButton.style.borderLeftColor = confirmButton.style.borderRightColor = '';
    cancelButton.style.backgroundColor = cancelButton.style.borderLeftColor = cancelButton.style.borderRightColor = '';
  }

  // CSS animation
  if (params.animation === true) {
    removeClass(modal, swalClasses.noanimation);
  } else {
    addClass(modal, swalClasses.noanimation);
  }
};

/*
 * Animations
 */
var openModal = function openModal(animation, onComplete) {
  var modal = getModal();
  if (animation) {
    addClass(modal, swalClasses.show);
    addClass(sweetContainer, swalClasses.fade);
    removeClass(modal, swalClasses.hide);
  } else {
    removeClass(modal, swalClasses.fade);
  }
  show(modal);

  // scrolling is 'hidden' until animation is done, after that 'auto'
  sweetContainer.style.overflowY = 'hidden';
  if (animationEndEvent && !hasClass(modal, swalClasses.noanimation)) {
    modal.addEventListener(animationEndEvent, function swalCloseEventFinished() {
      modal.removeEventListener(animationEndEvent, swalCloseEventFinished);
      sweetContainer.style.overflowY = 'auto';
    });
  } else {
    sweetContainer.style.overflowY = 'auto';
  }

  addClass(sweetContainer, swalClasses.in);
  addClass(document.body, swalClasses.in);
  fixScrollbar();
  iOSfix();
  states.previousActiveElement = document.activeElement;
  if (onComplete !== null && typeof onComplete === 'function') {
    onComplete(modal);
  }
};

var fixScrollbar = function fixScrollbar() {
  // for queues, do not do this more than once
  if (states.previousBodyPadding !== null) {
    return;
  }
  // if the body has overflow
  if (document.body.scrollHeight > window.innerHeight) {
    // add padding so the content doesn't shift after removal of scrollbar
    states.previousBodyPadding = document.body.style.paddingRight;
    document.body.style.paddingRight = measureScrollbar() + 'px';
  }
};

var undoScrollbar = function undoScrollbar() {
  if (states.previousBodyPadding !== null) {
    document.body.style.paddingRight = states.previousBodyPadding;
    states.previousBodyPadding = null;
  }
};

// Fix iOS scrolling http://stackoverflow.com/q/39626302/1331425
var iOSfix = function iOSfix() {
  var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  if (iOS && !hasClass(document.body, swalClasses.iosfix)) {
    var offset = document.body.scrollTop;
    document.body.style.top = offset * -1 + 'px';
    addClass(document.body, swalClasses.iosfix);
  }
};

var undoIOSfix = function undoIOSfix() {
  if (hasClass(document.body, swalClasses.iosfix)) {
    var offset = parseInt(document.body.style.top, 10);
    removeClass(document.body, swalClasses.iosfix);
    document.body.style.top = '';
    document.body.scrollTop = offset * -1;
  }
};

var modalDependant = function modalDependant() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (args[0] === undefined) {
    console.error('SweetAlert2 expects at least 1 attribute!');
    return false;
  }

  var params = _extends({}, modalParams);

  switch (_typeof(args[0])) {
    case 'string':
      params.title = args[0];
      params.text = args[1];
      params.type = args[2];

      break;

    case 'object':
      _extends(params, args[0]);
      params.extraParams = args[0].extraParams;

      if (params.input === 'email' && params.inputValidator === null) {
        params.inputValidator = function (email) {
          return new Promise(function (resolve, reject) {
            var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (emailRegex.test(email)) {
              resolve();
            } else {
              reject('Invalid email address');
            }
          });
        };
      }
      break;

    default:
      console.error('SweetAlert2: Unexpected type of argument! Expected "string" or "object", got ' + _typeof(args[0]));
      return false;
  }

  setParameters(params);

  var modal = getModal();

  return new Promise(function (resolve, reject) {
    // Close on timer
    if (params.timer) {
      modal.timeout = setTimeout(function () {
        sweetAlert.closeModal(params.onClose);
        reject('timer');
      }, params.timer);
    }

    // Get input element by specified type or, if type isn't specified, by params.input
    var getInput = function getInput(inputType) {
      inputType = inputType || params.input;
      switch (inputType) {
        case 'select':
        case 'textarea':
        case 'file':
          return getChildByClass(modal, swalClasses[inputType]);
        case 'checkbox':
          return modal.querySelector('.' + swalClasses.checkbox + ' input');
        case 'radio':
          return modal.querySelector('.' + swalClasses.radio + ' input:checked') || modal.querySelector('.' + swalClasses.radio + ' input:first-child');
        case 'range':
          return modal.querySelector('.' + swalClasses.range + ' input');
        default:
          return getChildByClass(modal, swalClasses.input);
      }
    };

    // Get the value of the modal input
    var getInputValue = function getInputValue() {
      var input = getInput();
      if (!input) {
        return null;
      }
      switch (params.input) {
        case 'checkbox':
          return input.checked ? 1 : 0;
        case 'radio':
          return input.checked ? input.value : null;
        case 'file':
          return input.files.length ? input.files[0] : null;
        default:
          return params.inputAutoTrim ? input.value.trim() : input.value;
      }
    };

    // input autofocus
    if (params.input) {
      setTimeout(function () {
        var input = getInput();
        if (input) {
          focusInput(input);
        }
      }, 0);
    }

    var confirm = function confirm(value) {
      if (params.showLoaderOnConfirm) {
        sweetAlert.showLoading();
      }

      if (params.preConfirm) {
        params.preConfirm(value, params.extraParams).then(function (preConfirmValue) {
          sweetAlert.closeModal(params.onClose);
          resolve(preConfirmValue || value);
        }, function (error) {
          sweetAlert.hideLoading();
          if (error) {
            sweetAlert.showValidationError(error);
          }
        });
      } else {
        sweetAlert.closeModal(params.onClose);
        resolve(value);
      }
    };

    // Mouse interactions
    var onButtonEvent = function onButtonEvent(event) {
      var e = event || window.event;
      var target = e.target || e.srcElement;
      var confirmButton = getConfirmButton();
      var cancelButton = getCancelButton();
      var targetedConfirm = confirmButton === target || confirmButton.contains(target);
      var targetedCancel = cancelButton === target || cancelButton.contains(target);

      switch (e.type) {
        case 'mouseover':
        case 'mouseup':
          if (params.buttonsStyling) {
            if (targetedConfirm) {
              confirmButton.style.backgroundColor = colorLuminance(params.confirmButtonColor, -0.1);
            } else if (targetedCancel) {
              cancelButton.style.backgroundColor = colorLuminance(params.cancelButtonColor, -0.1);
            }
          }
          break;
        case 'mouseout':
          if (params.buttonsStyling) {
            if (targetedConfirm) {
              confirmButton.style.backgroundColor = params.confirmButtonColor;
            } else if (targetedCancel) {
              cancelButton.style.backgroundColor = params.cancelButtonColor;
            }
          }
          break;
        case 'mousedown':
          if (params.buttonsStyling) {
            if (targetedConfirm) {
              confirmButton.style.backgroundColor = colorLuminance(params.confirmButtonColor, -0.2);
            } else if (targetedCancel) {
              cancelButton.style.backgroundColor = colorLuminance(params.cancelButtonColor, -0.2);
            }
          }
          break;
        case 'click':
          // Clicked 'confirm'
          if (targetedConfirm && sweetAlert.isVisible()) {
            if (params.input) {
              (function () {
                var inputValue = getInputValue();

                if (params.inputValidator) {
                  sweetAlert.disableInput();
                  params.inputValidator(inputValue, params.extraParams).then(function () {
                    sweetAlert.enableInput();
                    confirm(inputValue);
                  }, function (error) {
                    sweetAlert.enableInput();
                    if (error) {
                      sweetAlert.showValidationError(error);
                    }
                  });
                } else {
                  confirm(inputValue);
                }
              })();
            } else {
              confirm(true);
            }

            // Clicked 'cancel'
          } else if (targetedCancel && sweetAlert.isVisible()) {
            sweetAlert.closeModal(params.onClose);
            reject('cancel');
          }
          break;
        default:
      }
    };

    var buttons = modal.querySelectorAll('button');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].onclick = onButtonEvent;
      buttons[i].onmouseover = onButtonEvent;
      buttons[i].onmouseout = onButtonEvent;
      buttons[i].onmousedown = onButtonEvent;
    }

    // Closing modal by close button
    getCloseButton().onclick = function () {
      sweetAlert.closeModal(params.onClose);
      reject('close');
    };

    // Closing modal by overlay click
    sweetContainer.onclick = function (e) {
      if (e.target !== sweetContainer) {
        return;
      }
      if (params.allowOutsideClick) {
        sweetAlert.closeModal(params.onClose);
        reject('overlay');
      }
    };

    var confirmButton = getConfirmButton();
    var cancelButton = getCancelButton();

    // Reverse buttons if neede d
    if (params.reverseButtons) {
      confirmButton.parentNode.insertBefore(cancelButton, confirmButton);
    } else {
      confirmButton.parentNode.insertBefore(confirmButton, cancelButton);
    }

    // Focus handling
    var setFocus = function setFocus(index, increment) {
      var focusableElements = getFocusableElements(params.focusCancel);
      // search for visible elements and select the next possible match
      for (var _i2 = 0; _i2 < focusableElements.length; _i2++) {
        index = index + increment;

        // rollover to first item
        if (index === focusableElements.length) {
          index = 0;

          // go to last item
        } else if (index === -1) {
          index = focusableElements.length - 1;
        }

        // determine if element is visible
        var el = focusableElements[index];
        if (isVisible(el)) {
          return el.focus();
        }
      }
    };

    var handleKeyDown = function handleKeyDown(event) {
      var e = event || window.event;
      var keyCode = e.keyCode || e.which;

      if ([9, 13, 32, 27].indexOf(keyCode) === -1) {
        // Don't do work on keys we don't care about.
        return;
      }

      var targetElement = e.target || e.srcElement;

      var focusableElements = getFocusableElements(params.focusCancel);
      var btnIndex = -1; // Find the button - note, this is a nodelist, not an array.
      for (var _i3 = 0; _i3 < focusableElements.length; _i3++) {
        if (targetElement === focusableElements[_i3]) {
          btnIndex = _i3;
          break;
        }
      }

      // TAB
      if (keyCode === 9) {
        if (!e.shiftKey) {
          // Cycle to the next button
          setFocus(btnIndex, 1);
        } else {
          // Cycle to the prev button
          setFocus(btnIndex, -1);
        }
        e.stopPropagation();
        e.preventDefault();

        // ENTER/SPACE
      } else {
        if (keyCode === 13 || keyCode === 32) {
          if (btnIndex === -1) {
            // ENTER/SPACE clicked outside of a button.
            if (params.focusCancel) {
              fireClick(cancelButton, e);
            } else {
              fireClick(confirmButton, e);
            }
          }
        } else if (keyCode === 27 && params.allowEscapeKey === true) {
          sweetAlert.closeModal(params.onClose);
          reject('esc');
        }
      }
    };

    states.previousWindowKeyDown = window.onkeydown;
    window.onkeydown = handleKeyDown;

    // Loading state
    if (params.buttonsStyling) {
      confirmButton.style.borderLeftColor = params.confirmButtonColor;
      confirmButton.style.borderRightColor = params.confirmButtonColor;
    }

    /**
     * Show spinner instead of Confirm button and disable Cancel button
     */
    sweetAlert.showLoading = sweetAlert.enableLoading = function () {
      show(getSpacer());
      show(confirmButton, 'inline-block');
      addClass(confirmButton, swalClasses.loading);
      addClass(modal, swalClasses.loading);
      confirmButton.disabled = true;
      cancelButton.disabled = true;
    };

    /**
     * Show spinner instead of Confirm button and disable Cancel button
     */
    sweetAlert.hideLoading = sweetAlert.disableLoading = function () {
      if (!params.showConfirmButton) {
        hide(confirmButton);
        if (!params.showCancelButton) {
          hide(getSpacer());
        }
      }
      removeClass(confirmButton, swalClasses.loading);
      removeClass(modal, swalClasses.loading);
      confirmButton.disabled = false;
      cancelButton.disabled = false;
    };

    sweetAlert.enableButtons = function () {
      confirmButton.disabled = false;
      cancelButton.disabled = false;
    };

    sweetAlert.disableButtons = function () {
      confirmButton.disabled = true;
      cancelButton.disabled = true;
    };

    sweetAlert.enableConfirmButton = function () {
      confirmButton.disabled = false;
    };

    sweetAlert.disableConfirmButton = function () {
      confirmButton.disabled = true;
    };

    sweetAlert.enableInput = function () {
      var input = getInput();
      if (!input) {
        return false;
      }
      if (input.type === 'radio') {
        var radiosContainer = input.parentNode.parentNode;
        var radios = radiosContainer.querySelectorAll('input');
        for (var _i4 = 0; _i4 < radios.length; _i4++) {
          radios[_i4].disabled = false;
        }
      } else {
        input.disabled = false;
      }
    };

    sweetAlert.disableInput = function () {
      var input = getInput();
      if (!input) {
        return false;
      }
      if (input && input.type === 'radio') {
        var radiosContainer = input.parentNode.parentNode;
        var radios = radiosContainer.querySelectorAll('input');
        for (var _i5 = 0; _i5 < radios.length; _i5++) {
          radios[_i5].disabled = true;
        }
      } else {
        input.disabled = true;
      }
    };

    // Set modal min-height to disable scrolling inside the modal
    sweetAlert.recalculateHeight = debounce(function () {
      var modal = getModal();
      var prevState = modal.style.display;
      modal.style.minHeight = '';
      show(modal);
      modal.style.minHeight = modal.scrollHeight + 1 + 'px';
      modal.style.display = prevState;
    }, 50);

    // Show block with validation error
    sweetAlert.showValidationError = function (error) {
      var validationError = getValidationError();
      validationError.innerHTML = error;
      show(validationError);

      var input = getInput();
      focusInput(input);
      addClass(input, swalClasses.inputerror);
    };

    // Hide block with validation error
    sweetAlert.resetValidationError = function () {
      var validationError = getValidationError();
      hide(validationError);
      sweetAlert.recalculateHeight();

      var input = getInput();
      if (input) {
        removeClass(input, swalClasses.inputerror);
      }
    };

    sweetAlert.getProgressSteps = function () {
      return params.progressSteps;
    };

    sweetAlert.setProgressSteps = function (progressSteps) {
      params.progressSteps = progressSteps;
      setParameters(params);
    };

    sweetAlert.showProgressSteps = function () {
      show(getProgressSteps());
    };

    sweetAlert.hideProgressSteps = function () {
      hide(getProgressSteps());
    };

    sweetAlert.enableButtons();
    sweetAlert.hideLoading();
    sweetAlert.resetValidationError();

    // inputs
    var inputTypes = ['input', 'file', 'range', 'select', 'radio', 'checkbox', 'textarea'];
    var input = void 0;
    for (var _i6 = 0; _i6 < inputTypes.length; _i6++) {
      var inputClass = swalClasses[inputTypes[_i6]];
      var inputContainer = getChildByClass(modal, inputClass);
      input = getInput(inputTypes[_i6]);

      // set attributes
      if (input) {
        for (var j in input.attributes) {
          if (input.attributes.hasOwnProperty(j)) {
            var attrName = input.attributes[j].name;
            if (attrName !== 'type' && attrName !== 'value') {
              input.removeAttribute(attrName);
            }
          }
        }
        for (var attr in params.inputAttributes) {
          input.setAttribute(attr, params.inputAttributes[attr]);
        }
      }

      // set class
      inputContainer.className = inputClass;
      if (params.inputClass) {
        addClass(inputContainer, params.inputClass);
      }

      hide(inputContainer);
    }

    var populateInputOptions = void 0;

    (function () {
      switch (params.input) {
        case 'text':
        case 'email':
        case 'password':
        case 'number':
        case 'tel':
          input = getChildByClass(modal, swalClasses.input);
          input.value = params.inputValue;
          input.placeholder = params.inputPlaceholder;
          input.type = params.input;
          show(input);
          break;
        case 'file':
          input = getChildByClass(modal, swalClasses.file);
          input.placeholder = params.inputPlaceholder;
          input.type = params.input;
          show(input);
          break;
        case 'range':
          var range = getChildByClass(modal, swalClasses.range);
          var rangeInput = range.querySelector('input');
          var rangeOutput = range.querySelector('output');
          rangeInput.value = params.inputValue;
          rangeInput.type = params.input;
          rangeOutput.value = params.inputValue;
          show(range);
          break;
        case 'select':
          var select = getChildByClass(modal, swalClasses.select);
          select.innerHTML = '';
          if (params.inputPlaceholder) {
            var placeholder = document.createElement('option');
            placeholder.innerHTML = params.inputPlaceholder;
            placeholder.value = '';
            placeholder.disabled = true;
            placeholder.selected = true;
            select.appendChild(placeholder);
          }
          populateInputOptions = function populateInputOptions(inputOptions) {
            for (var optionValue in inputOptions) {
              var option = document.createElement('option');
              option.value = optionValue;
              option.innerHTML = inputOptions[optionValue];
              if (params.inputValue === optionValue) {
                option.selected = true;
              }
              select.appendChild(option);
            }
            show(select);
            select.focus();
          };
          break;
        case 'radio':
          var radio = getChildByClass(modal, swalClasses.radio);
          radio.innerHTML = '';
          populateInputOptions = function populateInputOptions(inputOptions) {
            for (var radioValue in inputOptions) {
              var id = 1;
              var radioInput = document.createElement('input');
              var radioLabel = document.createElement('label');
              var radioLabelSpan = document.createElement('span');
              radioInput.type = 'radio';
              radioInput.name = swalClasses.radio;
              radioInput.value = radioValue;
              radioInput.id = swalClasses.radio + '-' + id++;
              if (params.inputValue === radioValue) {
                radioInput.checked = true;
              }
              radioLabelSpan.innerHTML = inputOptions[radioValue];
              radioLabel.appendChild(radioInput);
              radioLabel.appendChild(radioLabelSpan);
              radioLabel.for = radioInput.id;
              radio.appendChild(radioLabel);
            }
            show(radio);
            var radios = radio.querySelectorAll('input');
            if (radios.length) {
              radios[0].focus();
            }
          };
          break;
        case 'checkbox':
          var checkbox = getChildByClass(modal, swalClasses.checkbox);
          var checkboxInput = getInput('checkbox');
          checkboxInput.type = 'checkbox';
          checkboxInput.value = 1;
          checkboxInput.id = swalClasses.checkbox;
          checkboxInput.checked = Boolean(params.inputValue);
          var label = checkbox.getElementsByTagName('span');
          if (label.length) {
            checkbox.removeChild(label[0]);
          }
          label = document.createElement('span');
          label.innerHTML = params.inputPlaceholder;
          checkbox.appendChild(label);
          show(checkbox);
          break;
        case 'textarea':
          var textarea = getChildByClass(modal, swalClasses.textarea);
          textarea.value = params.inputValue;
          textarea.placeholder = params.inputPlaceholder;
          show(textarea);
          break;
        case null:
          break;
        default:
          console.error('SweetAlert2: Unexpected type of input! Expected "text", "email", "password", "select", "checkbox", "textarea" or "file", got "' + params.input + '"');
          break;
      }
    })();

    if (params.input === 'select' || params.input === 'radio') {
      if (params.inputOptions instanceof Promise) {
        sweetAlert.showLoading();
        params.inputOptions.then(function (inputOptions) {
          sweetAlert.hideLoading();
          populateInputOptions(inputOptions);
        });
      } else if (_typeof(params.inputOptions) === 'object') {
        populateInputOptions(params.inputOptions);
      } else {
        console.error('SweetAlert2: Unexpected type of inputOptions! Expected object or Promise, got ' + _typeof(params.inputOptions));
      }
    }

    openModal(params.animation, params.onOpen);

    // Focus the first element (input or button)
    setFocus(-1, 1);

    // fix scroll
    sweetContainer.scrollTop = 0;

    // Observe changes inside the modal and adjust height
    if (typeof MutationObserver !== 'undefined' && !swal2Observer) {
      swal2Observer = new MutationObserver(sweetAlert.recalculateHeight);
      swal2Observer.observe(modal, { childList: true, characterData: true, subtree: true });
    }
  });
};

// SweetAlert entry point
var sweetAlert = function sweetAlert() {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  if (sweetAlert.isVisible()) {
    sweetAlert.close();
  }

  return modalDependant.apply(undefined, args);
};

/*
 * Global function to determine if swal2 modal is visible
 */
sweetAlert.isVisible = function () {
  var modal = getModal();
  return isVisible(modal);
};

/*
 * Global function for chaining sweetAlert modals
 */
sweetAlert.queue = function (steps) {
  queue = steps;
  var modal = getModal();
  var resetQueue = function resetQueue() {
    queue = [];
    modal.removeAttribute('data-queue-step');
  };
  var queueResult = [];
  return new Promise(function (resolve, reject) {
    (function step(i, callback) {
      if (i < queue.length) {
        modal.setAttribute('data-queue-step', i);

        sweetAlert(queue[i]).then(function (result) {
          queueResult.push(result);
          step(i + 1, callback);
        }, function (dismiss) {
          resetQueue();
          reject(dismiss);
        });
      } else {
        resetQueue();
        resolve(queueResult);
      }
    })(0);
  });
};

/*
 * Global function for getting the index of current modal in queue
 */
sweetAlert.getQueueStep = function () {
  return getModal().getAttribute('data-queue-step');
};

/*
 * Global function for inserting a modal to the queue
 */
sweetAlert.insertQueueStep = function (step, index) {
  if (index && index < queue.length) {
    return queue.splice(index, 0, step);
  }
  return queue.push(step);
};

/*
 * Global function for deleting a modal from the queue
 */
sweetAlert.deleteQueueStep = function (index) {
  if (typeof queue[index] !== 'undefined') {
    queue.splice(index, 1);
  }
};

/*
 * Global function to close sweetAlert
 */
sweetAlert.close = sweetAlert.closeModal = function (onComplete) {
  var modal = getModal();
  removeClass(modal, swalClasses.show);
  addClass(modal, swalClasses.hide);

  // Reset icon animations
  var successIcon = modal.querySelector('.' + swalClasses.icon + '.' + iconTypes.success);
  removeClass(successIcon, 'animate');
  removeClass(successIcon.querySelector('.tip'), 'animate-success-tip');
  removeClass(successIcon.querySelector('.long'), 'animate-success-long');

  var errorIcon = modal.querySelector('.' + swalClasses.icon + '.' + iconTypes.error);
  removeClass(errorIcon, 'animate-error-icon');
  removeClass(errorIcon.querySelector('.x-mark'), 'animate-x-mark');

  var warningIcon = modal.querySelector('.' + swalClasses.icon + '.' + iconTypes.warning);
  removeClass(warningIcon, 'pulse-warning');

  resetPrevState();

  var hideModalAndResetState = function hideModalAndResetState() {
    hide(modal);
    modal.style.minHeight = '';
    removeClass(sweetContainer, swalClasses.in);
    removeClass(document.body, swalClasses.in);
    undoScrollbar();
    undoIOSfix();
  };

  // If animation is supported, animate
  if (animationEndEvent && !hasClass(modal, swalClasses.noanimation)) {
    modal.addEventListener(animationEndEvent, function swalCloseEventFinished() {
      modal.removeEventListener(animationEndEvent, swalCloseEventFinished);
      if (hasClass(modal, swalClasses.hide)) {
        hideModalAndResetState();
      }
    });
  } else {
    // Otherwise, hide immediately
    hideModalAndResetState();
  }
  if (onComplete !== null && typeof onComplete === 'function') {
    onComplete(modal);
  }
};

/*
 * Global function to click 'Confirm' button
 */
sweetAlert.clickConfirm = function () {
  return getConfirmButton().click();
};

/*
 * Global function to click 'Cancel' button
 */
sweetAlert.clickCancel = function () {
  return getCancelButton().click();
};

/**
 * Set default params for each popup
 * @param {Object} userParams
 */
sweetAlert.setDefaults = function (userParams) {
  if (!userParams || (typeof userParams === 'undefined' ? 'undefined' : _typeof(userParams)) !== 'object') {
    return console.error('SweetAlert2: the argument for setDefaults() is required and has to be a object');
  }

  for (var param in userParams) {
    if (!defaultParams.hasOwnProperty(param) && param !== 'extraParams') {
      console.warn('SweetAlert2: Unknown parameter "' + param + '"');
      delete userParams[param];
    }
  }

  _extends(modalParams, userParams);
};

/**
 * Reset default params for each popup
 */
sweetAlert.resetDefaults = function () {
  modalParams = _extends({}, defaultParams);
};

sweetAlert.noop = function () {};

sweetAlert.version = '6.2.1';

module.exports = sweetAlert;
if (window.Sweetalert2) window.sweetAlert = window.swal = window.Sweetalert2;
