const fs = require('fs')
const zlib = require('zlib')
const crypto = require('crypto')

const decryption = () => {}

const getCipherKey = (password) => {
    return crypto.createHash('sha256').update(password).digest()
}

decryption.getInitVectorStream = (path) => {
    const readInitVector = fs.createReadStream(path, {
        end: 15
    })
    return readInitVector
}

decryption.decrypt = (path, initVector, password) => {
    const cipherKey = getCipherKey(password)
    const readStream = fs.createReadStream(path, {
        start: 16
    })
    const decipher = crypto.createDecipheriv('aes256', cipherKey, initVector)
    const unzip = zlib.createUnzip()
    return readStream
        .pipe(decipher)
        .pipe(unzip)
}

module.exports = decryption