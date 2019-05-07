import path from 'path'
import { fork } from 'child_process'

const Jsto = () => {}

const childPath = path.join(__dirname, 'child.js')

Jsto.saveJSON = (path, obj, password) => {
    return new Promise(resolve => {
        const child = fork(childPath)
        child.send({ method: 'save', path: path, obj: obj, pwd: password })
        child.on('message', () => {
            resolve()
        })
    })
}

Jsto.loadJSON = (path, password) => {
    return new Promise(resolve => {
        const child = fork(childPath)
        child.send({ method: 'load', path: path, pwd: password })
        child.on('message', (msg) => {
            resolve(msg)
        })
    })
}

export default Jsto
