'use strict';

var _jsBeautify = require('js-beautify');

var _jsBeautify2 = _interopRequireDefault(_jsBeautify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');
var Readable = require('stream').Readable;


var encrypt = require('./encrypt');
var decryption = require('./decrypt');

var Jsto = function Jsto() {};

Jsto.saveJSON = function (path, obj, password) {
    var dataStr = JSON.stringify(obj);
    dataStr = (0, _jsBeautify2.default)(dataStr, {
        indent_size: 4
    });
    var dataStream = new Readable();
    dataStream.push(dataStr);
    dataStream.push(null);
    var writeStream = fs.createWriteStream(path);
    if (password === undefined || password === false) {
        dataStream.on('data', function (chunk) {
            writeStream.write(chunk);
        });
    } else {

        var encryptedStream = encrypt(dataStream, password);
        encryptedStream.on('unpipe', function () {}).pipe(writeStream);
    }
};

Jsto.loadJSON = function (path, password) {
    if (password === undefined || password === false) {
        var readStream = fs.createReadStream(path);
        var writeStream = fs.createWriteStream(path);

        readStream.on('data', function (chunk) {
            writeStream.write(chunk);
        });
    } else {
        var initVector = void 0;
        var readInitVector = decryption.getInitVectorStream(path);
        readInitVector.on('data', function (chunk) {
            initVector = chunk;

            var decryptedStream = void 0;
            readInitVector.on('close', function () {
                decryptedStream = decryption.decrypt(path, initVector, password);
                decryptedStream
                // .on('unpipe', () => {})
                .on('data', function (chunk) {
                    var dataStr = chunk.toString('utf8');
                    var dataObj = {};
                    console.log('result:' + dataStr);
                    try {
                        dataObj = JSON.parse(dataStr);
                    } catch (err) {
                        //
                    }
                    return dataObj;
                });
            });
        });
    }
};

module.exports = Jsto;