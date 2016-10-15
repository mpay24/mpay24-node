var assert = require('assert');

const mpay = require('../lib/mpay24.js');

describe('mPAY24 SOAP', function() {
  before(function(done) {
    mpay.init(process.env.username, process.env.password).then(() => {
      done();
    }).catch(err => {
      done();
    });
  });
  describe('SOAP Calls', function() {
    it('listPaymentMethods', function(done) {
      mpay.listPaymentMethods().then(paymentMethods => {
        assert.equal(paymentMethods.status, 'OK');
        done();
      }).catch(err => {
        assert.equal(paymentMethods.status, 'OK');
        done();
      });
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
      });
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
