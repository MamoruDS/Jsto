import jsto from './main_old'

process.on('message', async msg => {
    if (msg.method === 'save') {
        await jsto.saveJSON(msg.path, msg.obj, msg.pwd)
        process.send('ok')
    } else if (msg.method === 'load') {
        const res = await jsto.loadJSON(msg.path, msg.pwd)
        process.send(res)
    }
    process.exit(0)
})
