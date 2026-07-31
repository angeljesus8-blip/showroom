/* ============================================================
   SHOWROOM — HES 1217
   Service worker: guarda la app en la tablet para que abra
   aunque el wifi de tienda se caiga.

   Las fotos SÍ se guardan (están en el proyecto), así que sin
   internet el catálogo funciona completo. Lo único que necesita
   señal es el visor 3D, que viene de la página de HUAWEI.

   ⚠️ AL ACTUALIZAR catalogo.js (precios, equipos, fotos),
      SUBE ESTE NÚMERO. Si no, las tablets siguen mostrando
      la versión vieja porque la tienen guardada.
   ============================================================ */
const VERSION = 'showroom-v9';

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

  const url = new URL(e.request.url);
  // El visor 3D es de otro sitio: no se guarda ni se intercepta.
  if (url.origin !== location.origin) return;

  // Las fotos no cambian nunca: primero lo guardado, así el catálogo
  // se siente instantáneo y no gasta datos de la tablet.
  const esFoto = url.pathname.includes('/fotos/');

  e.respondWith((async () => {
    const cache = await caches.open(VERSION);

    if (esFoto) {
      const guardada = await cache.match(e.request);
      if (guardada) return guardada;
    }
    try {
      const red = await fetch(e.request);
      if (red && red.ok) cache.put(e.request, red.clone());
      return red;
    } catch {
      return (await cache.match(e.request)) || cache.match('./index.html');
    }
  })());
});
