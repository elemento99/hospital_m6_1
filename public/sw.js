self.addEventListener("install", (event) => {
    console.log("Service Worker instalado");
    event.waitUntil(self.skipWaiting());
    });
    self.addEventListener("activate", (event) => {
    console.log("Service Worker activado");
    });
    self.addEventListener("fetch", (event) => {
    console.log("Interceptando solicitud:", event.request.url);
    })

    const CACHE_NAME = "pwa-cache-v1";
const urlsToCache = ["/", "/index.html", "/icons/icon-192x192.png"];
self.addEventListener("install", event => {
event.waitUntil(
caches.open(CACHE_NAME).then(cache => {
return cache.addAll(urlsToCache);
})
);
});
self.addEventListener("fetch", event => {
event.respondWith(
caches.match(event.request).then(response => {
return response || fetch(event.request);
})
);
});