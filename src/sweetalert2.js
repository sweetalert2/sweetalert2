// SweetAlert2
// github.com/limonte/sweetalert2

;(function(window, document) {
  'use strict';

  window.swalClasses = {
    modal: 'sweet-alert',
    overlay: 'sweet-overlay',
    confirm: 'sweet-confirm',
    cancel: 'sweet-cancel',
    icon: 'sweet-icon',
    iconTypes: {
      success: 'sweet-success',
      warning: 'sweet-warning',
      info: 'sweet-info',
      question: 'sweet-question',
      error: 'sweet-error'
    }
  };

  var mediaqueryId = 'sweet-alert-mediaquery';
  var defaultParams = {
    title: '',
    text: '',
    html: '',
    type: null,
    animation: true,
    allowOutsideClick: true,
    allowEscapeKey: true,
    showConfirmButton: true,
    showCancelButton: false,
    closeOnConfirm: true,
    closeOnCancel: true,
    confirmButtonText: 'OK',
    confirmButtonColor: '#3085d6',
    confirmButtonClass: null,
    cancelButtonText: 'Cancel',
    cancelButtonColor: '#aaa',
    cancelButtonClass: null,
    buttonsStyling: true,
    reverseButtons: false,
    imageUrl: null,
    imageWidth: null,
    imageHeight: null,
    imageClass: null,
    timer: null,
    width: 500,
    padding: 20,
    background: '#fff'
  };

  /*
   * Manipulate DOM
   */
  var getModal = function() {
    return document.querySelector('.' + window.swalClasses.modal);
  };

  var getOverlay = function() {
    return document.querySelector('.' + window.swalClasses.overlay);
  };

  var hasClass = function(elem, className) {
    return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
  };

  var addClass = function(elem, className) {
    if (className && !hasClass(elem, className)) {
      elem.className += ' ' + className;
    }
  };

  var removeClass = function(elem, className) {
    var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, ' ') + ' ';
    if (hasClass(elem, className)) {
      while (newClass.indexOf(' ' + className + ' ') >= 0) {
        newClass = newClass.replace(' ' + className + ' ', ' ');
      }
      elem.className = newClass.replace(/^\s+|\s+$/g, '');
    }
  };

  var escapeHtml = function(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  var _show = function(elem) {
    elem.style.opacity = '';
    elem.style.display = 'block';
  };

  var show = function(elems) {
    if (elems && !elems.length) {
      return _show(elems);
    }
    for (var i = 0; i < elems.length; ++i) {
      _show(elems[i]);
    }
  };

  var _hide = function(elem) {
    elem.style.opacity = '';
    elem.style.display = 'none';
  };

  var hide = function(elems) {
    if (elems && !elems.length) {
      return _hide(elems);
    }
    for (var i = 0; i < elems.length; ++i) {
      _hide(elems[i]);
    }
  };

  var removeStyleProperty = function(elem, property) {
    if (elem.style.removeProperty) {
      elem.style.removeProperty(property);
    } else {
      elem.style.removeAttribute(property);
    }
  }

  var isDescendant = function(parent, child) {
    var node = child.parentNode;
    while (node !== null) {
      if (node === parent) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  };

  var getTopMargin = function(elem) {
    elem.style.left = '-9999px';
    elem.style.display = 'block';

    var height = elem.clientHeight;
    var padding = parseInt(getComputedStyle(elem).getPropertyValue('padding'), 10);

    elem.style.left = '';
    elem.style.display = 'none';
    return ('-' + parseInt(height / 2 + padding) + 'px');
  };

  var fadeIn = function(elem, interval) {
    if (+elem.style.opacity < 1) {
      interval = interval || 16;
      elem.style.opacity = 0;
      elem.style.display = 'block';
      var last = +new Date();
      var tick = function() {
        elem.style.opacity = +elem.style.opacity + (new Date() - last) / 100;
        last = +new Date();

        if (+elem.style.opacity < 1) {
          setTimeout(tick, interval);
        }
      };
      tick();
    }
  };

  var fireClick = function(node) {
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
      node.fireEvent('onclick') ;
    } else if (typeof node.onclick === 'function') {
      node.onclick();
    }
  };

  var stopEventPropagation = function(e) {
    // In particular, make sure the space bar doesn't scroll the main window.
    if (typeof e.stopPropagation === 'function') {
      e.stopPropagation();
      e.preventDefault();
    } else if (window.event && window.event.hasOwnProperty('cancelBubble')) {
      window.event.cancelBubble = true;
    }
  };

  // Remember state in cases where opening and handling a modal will fiddle with it.
  var previousActiveElement;
  var previousDocumentClick;
  var previousWindowKeyDown;
  var lastFocusedButton;

  /*
   * Global sweetAlert function
   */
  window.sweetAlert = window.swal = function() {
    // Copy arguments to the local args variable
    var args = arguments;
    var modal = getModal();
    if (modal !== null) {
        if (hasClass(modal, 'visible')) {
          resetPrevState();
        }
        // If getModal returns values then continue
        return modalDependant.apply(this, args);
    } else {
        // If getModal returns null i.e. no matches, then set up a interval event to check the return value until it is not null
        var modalCheckInterval = setInterval(function() {
          if (getModal() !== null) {
            clearInterval(modalCheckInterval);
            return modalDependant.apply(this, args);
          }
      }, 100);
    }
  };

  /*
   * Global function to close sweetAlert
   */
  window.sweetAlert.closeModal = window.swal.closeModal = function() {
    closeModal();
  };

  /*
   * Global function to click 'Confirm' button
   */
  window.sweetAlert.clickConfirm = window.swal.clickConfirm = function() {
    var modal = getModal();
    var $confirmButton = modal.querySelector('button.' + window.swalClasses.confirm);
    $confirmButton.click();
  };

  /*
   * Global function to click 'Cancel' button
   */
  window.sweetAlert.clickCancel = window.swal.clickCancel = function() {
    var modal = getModal();
    var $cancelButton = modal.querySelector('button.' + window.swalClasses.cancel);
    $cancelButton.click();
  };

  function modalDependant() {

    if (arguments[0] === undefined) {
      window.console.error('sweetAlert expects at least 1 attribute!');
      return false;
    }

    var params = extend({}, defaultParams);

    switch (typeof arguments[0]) {

      case 'string':
        params.title = arguments[0];
        params.text  = arguments[1] || '';
        params.type  = arguments[2] || '';

        break;

      case 'object':
        params.title              = arguments[0].title || defaultParams.title;
        params.text               = arguments[0].text || defaultParams.text;
        params.html               = arguments[0].html || defaultParams.html;
        params.type               = arguments[0].type || defaultParams.type;
        params.animation          = arguments[0].animation !== undefined ? arguments[0].animation : defaultParams.animation;
        params.customClass        = arguments[0].customClass || params.customClass;
        params.allowOutsideClick  = arguments[0].allowOutsideClick !== undefined ? arguments[0].allowOutsideClick : defaultParams.allowOutsideClick;
        params.allowEscapeKey     = arguments[0].allowEscapeKey !== undefined ? arguments[0].allowEscapeKey : defaultParams.allowEscapeKey;
        params.showConfirmButton  = arguments[0].showConfirmButton !== undefined ? arguments[0].showConfirmButton : defaultParams.showConfirmButton;
        params.showCancelButton   = arguments[0].showCancelButton !== undefined ? arguments[0].showCancelButton : defaultParams.showCancelButton;
        params.closeOnConfirm     = arguments[0].closeOnConfirm !== undefined ? arguments[0].closeOnConfirm : defaultParams.closeOnConfirm;
        params.closeOnCancel      = arguments[0].closeOnCancel !== undefined ? arguments[0].closeOnCancel : defaultParams.closeOnCancel;
        params.timer              = parseInt(arguments[0].timer) || defaultParams.timer;
        params.width              = parseInt(arguments[0].width) || defaultParams.width;
        params.padding            = parseInt(arguments[0].padding) || defaultParams.padding;
        params.background         = arguments[0].background !== undefined ? arguments[0].background : defaultParams.background;

        params.confirmButtonText  = arguments[0].confirmButtonText || defaultParams.confirmButtonText;
        params.confirmButtonColor = arguments[0].confirmButtonColor || defaultParams.confirmButtonColor;
        params.confirmButtonClass = arguments[0].confirmButtonClass || params.confirmButtonClass;
        params.cancelButtonText   = arguments[0].cancelButtonText || defaultParams.cancelButtonText;
        params.cancelButtonColor  = arguments[0].cancelButtonColor || defaultParams.cancelButtonColor;
        params.cancelButtonClass  = arguments[0].cancelButtonClass || params.cancelButtonClass;
        params.buttonsStyling     = arguments[0].buttonsStyling !== undefined ? arguments[0].buttonsStyling : defaultParams.buttonsStyling;
        params.reverseButtons     = arguments[0].reverseButtons !== undefined ? arguments[0].reverseButtons : defaultParams.reverseButtons;
        params.imageUrl           = arguments[0].imageUrl || defaultParams.imageUrl;
        params.imageWidth         = arguments[0].imageWidth || defaultParams.imageWidth;
        params.imageHeight        = arguments[0].imageHeight || defaultParams.imageHeight;
        params.imageClass         = arguments[0].imageClass || defaultParams.imageClass;

        break;

      default:
        window.console.error('Unexpected type of argument! Expected "string" or "object", got ' + typeof arguments[0]);
        return false;

    }

    setParameters(params);
    fixVerticalPosition();
    openModal();

    // Modal interactions
    var modal = getModal();

    return new Promise(function(resolve) {
      // Close on timer
      if (params.timer) {
        modal.timeout = setTimeout(function() {
          closeModal();
          resolve(undefined);
        }, params.timer);
      }

      // Mouse interactions
      var onButtonEvent = function(event) {
        var e = event || window.event;
        var target = e.target || e.srcElement;
        var targetedConfirm = hasClass(target, window.swalClasses.confirm);
        var targetedCancel  = hasClass(target, window.swalClasses.cancel);
        var modalIsVisible  = hasClass(modal, 'visible');

        switch (e.type) {
          case 'mouseover':
          case 'mouseup':
          case 'focus':
            if (params.buttonsStyling) {
              if (targetedConfirm) {
                target.style.backgroundColor = colorLuminance(params.confirmButtonColor, -0.1);
              } else if (targetedCancel) {
                target.style.backgroundColor = colorLuminance(params.cancelButtonColor, -0.1);
              }
            }
            break;
          case 'mouseout':
          case 'blur':
            if (params.buttonsStyling) {
              if (targetedConfirm) {
                target.style.backgroundColor = params.confirmButtonColor;
              } else if (targetedCancel) {
                target.style.backgroundColor = params.cancelButtonColor;
              }
            }
            break;
          case 'mousedown':
            if (params.buttonsStyling) {
              if (targetedConfirm) {
                target.style.backgroundColor = colorLuminance(params.confirmButtonColor, -0.2);
              } else if (targetedCancel) {
                target.style.backgroundColor = colorLuminance(params.cancelButtonColor, -0.2);
              }
            }
            break;
          case 'click':
            // Clicked 'confirm'
            if (targetedConfirm && modalIsVisible) {

              if (params.closeOnConfirm) {
                closeModal();
              }

              resolve(true);

            // Clicked 'cancel'
            } else if (targetedCancel && modalIsVisible) {

              if (params.closeOnCancel) {
                closeModal();
              }

              resolve(false);

            } else {
              closeModal();
            }

            break;
        }
      };

      var $buttons = modal.querySelectorAll('button');
      var i;
      for (i = 0; i < $buttons.length; i++) {
        $buttons[i].onclick     = onButtonEvent;
        $buttons[i].onmouseover = onButtonEvent;
        $buttons[i].onmouseout  = onButtonEvent;
        $buttons[i].onmousedown = onButtonEvent;
      }

      // Remember the current document.onclick event.
      previousDocumentClick = document.onclick;
      document.onclick = function(event) {
        var e = event || window.event;
        var target = e.target || e.srcElement;

        if (target === getOverlay() && params.allowOutsideClick) {
          closeModal();
          resolve(undefined);
        }
      };

      // Keyboard interactions
      var $confirmButton = modal.querySelector('button.' + window.swalClasses.confirm);
      var $cancelButton = modal.querySelector('button.' + window.swalClasses.cancel);
      var $modalElements = modal.querySelectorAll('button, input:not([type=hidden]), textarea, select');
      for (i = 0; i < $modalElements.length; i++) {
        $modalElements[i].onfocus = onButtonEvent;
        $modalElements[i].onblur = onButtonEvent;
      }

      // Reverse buttons if neede d
      if (params.reverseButtons) {
        $confirmButton.parentNode.insertBefore($cancelButton, $confirmButton);
      }

      // Focus the first element (input or button)
      setFocus(-1, 1);

      function setFocus(index, increment) {
        // search for visible elements and select the next possible match
        for (var i = 0; i < $modalElements.length; i++) {
          index = index + increment;

          // rollover to first item
          if (index === $modalElements.length) {
            index = 0;

          // go to last item
          } else if (index === -1) {
            index = $modalElements.length - 1;
          }

          // determine if element is visible, the following is borrowed from jqeury $(elem).is(':visible') implementation
          if (
            $modalElements[index].offsetWidth ||
            $modalElements[index].offsetHeight ||
            $modalElements[index].getClientRects().length
          ) {
            $modalElements[index].focus();
            return;
          }
        }
      }

      function handleKeyDown(event) {
        var e = event || window.event;
        var keyCode = e.keyCode || e.which;
        var modalIsVisible = hasClass(modal, 'visible');

        if ([9,13,32,27].indexOf(keyCode) === -1) {
          // Don't do work on keys we don't care about.
          return;
        }

        var $targetElement = e.target || e.srcElement;

        var btnIndex = -1; // Find the button - note, this is a nodelist, not an array.
        for (var i = 0; i < $modalElements.length; i++) {
          if ($targetElement === $modalElements[i]) {
            btnIndex = i;
            break;
          }
        }

        if (keyCode === 9) {
          // TAB

          // Should only happen if modal is visible
          if (!modalIsVisible) {
            return;
          }

          if (!e.shiftKey) {
            // Cycle to the next button
            setFocus(btnIndex, 1);
          } else {
            // Cycle to the prev button
            setFocus(btnIndex, -1);
          }

          stopEventPropagation(e);

        } else {
          if (keyCode === 13 || keyCode === 32) {
            if (btnIndex === -1) {
              // ENTER/SPACE clicked outside of a button.
              fireClick($confirmButton, e);
            }
          } else if (keyCode === 27 && params.allowEscapeKey === true) {
            fireClick($cancelButton, e);
          }
        }
      }

      previousWindowKeyDown = window.onkeydown;
      window.onkeydown = handleKeyDown;

      // Loading state
      if (params.buttonsStyling) {
        $confirmButton.style.borderLeftColor = params.confirmButtonColor;
        $confirmButton.style.borderRightColor = params.confirmButtonColor;
      }

      window.swal.toggleLoading = function() {
        $confirmButton.disabled = !$confirmButton.disabled;
        $cancelButton.disabled = !$cancelButton.disabled;
      };

      window.swal.enableButtons = function() {
        $confirmButton.disabled = false;
        $cancelButton.disabled = false;
      };

      window.swal.disableButtons = function() {
        $confirmButton.disabled = true;
        $cancelButton.disabled = true;
      };

      swal.enableButtons();

      window.onfocus = function() {
        // When the user has focused away and focused back from the whole window.
        window.setTimeout(function() {
          // Put in a timeout to jump out of the event sequence. Calling focus() in the event
          // sequence confuses things.
          if (lastFocusedButton !== undefined) {
            lastFocusedButton.focus();
            lastFocusedButton = undefined;
          }
        }, 0);
      };
    });
  }

  /*
   * Add modal + overlay to DOM
   */
  window.swal.init = function() {
    var sweetHTML = '<div class="' + window.swalClasses.overlay + '" tabIndex="-1"></div><div class="' + window.swalClasses.modal + '" style="display: none" tabIndex="-1"><div class="' + window.swalClasses.icon + ' ' + window.swalClasses.iconTypes.error + '"><span class="x-mark"><span class="line left"></span><span class="line right"></span></span></div><div class="' + window.swalClasses.icon + ' ' + window.swalClasses.iconTypes.question + '">?</div><div class="' + window.swalClasses.icon + ' ' + window.swalClasses.iconTypes.warning + '"> <span class="body"></span> <span class="dot"></span> </div> <div class="' + window.swalClasses.icon + ' ' + window.swalClasses.iconTypes.info + '"></div> <div class="' + window.swalClasses.icon + ' ' + window.swalClasses.iconTypes.success + '"> <span class="line tip"></span> <span class="line long"></span> <div class="placeholder"></div> <div class="fix"></div> </div> <img class="sweet-image"> <h2>Title</h2><div class="sweet-content">Text</div><hr class="sweet-spacer"><button class="' + window.swalClasses.confirm + '">OK</button><button class="' + window.swalClasses.cancel + '">Cancel</button></div>';
    var sweetWrap = document.createElement('div');
    sweetWrap.className = 'sweet-container';

    sweetWrap.innerHTML = sweetHTML;

    document.body.appendChild(sweetWrap);
  };

  /**
   * Set default params for each popup
   * @param {Object} userParams
   */
  window.swal.setDefaults = function(userParams) {
    if (!userParams) {
      throw new Error('userParams is required');
    }
    if (typeof userParams !== 'object') {
      throw new Error('userParams has to be a object');
    }

    extend(defaultParams, userParams);
  };

  /*
   * Set type, text and actions on modal
   */
  function setParameters(params) {
    var modal = getModal();

    // set modal width, padding and margin-left
    modal.style.width = params.width + 'px';
    modal.style.padding = params.padding + 'px';
    modal.style.marginLeft = -params.width / 2 + 'px';
    modal.style.background = params.background;

    // add dynamic media query css
    var head = document.getElementsByTagName('head')[0];
    var cssNode = document.createElement('style');
    cssNode.type = 'text/css';
    cssNode.id = mediaqueryId;
    cssNode.innerHTML =
      '@media screen and (max-width: ' + params.width + 'px) {' +
        '.' + window.swalClasses.modal + ' {' +
          'max-width: 100%;' +
          'left: 0 !important;' +
          'margin-left: 0 !important;' +
        '}' +
      '}';
    head.appendChild(cssNode);

    var $title = modal.querySelector('h2');
    var $content = modal.querySelector('div.sweet-content');
    var $confirmBtn = modal.querySelector('button.' + window.swalClasses.confirm);
    var $cancelBtn = modal.querySelector('button.' + window.swalClasses.cancel);
    var $btnSpacer = modal.querySelector('hr.sweet-spacer');

    // Title
    $title.innerHTML = escapeHtml(params.title).split('\n').join('<br>');

    // Content
    if (window.jQuery) {
      $content = $($content).html(params.html || ('<p>' + escapeHtml(params.text.split('\n').join('<br>'))) + '</p>');
    } else {
      $content.innerHTML = params.html || ('<p>' + escapeHtml(params.text.split('\n').join('<br>')) + '</p>');
      if ($content.innerHTML) {
        show($content);
      }
    }

    // Custom Class
    modal.className = window.swalClasses.modal;
    if (params.customClass) {
      addClass(modal, params.customClass);
    }

    // Icon
    hide(modal.querySelectorAll('.' + window.swalClasses.icon));
    if (params.type) {
      var validType = false;
      for (var iconType in window.swalClasses.iconTypes) {
        if (params.type === iconType) {
          validType = true;
          break;
        }
      }
      if (!validType) {
        window.console.error('Unknown alert type: ' + params.type);
        return false;
      }
      var $icon = modal.querySelector('.' + window.swalClasses.icon + '.' + window.swalClasses.iconTypes[params.type]);
      show($icon);

      // Animate icon
      switch (params.type) {
        case 'success':
          addClass($icon, 'animate');
          addClass($icon.querySelector('.tip'), 'animate-success-tip');
          addClass($icon.querySelector('.long'), 'animate-success-long');
          break;
        case 'error':
          addClass($icon, 'animate-error-icon');
          addClass($icon.querySelector('.x-mark'), 'animate-x-mark');
          break;
        case 'warning':
          addClass($icon, 'pulse-warning');
          addClass($icon.querySelector('.body'), 'pulse-warning-ins');
          addClass($icon.querySelector('.dot'), 'pulse-warning-ins');
          break;
      }

    }

    // Custom image
    var $customImage = modal.querySelector('.sweet-image');
    if (params.imageUrl) {
      $customImage.setAttribute('src', params.imageUrl);
      show($customImage);

      if (params.imageWidth) {
        $customImage.setAttribute('width', params.imageWidth);
      }

      if (params.imageHeight) {
        $customImage.setAttribute('height', params.imageHeight);
      }

      if (params.imageClass) {
        addClass($customImage, params.imageClass);
      }
    } else {
      hide($customImage);
    }

    // Cancel button
    if (params.showCancelButton) {
      $cancelBtn.style.display = 'inline-block';
    } else {
      hide($cancelBtn);
    }

    // Confirm button
    if (params.showConfirmButton) {
      removeStyleProperty($confirmBtn, 'display');
    } else {
      hide($confirmBtn);
    }

    // Buttons spacer
    if (!params.showConfirmButton && !params.showCancelButton) {
      hide($btnSpacer);
    } else {
      show($btnSpacer);
    }

    // Edit text on cancel and confirm buttons
    $confirmBtn.innerHTML = escapeHtml(params.confirmButtonText);
    $cancelBtn.innerHTML = escapeHtml(params.cancelButtonText);

    // Set buttons to selected background colors
    if (params.buttonsStyling) {
      $confirmBtn.style.backgroundColor = params.confirmButtonColor;
      $cancelBtn.style.backgroundColor = params.cancelButtonColor;
    }

    // Add buttons custom classes
    $confirmBtn.className = window.swalClasses.confirm;
    addClass($confirmBtn, params.confirmButtonClass);
    $cancelBtn.className = window.swalClasses.cancel;
    addClass($cancelBtn, params.cancelButtonClass);

    // Buttons styling
    if (params.buttonsStyling) {
      addClass($confirmBtn, 'styled');
      addClass($cancelBtn, 'styled');
    } else {
      removeClass($confirmBtn, 'styled');
      removeClass($cancelBtn, 'styled');

      $confirmBtn.style.backgroundColor = $confirmBtn.style.borderLeftColor = $confirmBtn.style.borderRightColor = '';
      $cancelBtn.style.backgroundColor = $cancelBtn.style.borderLeftColor = $cancelBtn.style.borderRightColor = '';
    }

    // CSS animation
    if (params.animation === true) {
      removeClass(modal, 'no-animation');
    } else {
      addClass(modal, 'no-animation');
    }
  }

  /*
   * Set hover, active and focus-states for buttons (source: http://www.sitepoint.com/javascript-generate-lighter-darker-color)
   */
  function colorLuminance(hex, lum) {
    // Validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;

    // Convert to decimal and change luminosity
    var rgb = '#';
    for (var i = 0; i < 3; i++) {
      var c = parseInt(hex.substr(i * 2,2), 16);
      c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
      rgb += ('00' + c).substr(c.length);
    }

    return rgb;
  }

  function extend(a, b) {
    for (var key in b) {
      if (b.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }

    return a;
  }

  /*
   * Animations
   */
  function openModal() {
    var modal = getModal();
    fadeIn(getOverlay(), 10);
    show(modal);
    addClass(modal, 'show-sweet-alert');
    removeClass(modal, 'hide-sweet-alert');

    previousActiveElement = document.activeElement;

    setTimeout(function() {
      addClass(modal, 'visible');
    }, 500);
  }

  function closeModal() {
    var modal = getModal();
    _hide(getOverlay());
    _hide(modal);
    removeClass(modal, 'showSweetAlert');
    addClass(modal, 'hideSweetAlert');
    removeClass(modal, 'visible');

    // Reset icon animations

    var $successIcon = modal.querySelector('.' + window.swalClasses.icon + '.' + window.swalClasses.iconTypes.success);
    removeClass($successIcon, 'animate');
    removeClass($successIcon.querySelector('.tip'), 'animate-success-tip');
    removeClass($successIcon.querySelector('.long'), 'animate-success-long');

    var $errorIcon = modal.querySelector('.' + window.swalClasses.icon + '.' + window.swalClasses.iconTypes.error);
    removeClass($errorIcon, 'animate-error-icon');
    removeClass($errorIcon.querySelector('.x-mark'), 'animate-x-mark');

    var $warningIcon = modal.querySelector('.' + window.swalClasses.icon + '.' + window.swalClasses.iconTypes.warning);
    removeClass($warningIcon, 'pulse-warning');
    removeClass($warningIcon.querySelector('.body'), 'pulse-warning-ins');
    removeClass($warningIcon.querySelector('.dot'), 'pulse-warning-ins');

    resetPrevState();
  }

  // Reset the page to its previous state
  function resetPrevState() {
    var modal = getModal();
    window.onkeydown = previousWindowKeyDown;
    document.onclick = previousDocumentClick;
    if (previousActiveElement) {
      previousActiveElement.focus();
    }
    lastFocusedButton = undefined;
    clearTimeout(modal.timeout);

    // Remove dynamically created media query
    var head = document.getElementsByTagName('head')[0];
    var mediaquery = document.getElementById(mediaqueryId);
    if (mediaquery) {
      head.removeChild(mediaquery);
    }
  }

  /*
   * Set 'margin-top'-property on modal based on its computed height
   */
  function fixVerticalPosition() {
    var modal = getModal();

    modal.style.marginTop = getTopMargin(getModal());
  }

  /*
   * If library is injected after page has loaded
   */
  (function() {
    if (document.readyState === 'complete' || document.readyState === 'interactive' && document.body) {
      swal.init();
    } else {
      if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', function onDomContentLoaded() {
          document.removeEventListener('DOMContentLoaded', onDomContentLoaded, false);
          swal.init();
        }, false);
      } else if (document.attachEvent) {
        document.attachEvent('onreadystatechange', function onReadyStateChange() {
          if (document.readyState === 'complete') {
            document.detachEvent('onreadystatechange', onReadyStateChange);
            swal.init();
          }
        });
      }
    }
  })();

})(window, document);
