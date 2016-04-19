/*
*   Listen for clicks in the popup.
*
*   If the click is not on one of the menuitems, which are identified
*   by having their CSS class set to 'visually', return early.
*
*   Otherwise, the text content of the node is the selected option:
*     * Inject the visua11y script into the active tab
*     * Send it a message containing the selected option
*/
document.addEventListener("click", function (e) {
  if (!e.target.classList.contains("visua11y")) {
    return;
  }

  var selection = e.target.textContent;

  chrome.tabs.insertCSS(null, {
    file: "/content-scripts/visua11y.css"
  });

  chrome.tabs.executeScript(null, {
    file: "/content-scripts/visua11y.js"
  });

  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {selection: selection});
  });

});

/*
*   @constructor Menu: Encapsulate state and behavior of menu popup
*
*   @param node : The element node that serves as the menu container.
*          Each child element that serves as a menuitem must have its
*          role attribute set to 'menuitem'.
*/
var Menu = function (node) {
  // Check whether node is a DOM element
  if (!node instanceof Element)
    throw new TypeError("Constructor argument 'node' is not a DOM Element.");

  // Check whether menu has child menuitems
  if (node.childElementCount === 0)
    throw new Error("Constructor argument 'node' has no Element children!")

  this.menuNode  = node;
  this.firstItem = null;
  this.lastItem  = null;

  this.keyCode = Object.freeze({
    'TAB'      :  9,
    'RETURN'   : 13,
    'ESC'      : 27,
    'SPACE'    : 32,
    'PAGEUP'   : 33,
    'PAGEDOWN' : 34,
    'END'      : 35,
    'HOME'     : 36,
    'LEFT'     : 37,
    'UP'       : 38,
    'RIGHT'    : 39,
    'DOWN'     : 40
  });
};

/*
*   @method Menu.prototype.init
*
*   Initialize firstItem, lastItem
*   Set tabindex to 0 for each menuitem
*   Add event listeners for 'keydown' events
*   Set focus to first menuitem
*/
Menu.prototype.init = function () {
  var menu = this,
      mi = this.menuNode.firstElementChild;

  while (mi) {
    if (mi.getAttribute('role') === 'menuitem') {
      if (!this.firstItem) this.firstItem = mi;
      this.lastItem = mi;
      mi.tabIndex = 0;
      mi.addEventListener('keydown', function (event) {
        menu.handleKeydown(event);
      });
    }
    mi = mi.nextElementSibling;
  }

  this.firstItem.focus();
};

/*
*   @method Menu.prototype.handleKeydown: Handle 'keydown' events
*   on elements identified as menuitems.
*/
Menu.prototype.handleKeydown = function (event) {
  var tgt = event.currentTarget,
      flag = false;

  switch (event.keyCode) {
    case this.keyCode.SPACE:
    case this.keyCode.RETURN:
      var clickEvent = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      tgt.dispatchEvent(clickEvent);
      flag = true;
      break;

    case this.keyCode.ESC:
    case this.keyCode.TAB:
      this.close();
      flag = true;
      break;

    case this.keyCode.UP:
    case this.keyCode.LEFT:
      this.previousItem(tgt);
      flag = true;
      break;

    case this.keyCode.DOWN:
    case this.keyCode.RIGHT:
      this.nextItem(tgt);
      flag = true;
      break;

    case this.keyCode.HOME:
    case this.keyCode.PAGEUP:
      this.firstItem.focus();
      flag = true;
      break;

    case this.keyCode.END:
    case this.keyCode.PAGEDOWN:
      this.lastItem.focus();
      flag = true;
      break;

    default:
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

Menu.prototype.previousItem = function (currentItem) {
  var mi = currentItem.previousElementSibling;

  while (mi) {
    if (mi.getAttribute('role')  === 'menuitem') {
      mi.focus();
      break;
    }
    mi = mi.previousElementSibling;
  }

  if (!mi && this.lastItem) {
    this.lastItem.focus();
  }
};

Menu.prototype.nextItem = function (currentItem) {
  var mi = currentItem.nextElementSibling;

  while (mi) {
    if (mi.getAttribute('role')  === 'menuitem') {
      mi.focus();
      break;
    }
    mi = mi.nextElementSibling;
  }

  if (!mi && this.firstItem) {
    this.firstItem.focus();
  }
};

Menu.prototype.close = function () {
  window.close();
};

/*
*   initMenu: Instantiate and initialize Menu object
*/
function initMenu () {
  var menu = new Menu(document.getElementById('menu'));
  menu.init();
}

window.addEventListener("load", initMenu);
