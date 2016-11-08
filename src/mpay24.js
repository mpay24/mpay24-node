const soap = require('soap')
const js2xmlparser = require('js2xmlparser')
const pkg = require('../package.json')
const helper = require('./helper.js')

function mpay24() {
  if (!(this instanceof mpay24)) {
    return new mpay24()
  }
  return this
}

mpay24.wsdl = 'https://www.mpay24.com/soap/etp/1.5/ETP.wsdl'

mpay24.prototype = {
  createSoapRequest(method, data = {}) {
    return new Promise((resolve, reject) => {
      data.merchantID = mpay24.username
      mpay24.client[method](data, (err, res) => {
        if (!err) {
          if (res.status === 'OK') {
            resolve(res)
          }
          reject(res)
        }
        reject(err)
      })
    })
  },
  init(username, password, environment = 'LIVE') {
    return new Promise((resolve, reject) => {
      if (!username || !password) {
        reject('Please provide your SOAP user and password')
      }
      const prefix = environment === 'TEST' ? 'test' : 'www'
      const mpayEndpoint = `https://${prefix}.mpay24.com/app/bin/etpproxy_v15`
      const options = {
        endpoint: mpayEndpoint,
      }
      soap.createClient(mpay24.wsdl, options, (err, client) => {
        if (!err) {
          client.addHttpHeader('User-Agent', `mpay24-node ${pkg.version}`)
          client.setSecurity(new soap.BasicAuthSecurity(`u${username}`, password))
          mpay24.client = client
          mpay24.username = username
          resolve()
        }
        reject('Client could not be created. Please contact support')
      })
    })
  },

  createPaymentToken(data) {
    return this.createSoapRequest('CreatePaymentToken', data)
  },
  acceptPayment(data) {
    data.payment.attributes = {
      'xsi:type': `etp:Payment${data.pType}`,
    }
    return this.createSoapRequest('AcceptPayment', data)
  },
  selectPayment(data) {
    if (helper.isInt(data.price)) {
      data.price /= 100
    }
    data.price = helper.stringToFloat(data.price)
    data = helper.keyToUpperCase(data)
    data.mdxi = js2xmlparser.parse('Order', data)
    return this.createSoapRequest('SelectPayment', data)
  },
  acceptWithdraw(data) {
    return this.createSoapRequest('AcceptWithdraw', data)
  },
  transactionStatus(data) {
    return this.createSoapRequest('TransactionStatus', data)
  },
  transactionConfirmation(data) {
    return this.createSoapRequest('TransactionConfirmation', data)
  },
  transactionHistory(data) {
    return this.createSoapRequest('TransactionHistory', data)
  },
  manualClear(data) {
    return this.createSoapRequest('ManualClear', data)
  },
  manualReverse(data) {
    return this.createSoapRequest('ManualReverse', data)
  },
  manualCredit(data) {
    return this.createSoapRequest('ManualCredit', data)
  },
  manualCallback(data) {
    return this.createSoapRequest('ManualCallback', data)
  },
  listNotCleared() {
    return this.createSoapRequest('ListNotCleared')
  },
  listPaymentMethods() {
    return this.createSoapRequest('ListPaymentMethods')
  },
  createProfile(data) {
    return this.createSoapRequest('CreateProfile', data)
  },
  listProfiles() {
    return this.createSoapRequest('ListPaymentMethods')
  },
  deleteProfile(data) {
    return this.createSoapRequest('ListPaymentMethods', data)
  },
}

module.exports = new mpay24()
