'use strict';

import { defaultParams, sweetContainer } from './utils/default.js';
import { swalClasses, iconTypes } from './utils/classes.js';
import { extend, colorLuminance } from './utils/utils.js';
import * as dom from './utils/dom.js';

var modalParams = extend({}, defaultParams);
var queue = [];
var swal2Observer;

/*
 * Set type, text and actions on modal
 */
var setParameters = function(params) {
  var modal = dom.getModal();

  for (var param in params) {
    if (!defaultParams.hasOwnProperty(param) && param !== 'extraParams') {
      console.warn('SweetAlert2: Unknown parameter "' + param + '"');
    }
  }

  // set modal width and margin-left
  modal.style.width = (typeof params.width === 'number') ? params.width + 'px' : params.width;

  modal.style.padding = params.padding + 'px';
  modal.style.background = params.background;

  var $title = modal.querySelector('h2');
  var $content = modal.querySelector('.' + swalClasses.content);
  var $confirmBtn = dom.getConfirmButton();
  var $cancelBtn = dom.getCancelButton();
  var $closeButton = modal.querySelector('.' + swalClasses.close);

  // Title
  $title.innerHTML = params.title.split('\n').join('<br>');

  // Content
  var i;
  if (params.text || params.html) {
    if (typeof params.html === 'object') {
      $content.innerHTML = '';
      if (0 in params.html) {
        for (i = 0; i in params.html; i++) {
          $content.appendChild(params.html[i].cloneNode(true));
        }
      } else {
        $content.appendChild(params.html.cloneNode(true));
      }
    } else {
      $content.innerHTML = params.html || (params.text.split('\n').join('<br>'));
    }
    dom.show($content);
  } else {
    dom.hide($content);
  }

  // Close button
  if (params.showCloseButton) {
    dom.show($closeButton);
  } else {
    dom.hide($closeButton);
  }

  // Custom Class
  modal.className = swalClasses.modal;
  if (params.customClass) {
    dom.addClass(modal, params.customClass);
  }

  // Progress steps
  var progressStepsContainer = dom.getProgressSteps();
  var currentProgressStep = parseInt(params.currentProgressStep === null? swal.getQueueStep() : params.currentProgressStep, 10);
  if (params.progressSteps.length) {
    dom.show(progressStepsContainer);
    dom.empty(progressStepsContainer);
    if (currentProgressStep >= params.progressSteps.length) {
      console.warn(
        'SweetAlert2: Invalid currentProgressStep parameter, it should be less than progressSteps.length ' +
        '(currentProgressStep like JS arrays starts from 0)'
      );
    }
    params.progressSteps.forEach(function(step, index) {
      var circle = document.createElement('li');
      dom.addClass(circle, swalClasses.progresscircle);
      circle.innerHTML = step;
      if (index === currentProgressStep) {
        dom.addClass(circle, swalClasses.activeprogressstep);
      }
      progressStepsContainer.appendChild(circle);
      if (index !== params.progressSteps.length - 1) {
        var line = document.createElement('li');
        dom.addClass(line, swalClasses.progressline);
        line.style.width = params.progressStepsDistance;
        progressStepsContainer.appendChild(line);
      }
    });
  } else {
    dom.hide(progressStepsContainer);
  }

  // Icon
  var icons = dom.getIcons();
  for (i = 0; i < icons.length; i++) {
    dom.hide(icons[i]);
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
    var $icon = modal.querySelector('.' + swalClasses.icon + '.' + iconTypes[params.type]);
    dom.show($icon);

    // Animate icon
    switch (params.type) {
      case 'success':
        dom.addClass($icon, 'animate');
        dom.addClass($icon.querySelector('.tip'), 'animate-success-tip');
        dom.addClass($icon.querySelector('.long'), 'animate-success-long');
        break;
      case 'error':
        dom.addClass($icon, 'animate-error-icon');
        dom.addClass($icon.querySelector('.x-mark'), 'animate-x-mark');
        break;
      case 'warning':
        dom.addClass($icon, 'pulse-warning');
        break;
      default:
        break;
    }

  }

  // Custom image
  var $customImage = modal.querySelector('.' + swalClasses.image);
  if (params.imageUrl) {
    $customImage.setAttribute('src', params.imageUrl);
    dom.show($customImage);

    if (params.imageWidth) {
      $customImage.setAttribute('width', params.imageWidth);
    } else {
      $customImage.removeAttribute('width');
    }

    if (params.imageHeight) {
      $customImage.setAttribute('height', params.imageHeight);
    } else {
      $customImage.removeAttribute('height');
    }

    $customImage.className = swalClasses.image;
    if (params.imageClass) {
      dom.addClass($customImage, params.imageClass);
    }
  } else {
    dom.hide($customImage);
  }

  // Cancel button
  if (params.showCancelButton) {
    $cancelBtn.style.display = 'inline-block';
  } else {
    dom.hide($cancelBtn);
  }

  // Confirm button
  if (params.showConfirmButton) {
    dom.removeStyleProperty($confirmBtn, 'display');
  } else {
    dom.hide($confirmBtn);
  }

  // Buttons spacer
  var spacer = dom.getSpacer();
  if (!params.showConfirmButton && !params.showCancelButton) {
    dom.hide(spacer);
  } else {
    dom.show(spacer);
  }

  // Edit text on cancel and confirm buttons
  $confirmBtn.innerHTML = params.confirmButtonText;
  $cancelBtn.innerHTML = params.cancelButtonText;

  // Set buttons to selected background colors
  if (params.buttonsStyling) {
    $confirmBtn.style.backgroundColor = params.confirmButtonColor;
    $cancelBtn.style.backgroundColor = params.cancelButtonColor;
  }

  // Add buttons custom classes
  $confirmBtn.className = swalClasses.confirm;
  dom.addClass($confirmBtn, params.confirmButtonClass);
  $cancelBtn.className = swalClasses.cancel;
  dom.addClass($cancelBtn, params.cancelButtonClass);

  // Buttons styling
  if (params.buttonsStyling) {
    dom.addClass($confirmBtn, 'styled');
    dom.addClass($cancelBtn, 'styled');
  } else {
    dom.removeClass($confirmBtn, 'styled');
    dom.removeClass($cancelBtn, 'styled');

    $confirmBtn.style.backgroundColor = $confirmBtn.style.borderLeftColor = $confirmBtn.style.borderRightColor = '';
    $cancelBtn.style.backgroundColor = $cancelBtn.style.borderLeftColor = $cancelBtn.style.borderRightColor = '';
  }

  // CSS animation
  if (params.animation === true) {
    dom.removeClass(modal, 'no-animation');
  } else {
    dom.addClass(modal, 'no-animation');
  }
};

