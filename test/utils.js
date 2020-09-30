const randomStr = (length) => {
    const str = []
    for (let i = 0; i < length; i++) {
        str.push(Math.floor(Math.random() * 16).toString(16))
    }
    return str.join('')
}

exports.randomStr = randomStr

const assertObjEq = (obj1, obj2) => {
    if (typeof obj1 != 'object' || typeof obj2 != 'object') {
        return false
    }
    if (obj1 == null || obj2 == null) {
        if (obj1 == null && obj2 == null) {
            return true
        } else {
            return false
        }
    } else if (Array.isArray(obj1) && Array.isArray(obj2)) {
    } else if (Array.isArray(obj1) || Array.isArray(obj2)) {
        return false
    } else {
        if (Object.keys(obj1).length != Object.keys(obj2).length) {
            return false
        }
        for (const key of Object.keys(obj1)) {
            if (typeof obj1[key] != typeof obj2[key]) {
                return false
            }
            if (typeof obj1[key] == 'object') {
                if (assertObjEq(obj1[key], obj2[key])) {
                    continue
                } else {
                    return false
                }
            } else {
                if (obj1[key] === obj2[key]) {
                    continue
                } else {
                    return false
                }
            }
        }
    }
    return true
}

exports.assertObjEq = assertObjEq
