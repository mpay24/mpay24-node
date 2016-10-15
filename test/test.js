var assert = require('assert');

const mpay = require('../lib/mpay24.js');

describe('mPAY24 SOAP', function() {
  before(function(done) {
    if(!process.env.USERNAME || !process.env.PASSWORD) {
      throw new Error('Please set environment variables (Soap login): USERNAME, PASSWORD');
    }
    mpay.init(process.env.USERNAME, process.env.PASSWORD).then((data) => {
      done();
    }, done);
  });
  describe('SOAP Calls', function() {
    it('listPaymentMethods', function(done) {
      mpay.listPaymentMethods().then(paymentMethods => {
        assert.equal(paymentMethods.status, 'OK');
        done();
      }, done);
    });
    it('createPaymentToken success', function(done) {
      mpay.createPaymentToken({
        pType: 'CC',
        templateSet: 'DEFAULT',
      }).then(data => {
        assert.equal(data.status, 'OK');
        assert.equal(data.returnCode, 'REDIRECT');
        assert.notEqual(data.token, '');
        assert.notEqual(data.apiKey, '');
        assert.notEqual(data.location, '');
        done();
      }, done);
    });
    it('createPaymentToken wrong template set', function(done) {
      mpay.createPaymentToken({
        pType: 'CC',
        templateSet: 'DEFAULT1',
      }).catch(err => {
        assert.equal(err.status, 'ERROR');
        assert.equal(err.returnCode, 'TEMPLATESET_NOT_CORRECT');
        done();
      });
    });
  });
});
