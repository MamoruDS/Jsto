import * as fs from 'fs'
import * as zlib from 'zlib'
import * as crypto from 'crypto'

const getCipherKey = (password: string): Buffer => {
    return crypto
        .createHash('sha256')
        .update(password)
        .digest()
}

export const getInitVectorStream = (path: string): fs.ReadStream => {
    const readInitVector = fs.createReadStream(path, {
        end: 15,
    })
    return readInitVector
}

export const decrypt = (
    path      : string,
    initVector: crypto.BinaryLike,
    password  : string
    )         : zlib.Unzip => {
    const cipherKey: crypto.CipherKey = getCipherKey(password)
    const readStream: fs.ReadStream   = fs.createReadStream(path, {
        start: 16,
    })
    const decipher: crypto.Decipher = crypto.createDecipheriv(
        'aes256',
        cipherKey,
        initVector
    )
    const unzip: zlib.Unzip = zlib.createUnzip()
    return readStream.pipe(decipher).pipe(unzip)
}
