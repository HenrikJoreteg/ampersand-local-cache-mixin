var isNumber = require('lodash.isnumber')
var isString = require('lodash.isstring')
var result = require('lodash.result')
var merge = require('lodash.merge')
var pick = require('lodash.pick')
var storage = require('./localstorage-ttls')

module.exports = {
  initStorage: function (opts) {
    if (!storage.support()) {
      return
    }
    // allow options to be passed in when configured
    if (opts) {
      merge(this, pick(opts, ['storageKey', 'ttl', 'tts']))
    }
    if (this.storageKey == null || !isNumber(this.ttl)) {
      throw Error('Must have `storageKey` and `ttl` options set')
    }
    if (!isNumber(this.tts)) {
      this.tts = this.ttl
    }
    this.readFromStorage()
  },
  writeToStorage: function () {
    if (!storage.support()) {
      return
    }
    storage.write(result(this, 'storageKey'), this.serializeToStorage())
  },
  serializeToStorage: function () {
    return this.toJSON()
  },
  parseFromStorage: function (data) {
    return data
  },
  readFromStorage: function () {
    if (!storage.support()) {
      return false
    }
    var retrieved = storage.read(result(this, 'storageKey'), {
      ttl: this.ttl,
      tts: this.tts
    })

    if (!retrieved.data) {
      this.deferTrigger('empty')
      return false
    }

    this.set(this.parseFromStorage(retrieved.data))
    if (retrieved.stale) {
      this.deferTrigger('stale')
    }
    return true
  },
  deferTrigger: function (event) {
    // we do this so host object can call
    // `initStorage` before registering `stale`
    // handler (looks more sane as user)
    var self = this
    setTimeout(function () {
      self.trigger(event)
    }, 0)
  }
}
