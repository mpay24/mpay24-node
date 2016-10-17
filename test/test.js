require('es6-promise').polyfill();

const assert = require('assert');

const mpay = require('../lib/mpay24.js');

describe('mPAY24 SOAP', () => {
  before((done) => {
    if (!process.env.USER || !process.env.PASSWORD) {
      throw new Error('Please set environment variables (soap login): USER, PASSWORD');
    }
    if (!process.env.ENV || process.env.ENV !== 'TEST') {
      console.info('No or wrong environment specified. Using Live System.');
    }
    mpay.init(process.env.USER, process.env.PASSWORD, process.env.ENV).then(() => {
      done();
    }, done);
  });
  it('listPaymentMethods', (done) => {
    mpay.listPaymentMethods().then(paymentMethods => {
      assert.equal(paymentMethods.status, 'OK');
      done();
    }, done);
  });
  it('createPaymentToken success', (done) => {
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
  it('createPaymentToken wrong template set', (done) => {
    mpay.createPaymentToken({
      pType: 'CC',
      templateSet: 'DEFAULT1',
    }).catch(err => {
      assert.equal(err.status, 'ERROR');
      assert.equal(err.returnCode, 'TEMPLATESET_NOT_CORRECT');
      done();
    });
  });
  it('acceptPayment CC parameter wrong order', (done) => {
    mpay.acceptPayment({
      tid: 'testing',
      pType: 'CC',
      payment: {
        amount: 100,
        brand: 'MASTERCARD',
        expiry: 2507,
        identifier: '5555444433331111',
        currency: 'EUR',
      },
    }).then(data => {
      assert.equal(data.status, 'OK');
      done();
    });
  });
  it('acceptPayment CC wrong identifier', (done) => {
    mpay.acceptPayment({
      tid: 'testing',
      pType: 'CC',
      payment: {
        amount: 100,
        currency: 'EUR',
        brand: 'MASTERCARD',
        identifier: '55554444333311111',
        expiry: 2507,
      },
    }).then(data => {
      assert.equal(data.status, 'OK');
      done();
    }).catch(err => {
      assert.equal(err.status, 'ERROR');
      assert.equal(err.returnCode, 'INVALID_CREDITCARD_NUMBER');
      done();
    });
  });
  it('selectPayment maximum', (done) => {
    mpay.selectPayment({
      tid: 'testing_selectpayment',
      shoppingCart: {
        item: [{
          number: 1,
          quantity: 1,
          itemPrice: '1.00',
        }, {
          number: 2,
          quantity: 1,
          itemPrice: '2.00',
        }, {
          number: 3,
          quantity: 1,
          itemPrice: '3.00',
        }],
      },
      price: 600,
    }).then(data => {
      assert.equal(data.status, 'OK');
      assert.notEqual(data.location, '');
      done();
    });
  });
  it('selectPayment with double string price 1.00', (done) => {
    mpay.selectPayment({
      tid: 'testing_selectpayment',
      price: '1.00',
    }).then(data => {
      assert.equal(data.status, 'OK');
      assert.notEqual(data.location, '');
      done();
    });
  });
});
