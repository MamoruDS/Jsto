"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _path = _interopRequireDefault(require("path"));

var _child_process = require("child_process");

var Jsto = function Jsto() {};

var childPath = _path["default"].join(__dirname, 'child.js');

Jsto.saveJSON = function (path, obj, password) {
  return new Promise(function (resolve) {
    var child = (0, _child_process.fork)(childPath);
    child.send({
      method: 'save',
      path: path,
      obj: obj,
      pwd: password
    });
    child.on('message', function () {
      resolve();
    });
  });
};

Jsto.loadJSON = function (path, password) {
  return new Promise(function (resolve) {
    var child = (0, _child_process.fork)(childPath);
    child.send({
      method: 'load',
      path: path,
      pwd: password
    });
    child.on('message', function (msg) {
      resolve(msg);
    });
  });
};

var _default = Jsto;
exports["default"] = _default;