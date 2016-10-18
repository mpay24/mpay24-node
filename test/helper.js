const helper = require('../lib/helper.js');
const assert = require('assert');

describe('Helper functions', () => {
  describe('keyToUpperCase', () => {
    const test = {
      atest: 'A',
      Btest: 'B',
      xtest: {
        ytest: {
          ztest: 'Z',
        },
      },
    };
    const newData = helper.keyToUpperCase(test);
    it('lower to upper', () => {
      assert.equal(newData.hasOwnProperty('Atest'), true);
    });
    it('upper should stay', () => {
      assert.equal(newData.hasOwnProperty('Btest'), true);
    });
    it('recursive should work', () => {
      assert.equal(newData.Xtest.Ytest.hasOwnProperty('Ztest'), true);
    });
  });
  describe('isInt', () => {
    it('string 1.00', () => {
      assert.equal(helper.isInt('1.00'), false);
    });
    it('string 100', () => {
      assert.equal(helper.isInt('100'), false);
    });
    it('int 100', () => {
      assert.equal(helper.isInt(100), true);
    });
    it('float 1.00', () => {
      assert.equal(helper.isInt(1.00), true);
    });
  });
});
