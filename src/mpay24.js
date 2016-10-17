'use strict';

let soap = require('soap');
var js2xmlparser = require('js2xmlparser');

mpay24.mdxi = 'https://www.mpay24.com/soap/etp/1.5/ETP.wsdl';

function mpay24() {
  if (!(this instanceof mpay24)) {
    return new mpay24();
  }
}

function keyToUpperCase(obj) {
  for (var key in obj) {
    var temp;
    if (obj.hasOwnProperty(key)) {
      temp = obj[key];
      if(typeof temp =='object') {
        temp = keyToUpperCase(temp);
      }
      delete obj[key];
      obj[key.charAt(0).toUpperCase() + key.substring(1)] = temp;
    }
  }
  return obj;
}

mpay24.prototype = {
  createSoapRequest(method, data) {
    data = data || {};
    return new Promise((resolve, reject) => {
      data.merchantID = mpay24.username;
      mpay24.client[method](data, function(err, data) {
        if (!err) {
          if(data.status === 'OK') {
            resolve(data);
          }
          reject(data);
        }
        reject(err);
      });
    });
  },
  init(username, password, environment) {
    environment = environment || 'LIVE';
    return new Promise((resolve, reject) => {
      if(!username || !password) {
        reject('Please provide your SOAP user and password');
      }
      const prefix = environment === 'TEST' ? 'test' : 'www';
      const mpayEndpoint = `https://${prefix}.mpay24.com/app/bin/etpproxy_v15`;
      const options = {
        endpoint: mpayEndpoint,
      };
      soap.createClient(mpay24.mdxi, options, function(err, client) {
        if(!err) {
          client.setSecurity(new soap.BasicAuthSecurity(username, password));
          mpay24.client = client;
          mpay24.username = username.substr(1);
          resolve();
        }
        reject('Client could not be created. Please contact support');
      });
    });
  },
  createPaymentToken(data) {
    return this.createSoapRequest('CreatePaymentToken', data);
  },
  acceptPayment(data) {
    data.payment['attributes'] = {
      'xsi:type': 'etp:Payment'+data.pType,
    };
    return this.createSoapRequest('AcceptPayment', data);
  },
  selectPayment(data) {
    data.price = parseFloat(data.price).toFixed(2);
    data = keyToUpperCase(data);
    data.mdxi = js2xmlparser.parse('Order', data);
    return this.createSoapRequest('SelectPayment', data);
  },
  acceptWithdraw(data) {
    return this.createSoapRequest('AcceptWithdraw', data);
  },
  transactionStatus(data) {
    return this.createSoapRequest('TransactionStatus', data);
  },
  transactionConfirmation(data) {
    return this.createSoapRequest('TransactionConfirmation', data);
  },
  transactionHistory(data) {
    return this.createSoapRequest('TransactionHistory', data);
  },
  manualClear(data) {
    return this.createSoapRequest('ManualClear', data);
  },
  manualReverse(data) {
    return this.createSoapRequest('ManualReverse', data);
  },
  manualCredit(data) {
    return this.createSoapRequest('ManualCredit', data);
  },
  listNotCleared() {
    return this.createSoapRequest('ListNotCleared');
  },
  listPaymentMethods() {
    return this.createSoapRequest('ListPaymentMethods');
  },
  createProfile(data) {
    return this.createSoapRequest('CreateProfile', data);
  },
  listProfiles() {
    return this.createSoapRequest('ListPaymentMethods');
  },
  deleteProfile(data) {
    return this.createSoapRequest('ListPaymentMethods', data);
  }
}

module.exports = new mpay24();
