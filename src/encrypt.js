const crypto = require('crypto')
const zlib = require('zlib')
const gzipStream = zlib.createGzip()
const {
    Transform
} = require('stream')

class AppendInitVect extends Transform {
    constructor(initVect, opts) {
        super(opts)
        this.initVect = initVect
        this.appended = false
    }

    _transform(chunk, encoding, cb) {
        if (!this.appended) {
            this.push(this.initVect)
            this.appended = true
        }
        this.push(chunk)
        cb()
    }
}

const getCipherKey = (password) => {
    return crypto.createHash('sha256').update(password).digest()
}

const encrypt = (contentStream, password) => {
    const initVector = crypto.randomBytes(16)
    const cipherKey = getCipherKey(password)
    const cipher = crypto.createCipheriv('aes256', cipherKey, initVector)
    const appendInitVect = new AppendInitVect(initVector)
    return contentStream
        .pipe(gzipStream)
        .pipe(cipher)
        .pipe(appendInitVect)
}

module.exports = encrypt