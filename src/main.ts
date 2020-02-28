import * as fs from 'fs'
import { Readable } from 'stream'
import * as beautify from 'js-beautify'

import * as encryption from './encrypt'
import * as decryption from './decrypt'

export const saveJSON = (
    filePath: string,
    data: object,
    password?: string
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const dataStr: string = beautify(JSON.stringify(data), {
            indent_size: 4,
        })
        const dataStream: Readable = new Readable()
        dataStream.push(dataStr)
        dataStream.push(null)
        const writeStream: fs.WriteStream = fs.createWriteStream(filePath)
        if (password === undefined) {
            dataStream.on('data', chunk => {
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

export const loadJSON = async (
    filePath: string,
    password?: string,
    defaultData?: object
): Promise<object> => {
    return new Promise(async (resolve, reject) => {
        if (!fs.existsSync(filePath)) {
            if (defaultData) {
                await saveJSON(filePath, defaultData, password)
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
                .on('data', chunk => {
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
            readInitVector.on('data', chunk => {
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
                        .on('data', chunk => {
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