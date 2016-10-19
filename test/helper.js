const assert = require('assert')

const helper = require('../lib/helper.js')

export default () => {
  describe('keyToUpperCase', () => {
    const test = {
      atest: 'A',
      Btest: 'B',
      xtest: {
        ytest: {
          ztest: 'Z',
        },
      },
    }
    const newData = helper.keyToUpperCase(test)
    it('lower to upper', () => {
      assert.equal({}.hasOwnProperty.call(newData, 'Atest'), true)
    })
    it('upper should stay', () => {
      assert.equal({}.hasOwnProperty.call(newData, 'Btest'), true)
    })
    it('recursive should work', () => {
      assert.equal({}.hasOwnProperty.call(newData.Xtest.Ytest, 'Ztest'), true)
    })
  })
  describe('isInt', () => {
    it('string 1.00', () => {
      assert.equal(helper.isInt('1.00'), false)
    })
    it('string 100', () => {
      assert.equal(helper.isInt('100'), false)
    })
    it('int 100', () => {
      assert.equal(helper.isInt(100), true)
    })
    it('float 1.00', () => {
      assert.equal(helper.isInt(1.00), true)
    })
  })
}
