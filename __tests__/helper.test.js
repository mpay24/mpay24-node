const helper = require('../lib/helper.js')

const data = {
  atest: 'A',
  Btest: 'B',
  xtest: {
    ytest: {
      ztest: 'Z'
    }
  }
}

const newData = helper.keyToUpperCase(data)

describe('helper-tests', () => {
  it('lower to upper', () => {
    expect({}.hasOwnProperty.call(newData, 'Atest')).toBe(true)
  })
  it('upper should stay', () => {
    expect({}.hasOwnProperty.call(newData, 'Btest')).toBe(true)
  })
  it('recursive should work', () => {
    expect({}.hasOwnProperty.call(newData.Xtest.Ytest, 'Ztest')).toBe(true)
  })
  it('string 1.00', () => {
    expect(helper.isInt('1.00')).toBe(false)
  })
  it('string 100', () => {
    expect(helper.isInt('100')).toBe(false)
  })
  it('int 100', () => {
    expect(helper.isInt(100)).toBe(true)
  })
  it('float 1.00', () => {
    expect(helper.isInt(1.0)).toBe(true)
  })
  it('reformat transactionstatus response', () => {
    const req = {
      TID: '123',
      parameter: [
        {
          name: 'Status',
          value: 'BILLED'
        }
      ]
    }

    const expected = {
      tid: '123',
      status: 'BILLED'
    }
    const formatted = helper.formatResult(req)
    expect(formatted).toEqual(expected)
  })
})
