/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */


(function (self) {
  'use strict';

  // On install, cache resources and skip waiting so the worker won't
  // wait for clients to be closed before becoming active.
  self.addEventListener('install', event =>
    event.waitUntil(
      oghliner.cacheResources()
      .then(() => self.skipWaiting())
    )
  );

  // On activation, delete old caches and start controlling the clients
  // without waiting for them to reload.
  self.addEventListener('activate', event =>
    event.waitUntil(
      oghliner.clearOtherCaches()
      .then(() => self.clients.claim())
    )
  );

  // Retrieves the request following oghliner strategy.
  self.addEventListener('fetch', event => {
    if (event.request.method === 'GET') {
      event.respondWith(oghliner.get(event.request));
    } else {
      event.respondWith(self.fetch(event.request));
    }
  });

  var oghliner = self.oghliner = {

    // This is the unique prefix for all the caches controlled by this worker.
    CACHE_PREFIX: 'offline-cache:ceciVPlan/cecivplan.github.io:' + (self.registration ? self.registration.scope : '') + ':',

    // This is the unique name for the cache controlled by this version of the worker.
    get CACHE_NAME() {
      return this.CACHE_PREFIX + '408ac68413bde70ca01bf30a608d2a0681e11b6f';
    },

    // This is a list of resources that will be cached.
    RESOURCES: [
      './404.html', // 4c185a7b907a78e896ba83c4028a87fb3b31b3dd
      './action-icon-ios7.png', // 0360cd1a97f42e386fd889c3e3f8c5c23c552916
      './cache.manifest', // 45fb3c55f70a002b28b29d74deecaf658affdd2a
      './CNAME', // 7467717f9f20770caf605b6c85d80fd3baf28dfb
      './dark.min.css', // 0efac0ce3ea332b412fc8dbbcfe1ec20c279727d
      './dropdown.png', // 2ef71158816732d7803766d54344939c7abe7088
      './dropup.png', // 1679b1b3bea5d1c216361f85d2d54d45914092a5
      './firebase.json', // 3fc0b879299121fca7b3a77dbffab54cd9ef63c3
      './firststart.html', // 55ba600c2d9d30e1a786bd436f7cacf6733c32c2
      './gulpfile.js', // ae852d357c290c3e938f395ed7913129d9dc94a0
      './ic_launcher.png', // f1138a1e4199f6807cbe832814e7c845cbb88b69
      './ic_person_black_24dp_1x.png', // 02eee5f36d71a697741104f174d1b52695d21979
      './index.html', // b2b330e1e35b79f24002b0319a6c05c82454f99b
      './jquery.min.js', // b14a228c3632ebfe3d20e5ea830ceea313523353
      './jquery.mobile-1.4.5.min.css', // 8897f68fffc72c72fca51a5c59454c966283d381
      './jquery.mobile-1.4.5.min.js', // fc55d367c7272bdde8070f851af4584bbc10b2e8
      './manifest.json', // 51e8a6114cfa5f940fd1b3bb1b1b88d59632fcae
      './nav.png', // 83b3bb63258de0c9dd1d52d7e44485c886829857
      './offline-manager.js', // e2e09e000c5b64035940ae44e9c0936eb25ecd51
      './README.md', // b4e817246ea8c6db5c674664e1ce974c851bc977
      './style.css', // 88173942a8ac60faaf12f6f300ee98fba4617e17

    ],

    // Adds the resources to the cache controlled by this worker.
    cacheResources: function () {
      var now = Date.now();
      var baseUrl = self.location;
      return this.prepareCache()
      .then(cache => Promise.all(this.RESOURCES.map(resource => {
        // Bust the request to get a fresh response
        var url = new URL(resource, baseUrl);
        var bustParameter = (url.search ? '&' : '') + '__bust=' + now;
        var bustedUrl = new URL(url.toString());
        bustedUrl.search += bustParameter;

        // But cache the response for the original request
        var requestConfig = { credentials: 'same-origin' };
        var originalRequest = new Request(url.toString(), requestConfig);
        var bustedRequest = new Request(bustedUrl.toString(), requestConfig);
        return fetch(bustedRequest)
        .then(response => {
          if (response.ok) {
            return cache.put(originalRequest, response);
          }
          console.error('Error fetching ' + url + ', status was ' + response.status);
        });
      })));
    },

    // Remove the offline caches not controlled by this worker.
    clearOtherCaches: function () {
      var outOfDate = cacheName => cacheName.startsWith(this.CACHE_PREFIX) && cacheName !== this.CACHE_NAME;

      return self.caches.keys()
      .then(cacheNames => Promise.all(
        cacheNames
        .filter(outOfDate)
        .map(cacheName => self.caches.delete(cacheName))
      ));
    },

    // Get a response from the current offline cache or from the network.
    get: function (request) {
      return this.openCache()
      .then(cache => cache.match(() => this.extendToIndex(request)))
      .then(response => {
        if (response) {
          return response;
        }
        return self.fetch(request);
      });
    },

    // Make requests to directories become requests to index.html
    extendToIndex: function (request) {
      var url = new URL(request.url, self.location);
      var path = url.pathname;
      if (path[path.length - 1] !== '/') {
        return request;
      }
      url.pathname += 'index.html';
      return new Request(url.toString(), request);
    },

    // Prepare the cache for installation, deleting it before if it already exists.
    prepareCache: function () {
      return self.caches.delete(this.CACHE_NAME)
      .then(() => this.openCache());
    },

    // Open and cache the offline cache promise to improve the performance when
    // serving from the offline-cache.
    openCache: function () {
      if (!this._cache) {
        this._cache = self.caches.open(this.CACHE_NAME);
      }
      return this._cache;
    }

  };
}(self));
