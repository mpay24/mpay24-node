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

describe('payment-page', () => {
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
  it('selectPayment with int price 100', async () => {
    const req = {
      tid: 'testing_selectpayment',
      price: 100,
    }
    const data = await mpay.selectPayment(req)
    expect(data.status).toBe('OK')
    expect(data.location).not.toBe('')
  })
})
