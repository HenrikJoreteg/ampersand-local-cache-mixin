# ampersand-local-cache-mixin

Only fetch when your data is old or stale. Easily configurable localStorage cache for ampersand & backbone state objects, models, and collections.

Note that this is not an alternate `sync` implementation, this is to let you configure and trust a local cache but ultimately get your data from a remote source.

Works with Ampersand.js and Backbone in state objects, models, and collections.

## install

```
npm install ampersand-local-cache-mixin
```

## example

```javascript
var cacheMixin = require('ampersand-local-cache-mixin');
var Model = require('ampersand-model');
var ms = require('milliseconds');

module.exports = Model.extend(cacheMixin, {
    // "Time To Live". If more than the `ttl` (a number in milliseconds)
    // has passed since last stored last, it won't use the cache.
    // (note we're using the `miliseconds` module here for better readability)
    ttl: ms.weeks(1),

    // "Time To Stale". Similarly you can optinally provide a `tts`.
    // This is the time in milliseconds after which to consider the data
    // to be stale. In this scenario a `stale` event will be triggered
    // on the instance, but the data will still be read/set. This is good
    // for cases where you quickly want to show the data you have but still
    // got fetch new stuff in the background.
    // (note we're using the `miliseconds` module here for better readability)
    tts: ms.minutes(5),

    // The key (or function that returns a key) to use when storing this object
    // to localstorage
    storageKey: 'me',

    // After setting these options, call `initStorage` on your host object
    initialize: function () {
        // sets up our mixin and reads if it has it
        this.initStorage();

        // listen to `stale` and `empty` events
        // fetch on both
        this.on('stale empty', this.fetch, this)

        // **note: you have to tell it when to write to storage**
        // otherwise nothing ever gets cached.
        this.on('change', this.writeToStorage, this)
    }
})

```

## Other details

There are two overwriteable methods that determine what gets stored and retrieved.

Here's how they look by default:

```js
  serializeToStorage: function () {
    return this.toJSON()
  },
  parseFromStorage: function (data) {
    return data
  },
```

If you want to customize how it gets parsed/read from storage, simply overwrite those methods.

**note:** By default only `props` will get stored, not `session` or `derived` properties

## More docs?

This is really just a simple object with a few methods. It's quite short and readable, I'd suggest reading the source to know exactly what's going on.

But also,

## credits

If you like this follow [@HenrikJoreteg](http://twitter.com/henrikjoreteg) on twitter.

## license

MIT

