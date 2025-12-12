const CACHE = "zen-v5";

const ASSETS = [
  "./index.html",
  "./styles.css",
  "./script.js",
  "./manifest.json",
  "./img/logo.png",
  "./img/gal1.jpg",
  "./img/gal2.jpg",
  "./img/gal3.jpg",
  "./img/thumbnail.jpg",
  "./img/icon-192.png",
  "./img/icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== CACHE && caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {

  // Não interceptar Google Apps Script ou domínios externos
  if (!e.request.url.startsWith(self.location.origin)) return;

  // Navegação: network first
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request).catch(() => caches.match("./index.html"))
    );
    return;
  }

  // Assets: cache first
  e.respondWith(
    caches.match(e.request).then(cacheRes => {
      return (
        cacheRes ||
        fetch(e.request).then(networkRes => {
          caches.open(CACHE).then(cache =>
            cache.put(e.request, networkRes.clone())
          );
          return networkRes;
        })
      );
    })
  );
});