const mpay = require('../lib/mpay24.js')

beforeAll(async () => {
  if (!process.env.USER || !process.env.PASSWORD) {
    throw new Error('Please set environment variables (soap login): USER, PASSWORD')
  }
  if (!process.env.ENV || process.env.ENV !== 'TEST') {
    console.info('No or wrong environment specified. Using Live System.')
  }
  await mpay.init(process.env.USER, process.env.PASSWORD, process.env.ENV)
})

describe('payment', () => {
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
