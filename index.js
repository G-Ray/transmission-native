const tr = require('./binding')

class Transmission {
  constructor () {
    this.set = new Set()
  }

  init () {
    tr.sessionInit()
  }

  close () {
    tr.sessionClose()
  }

  request (reqJson, cb) {
    const self = Buffer.alloc(tr.sizeof_tr_napi_t)
    this.set.add(self)
    tr.request(self, Buffer.from(JSON.stringify(reqJson)), (err, res) => {
      if (err) return cb(err)
      const resJson = JSON.parse(res)
      const e = (resJson.result !== 'success') ? new Error(resJson.result) : null
      this.set.delete(self)
      cb(e, resJson)
    })
  }
}

module.exports = Transmission
