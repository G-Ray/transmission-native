const tr = require('./binding')

class Transmission {
  init () {
    tr.sessionInit()
  }

  close () {
    tr.sessionClose()
  }

  request (reqJson) {
    const res = tr.request(Buffer.from(JSON.stringify(reqJson)))
    const resJson = JSON.parse(res)

    if (resJson.result !== 'success') throw new Error(resJson.result)

    return resJson
  }
}

module.exports = Transmission
