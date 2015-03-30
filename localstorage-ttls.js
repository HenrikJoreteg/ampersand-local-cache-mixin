// simple abstraction to provide consistent API
// for localStorage with support for time to live
// and time to stale settings.
var isNumber = require('lodash.isnumber')
var storage = typeof window !== 'undefined' && window.localStorage

module.exports = {
  support: function () {
    return !!storage
  },
  clear: function (key) {
    if (!storage) {
      return
    }
    delete storage[key]
  },
  write: function (key, data, opts) {
    if (!storage) {
      return
    }
    storage[key] = JSON.stringify({
      time: Date.now(),
      data: data
    })
  },
  read: function (key, opts) {
    if (!storage) {
      return {
        data: null,
        stale: false
      }
    }
    if (!opts) {
      opts = {}
    }
    if (!isNumber(opts.ttl)) {
      opts.ttl = Infinity
    }
    if (!isNumber(opts.tts)) {
      opts.tts = opts.ttl
    }
    try {
      var parsed = JSON.parse(storage[key])
      var now = Date.now()
      // if it's expired, delete it
      if (now - parsed.time > opts.ttl) {
        delete storage[key]
        return {
          data: null,
          stale: false
        }
      }
      // if it's stale, return it, but specify
      // that it's stale
      if (opts.tts && now - parsed.time > opts.tts) {
        return {
          data: parsed.data,
          stale: true
        }
      }

      // just return it
      return {
        data: parsed.data,
        stale: false
      }
    } catch (e) {
      return {
        data: null,
        stale: false
      }
    }
  }
}
