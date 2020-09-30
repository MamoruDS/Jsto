# Jsto
> Save/Load object as JSON with compress and encryption with aes-256.

![npm](https://img.shields.io/npm/v/jsto.svg?style=flat-square)

## Installation
```shell
npm i jsto
```

## Usage
```javascript
const jsto = require('jsto')

jsto.options['indent_size'] = 2

const func = async () => {
    await jsto.dump(
        './staff.sto',
        [
            { name: 'John', age: '34' },
            { name: 'Gaston', age: '28' },
        ],
        'passwd'
    )
    await jsto.load('./staff.sto', 'passwd')
}

```

## License
MIT © MamoruDS