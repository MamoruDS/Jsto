import * as fs from 'fs'
import { Readable } from 'stream'

import * as encryption from './encrypt'
import * as decryption from './decrypt'

const options = {
    indent_size: 4,
} as {
    indent_size: number
}

const saveJSON = async (
    filePath: string,
    data: object,
    password?: string
): Promise<string> => {
    return await dump(filePath, data, password)
}

const dump = async (
    filePath: string,
    data: object,
    password?: string
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const dataStr: string = password
            ? JSON.stringify(data)
            : JSON.stringify(data, null, options.indent_size)
        const dataStream: Readable = new Readable()
        dataStream.push(dataStr)
        dataStream.push(null)
        const writeStream: fs.WriteStream = fs.createWriteStream(filePath)
        if (password === undefined) {
            dataStream.on('data', (chunk) => {
                writeStream.write(chunk)
                writeStream.end()
                writeStream.on('finish', () => {
                    resolve(dataStr)
                })
                writeStream.on('end', () => {
                    // do nothing
                })
            })
        } else {
            let encryptedStream = encryption.encrypt(dataStream, password)
            encryptedStream
                .on('unpipe', () => {})
                .pipe(writeStream)
                .on('unpipe', () => {
                    resolve(dataStr)
                })
        }
    })
}

const loadJSON = async (
    filePath: string,
    password?: string,
    defaultData?: object
): Promise<object> => {
    return await load(filePath, password, defaultData)
}

const load = async (
    filePath: string,
    password?: string,
    defaultData?: object
): Promise<object> => {
    return new Promise(async (resolve, reject) => {
        if (!fs.existsSync(filePath)) {
            if (defaultData) {
                await dump(filePath, defaultData, password)
                resolve(defaultData)
            } else {
                reject()
            }
            return {}
        }

        if (password === undefined) {
            const readStream: fs.ReadStream = fs.createReadStream(filePath)
            let _dataStr: string = ''
            readStream
                .on('data', (chunk) => {
                    _dataStr = _dataStr + chunk.toString('utf8')
                })
                .on('close', () => {
                    let dataObj = {}
                    try {
                        dataObj = JSON.parse(_dataStr)
                    } catch (err) {
                        reject(err)
                    }
                    resolve(dataObj)
                })
        } else {
            const readInitVector: fs.ReadStream = decryption.getInitVectorStream(
                filePath
            )
            readInitVector.on('data', (chunk) => {
                const initVector = chunk
                let decryptedStream
                readInitVector.on('close', () => {
                    let dataStr = ''
                    decryptedStream = decryption.decrypt(
                        filePath,
                        initVector,
                        password
                    )
                    decryptedStream
                        .on('data', (chunk) => {
                            dataStr = dataStr + chunk.toString('utf8')
                            decryptedStream.close()
                        })
                        .on('close', () => {
                            let dataObj = {}
                            try {
                                dataObj = JSON.parse(dataStr)
                            } catch (err) {
                                reject(err)
                            }
                            resolve(dataObj)
                        })
                })
            })
        }
    })
}

export { saveJSON, loadJSON }

export { options, dump, load }
