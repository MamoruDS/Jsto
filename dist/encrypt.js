"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encrypt = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _crypto = _interopRequireDefault(require("crypto"));

var _zlib = _interopRequireDefault(require("zlib"));

var _stream = require("stream");

var gzipStream = _zlib["default"].createGzip();

var AppendInitVect =
/*#__PURE__*/
function (_Transform) {
  (0, _inherits2["default"])(AppendInitVect, _Transform);

  function AppendInitVect(initVect, opts) {
    var _this;

    (0, _classCallCheck2["default"])(this, AppendInitVect);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(AppendInitVect).call(this, opts));
    _this.initVect = initVect;
    _this.appended = false;
    return _this;
  }

  (0, _createClass2["default"])(AppendInitVect, [{
    key: "_transform",
    value: function _transform(chunk, encoding, cb) {
      if (!this.appended) {
        this.push(this.initVect);
        this.appended = true;
      }

      this.push(chunk);
      cb();
    }
  }]);
  return AppendInitVect;
}(_stream.Transform);

var getCipherKey = function getCipherKey(password) {
  return _crypto["default"].createHash('sha256').update(password).digest();
};

var encrypt = function encrypt(contentStream, password) {
  var initVector = _crypto["default"].randomBytes(16);

  var cipherKey = getCipherKey(password);

  var cipher = _crypto["default"].createCipheriv('aes256', cipherKey, initVector);

  var appendInitVect = new AppendInitVect(initVector);
  return contentStream.pipe(gzipStream).pipe(cipher).pipe(appendInitVect);
};

exports.encrypt = encrypt;