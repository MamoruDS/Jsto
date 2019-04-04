'use strict';

var fs = require('fs');
var zlib = require('zlib');
var crypto = require('crypto');

var decryption = function decryption() {};

var getCipherKey = function getCipherKey(password) {
    return crypto.createHash('sha256').update(password).digest();
};

decryption.getInitVectorStream = function (path) {
    var readInitVector = fs.createReadStream(path, {
        end: 15
    });
    return readInitVector;
};

decryption.decrypt = function (path, initVector, password) {
    var cipherKey = getCipherKey(password);
    var readStream = fs.createReadStream(path, {
        start: 16
    });
    var decipher = crypto.createDecipheriv('aes256', cipherKey, initVector);
    var unzip = zlib.createUnzip();
    return readStream.pipe(decipher).pipe(unzip);
};

module.exports = decryption;