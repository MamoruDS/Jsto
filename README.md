# Jsto
> Save/Load object as JSON with compress and encryption with aes-256.

![npm](https://img.shields.io/npm/v/jsto.svg?style=flat-square)

## Installation
```shell
npm i jsto
```

## Usage
```javascript
const Jsto = require('jsto')

Jsto.saveJSON('./staff.sto', [{"name":"John", "age":"34"}, {"name":"Gaston", "age":"28"}], 'passwd')

Jsto.loadJSON('./staff.sto', 'passwd')
```

## License
MIT © MamoruDS