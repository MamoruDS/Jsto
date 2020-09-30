import { createHash, createCipheriv, createDecipheriv } from 'crypto'

const METHOD = 'aes256'

const encrypt = async (text: string, password: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const key = createHash('sha256').update(password).digest()
        const iv = Buffer.alloc(16, 0)
        const cipher = createCipheriv(METHOD, key, iv)
        let encrypted = ''
        cipher.on('readable', () => {
            let chunk: any
            while (null !== (chunk = cipher.read())) {
                encrypted += chunk.toString('hex')
            }
        })
        cipher.on('end', () => {
            resolve(encrypted)
        })
        cipher.write(text)
        cipher.end()
    })
}

const decrypt = async (
    encrypted: string,
    password: string
): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        const key = createHash('sha256').update(password).digest()
        const iv = Buffer.alloc(16, 0)
        const decipher = createDecipheriv(METHOD, key, iv)
        let decrypted = ''
        decipher.on('readable', () => {
            let chunk = undefined
            while (null !== (chunk = decipher.read())) {
                decrypted += chunk.toString('utf8')
            }
        })
        decipher.on('end', () => {
            resolve(decrypted)
        })
        decipher.write(encrypted, 'hex')
        decipher.end()
    })
}

export { encrypt, decrypt }
