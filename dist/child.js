"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _main_old = _interopRequireDefault(require("./main_old"));

process.on('message',
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(msg) {
    var res;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(msg.method === 'save')) {
              _context.next = 6;
              break;
            }

            _context.next = 3;
            return _main_old["default"].saveJSON(msg.path, msg.obj, msg.pwd);

          case 3:
            process.send('ok');
            _context.next = 11;
            break;

          case 6:
            if (!(msg.method === 'load')) {
              _context.next = 11;
              break;
            }

            _context.next = 9;
            return _main_old["default"].loadJSON(msg.path, msg.pwd);

          case 9:
            res = _context.sent;
            process.send(res);

          case 11:
            process.exit(0);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());