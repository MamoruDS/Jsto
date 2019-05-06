import { fork } from 'child_process'

const Jsto = () => {}

Jsto.saveJSON = (path, obj, password) => {
    return new Promise(resolve => {
        const child = fork('dist/child.js')
        child.send({ method: 'save', path: path, obj: obj, pwd: password })
        child.on('exit', () => {
            resolve()
        })
    })
}

Jsto.loadJSON = (path, password) => {
    return new Promise(resolve => {
        const child = fork('dist/child.js')
        child.send({ method: 'save', path: path, pwd: password })
        child.on('exit', () => {
            resolve()
        })
    })
}

export default Jsto
