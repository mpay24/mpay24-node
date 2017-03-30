# mpay24-node

[![Build Status](https://travis-ci.org/mpay24/mpay24-node.svg?branch=master)](https://travis-ci.org/mpay24/mpay24-node) [![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

Offical mPAY24 node.js SDK

## Installation

`npm install mpay24-node --save`

## Documentation

A short demo implementation guide is available at https://docs.mpay24.com/docs/get-started</br>
Documentation is available at https://docs.mpay24.com/docs

## SDK Overview

First it is necessary to include the library:
```js
const mpay24 = require('mpay24-node')
```
The SDK is using the mPAY24 SOAP interface.
So you need to initialize the SDK

The parameter of the `init` method are the `merchantID` and `password`

The third optional parameter is the environment. The parameter can be set to `TEST` or `LIVE`.
If the parameter is not set, the default is LIVE.

```js
mpay24.init('merchantID','password', 'TEST').then(() => {
  // now all methods can be used
}).catch(err => {
  console.error(err)
})
```

#### Create a token for seamless creditcard payments

```js
mpay24.createPaymentToken({
  pType: 'CC',
  templateSet: 'DEFAULT'
}).then(result => {
  console.log(result)
})
```

#### Create a payment

Creditcard payment with a token
```js
mpay24.acceptPayment({
  tid: 'customTransactionID',
  pType: 'TOKEN',
  payment: {
    amount: 100,
    currency: 'EUR',
    token: 'y2hUtk9fn3mhv2yVox0yarawKzWQv0+vf/cp1NuzxFw='
  }
}).then(result => {
  console.log(result)
}).catch(err => {
  console.error(err)
})
```

Paypal payment
```js
mpay24.acceptPayment({
  tid: 'customTransactionID',
  pType: 'PAYPAL',
  payment: {
    amount: 100,
    currency: 'EUR'
  }
}).then(result => {
  console.log(result)
}).catch(err => {
  console.error(err)
})
```

#### Create a customer and charge a customer (recurring profile)

Create customer with token
```js
mpay24.acceptPayment({
  tid: 'customTransactionID',
  pType: 'TOKEN',
  payment: {
    amount: 100,
    currency: 'EUR',
    token: 'y2hUtk9fn3mhv2yVox0yarawKzWQv0+vf/cp1NuzxFw=',
    useProfile: true
  },
  customerID: 'customer-123'
}).then(result => {
  console.log(result)
}).catch(err => {
  console.error(err)
})
```
Charge the created customer
```js
mpay24.acceptPayment({
  tid: 'profilepayment',
  pType: 'PROFILE',
  payment: {
    amount: 100,
    currency: 'EUR'
  },
  customerID: 'customer-123'
}).then(result => {
  console.log(result)
}).catch(err => {
  console.error(err)
})
```

#### Get the current transaction status

```js
mpay24.transactionStatus({
  mpayTID: 1111, // from acceptPayment response
  // tid: 'customTransactionID'
}).then(result => {
  console.log(result)
}).catch(err => {
  console.error(err)
})
```

#### Initialize a Payment Page

```js
mpay24.selectPayment({
  tid: '123456',
  price: '1.00',
  URL: {
    success: 'https://yourpage.com/success',
    error: 'https://yourpage.com/error',
    confirmation: 'https://yourpage.com/confirm'
  }
}).then(result => {
  console.log(result)
}).catch(err => {
  console.error(err)
})
```

## Testing
Environment variables need to be set in order to run the tests

`USER` is the merchantID</br>
`PASSWORD` is the soap password</br>
`ENV` can be `TEST` or `LIVE` to run tests again live or testsystem

```js
USER='9XXXX' PASSWORD='XXXXXX' ENV=TEST npm run test
```
