const CACHE_NAME = 'site-seguro-v4'; // Versão atualizada
const ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  '/img/gal1.jpg',
  '/img/gal2.jpg',
  '/img/gal3.jpg',
  '/img/logo.png',
  '/img/thumbnail.jpg' // Adicionado o thumbnail
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      // Deleta caches antigos
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const req = event.request;

  // IMPORTANTE: Não interfere em APIs externas (como o Google Apps Script)
  // Deixa o navegador fazer a requisição normalmente, respeitando o CORS.
  if (!req.url.startsWith(self.location.origin)) {
    return;
  }

  // Navegação → network first
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Assets → cache first
  event.respondWith(
    caches.match(req).then(cached =>
      cached ||
      fetch(req).then(resp => {
        caches.open(CACHE_NAME).then(c => c.put(req, resp.clone()));
        return resp;
      })
    )
  );
});
