import test from 'ava'

const mpay = require('../lib/mpay24.js')

test.before(async t => {
  if (!process.env.USER || !process.env.PASSWORD) {
    throw new Error('Please set environment variables (soap login): USER, PASSWORD')
  }
  if (!process.env.ENV || process.env.ENV !== 'TEST') {
    console.info('No or wrong environment specified. Using Live System.')
    t.pass()
  }
  await mpay.init(process.env.USER, process.env.PASSWORD, process.env.ENV)
})

test('listPaymentMethods', async t => {
  const paymentMethods = await mpay.listPaymentMethods()
  t.is(paymentMethods.status, 'OK')
})

test('createPaymentToken success', async t => {
  const req = {
    pType: 'CC',
    templateSet: 'DEFAULT',
  }
  const data = await mpay.createPaymentToken(req)
  t.is(data.status, 'OK')
  t.is(data.returnCode, 'REDIRECT')
  t.not(data.token, '')
  t.not(data.apiKey, '')
  t.not(data.location, '')
})

test('createPaymentToken wrong template set', async t => {
  const req = {
    pType: 'CC',
    templateSet: 'DEFAULT1',
  }
  try {
    await mpay.createPaymentToken(req)
  } catch (err) {
    t.is(err.status, 'ERROR')
    t.is(err.returnCode, 'TEMPLATESET_NOT_CORRECT')
  }
})

test('acceptPayment CC parameter wrong order', async t => {
  const req = {
    tid: 'testing',
    pType: 'CC',
    payment: {
      amount: 100,
      brand: 'MASTERCARD',
      expiry: 2507,
      identifier: '5555444433331111',
      currency: 'EUR',
    },
  }
  const data = await mpay.acceptPayment(req)
  t.is(data.status, 'OK')
})

test('acceptPayment CC wrong identifier', async t => {
  const req = {
    tid: 'testing',
    pType: 'CC',
    payment: {
      amount: 100,
      currency: 'EUR',
      brand: 'MASTERCARD',
      identifier: '55554444333311111',
      expiry: 2507,
    },
  }
  try {
    await mpay.acceptPayment(req)
  } catch (err) {
    t.is(err.status, 'ERROR')
    t.is(err.returnCode, 'INVALID_CREDITCARD_NUMBER')
  }
})
test('selectPayment maximum', async t => {
  const req = {
    clientIP: '208.67.222.222',
    tid: '90021',
    shoppingCart: {
      description: 'Example shopping cart',
      item: [
        {
          ProductNr: '001',
          description: 'Test product A',
          quantity: 2,
          itemPrice: {
            '@': {
              tax: '1.00',
            },
            '#': '6.00',
          },
        },
      ],
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
  }
  const data = await mpay.selectPayment(req)
  t.is(data.status, 'OK')
  t.not(data.location, '')
})

test('selectPayment with double string price 1.00', async t => {
  const req = {
    tid: 'testing_selectpayment',
    price: '1.00',
  }
  const data = await mpay.selectPayment(req)
  t.is(data.status, 'OK')
  t.not(data.location, '')
})