/*
 * Animations
 */
var openModal = function(animation, onComplete) {
  var modal = dom.getModal();
  if (animation) {
    dom.addClass(modal, 'show-swal2');
    dom.addClass(sweetContainer, 'fade');
    dom.removeClass(modal, 'hide-swal2');
  } else {
    dom.removeClass(modal, 'fade');
  }
  dom.show(modal);

  // scrolling is 'hidden' until animation is done, after that 'auto'
  sweetContainer.style.overflowY = 'hidden';
  if (dom.animationEndEvent && !dom.hasClass(modal, 'no-animation')) {
    modal.addEventListener(dom.animationEndEvent, function swalCloseEventFinished() {
      modal.removeEventListener(dom.animationEndEvent, swalCloseEventFinished);
      sweetContainer.style.overflowY = 'auto';
    });
  } else {
    sweetContainer.style.overflowY = 'auto';
  }

  dom.addClass(sweetContainer, 'in');
  dom.addClass(document.body, swalClasses.in);
  fixScrollbar();
  dom.states.previousActiveElement = document.activeElement;
  if (onComplete !== null && typeof onComplete === 'function') {
    onComplete.call(this, modal);
  }
};

function fixScrollbar() {
  // for queues, do not do this more than once
  if (dom.states.previousBodyPadding !== null) {
    return;
  }
  // if the body has overflow
  if (document.body.scrollHeight > window.innerHeight) {
    // add padding so the content doesn't shift after removal of scrollbar
    dom.states.previousBodyPadding = document.body.style.paddingRight;
    document.body.style.paddingRight = dom.measureScrollbar() + 'px';
  }
}

