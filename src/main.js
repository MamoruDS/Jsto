const fs = require('fs')
const Readable = require('stream').Readable
import beautify from 'js-beautify'

const encrypt = require('./encrypt')
const decryption = require('./decrypt')

const Jsto = () => {}

Jsto.saveJSON = (path, obj, password) => {
    return new Promise(resolve => {
        let dataStr = JSON.stringify(obj)
        dataStr = beautify(dataStr, {
            indent_size: 4
        })
        const dataStream = new Readable()
        dataStream.push(dataStr)
        dataStream.push(null)
        const writeStream = fs.createWriteStream(path)
        if (password === undefined || password === false) {
            dataStream.on('data', (chunk) => {
                writeStream.write(chunk)
                writeStream.end()
                writeStream.on('finish', ()=>{
                    console.log('write finished')
                    resolve("what ever")
                })
                writeStream.on('end', ()=>{
                    console.log('write end')
                    // resolve()
                })
            })
        } else {
            let encryptedStream = encrypt(dataStream, password)
            encryptedStream
                .on('unpipe', () => {})
                .pipe(writeStream)
                .on('unpipe', ()=>{
                    resolve()
                })
        }
    })

}

Jsto.loadJSON = (path, password) => {
    if (password === undefined || password === false) {
        const readStream = fs.createReadStream(path)
        const writeStream = fs.createWriteStream(path)

        readStream.on('data', (chunk) => {
            writeStream.write(chunk)
        })
    } else {
        let initVector
        let readInitVector = decryption.getInitVectorStream(path)
        readInitVector.on('data', (chunk) => {
            initVector = chunk

            let decryptedStream
            readInitVector.on('close', () => {
                let dataStr = ''
                decryptedStream = decryption.decrypt(path, initVector, password)
                decryptedStream
                    // .on('unpipe', () => {})
                    .on('data', (chunk) => {
                        dataStr = dataStr + chunk.toString('utf8')
                    })
                    .on('close', ()=>{
                        let dataObj = {}
                        try {
                            dataObj = JSON.parse(dataStr)
                        } catch (err) {
                            //
                        }
                        return dataObj
                    })
            })
        })
    }
}

module.exports = Jsto