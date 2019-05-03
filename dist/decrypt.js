"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decryption = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _zlib = _interopRequireDefault(require("zlib"));

var _crypto = _interopRequireDefault(require("crypto"));

var decryption = function decryption() {};

exports.decryption = decryption;

var getCipherKey = function getCipherKey(password) {
  return _crypto["default"].createHash('sha256').update(password).digest();
};

decryption.getInitVectorStream = function (path) {
  var readInitVector = _fs["default"].createReadStream(path, {
    end: 15
  });

  return readInitVector;
};

decryption.decrypt = function (path, initVector, password) {
  var cipherKey = getCipherKey(password);

  var readStream = _fs["default"].createReadStream(path, {
    start: 16
  });

  var decipher = _crypto["default"].createDecipheriv('aes256', cipherKey, initVector);

  var unzip = _zlib["default"].createUnzip();

  return readStream.pipe(decipher).pipe(unzip);
};