function undoScrollbar() {
  if (dom.states.previousBodyPadding !== null) {
    document.body.style.paddingRight = dom.states.previousBodyPadding;
    dom.states.previousBodyPadding = null;
  }
}

function modalDependant() {
  if (arguments[0] === undefined) {
    console.error('SweetAlert2 expects at least 1 attribute!');
    return false;
  }

  var params = extend({}, modalParams);

  switch (typeof arguments[0]) {

    case 'string':
      params.title = arguments[0];
      params.text  = arguments[1] || '';
      params.type  = arguments[2] || '';

      break;

    case 'object':
      extend(params, arguments[0]);
      params.extraParams = arguments[0].extraParams;

      if (params.input === 'email' && params.inputValidator === null) {
        params.inputValidator = function(email) {
          return new Promise(function(resolve, reject) {
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
      console.error('SweetAlert2: Unexpected type of argument! Expected "string" or "object", got ' + typeof arguments[0]);
      return false;
  }

  setParameters(params);

  // Modal interactions
  var modal = dom.getModal();

  return new Promise(function(resolve, reject) {
    // Close on timer
    if (params.timer) {
      modal.timeout = setTimeout(function() {
        sweetAlert.closeModal(params.onClose);
        reject('timer');
      }, params.timer);
    }

    // Get input element by specified type or, if type isn't specified, by params.input
    var getInput = function(inputType) {
      inputType = inputType || params.input;
      switch (inputType) {
        case 'select':
        case 'textarea':
        case 'file':
          return dom.getChildByClass(modal, swalClasses[inputType]);
        case 'checkbox':
          return modal.querySelector('.' + swalClasses.checkbox + ' input');
        case 'radio':
          return modal.querySelector('.' + swalClasses.radio + ' input:checked') ||
            modal.querySelector('.' + swalClasses.radio + ' input:first-child');
        case 'range':
          return modal.querySelector('.' + swalClasses.range + ' input');
        default:
          return dom.getChildByClass(modal, swalClasses.input);
      }
    };

    // Get the value of the modal input
    var getInputValue = function() {
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
          return params.inputAutoTrim? input.value.trim() : input.value;
      }
    };

    // input autofocus
    if (params.input) {
      setTimeout(function() {
        var input = getInput();
        if (input) {
          dom.focusInput(input);
        }
      }, 0);
    }

    var confirm = function(value) {
      if (params.showLoaderOnConfirm) {
        sweetAlert.showLoading();
      }

      if (params.preConfirm) {
        params.preConfirm(value, params.extraParams).then(
          function(preConfirmValue) {
            sweetAlert.closeModal(params.onClose);
            resolve(preConfirmValue || value);
          },
          function(error) {
            sweetAlert.hideLoading();
            if (error) {
              sweetAlert.showValidationError(error);
            }
          }
        );
      } else {
        sweetAlert.closeModal(params.onClose);
        resolve(value);
      }
    };

    // Mouse interactions
    var onButtonEvent = function(event) {
      var e = event || window.event;
      var target = e.target || e.srcElement;
      var confirmBtn = dom.getConfirmButton();
      var cancelBtn = dom.getCancelButton();
      var targetedConfirm = confirmBtn === target || confirmBtn.contains(target);
      var targetedCancel = cancelBtn === target || cancelBtn.contains(target);

      switch (e.type) {
        case 'mouseover':
        case 'mouseup':
          if (params.buttonsStyling) {
            if (targetedConfirm) {
              confirmBtn.style.backgroundColor = colorLuminance(params.confirmButtonColor, -0.1);
            } else if (targetedCancel) {
              cancelBtn.style.backgroundColor = colorLuminance(params.cancelButtonColor, -0.1);
            }
          }
          break;
        case 'mouseout':
          if (params.buttonsStyling) {
            if (targetedConfirm) {
              confirmBtn.style.backgroundColor = params.confirmButtonColor;
            } else if (targetedCancel) {
              cancelBtn.style.backgroundColor = params.cancelButtonColor;
            }
          }
          break;
        case 'mousedown':
          if (params.buttonsStyling) {
            if (targetedConfirm) {
              confirmBtn.style.backgroundColor = colorLuminance(params.confirmButtonColor, -0.2);
            } else if (targetedCancel) {
              cancelBtn.style.backgroundColor = colorLuminance(params.cancelButtonColor, -0.2);
            }
          }
          break;
        case 'click':
          // Clicked 'confirm'
          if (targetedConfirm && sweetAlert.isVisible()) {
            if (params.input) {
              var inputValue = getInputValue();

              if (params.inputValidator) {
                sweetAlert.disableInput();
                params.inputValidator(inputValue, params.extraParams).then(
                  function() {
                    sweetAlert.enableInput();
                    confirm(inputValue);
                  },
                  function(error) {
                    sweetAlert.enableInput();
                    if (error) {
                      sweetAlert.showValidationError(error);
                    }
                  }
                );
              } else {
                confirm(inputValue);
              }

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

    var $buttons = modal.querySelectorAll('button');
    var i;
    for (i = 0; i < $buttons.length; i++) {
      $buttons[i].onclick     = onButtonEvent;
      $buttons[i].onmouseover = onButtonEvent;
      $buttons[i].onmouseout  = onButtonEvent;
      $buttons[i].onmousedown = onButtonEvent;
    }

    // Closing modal by close button
    dom.getCloseButton().onclick = function() {
      sweetAlert.closeModal(params.onClose);
      reject('close');
    };

    // Closing modal by overlay click
    sweetContainer.onclick = function(e) {
      if (e.target !== sweetContainer) {
        return;
      }
      if (params.allowOutsideClick) {
        sweetAlert.closeModal(params.onClose);
        reject('overlay');
      }
    };

    var $confirmButton = dom.getConfirmButton();
    var $cancelButton = dom.getCancelButton();

    // Reverse buttons if neede d
    if (params.reverseButtons) {
      $confirmButton.parentNode.insertBefore($cancelButton, $confirmButton);
    } else {
      $confirmButton.parentNode.insertBefore($confirmButton, $cancelButton);
    }

    // Focus handling
    function setFocus(index, increment) {
      var focusableElements = dom.getFocusableElements(params.focusCancel);
      // search for visible elements and select the next possible match
      for (var i = 0; i < focusableElements.length; i++) {
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
        if (dom.isVisible(el)) {
          return el.focus();
        }
      }
    }

    function handleKeyDown(event) {
      var e = event || window.event;
      var keyCode = e.keyCode || e.which;

      if ([9, 13, 32, 27].indexOf(keyCode) === -1) {
        // Don't do work on keys we don't care about.
        return;
      }

      var $targetElement = e.target || e.srcElement;

      var focusableElements = dom.getFocusableElements(params.focusCancel);
      var btnIndex = -1; // Find the button - note, this is a nodelist, not an array.
      for (var i = 0; i < focusableElements.length; i++) {
        if ($targetElement === focusableElements[i]) {
          btnIndex = i;
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

        dom.stopEventPropagation(e);

      } else {
        if (keyCode === 13 || keyCode === 32) {
          if (btnIndex === -1) {
            // ENTER/SPACE clicked outside of a button.
            if (params.focusCancel) {
              dom.fireClick($cancelButton, e);
            } else {
              dom.fireClick($confirmButton, e);
            }
          }
        } else if (keyCode === 27 && params.allowEscapeKey === true) {
          sweetAlert.closeModal(params.onClose);
          reject('esc');
        }
      }
    }

    dom.states.previousWindowKeyDown = window.onkeydown;
    window.onkeydown = handleKeyDown;

    // Loading state
    if (params.buttonsStyling) {
      $confirmButton.style.borderLeftColor = params.confirmButtonColor;
      $confirmButton.style.borderRightColor = params.confirmButtonColor;
    }

    /**
     * Show spinner instead of Confirm button and disable Cancel button
     */
    sweetAlert.showLoading = sweetAlert.enableLoading = function() {
      dom.show(dom.getSpacer());
      dom.show($confirmButton, 'inline-block');
      dom.addClass($confirmButton, 'loading');
      dom.addClass(modal, 'loading');
      $confirmButton.disabled = true;
      $cancelButton.disabled = true;
    };

    /**
     * Show spinner instead of Confirm button and disable Cancel button
     */
    sweetAlert.hideLoading = sweetAlert.disableLoading = function() {
      if (!params.showConfirmButton) {
        dom.hide($confirmButton);
        if (!params.showCancelButton) {
          dom.hide(dom.getSpacer());
        }
      }
      dom.removeClass($confirmButton, 'loading');
      dom.removeClass(modal, 'loading');
      $confirmButton.disabled = false;
      $cancelButton.disabled = false;
    };

    sweetAlert.enableButtons = function() {
      $confirmButton.disabled = false;
      $cancelButton.disabled = false;
    };

    sweetAlert.disableButtons = function() {
      $confirmButton.disabled = true;
      $cancelButton.disabled = true;
    };

    sweetAlert.enableConfirmButton = function() {
      $confirmButton.disabled = false;
    };

    sweetAlert.disableConfirmButton = function() {
      $confirmButton.disabled = true;
    };

    sweetAlert.enableInput = function() {
      var input = getInput();
      if (!input) {
        return false;
      }
      if (input.type === 'radio') {
        var radiosContainer = input.parentNode.parentNode;
        var radios = radiosContainer.querySelectorAll('input');
        for (var i = 0; i < radios.length; i++) {
          radios[i].disabled = false;
        }
      } else {
        input.disabled = false;
      }
    };

    sweetAlert.disableInput = function() {
      var input = getInput();
      if (!input) {
        return false;
      }
      if (input && input.type === 'radio') {
        var radiosContainer = input.parentNode.parentNode;
        var radios = radiosContainer.querySelectorAll('input');
        for (var i = 0; i < radios.length; i++) {
          radios[i].disabled = true;
        }
      } else {
        input.disabled = true;
      }
    };

    // Set modal min-height to disable scrolling inside the modal
    sweetAlert.recalculateHeight = function() {
      var modal = dom.getModal() || sweetAlert.init();
      var prevState = modal.style.display;
      modal.style.minHeight = '';
      dom.show(modal);
      modal.style.minHeight = (modal.scrollHeight + 1) + 'px';
      modal.style.display = prevState;
    };

    // Show block with validation error
    sweetAlert.showValidationError = function(error) {
      var $validationError = modal.querySelector('.' + swalClasses.validationerror);
      $validationError.innerHTML = error;
      dom.show($validationError);

      var input = getInput();
      dom.focusInput(input);
      dom.addClass(input, 'error');
    };

    // Hide block with validation error
    sweetAlert.resetValidationError = function() {
      var $validationError = modal.querySelector('.' + swalClasses.validationerror);
      dom.hide($validationError);

      var input = getInput();
      if (input) {
        dom.removeClass(input, 'error');
      }
    };

    sweetAlert.getProgressSteps = function() {
      return params.progressSteps;
    };

    sweetAlert.setProgressSteps = function(progressSteps) {
      params.progressSteps = progressSteps;
      setParameters(params);
    };

    sweetAlert.showProgressSteps = function() {
      dom.show(dom.getProgressSteps());
    };

    sweetAlert.hideProgressSteps = function() {
      dom.hide(dom.getProgressSteps());
    };

    sweetAlert.enableButtons();
    sweetAlert.hideLoading();
    sweetAlert.resetValidationError();

    // inputs
    var inputTypes = ['input', 'file', 'range', 'select', 'radio', 'checkbox', 'textarea'];
    var input;
    for (i = 0; i < inputTypes.length; i++) {
      var inputClass = swalClasses[inputTypes[i]];
      var inputContainer = dom.getChildByClass(modal, inputClass);
      input = getInput(inputTypes[i]);

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
        dom.addClass(inputContainer, params.inputClass);
      }

      dom.hide(inputContainer);
    }

    var populateInputOptions;
    switch (params.input) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
      case 'tel':
        input = dom.getChildByClass(modal, swalClasses.input);
        input.value = params.inputValue;
        input.placeholder = params.inputPlaceholder;
        input.type = params.input;
        dom.show(input);
        break;
      case 'file':
        input = dom.getChildByClass(modal, swalClasses.file);
        input.placeholder = params.inputPlaceholder;
        input.type = params.input;
        dom.show(input);
        break;
      case 'range':
        var range = dom.getChildByClass(modal, swalClasses.range);
        var rangeInput = range.querySelector('input');
        var rangeOutput = range.querySelector('output');
        rangeInput.value = params.inputValue;
        rangeInput.type = params.input;
        rangeOutput.value = params.inputValue;
        dom.show(range);
        break;
      case 'select':
        var select = dom.getChildByClass(modal, swalClasses.select);
        select.innerHTML = '';
        if (params.inputPlaceholder) {
          var placeholder = document.createElement('option');
          placeholder.innerHTML = params.inputPlaceholder;
          placeholder.value = '';
          placeholder.disabled = true;
          placeholder.selected = true;
          select.appendChild(placeholder);
        }
        populateInputOptions = function(inputOptions) {
          for (var optionValue in inputOptions) {
            var option = document.createElement('option');
            option.value = optionValue;
            option.innerHTML = inputOptions[optionValue];
            if (params.inputValue === optionValue) {
              option.selected = true;
            }
            select.appendChild(option);
          }
          dom.show(select);
          select.focus();
        };
        break;
      case 'radio':
        var radio = dom.getChildByClass(modal, swalClasses.radio);
        radio.innerHTML = '';
        populateInputOptions = function(inputOptions) {
          for (var radioValue in inputOptions) {
            var id = 1;
            var radioInput = document.createElement('input');
            var radioLabel = document.createElement('label');
            var radioLabelSpan = document.createElement('span');
            radioInput.type = 'radio';
            radioInput.name = swalClasses.radio;
            radioInput.value = radioValue;
            radioInput.id = swalClasses.radio + '-' + (id++);
            if (params.inputValue === radioValue) {
              radioInput.checked = true;
            }
            radioLabelSpan.innerHTML = inputOptions[radioValue];
            radioLabel.appendChild(radioInput);
            radioLabel.appendChild(radioLabelSpan);
            radioLabel.for = radioInput.id;
            radio.appendChild(radioLabel);
          }
          dom.show(radio);
          var radios = radio.querySelectorAll('input');
          if (radios.length) {
            radios[0].focus();
          }
        };
        break;
      case 'checkbox':
        var checkbox = dom.getChildByClass(modal, swalClasses.checkbox);
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
        dom.show(checkbox);
        break;
      case 'textarea':
        var textarea = dom.getChildByClass(modal, swalClasses.textarea);
        textarea.value = params.inputValue;
        textarea.placeholder = params.inputPlaceholder;
        dom.show(textarea);
        break;
      case null:
        break;
      default:
        console.error('SweetAlert2: Unexpected type of input! Expected "text" or "email" or "password", "select", "checkbox", "textarea" or "file", got "' + params.input + '"');
        break;
    }

    if (params.input === 'select' || params.input === 'radio') {
      if (params.inputOptions instanceof Promise) {
        sweetAlert.showLoading();
        params.inputOptions.then(function(inputOptions) {
          sweetAlert.hideLoading();
          populateInputOptions(inputOptions);
        });
      } else if (typeof params.inputOptions === 'object') {
        populateInputOptions(params.inputOptions);
      } else {
        console.error('SweetAlert2: Unexpected type of inputOptions! Expected object or Promise, got ' + typeof params.inputOptions);
      }
    }

    openModal(params.animation, params.onOpen);

    // Focus the first element (input or button)
    setFocus(-1, 1);

    // fix scroll
    sweetContainer.scrollTop = 0;

    // Observe changes inside the modal and adjust height
    if (typeof MutationObserver !== 'undefined' && !swal2Observer) {
      var mutationsHandler = dom.debounce(function() {
        sweetAlert.recalculateHeight();
      }, 50);
      swal2Observer = new MutationObserver(mutationsHandler);
      swal2Observer.observe(modal, {childList: true, characterData: true, subtree: true});
    }
  });
}

// SweetAlert function
function sweetAlert() {
  // Copy arguments to the local args variable
  var args = arguments;
  var modal = dom.getModal();

  if (modal === null) {
    sweetAlert.init();
    modal = dom.getModal();
  }

  if (sweetAlert.isVisible()) {
    sweetAlert.close();
  }

  return modalDependant.apply(this, args);
}

/*
 * Global function to determine if swal2 modal is visible
 */
sweetAlert.isVisible = function() {
  var modal = dom.getModal();
  return dom.isVisible(modal);
};

/*
 * Global function for chaining sweetAlert modals
 */
sweetAlert.queue = function(steps) {
  queue = steps;
  var modal = dom.getModal() || sweetAlert.init();
  var resetQueue = function() {
    queue = [];
    modal.removeAttribute('data-queue-step');
  };
  return new Promise(function(resolve, reject) {
    (function step(i, callback) {
      if (i < queue.length) {
        modal.setAttribute('data-queue-step', i);

        sweetAlert(queue[i]).then(function() {
          step(i+1, callback);
        }, function(dismiss) {
          resetQueue();
          reject(dismiss);
        });
      } else {
        resetQueue();
        resolve();
      }
    })(0);
  });
};

/*
 * Global function for getting the index of current modal in queue
 */
sweetAlert.getQueueStep = function() {
  return dom.getModal().getAttribute('data-queue-step');
};

/*
 * Global function for inserting a modal to the queue
 */
sweetAlert.insertQueueStep = function(step, index) {
  if (index && index < queue.length) {
    return queue.splice(index, 0, step);
  }
  return queue.push(step);
};

/*
 * Global function for deleting a modal from the queue
 */
sweetAlert.deleteQueueStep = function(index) {
  if (typeof queue[index] !== 'undefined') {
    queue.splice(index, 1);
  }
};

/*
 * Global function to close sweetAlert
 */
sweetAlert.close = sweetAlert.closeModal = function(onComplete) {
  var modal = dom.getModal();
  dom.removeClass(modal, 'show-swal2');
  dom.addClass(modal, 'hide-swal2');

  // Reset icon animations
  var $successIcon = modal.querySelector('.' + swalClasses.icon + '.' + iconTypes.success);
  dom.removeClass($successIcon, 'animate');
  dom.removeClass($successIcon.querySelector('.tip'), 'animate-success-tip');
  dom.removeClass($successIcon.querySelector('.long'), 'animate-success-long');

  var $errorIcon = modal.querySelector('.' + swalClasses.icon + '.' + iconTypes.error);
  dom.removeClass($errorIcon, 'animate-error-icon');
  dom.removeClass($errorIcon.querySelector('.x-mark'), 'animate-x-mark');

  var $warningIcon = modal.querySelector('.' + swalClasses.icon + '.' + iconTypes.warning);
  dom.removeClass($warningIcon, 'pulse-warning');

  dom.resetPrevState();

  // If animation is supported, animate
  if (dom.animationEndEvent && !dom.hasClass(modal, 'no-animation')) {
    modal.addEventListener(dom.animationEndEvent, function swalCloseEventFinished() {
      modal.removeEventListener(dom.animationEndEvent, swalCloseEventFinished);
      if (dom.hasClass(modal, 'hide-swal2')) {
        dom.hide(modal);
        dom.removeClass(sweetContainer, 'in');
        dom.removeClass(document.body, swalClasses.in);
        undoScrollbar();
      }
    });
  } else {
    // Otherwise, hide immediately
    dom.hide(modal);
    dom.removeClass(sweetContainer, 'in');
    dom.removeClass(document.body, swalClasses.in);
    undoScrollbar();
  }
  if (onComplete !== null && typeof onComplete === 'function') {
    onComplete.call(this, modal);
  }
};

/*
 * Global function to click 'Confirm' button
 */
sweetAlert.clickConfirm = function() {
  dom.getConfirmButton().click();
};

/*
 * Global function to click 'Cancel' button
 */
sweetAlert.clickCancel = function() {
  dom.getCancelButton().click();
};

/*
 * Add modal + overlay to DOM
 */
sweetAlert.init = function() {
  if (typeof document === 'undefined') {
    console.error('SweetAlert2 requires document to initialize');
    return;
  } else if (document.getElementsByClassName(swalClasses.container).length) {
    return;
  }

  document.body.appendChild(sweetContainer);

  var modal = dom.getModal();
  var input = dom.getChildByClass(modal, swalClasses.input);
  var file = dom.getChildByClass(modal, swalClasses.file);
  var range = modal.querySelector('.' + swalClasses.range + ' input');
  var select = dom.getChildByClass(modal, swalClasses.select);
  var checkbox = modal.querySelector('.' + swalClasses.checkbox + ' input');
  var textarea = dom.getChildByClass(modal, swalClasses.textarea);

  input.oninput = function() {
    sweetAlert.resetValidationError();
  };

  input.onkeyup = function(event) {
    event.stopPropagation();
    if (event.keyCode === 13) {
      sweetAlert.clickConfirm();
    }
  };

  file.onchange = function() {
    sweetAlert.resetValidationError();
  };

  range.oninput = function() {
    sweetAlert.resetValidationError();
    range.previousSibling.value = range.value;
  };

  range.onchange = function() {
    sweetAlert.resetValidationError();
    range.previousSibling.value = range.value;
  };

  select.onchange = function() {
    sweetAlert.resetValidationError();
  };

  checkbox.onchange = function() {
    sweetAlert.resetValidationError();
  };

  textarea.oninput = function() {
    sweetAlert.resetValidationError();
  };

  return modal;
};

/**
 * Set default params for each popup
 * @param {Object} userParams
 */
sweetAlert.setDefaults = function(userParams) {
  if (!userParams) {
    throw new Error('userParams is required');
  }
  if (typeof userParams !== 'object') {
    throw new Error('userParams has to be a object');
  }

  extend(modalParams, userParams);
};

/**
 * Reset default params for each popup
 */
sweetAlert.resetDefaults = function() {
  modalParams = extend({}, defaultParams);
};

sweetAlert.version = '';

window.sweetAlert = window.swal = sweetAlert;

/*
* If library is injected after page has loaded
*/
(function() {
  if (document.readyState === 'complete' || document.readyState === 'interactive' && document.body) {
    sweetAlert.init();
  } else {
    document.addEventListener('DOMContentLoaded', function onDomContentLoaded() {
      document.removeEventListener('DOMContentLoaded', onDomContentLoaded, false);
      sweetAlert.init();
    }, false);
  }
})();

if (typeof Promise === 'function') {
  Promise.prototype.done = Promise.prototype.done || function() {
    return this.catch(function() {
      // Catch promise rejections silently.
      // https://github.com/limonte/sweetalert2/issues/177
    });
  };
} else {
  console.warn('SweetAlert2: Please inlude Promise polyfill BEFORE including sweetalert2.js if IE10+ support needed.');
}

export default sweetAlert;
