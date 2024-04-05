"use strict";

// canvas template
var canvas = document.querySelector('.myCanvas');
var ctx = canvas.getContext('2d');
var width = canvas.width = window.innerWidth - 20;
var height = canvas.height = window.innerHeight - 20; // gonna make a full sized canvas with a little bit of ground leeway
// now you can clearred fillrect fillstyle arc on the ctx
// for animations

var sleep = function sleep(ms) {
  return new Promise(function (res) {
    return setTimeout(res, ms);
  });
}; // main loop


(function _callee() {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!true) {
            _context.next = 5;
            break;
          }

          _context.next = 3;
          return regeneratorRuntime.awrap(sleep(2));

        case 3:
          _context.next = 0;
          break;

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
})(); // ok thats it for the main loop
// keypress processing


(function _callee2() {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          window.addEventListener("keydown", function (event) {
            if (event.defaultPrevented) {
              return;
            }

            var actkey = event.code.replace('Key', '');
            var filterletters = 'QWERTYUIOPASDFGHJKLZXCVBNM';
          }, true);

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
})();