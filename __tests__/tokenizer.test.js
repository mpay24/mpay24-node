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

describe('tokenizer', () => {
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
})
