const tr = require('./binding')

class Transmission {
  constructor (configDir = 'transmission', appName = 'transmission') {
    this.set = new Set()
    // NOTE: we append the buffer with a null character to delimitate the C string
    tr.sessionInit(Buffer.from(configDir + '\0'), Buffer.from(appName + '\0'))
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
