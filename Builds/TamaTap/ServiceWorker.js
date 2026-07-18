const cacheName = "ErmineGames-tamagotchi-d_1.3.21";
const contentToCache = [
    "Build/Tamagichi.loader.js",
    "Build/Tamagichi.framework.js",
    "Build/Tamagichi.data",
    "Build/Tamagichi.wasm",
    "TemplateData/style.css"

];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');

    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => {
                        return name !== cacheName;
                    })
                    .map((name) => {
                        console.log("[Service Worker] Deleting old cache:", name);
                        return caches.delete(name);
                    })
            );
        })
    );
    e.waitUntil((async function () {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
      console.log('[Service Worker] Caching all: finished');
    })());
});

self.addEventListener('fetch', function (e) {
    e.respondWith((async function () {
      let response = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (response) { return response; }

      response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })());
});
