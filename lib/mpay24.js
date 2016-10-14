'use strict';

let soap = require('soap');

mpay24.mdxi = 'https://www.mpay24.com/soap/etp/1.5/ETP.wsdl';

function mpay24() {
  if (!(this instanceof mpay24)) {
    return new mpay24()
  }
}

mpay24.prototype = {
  createSoapRequest(method, data) {
    data = data || {};
    return new Promise((resolve, reject) => {
      data.merchantID = mpay24.username;
      mpay24.client[method](data, function(err, data) {
        if (!err) {
          resolve(data);
        }
        reject(err);
      });
    });
  },
  init(username, password) {
    return new Promise((resolve, reject) => {
      if(!username || !password) {
        reject('Please provide your SOAP username and password');
      }
      soap.createClient(mpay24.mdxi, function(err, client) {
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
  listPaymentMethods() {
    return this.createSoapRequest('ListPaymentMethods');
  }
}

module.exports = new mpay24();
