"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _stream = require("stream");

var _jsBeautify = _interopRequireDefault(require("js-beautify"));

var _encrypt = require("./encrypt");

var _decrypt = require("./decrypt");

var Jsto = function Jsto() {};

Jsto.saveJSON = function (path, obj, password) {
  return new Promise(function (resolve) {
    var dataStr = JSON.stringify(obj);
    dataStr = (0, _jsBeautify["default"])(dataStr, {
      indent_size: 4
    });
    var dataStream = new _stream.Readable();
    dataStream.push(dataStr);
    dataStream.push(null);

    var writeStream = _fs["default"].createWriteStream(path);

    if (password === undefined || password === false) {
      dataStream.on('data', function (chunk) {
        writeStream.write(chunk);
        writeStream.end();
        writeStream.on('finish', function () {
          resolve('what ever');
        });
        writeStream.on('end', function () {// resolve()
        });
      });
    } else {
      var encryptedStream = (0, _encrypt.encrypt)(dataStream, password);
      encryptedStream.on('unpipe', function () {}).pipe(writeStream).on('unpipe', function () {
        resolve();
      });
    }
  });
};

Jsto.loadJSON = function (path, password) {
  var touchFile = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  if (!_fs["default"].existsSync(path)) {
    if (touchFile) {
      Jsto.saveJSON(path, {}, password);
    }

    return {};
  } else {
    return new Promise(function (resolve) {
      if (password === undefined || password === false) {
        var readStream = _fs["default"].createReadStream(path);

        var dataStr = '';
        readStream.on('data', function (chunk) {
          dataStr = dataStr + chunk.toString('utf8');
        }).on('close', function () {
          var dataObj = {};

          try {
            dataObj = JSON.parse(dataStr);
          } catch (err) {//
          }

          resolve(dataObj);
        });
      } else {
        var initVector;

        var readInitVector = _decrypt.decryption.getInitVectorStream(path);

        readInitVector.on('data', function (chunk) {
          initVector = chunk;
          var decryptedStream;
          readInitVector.on('close', function () {
            var dataStr = '';
            decryptedStream = _decrypt.decryption.decrypt(path, initVector, password);
            decryptedStream // .on('unpipe', () => {})
            .on('data', function (chunk) {
              dataStr = dataStr + chunk.toString('utf8');
            }).on('close', function () {
              var dataObj = {};

              try {
                dataObj = JSON.parse(dataStr);
              } catch (err) {//
              }

              resolve(dataObj);
            });
          });
        });
      }
    });
  }
};

var _default = Jsto;
exports["default"] = _default;