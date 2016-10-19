import test from 'ava'

const helper = require('../lib/helper.js')

const data = {
  atest: 'A',
  Btest: 'B',
  xtest: {
    ytest: {
      ztest: 'Z',
    },
  },
}

const newData = helper.keyToUpperCase(data)

test('lower to upper', t => {
  t.is({}.hasOwnProperty.call(newData, 'Atest'), true)
})
test('upper should stay', t => {
  t.is({}.hasOwnProperty.call(newData, 'Btest'), true)
})
test('recursive should work', t => {
  t.is({}.hasOwnProperty.call(newData.Xtest.Ytest, 'Ztest'), true)
})
test('string 1.00', t => {
  t.is(helper.isInt('1.00'), false)
})
test('string 100', t => {
  t.is(helper.isInt('100'), false)
})
test('int 100', t => {
  t.is(helper.isInt(100), true)
})
test('float 1.00', t => {
  t.is(helper.isInt(1.00), true)
})
