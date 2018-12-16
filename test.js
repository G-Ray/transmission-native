const tape = require('tape')
const Transmission = require('./index')

const tr = new Transmission()

tape('sessionInit', t => {
  tr.init()
  t.pass('did not crash')
  t.end()
})

tape('request should succeed', t => {
  const req = { method: 'session-get' }
  const json = tr.request(req)
  t.equal(json.result, 'success')
  t.end()
})

tape('request should throw', t => {
  const req = { method: 'unknown' }
  t.throws(() => tr.request(req), RegExp('method name not recognized'))
  t.end()
})

tape('sessionClose', t => {
  tr.close()
  t.pass('did not crash')
  t.end()
})
