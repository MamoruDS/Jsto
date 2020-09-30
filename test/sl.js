const fs = require('fs')
const jsto = require('../dist/main')

const randomStr = require('./utils').randomStr

const assert = require('assert').strict

const test = async () => {
    const obj = {
        key_1: 'value_1',
        key_2: 2,
        key_3: true,
    }
    const filepath = randomStr(4) + '_temp.test'
    try {
        const passwords = [undefined, 'passwd']
        for (const passwd of passwords) {
            try {
                await jsto.saveJSON(filepath, obj, passwd)
                const _obj = await jsto.loadJSON(filepath, passwd)
                assert.deepStrictEqual(obj, _obj)
                console.log('ok')
            } catch (e) {
                console.log('panic')
            }
        }
    } catch (e) {
        console.log('error')
        console.error(e)
    }
    fs.unlinkSync(filepath)
}

test()
