const util = require('util')

const tr = require('./binding')

class Transmission {
  constructor (configDir = 'transmission', appName = 'transmission') {
    // Keep reference of requests in a set to avoid the requests to be GC
    this.set = new Set()
    // NOTE: we append the buffer with a null character to delimitate the C string
    tr.sessionInit(Buffer.from(configDir + '\0'), Buffer.from(appName + '\0'))
  }

  close () {
    tr.sessionClose()
  }

  request (reqJson, cb) {
    // Callback api
    if (cb && typeof cb === 'function') {
      return this._request(reqJson, cb)
    }

    // Promise api
    const promisified = util.promisify(this._request).bind(this)
    return promisified(reqJson)
  }

  _request (reqJson, cb) {
    const self = Buffer.alloc(tr.sizeof_tr_napi_t)
    this.set.add(self)
    tr.request(self, Buffer.from(JSON.stringify(reqJson)), (err, res) => {
      if (err) return cb(err)
      const resJson = JSON.parse(res)
      this.set.delete(self)
      cb(null, resJson)
    })
  }
}

module.exports = Transmission
