import * as crypto from 'crypto'
import * as zlib from 'zlib'

const gzipStream = zlib.createGzip()
import { Transform, Readable } from 'stream'

class AppendInitVect extends Transform {
    private initVect: Buffer
    private appended: boolean
    constructor(initVect: Buffer, opts?) {
        super(opts)
        this.initVect = initVect
        this.appended = false
    }

    public _transform(
        chunk   : Buffer | string | any,
        encoding: string | 'buffer',
        cb      : () => any
        )       : void {
        if (!this.appended) {
            this.push(this.initVect)
            this.appended = true
        }
        this.push(chunk)
        cb()
    }
}

const getCipherKey = (password: string): crypto.CipherKey => {
    return crypto
        .createHash('sha256')
        .update(password)
        .digest()
}

export const encrypt = (contentStream: Readable, password: string) => {
    const initVector: Buffer          = crypto.randomBytes(16)
    const cipherKey: crypto.CipherKey = getCipherKey(password)
    const cipher: crypto.Cipher       = crypto.createCipheriv(
        'aes256',
        cipherKey,
        initVector
    )
    const appendInitVect = new AppendInitVect(initVector)
    return contentStream
        .pipe(gzipStream)
        .pipe(cipher)
        .pipe(appendInitVect)
}
