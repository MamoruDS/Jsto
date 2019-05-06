"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _main = _interopRequireDefault(require("./main"));

var conf = {
  prop_A: 'sometext',
  prop_B: 123,
  prop_C: true,
  prop_D: [false, 456, 'data']
};

var jsonRead =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(path, passwd) {
    var data;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _main["default"].loadJSON(path, passwd);

          case 2:
            data = _context.sent;
            console.log(data);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function jsonRead(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}(); // jsto.saveJSON('sample.sto', conf, 'pwd')


jsonRead('sample.sto', 'pwd');