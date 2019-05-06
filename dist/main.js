"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _child_process = require("child_process");

var Jsto = function Jsto() {};

Jsto.saveJSON = function (path, obj, password) {
  return new Promise(function (resolve) {
    var child = (0, _child_process.fork)('dist/child.js');
    child.send({
      method: 'save',
      path: path,
      obj: obj,
      pwd: password
    });
    child.on('exit', function () {
      resolve();
    });
  });
};

Jsto.loadJSON = function (path, password) {
  return new Promise(function (resolve) {
    var child = (0, _child_process.fork)('dist/child.js');
    child.send({
      method: 'save',
      path: path,
      pwd: password
    });
    child.on('exit', function () {
      resolve();
    });
  });
};

var _default = Jsto;
exports["default"] = _default;