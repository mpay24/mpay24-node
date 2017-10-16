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
          } else {
            reject(res)
          }
        } else {
          reject(err)
        }
      })
    })
  },
  init(username, password, environment = 'LIVE') {
    return new Promise((resolve, reject) => {
      if (!username || !password) {
        reject('Please provide your SOAP user and password')
      }
      const ep = '/app/bin/etpproxy_v15'
      let mpayEndpoint
      switch (environment) {
        case 'TEST':
          mpayEndpoint = `https://test.mpay24.com${ep}`
          break
        case 'LIVE':
          mpayEndpoint = `https://www.mpay24.com${ep}`
          break
        default:
          mpayEndpoint = `${environment}${ep}`
          break
      }
      const options = {
        endpoint: mpayEndpoint
      }
      soap.createClient(mpay24.wsdl, options, (err, client) => {
        if (!err) {
          client.addHttpHeader('User-Agent', `mpay24-node/${pkg.version}`)
          client.setSecurity(
            new soap.BasicAuthSecurity(`u${username}`, password)
          )
          mpay24.client = client
          mpay24.username = username
          resolve()
        }
        reject(err)
      })
    })
  },

  createPaymentToken(data) {
    return this.createSoapRequest('CreatePaymentToken', data)
  },
  acceptPayment(data) {
    data.payment.attributes = {
      'xsi:type': `etp:Payment${data.pType}`
    }
    return this.createSoapRequest('AcceptPayment', data)
  },
  createCustomer(data) {
    data.paymentData.attributes = {
      'xsi:type': 'etp:PaymentData' + data.pType
    }
    return this.createSoapRequest('CreateCustomer', data)
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
    return new Promise((resolve, reject) => {
      this.createSoapRequest('TransactionStatus', data)
        .then(result => {
          resolve(helper.formatResult(result))
        })
        .catch(err => {
          reject(err)
        })
    })
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
    return this.createSoapRequest('ListProfiles')
  },
  deleteProfile(data) {
    return this.createSoapRequest('DeleteProfile', data)
  }
}

module.exports = new mpay24()
