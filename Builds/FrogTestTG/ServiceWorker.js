var isCacheCleared = false;
const cacheName = "GameSolutions-PurpleFro-0.7.0";
const contentToCache = [
    "Build/Frog.loader.js",
    "Build/Frog.framework.js.unityweb",
    "Build/Frog.data.unityweb",
    "Build/Frog.wasm.unityweb",
    "TemplateData/style.css"
];

async function clearCache(e) {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
    return Promise.all(
      cacheNames
      .filter((name) => {
        return name.startsWith("GameSolutions-PurpleFro")
            && name !== cacheName;
      })
      .map((name) => {
        console.log("[Service Worker] Deleting old cache:", name);
        return caches.delete(name);
      })
    );
  }));
}

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    
    if (!isCacheCleared) {
      console.log('[Service Worker] Cache Install: clearing cache');
      clearCache(e);
      isCacheCleared = true;
    }

    e.waitUntil((async function () {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
});

self.addEventListener('fetch', function (e) {
    if (!isCacheCleared) {
      console.log('[Service Worker] Cache Fetch: clearing cache');
      clearCache(e);
      isCacheCleared = true;
    }

    // Check if resource is cached
    let isCached = false;
    contentToCache.every(async (contentName) => {
      if (e.request.url.endsWith(contentName)) {
        console.log(`[Service Worker] Is cached resource: ${e.request.url}. EndsWith: ${contentName}`);
        isCached = true;
      }
      return !isCached;
    });
    if (!isCached) {
      console.log(`[Service Worker] Is not cached resource: ${e.request.url}.`);
      return;
    }

    e.respondWith((async function () {

      const cache = await caches.open(cacheName);
      let response = await cache.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (response) {
        console.log(`[Service Worker] Resource is found in cache ${cacheName}`);
        return response;
      }

      response = await fetch(e.request);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })());
});
