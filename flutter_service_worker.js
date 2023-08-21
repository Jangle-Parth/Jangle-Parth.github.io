'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "36f14dc6497219acc3dd744cd3dfec16",
"assets/AssetManifest.json": "c750fb238d15a1238b245cb783f16ec5",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "86912e3c44293b3504c981fa46552bab",
"assets/lib/songs/Baaton%2520Baaton%2520Main%2520(Official%2520Video)%2520Shashwat%2520Sachdev%2520ft.%2520Anumita%2520Nadesan%2520-%2520New%2520Song%25202022.mp3": "b2e74563235cbec566a2a2a23300a433",
"assets/lib/songs/Jain%2520-%2520Makeba%2520(Official%2520Video).mp3": "ff4c1c172b3df071241ada38f94dbcfd",
"assets/lib/songs/Khalasi%2520-%2520Coke%2520Studio%2520Bharat.mp3": "54a1946fec202565ab5550211b9a1cea",
"assets/lib/songs/Lamhey-%2520Anubha%2520Bajaj%2520-%2520Trending%2520Song%25202023%2520-%2520Official%2520Video.mp3": "1fca3e6746cd490ca16ac9ca7ac32cbd",
"assets/lib/songs/RANG%2520MORLA%2520-%2520ADITYA%2520GADHVI%2520-%2520PRIYA%2520SARAIYA%2520-%2520PARTH%2520BHARAT%2520THAKKAR%2520-%2520VAARSO-SEASON1.mp3": "8edc1125f2f5c2c15809fd01b0b48b88",
"assets/lib/songs/videoplayback.mp3": "22465f2e982eb7b15f5da8111939bf51",
"assets/lib%255Csongs%255CBaaton%2520Baaton%2520Main%2520(Official%2520Video)%2520Shashwat%2520Sachdev%2520ft.%2520Anumita%2520Nadesan%2520-%2520New%2520Song%25202022.mp3": "b2e74563235cbec566a2a2a23300a433",
"assets/lib%255Csongs%255CJain%2520-%2520Makeba%2520(Official%2520Video).mp3": "ff4c1c172b3df071241ada38f94dbcfd",
"assets/lib%255Csongs%255CKhalasi%2520-%2520Coke%2520Studio%2520Bharat.mp3": "54a1946fec202565ab5550211b9a1cea",
"assets/lib%255Csongs%255CLamhey-%2520Anubha%2520Bajaj%2520-%2520Trending%2520Song%25202023%2520-%2520Official%2520Video.mp3": "1fca3e6746cd490ca16ac9ca7ac32cbd",
"assets/lib%255Csongs%255CRANG%2520MORLA%2520-%2520ADITYA%2520GADHVI%2520-%2520PRIYA%2520SARAIYA%2520-%2520PARTH%2520BHARAT%2520THAKKAR%2520-%2520VAARSO-SEASON1.mp3": "8edc1125f2f5c2c15809fd01b0b48b88",
"assets/lib%255Csongs%255Cvideoplayback.mp3": "22465f2e982eb7b15f5da8111939bf51",
"assets/NOTICES": "88843417e7d38375bb7529607983fbe1",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "89ed8f4e49bcdfc0b5bfc9b24591e347",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"canvaskit/canvaskit.js": "5caccb235fad20e9b72ea6da5a0094e6",
"canvaskit/canvaskit.wasm": "d9f69e0f428f695dc3d66b3a83a4aa8e",
"canvaskit/chromium/canvaskit.js": "ffb2bb6484d5689d91f393b60664d530",
"canvaskit/chromium/canvaskit.wasm": "393ec8fb05d94036734f8104fa550a67",
"canvaskit/skwasm.js": "95f16c6690f955a45b2317496983dbe9",
"canvaskit/skwasm.wasm": "d1fde2560be92c0b07ad9cf9acb10d05",
"canvaskit/skwasm.worker.js": "51253d3321b11ddb8d73fa8aa87d3b15",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "6b515e434cea20006b3ef1726d2c8894",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "c3ce2e023e2699dd5c4d6b979cb1947a",
"/": "c3ce2e023e2699dd5c4d6b979cb1947a",
"main.dart.js": "ee392d29272eea144cb1fd7478e77448",
"manifest.json": "82c95422c2d55382a1262244f3d9c3dd",
"version.json": "034050742d4fca422d8f5e951e613e82"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
