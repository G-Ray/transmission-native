const tr = require('./binding')

class Transmission {
  init () {
    tr.sessionInit()
  }

  close () {
    tr.sessionClose()
  }

  request (reqJson, cb) {
    const self = Buffer.alloc(tr.sizeof_tr_napi_t)
    tr.request(self, Buffer.from(JSON.stringify(reqJson)), (err, res) => {
      if (err) return cb(err)
      const resJson = JSON.parse(res)
      const e = (resJson.result !== 'success') ? new Error(resJson.result) : null
      cb(e, resJson)
    })
  }
}

module.exports = Transmission
