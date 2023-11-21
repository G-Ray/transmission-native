const os = require('os')
const fs = require('fs')
const path = require('node:path')
const assert = require('node:assert/strict')
const { describe, before, beforeEach, afterEach, it } = require('node:test')

const Transmission = require('./index')

const tmpDir = path.join(os.tmpdir(), 'transmission-native')
const APP_NAME = 'transmission'

describe('transmission-native tests', async () => {
  let tr

  before(() => removeTmpDir()) // In case tmp folder already exist)

  beforeEach(() => {
    tr = new Transmission(tmpDir, APP_NAME)
  })

  afterEach(() => {
    tr.close()
    removeTmpDir()
  })

  it('request should succeed with callback', () => {
    return new Promise((resolve, reject) => {
      const req = { method: 'session-get' }

      tr.request(req, (err, json) => {
        if (err) return reject(err)
        assert.equal(json.result, 'success')
        resolve()
      })
    })
  })

  it('request should succeed with promise', async () => {
    const req = { method: 'session-get' }
    const json = await tr.request(req)

    assert.equal(json.result, 'success')
  })

  it('request should return error', async () => {
    const req = { method: 'unknown' }
    const res = await tr.request(req)
    assert.equal(res.result, 'method name not recognized')
  })

  it('one async request', async () => {
    const req = { method: 'port-test' }
    const json = await tr.request(req)

    assert.equal(json.result, 'success')
  })

  it('two async requests', async () => {
    const req = { method: 'port-test' }
    const promises = [tr.request(req), tr.request(req)]
    const results = await Promise.all(promises)

    assert.equal(results[0].result, 'success')
    assert.equal(results[1].result, 'success')
  })

  it('settings should be saved', async () => {
    let exists = fs.existsSync(path.join(tmpDir, 'settings.json'))
    assert.equal(exists, false)

    tr.saveSettings()

    // Settings.json should now be saved
    exists = fs.existsSync(path.join(tmpDir, 'settings.json'))
    assert.equal(exists, true)
  })
})

const removeTmpDir = () => {
  if (fs.existsSync(tmpDir)) {
    console.log('Removing tmp folder...')
    fs.rmSync(tmpDir, { recursive: true })
  }
}
