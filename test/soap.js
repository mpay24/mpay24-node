/* eslint no-console: ["error", { allow: ["info", "error"] }] */

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
    }).catch(err => {
      console.error(err);
      done();
    });
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
    }).catch(err => {
      console.error(err);
      done();
    });
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
    }).catch(err => {
      console.error(err);
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
    }).catch(err => {
      assert.equal(err.status, 'ERROR');
      assert.equal(err.returnCode, 'INVALID_CREDITCARD_NUMBER');
      done();
    });
  });
  it('selectPayment maximum', (done) => {
    mpay.selectPayment({
      clientIP: '208.67.222.222',
      tid: '90021',
      shoppingCart: {
        description: 'Example shopping cart',
        item: [{
          ProductNr: '001',
          description: 'Test product A',
          quantity: 2,
          itemPrice: {
            '@': {
              tax: '1.00',
            },
            '#': '6.00',
          },
        }],
        subTotal: '22.80',
        discount: '-5.00',
        shippingCosts: '7.50',
        tax: '5.05',
      },
      price: '6.00',
      billingAddr: {
        '@': {
          mode: 'ReadOnly',
        },
        name: {
          '@': {
            gender: 'M',
            birthday: '1990-01-31',
          },
          '#': 'John Doe',
        },
        street: 'Main street 1',
        zip: '1010',
        city: 'Vienna',
        country: {
          '@': {
            code: 'AT',
          },
        },
        email: 'billing@mpay24.test',
        phone: '+4368012345678',
      },
      URL: {
        success: 'http://www.hotelmuster.at/succ.php',
        error: 'http://www.hotelmuster.at/err.php',
        confirmation: 'http://www.hotelmuster.at/conf.php',
      },
    }).then(data => {
      assert.equal(data.status, 'OK');
      assert.notEqual(data.location, '');
      done();
    }).catch(err => {
      console.error(err);
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
    }).catch(err => {
      console.error(err);
      done();
    });
  });
});
