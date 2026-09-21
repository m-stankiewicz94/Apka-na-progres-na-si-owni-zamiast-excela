'use strict';

const CACHE = 'gf-v1';
const ASSETS = [
  './',
  'index.html',
  'style.css',
  'app.js',
  'content.js',
  'screens.js',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png',
  'fonts/manrope-latin-400-normal.woff2',
  'fonts/manrope-latin-500-normal.woff2',
  'fonts/manrope-latin-600-normal.woff2',
  'fonts/manrope-latin-700-normal.woff2',
  'fonts/manrope-latin-ext-400-normal.woff2',
  'fonts/manrope-latin-ext-500-normal.woff2',
  'fonts/manrope-latin-ext-600-normal.woff2',
  'fonts/manrope-latin-ext-700-normal.woff2',
  'fonts/fraunces-latin-500-normal.woff2',
  'fonts/fraunces-latin-600-normal.woff2',
  'fonts/fraunces-latin-700-normal.woff2',
  'fonts/fraunces-latin-ext-500-normal.woff2',
  'fonts/fraunces-latin-ext-600-normal.woff2',
  'fonts/fraunces-latin-ext-700-normal.woff2'
];

const SCOPE_PATH = new URL('./', self.location.href).pathname;

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      // Cache Storage jest wspólny dla całej domeny — sprzątamy tylko własne wersje (gf-*),
      // żeby nie kasować cache drugiej aplikacji hostowanej obok.
      return Promise.all(keys.filter(function (k) { return k !== CACHE && k.indexOf('gf-') === 0; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  if (url.pathname.indexOf(SCOPE_PATH) !== 0) return;

  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(function (hit) {
      if (hit) return hit;
      return fetch(e.request).then(function (res) {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        }
        return res;
      }).catch(function () {
        if (e.request.mode === 'navigate') return caches.match('index.html');
        return Response.error();
      });
    })
  );
});
