import * as fs from 'fs'

import { encrypt, decrypt } from './encrypt'

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
    return new Promise(async (resolve, reject) => {
        const out = password
            ? await encrypt(JSON.stringify(data), password)
            : JSON.stringify(data, null, options.indent_size)
        fs.writeFileSync(filePath, out, { encoding: 'utf8' })
        resolve(out)
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
            resolve({})
        }

        const text = fs.readFileSync(filePath, { encoding: 'utf8' })
        resolve(JSON.parse(password ? await decrypt(text, password) : text))
    })
}

export { saveJSON, loadJSON }

export { options, dump, load }
