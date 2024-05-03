const CACHE_NAME = 'movie-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;  // Return the cached response
                }
                return fetch(event.request).then(newResponse => {
                    if (!newResponse || newResponse.status !== 200 || newResponse.type !== 'basic') {
                        return newResponse;
                    }
                    const responseToCache = newResponse.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    return newResponse;
                });
            })
    );
});
