import jsto from './main_old'

process.on('message', async msg => {
    if (msg.method === 'save') {
        await jsto.saveJSON(msg.path, msg.obj, msg.pwd)
    } else if (msg.method === 'load') {
        await jsto.loadJSON(msg.path, msg.pwd)
    }
    process.exit(0)
})
