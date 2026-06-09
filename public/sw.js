const CACHE_NAME = '4way-quick-stop-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/pages/food.html',
  '/pages/deals.html',
  '/pages/store.html',
  '/pages/fuel.html',
  '/pages/location.html',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // We only cache GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip caching Google Sheets data via SW since we do that in localStorage manually
  if (event.request.url.includes('docs.google.com/spreadsheets')) return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        // Return from cache, but fetch fresh in background
        fetch(event.request).then(response => {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, response);
          });
        }).catch(() => {}); // Ignore network errors in background
        return cachedResponse;
      }
      
      // If not in cache, fetch from network
      return fetch(event.request).then(response => {
        // Don't cache bad responses or non-basic types
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return response;
      }).catch(() => {
        // If network fails and not in cache, we could return a fallback offline page here if we had one
      });
    })
  );
});
