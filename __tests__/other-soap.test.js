'use strict'

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
describe('others', () => {
  it('listPaymentMethods', async () => {
    const paymentMethods = await mpay.listPaymentMethods()
    expect(paymentMethods.status).toBe('OK')
  })
  it('init without username and password', async () => {
    let error = false
    try {
      await mpay.init()
    } catch (err) {
      error = true
    }
    expect(error).toBe(true)
  })
})
