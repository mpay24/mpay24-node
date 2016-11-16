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

test('lower to upper', () => {
  expect({}.hasOwnProperty.call(newData, 'Atest')).toBe(true)
})
// test('upper should stay', t => {
//   t.is({}.hasOwnProperty.call(newData, 'Btest'), true)
// })
// test('recursive should work', t => {
//   t.is({}.hasOwnProperty.call(newData.Xtest.Ytest, 'Ztest'), true)
// })
// test('string 1.00', t => {
//   t.is(helper.isInt('1.00'), false)
// })
// test('string 100', t => {
//   t.is(helper.isInt('100'), false)
// })
// test('int 100', t => {
//   t.is(helper.isInt(100), true)
// })
// test('float 1.00', t => {
//   t.is(helper.isInt(1.00), true)
// })
// test('reformat transactionstatus response', t => {
//   const req = {
//     TID: '123',
//     parameter: [
//       {
//         name: 'Status',
//         value: 'BILLED',
//       },
//     ],
//   }
//
//   const expected = {
//     tid: '123',
//     status: 'BILLED',
//   }
//   const formatted = helper.formatResult(req)
//   t.deepEqual(formatted, expected)
// })
