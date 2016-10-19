function keyToUpperCase(obj) {
  for (const key in obj) {
    if ({}.hasOwnProperty.call(obj, key)) {
      let temp
      if ({}.hasOwnProperty.call(obj, key)) {
        temp = obj[key]
        if (typeof temp === 'object') {
          temp = keyToUpperCase(temp)
        }
        delete obj[key]
        obj[key.charAt(0).toUpperCase() + key.substring(1)] = temp
      }
    }
  }
  return obj
}

function isInt(n) {
  return Number(n) === n && n % 1 === 0
}

function stringToFloat(string) {
  return parseFloat(string).toFixed(2)
}

module.exports = {
  keyToUpperCase,
  isInt,
  stringToFloat,
}
