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

function formatResult(result) {
  for (const param in result) {
    if ({}.hasOwnProperty.call(result, param)) {
      const newParameterName = param.toLowerCase()
      if (param !== newParameterName) {
        result[param.toLowerCase()] = result[param]
        delete result[param]
      }
    }
  }
  let parameter = ''
  for (const param in result.parameter) {
    if ({}.hasOwnProperty.call(result.parameter, param)) {
      parameter = result.parameter[param]
      result[parameter.name.toLowerCase()] = parameter.value
    }
  }
  delete result.parameter
  return result
}

module.exports = {
  keyToUpperCase,
  isInt,
  stringToFloat,
  formatResult
}
