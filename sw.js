const CACHE = 'block-garden-v9';
const FILES = ['./','./index.html','./style.css','./sky.css','./app.js','./engine.js','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',event => { event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate',event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('block-garden-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())); });
self.addEventListener('fetch',event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const response = await fetch(event.request,{cache:'no-cache'});
      if (response.ok && FILES.some(file => new URL(file,self.registration.scope).href === event.request.url)) await cache.put(event.request,response.clone());
      return response;
    } catch (error) {
      const cached = await cache.match(event.request);
      if (cached) return cached;
      throw error;
    }
  })());
});
