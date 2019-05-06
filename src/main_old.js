import fs from 'fs'
import { Readable } from 'stream'
import beautify from 'js-beautify'
import { encrypt } from './encrypt'
import { decryption } from './decrypt'

const Jsto = () => {}

Jsto.saveJSON = (path, obj, password) => {
    return new Promise(resolve => {
        let dataStr = JSON.stringify(obj)
        dataStr = beautify(dataStr, {
            indent_size: 4,
        })
        const dataStream = new Readable()
        dataStream.push(dataStr)
        dataStream.push(null)
        const writeStream = fs.createWriteStream(path)
        if (password === undefined || password === false) {
            dataStream.on('data', chunk => {
                writeStream.write(chunk)
                writeStream.end()
                writeStream.on('finish', () => {
                    resolve('what ever')
                })
                writeStream.on('end', () => {
                    // resolve()
                })
            })
        } else {
            let encryptedStream = encrypt(dataStream, password)
            encryptedStream
                .on('unpipe', () => {})
                .pipe(writeStream)
                .on('unpipe', () => {
                    resolve()
                })
        }
    })
}

Jsto.loadJSON = (path, password, touchFile = true) => {
    if (!fs.existsSync(path)) {
        // if (touchFile) {
        //     Jsto.saveJSON(path, {}, password)
        // }
        return {}
    } else {
        return new Promise(resolve => {
            if (password === undefined || password === false) {
                const readStream = fs.createReadStream(path)
                let dataStr = ''
                readStream
                    .on('data', chunk => {
                        dataStr = dataStr + chunk.toString('utf8')
                    })
                    .on('close', () => {
                        let dataObj = {}
                        try {
                            dataObj = JSON.parse(dataStr)
                        } catch (err) {
                            //
                        }
                        resolve(dataObj)
                    })
            } else {
                let initVector
                let readInitVector = decryption.getInitVectorStream(path)
                readInitVector.on('data', chunk => {
                    initVector = chunk

                    let decryptedStream
                    readInitVector.on('close', () => {
                        let dataStr = ''
                        decryptedStream = decryption.decrypt(
                            path,
                            initVector,
                            password
                        )
                        decryptedStream
                            // .on('unpipe', () => {})
                            .on('data', chunk => {
                                dataStr = dataStr + chunk.toString('utf8')
                            })
                            .on('close', () => {
                                let dataObj = {}
                                try {
                                    dataObj = JSON.parse(dataStr)
                                } catch (err) {
                                    //
                                }
                                resolve(dataObj)
                            })
                    })
                })
            }
        })
    }
}

export default Jsto
