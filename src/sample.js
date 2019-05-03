import jsto from './main'

const conf = {
    prop_A: 'sometext',
    prop_B: 123,
    prop_C: true,
    prop_D: [false, 456, 'data'],
}

const jsonRead = async (path, passwd) => {
    let data = await jsto.loadJSON(path, passwd)
    console.log(data)
}

// jsto.saveJSON('sample.sto', conf, 'pwd')
jsonRead('sample.sto', 'pwd')
