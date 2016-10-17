# mpay24-node

[![Build Status](https://travis-ci.com/tobiaslins/mpay24-node.svg?token=peDG6G3LXx2xP4jx5E91&branch=master)](https://travis-ci.com/tobiaslins/mpay24-node)

Unoffical mPAY24 node.js SDK

## Installation

`npm install mpay24-node`

## Documentation

Documentation is available at https://docs.mpay24.com/docs/node.

## SDK Overview

First it is necessary to include the library:
```js
var mpay24 = require('mpay24-node');
```
The SDK is using the mPAY24 soap interface.
So you need to initialize the SDK

The parameter of the `init` method are the soap username and password
```js
mpay24.init('USERNAME','PASSWORD').then(() => {
  //now all methods can be used
}).catch(err => {
  console.error(err);
});
```

#### Create a token for seamless creditcard payments

```js
mpay24.createPaymentToken({
  pType: 'CC',
  templateSet: 'DEFAULT',
}).then(data => {
  console.log(data);
});
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
    token: 'y2hUtk9fn3mhv2yVox0yarawKzWQv0+vf/cp1NuzxFw=',
  }
}).then(data => {
  console.log(data);
}).catch(err => {
  console.error(err);
});
```
Paypal payment
```js
mpay24.acceptPayment({
  tid: 'customTransactionID',
  pType: 'PAYPAL',
  payment: {
    amount: 100,
    currency: 'EUR',
  }
}).then(data => {
  console.log(data);
}).catch(err => {
  console.error(err);
});
```

#### Get the current transaction status

```js
mpay24.transactionStatus({
  mpayTID: 1111, //from acceptPayment response
  //tid: 'customTransactionID' if unique
}).then(data => {
  console.log(data);
}).catch(err => {
  console.error(err);
});
```

## Testing

```js
> npm run build
> USER=uXXXXX PASSWORD=XXXXXX ENV=TEST npm run test
```
