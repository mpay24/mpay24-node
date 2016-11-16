const mpay = require('../lib/mpay24.js')

describe('soap-tests', () => {
  beforeAll(async () => {
    if (!process.env.USER || !process.env.PASSWORD) {
      throw new Error('Please set environment variables (soap login): USER, PASSWORD')
    }
    if (!process.env.ENV || process.env.ENV !== 'TEST') {
      console.info('No or wrong environment specified. Using Live System.')
    }
    await mpay.init(process.env.USER, process.env.PASSWORD, process.env.ENV)
  })

  it('listPaymentMethods', async () => {
    const paymentMethods = await mpay.listPaymentMethods()
    expect(paymentMethods.status).toBe('OK')
  })

  it('createPaymentToken success', async () => {
    const req = {
      pType: 'CC',
      templateSet: 'DEFAULT',
    }
    const data = await mpay.createPaymentToken(req)
    expect(data.status).toBe('OK')
    expect(data.returnCode).toBe('REDIRECT')
    expect(data.token).not.toBe('')
    expect(data.apiKey).not.toBe('')
    expect(data.location).not.toBe('')
  })

  it('createPaymentToken wrong template set', async () => {
    const req = {
      pType: 'CC',
      templateSet: 'DEFAULT1',
    }
    try {
      await mpay.createPaymentToken(req)
    } catch (err) {
      expect(err.status).toBe('ERROR')
      expect(err.returnCode).toBe('TEMPLATESET_NOT_CORRECT')
    }
  })

  it('acceptPayment CC parameter wrong order', async () => {
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
    expect(data.status).toBe('OK')
  })

  it('acceptPayment CC wrong identifier', async () => {
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
      expect(err.status).toBe('ERROR')
      expect(err.returnCode).toBe('INVALID_CREDITCARD_NUMBER')
    }
  })
  it('selectPayment maximum', async () => {
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
    expect(data.status).toBe('OK')
    expect(data.location).not.toBe('')
  })

  it('selectPayment with double string price 1.00', async () => {
    const req = {
      tid: 'testing_selectpayment',
      price: '1.00',
    }
    const data = await mpay.selectPayment(req)
    expect(data.status).toBe('OK')
    expect(data.location).not.toBe('')
  })

  it('acceptPayment with transactionStatus OK', async () => {
    const randomTID = Math.random()
    const acceptPaymentRequest = {
      tid: `${randomTID}`,
      pType: 'CC',
      payment: {
        amount: 100,
        brand: 'MASTERCARD',
        expiry: 2507,
        identifier: '5555444433331111',
        currency: 'EUR',
      },
    }
    const data = await mpay.acceptPayment(acceptPaymentRequest)
    expect(data.status).toBe('OK')
    const txStatusRequest = {
      tid: `${randomTID}`,
    }
    const transactionStatusResponse = await mpay.transactionStatus(txStatusRequest)
    expect(transactionStatusResponse.status).toBe('BILLED')
    expect(transactionStatusResponse.tid).toBe(`${randomTID}`)
  })
})
