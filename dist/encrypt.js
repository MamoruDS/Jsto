'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var crypto = require('crypto');
var zlib = require('zlib');
var gzipStream = zlib.createGzip();

var _require = require('stream'),
    Transform = _require.Transform;

var AppendInitVect = function (_Transform) {
    _inherits(AppendInitVect, _Transform);

    function AppendInitVect(initVect, opts) {
        _classCallCheck(this, AppendInitVect);

        var _this = _possibleConstructorReturn(this, (AppendInitVect.__proto__ || Object.getPrototypeOf(AppendInitVect)).call(this, opts));

        _this.initVect = initVect;
        _this.appended = false;
        return _this;
    }

    _createClass(AppendInitVect, [{
        key: '_transform',
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
}(Transform);

var getCipherKey = function getCipherKey(password) {
    return crypto.createHash('sha256').update(password).digest();
};

var encrypt = function encrypt(contentStream, password) {
    var initVector = crypto.randomBytes(16);
    var cipherKey = getCipherKey(password);
    var cipher = crypto.createCipheriv('aes256', cipherKey, initVector);
    var appendInitVect = new AppendInitVect(initVector);
    return contentStream.pipe(gzipStream).pipe(cipher).pipe(appendInitVect);
};

module.exports = encrypt;