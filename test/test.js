require('es6-promise').polyfill();

var assert = require('assert');

const mpay = require('../lib/mpay24.js');

describe('mPAY24 SOAP', function() {
  before(function(done) {
    if(!process.env.USER || !process.env.PASSWORD) {
      throw new Error('Please set environment variables (soap login): USER, PASSWORD');
    }
    if(!process.env.ENV || process.env.ENV !== 'TEST') {
      console.info('No or wrong environment specified. Using Live System.');
    }
    mpay.init(process.env.USER, process.env.PASSWORD, process.env.ENV).then((data) => {
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
    it('acceptPayment CC parameter wrong order', function(done) {
      this.timeout(5000);
      mpay.acceptPayment({
        tid: 'testing',
        pType: 'CC',
        payment: {
          amount: 100,
          brand: 'MASTERCARD',
          expiry: 2507,
          identifier: '5555444433331111',
          currency: 'EUR',
        }
      }).then(data => {
        assert.equal(data.status, 'OK');
        done();
      });
    });
    it('acceptPayment CC wrong identifier', function(done) {
      this.timeout(5000);
      mpay.acceptPayment({
        tid: 'testing',
        pType: 'CC',
        payment: {
          amount: 100,
          currency: 'EUR',
          brand: 'MASTERCARD',
          identifier: '55554444333311111',
          expiry: 2507,
        }
      }).then(data => {
        assert.equal(data.status, 'OK');
        done();
      }).catch(err => {
        assert.equal(err.status, 'ERROR');
        assert.equal(err.returnCode, 'INVALID_CREDITCARD_NUMBER');
        done();
      });
    });
  });
});
