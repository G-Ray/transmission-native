const tape = require('tape')
const Transmission = require('./index')
const os = require('os')
const path = require('path')
const fs = require('fs')

const tmpDir = path.join(os.tmpdir(), 'transmission-native')

const removeTmpDir = () => {
  if (fs.existsSync(tmpDir)) {
    console.log('🗑️ Removing tmp folder...')
    fs.rmSync(tmpDir, { recursive: true })
  }
}

let tr

tape('setup', (t) => {
  removeTmpDir() // In case tmp folder already exist
  tr = new Transmission(tmpDir, 'transmission')
  t.end()
})

tape('request should succeed', t => {
  const req = { method: 'session-get' }
  tr.request(req, (err, json) => {
    t.error(err)
    t.equal(json.result, 'success')
    t.end()
  })
})

tape('request should succeed with promise api', async (t) => {
  const req = { method: 'session-get' }
  const json = await tr.request(req)
  t.equal(json.result, 'success')
  t.end()
})

tape('request should return error', t => {
  const req = { method: 'unknown' }
  tr.request(req, (err, res) => {
    t.equal(err.message, 'method name not recognized')
    t.end()
  })
})

tape('one async request', t => {
  const req = { method: 'port-test' }
  tr.request(req, (err, res) => {
    t.error(err)
    t.ok(res)
    t.end()
  })
})

tape('two async requests', t => {
  t.plan(4)
  let count = 0
  const req = { method: 'port-test' }

  for (let i = 0; i < 2; i++) {
    tr.request(req, (err, res) => {
      t.error(err)
      t.ok(res)
      if (++count === 2) t.end()
    })
  }
})

tape('sessionClose', t => {
  tr.close()
  t.pass('did not crash')
  t.end()
})

tape('teardown', (t) => {
  removeTmpDir()
  t.end()
})

tape.onFailure(removeTmpDir)
