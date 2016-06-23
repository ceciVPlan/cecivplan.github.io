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
      return this.CACHE_PREFIX + '5b1f26f29465b31fd9c80ccb62c03f213e39fc31';
    },

    // This is a list of resources that will be cached.
    RESOURCES: [
      'a/css/style.css', // c29ca7e09bf956a6b86bd831d97fda5c3e779023
      'a/img/ic_person_black_24dp_1x.png', // 02eee5f36d71a697741104f174d1b52695d21979
      'a/img/ic_person_black_48px.svg', // 20915f012063519b0d6798e397dc96f15ed78de1
      'a/img/ionic.png', // 075f599e6f1f0d4bd20ffef54e322d979421a298
      'a/index.html', // d41f8ebdad6c94810a3b28a04a3c6b0965dd0870
      'a/js/app.js', // fce1e3b32a01d0359ee2e9268c5604e67db49243
      'a/js/controllers.js', // 0e4b8e50a83c31ae06c4ac79d4c9071f29352c42
      'a/lib/ionic/css/ionic.css', // a31ee5838736fce8da3e0e5b2ef3a04e2ba0e019
      'a/lib/ionic/css/ionic.min.css', // ec6d65e7082e202b77a0745f142768c32baa12ec
      'a/lib/ionic/fonts/ionicons.eot', // 61532e89e212f8dd16ba31f3ebcf35c0a7334035
      'a/lib/ionic/fonts/ionicons.svg', // 3f1ca28fcb042d2bcc6ee6a4e3dd817e5132eeea
      'a/lib/ionic/fonts/ionicons.ttf', // 1b0a0de084905946a20300ca8c354865dec46764
      'a/lib/ionic/fonts/ionicons.woff', // e46819e863a46751d622c1190c4e8a83ebc20612
      'a/lib/ionic/js/angular-ui/angular-ui-router.js', // 4a6e1aa406ce7a83f4767e7dba4c3ca7de0d6917
      'a/lib/ionic/js/angular-ui/angular-ui-router.min.js', // 0973f9c46d3be867276e941e2e6af9c662a92333
      'a/lib/ionic/js/angular/angular-animate.js', // 21a3445f0041fa48877ed6aa8e073652d0483fbe
      'a/lib/ionic/js/angular/angular-animate.min.js', // c3e66eff7a631ab577d8f5cafcedd5c73da8012c
      'a/lib/ionic/js/angular/angular-resource.js', // a81c6a4e3ccb54594b7de0574ffdaec72074b551
      'a/lib/ionic/js/angular/angular-resource.min.js', // 19340106c64e49da7259fe50899e0dc8d117d40b
      'a/lib/ionic/js/angular/angular-sanitize.js', // 50255c0009f55c0b02a6981705757e99720d591f
      'a/lib/ionic/js/angular/angular-sanitize.min.js', // ce3ce38afd0602bbe55075548c64d996150877e6
      'a/lib/ionic/js/angular/angular.js', // 0be30059068872b55c9c4b270e2c8279f6056016
      'a/lib/ionic/js/angular/angular.min.js', // 62c2a0c7e119887c9a69308b6016eb07abcca075
      'a/lib/ionic/js/ionic-angular.js', // 38d03f6c746ccb8c4fad55f5dfbd00728d1aab8b
      'a/lib/ionic/js/ionic-angular.min.js', // 00a1b13147fb69aa3d49be06cb16acc224074637
      'a/lib/ionic/js/ionic.bundle.js', // 5d26ef2b037434e17a0c22361320db9c509ed945
      'a/lib/ionic/js/ionic.bundle.min.js', // 15c1fb7ab186e3c0a196a5b621f7bb7b2e793fd8
      'a/lib/ionic/js/ionic.js', // 5c2b67d115ce6c8c3d3e16ddc9ac973ee9275035
      'a/lib/ionic/js/ionic.min.js', // 77e16240356a66af2fa53c6af82ecf67f116a56f
      'a/lib/ionic/scss/_action-sheet.scss', // 9f6059400c638f0d71e1d5ab6ee097ede844eb5e
      'a/lib/ionic/scss/_animations.scss', // 1a0cebe0937b1ec858b7f459f09cbdb75016ed87
      'a/lib/ionic/scss/_backdrop.scss', // c77abab0e176c178c7756c821f0b8070a18138b4
      'a/lib/ionic/scss/_badge.scss', // b64ddc45b180d7df642f77d4f346486529eba207
      'a/lib/ionic/scss/_bar.scss', // d9f9d1fbf406af9a606fae84c4af314f86d194d8
      'a/lib/ionic/scss/_button-bar.scss', // 725cbabb732c9a518bc12ce2bab84af775ea62db
      'a/lib/ionic/scss/_button.scss', // 287b48e8a11f92181a815ee4b3bb0b9bbda76f4d
      'a/lib/ionic/scss/_checkbox.scss', // 5a38815ab32229b19a365fda2f9703de573478d3
      'a/lib/ionic/scss/_form.scss', // 4c278f923fc3efeb5dde135651b46d71bdcaffaf
      'a/lib/ionic/scss/_grid.scss', // 613679c2f2c49377f2d3bbb8a58aecd14d16fd82
      'a/lib/ionic/scss/_items.scss', // 5c1cda6c3073282aa005569abcf3d1d6328126c6
      'a/lib/ionic/scss/_list.scss', // 2cf20f3bb6cdb7e706c35616ef056e5f1d9db469
      'a/lib/ionic/scss/_loading.scss', // bf9e4b93b1b004d14ca34849a4713eee9fdc247d
      'a/lib/ionic/scss/_menu.scss', // e9ceac584fdc1bf5ac703a605cf883577f9747bf
      'a/lib/ionic/scss/_mixins.scss', // 057240578c836ad90d6291676d0f255bc11e60d7
      'a/lib/ionic/scss/_modal.scss', // 9cd8fd8d15ffa799ada33414cc4c7473178eee79
      'a/lib/ionic/scss/_platform.scss', // 7f94c5ea45524cafbd941bd985e39227d84384b1
      'a/lib/ionic/scss/_popover.scss', // 033762b8e3038c5d423d932418db325b8c86508c
      'a/lib/ionic/scss/_popup.scss', // c8f0d021a3a28e94005eb8808ae0e69b7db9a9c1
      'a/lib/ionic/scss/_progress.scss', // 61d93cc23a5cc94e071fcbab374ad83de5071f87
      'a/lib/ionic/scss/_radio.scss', // 98821447ad5ef160b5d0fe0133e4de46142ba0fa
      'a/lib/ionic/scss/_range.scss', // acd4f7fa5556c443891d376d11240e18b15c371b
      'a/lib/ionic/scss/_refresher.scss', // 302edb91d041df7cb4b84497580a8611b47be314
      'a/lib/ionic/scss/_reset.scss', // b8eac9aa8001a7792ce8c41b4627196fb9917416
      'a/lib/ionic/scss/_scaffolding.scss', // 458f8565a18e6a4f0c562b40a09f74a75f9556c3
      'a/lib/ionic/scss/_select.scss', // dcaad92fd831d9d4cfc2f729b4549eb1b6e75a44
      'a/lib/ionic/scss/_slide-box.scss', // 2c246bfb26c887384f0c6f5794a3c6827a75c6f8
      'a/lib/ionic/scss/_slides.scss', // c2af880b01c193ae92dfcf2d7ec683acccca40cf
      'a/lib/ionic/scss/_spinner.scss', // 2aaa0bcdd9738baddbb662ace522dd752d7a2773
      'a/lib/ionic/scss/_tabs.scss', // 53c7ce3e4ed2bcc3dada8513841ba1b551c728a9
      'a/lib/ionic/scss/_toggle.scss', // 670bbdc2bf6bd9cb243d1d5ccf2d8854fc788acb
      'a/lib/ionic/scss/_transitions.scss', // bdbf66c58347464b582b86842d10a8172172b734
      'a/lib/ionic/scss/_type.scss', // 0b6a5712b22c44ee985d73fa432eb885bad8dc35
      'a/lib/ionic/scss/_util.scss', // d2ee76de3f18c44827d6b5a77fb97328878a6315
      'a/lib/ionic/scss/_variables.scss', // a5b0b8a72ac006a2e249b55b2fe3d9c1f10dc2e4
      'a/lib/ionic/scss/ionic.scss', // 2aa15845d241f3071c48e8b280efd1756162b48a
      'a/lib/ionic/scss/ionicons/_ionicons-font.scss', // 54d04dd3c635098ecb04e24a52c1ee6e2cc758b1
      'a/lib/ionic/scss/ionicons/_ionicons-icons.scss', // 7cb317da905ae4e845f39f5697014ef9f29f96f2
      'a/lib/ionic/scss/ionicons/_ionicons-variables.scss', // 704fa87c4800725c30a04608cace28514615ef06
      'a/lib/ionic/scss/ionicons/ionicons.scss', // 853e992abfeec6a7e941559d8513b882c0c3d656
      'a/lib/ionic/version.json', // b2115c658e42c01d2c9c6264e83f6b2761673f40
      'a/templates/browse.html', // 92ae07b7f71d4d2f6f597941747ff0bf5ecf1a71
      'a/templates/login.html', // bd7f1cc962e70ded81ca48e6b03884b3ac7d88b3
      'a/templates/menu.html', // 38604957f4c8175848d5b7410cd502c7f15f5c25
      'a/templates/playlist.html', // 142a592c476ad235954794c46c7fc7b65b09bee1
      'a/templates/playlists.html', // ade3bd2ca2ca5059e7edf62e85b236340c6a341f
      'a/templates/search.html', // c77a78c39a2e5d973fc6cf5fc6f0b1c64cc7179a
      'action-icon-ios7.png', // 0360cd1a97f42e386fd889c3e3f8c5c23c552916
      'cache.manifest', // 45fb3c55f70a002b28b29d74deecaf658affdd2a
      'CNAME', // 7467717f9f20770caf605b6c85d80fd3baf28dfb
      'dark.min.css', // 0efac0ce3ea332b412fc8dbbcfe1ec20c279727d
      'dropdown.png', // 2ef71158816732d7803766d54344939c7abe7088
      'dropup.png', // 1679b1b3bea5d1c216361f85d2d54d45914092a5
      'firebase.json', // 3fc0b879299121fca7b3a77dbffab54cd9ef63c3
      'firststart.html', // 55ba600c2d9d30e1a786bd436f7cacf6733c32c2
      'gulpfile.js', // ae852d357c290c3e938f395ed7913129d9dc94a0
      'ic_launcher.png', // f1138a1e4199f6807cbe832814e7c845cbb88b69
      'ic_person_black_24dp_1x.png', // 02eee5f36d71a697741104f174d1b52695d21979
      'index.html', // b2b330e1e35b79f24002b0319a6c05c82454f99b
      'jquery.min.js', // b14a228c3632ebfe3d20e5ea830ceea313523353
      'jquery.mobile-1.4.5.min.css', // 8897f68fffc72c72fca51a5c59454c966283d381
      'jquery.mobile-1.4.5.min.js', // fc55d367c7272bdde8070f851af4584bbc10b2e8
      'manifest.json', // 51e8a6114cfa5f940fd1b3bb1b1b88d59632fcae
      'nav.png', // 83b3bb63258de0c9dd1d52d7e44485c886829857
      'offline-manager.js', // e2e09e000c5b64035940ae44e9c0936eb25ecd51
      'public/404.html', // 4c185a7b907a78e896ba83c4028a87fb3b31b3dd
      'public/action-icon-ios7.png', // 0360cd1a97f42e386fd889c3e3f8c5c23c552916
      'public/cache.manifest', // 289ff1b6833e8a2e5721b5e95683d74134f54293
      'public/CNAME', // 7467717f9f20770caf605b6c85d80fd3baf28dfb
      'public/dark.min.css', // 0efac0ce3ea332b412fc8dbbcfe1ec20c279727d
      'public/dropdown.png', // 2ef71158816732d7803766d54344939c7abe7088
      'public/dropup.png', // 1679b1b3bea5d1c216361f85d2d54d45914092a5
      'public/firebase.json', // 3fc0b879299121fca7b3a77dbffab54cd9ef63c3
      'public/firststart.html', // 55ba600c2d9d30e1a786bd436f7cacf6733c32c2
      'public/gulpfile.js', // ae852d357c290c3e938f395ed7913129d9dc94a0
      'public/ic_launcher.png', // f1138a1e4199f6807cbe832814e7c845cbb88b69
      'public/ic_person_black_24dp_1x.png', // 02eee5f36d71a697741104f174d1b52695d21979
      'public/index.html', // b2b330e1e35b79f24002b0319a6c05c82454f99b
      'public/jquery.min.js', // b14a228c3632ebfe3d20e5ea830ceea313523353
      'public/jquery.mobile-1.4.5.min.css', // 8897f68fffc72c72fca51a5c59454c966283d381
      'public/jquery.mobile-1.4.5.min.js', // fc55d367c7272bdde8070f851af4584bbc10b2e8
      'public/manifest.json', // 51e8a6114cfa5f940fd1b3bb1b1b88d59632fcae
      'public/nav.png', // 83b3bb63258de0c9dd1d52d7e44485c886829857
      'public/offline-manager.js', // e2e09e000c5b64035940ae44e9c0936eb25ecd51
      'public/offline-worker.js', // f8ada6384e094b378f5dff5555bbd3bb047db2a1
      'public/README.md', // b4e817246ea8c6db5c674664e1ce974c851bc977
      'public/style.css', // 88173942a8ac60faaf12f6f300ee98fba4617e17
      'README.md', // b4e817246ea8c6db5c674664e1ce974c851bc977
      'style.css', // 88173942a8ac60faaf12f6f300ee98fba4617e17

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
