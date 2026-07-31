/* ============================================================
   SHOWROOM 3D — HES 1217
   Service worker: guarda la app en la tablet para que abra
   aunque el wifi de tienda se caiga.

   ⚠️ AL ACTUALIZAR catalogo.js (precios, equipos nuevos),
      SUBE ESTE NÚMERO. Si no, las tablets siguen mostrando
      la versión vieja porque la tienen guardada.
   ============================================================ */
const VERSION = 'showroom-v7';

/* La vista 3D viene de la página de HUAWEI y NO se puede guardar: sin internet
   la app abre, pero el visor muestra el aviso de "revisa el wifi".
   modelo3d.js y three siguen en el repo como respaldo, sin usarse. */
const ARCHIVOS = [
  './',
  './index.html',
  './catalogo.js',
  './logo_odemas.png',
  './icon-192.png',
  './icon-512.png',
  './manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    // Uno por uno: si un archivo falla, no se cae la instalación completa.
    await Promise.all(ARCHIVOS.map(a => cache.add(a).catch(() => {})));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const viejos = (await caches.keys()).filter(k => k !== VERSION);
    await Promise.all(viejos.map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  e.respondWith((async () => {
    // Primero la red, para que un catálogo actualizado se vea al momento;
    // si no hay señal, se sirve lo guardado.
    try {
      const red = await fetch(e.request);
      if (red && red.ok) {
        const cache = await caches.open(VERSION);
        cache.put(e.request, red.clone());
      }
      return red;
    } catch {
      const guardado = await caches.match(e.request);
      return guardado || caches.match('./index.html');
    }
  })());
});
