const CACHE_NAME = 'firegas-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/style.css',
  '/styles/responsive.css',
  '/scripts/index.js',
  '/scripts/views/pages/home.js',
  '/scripts/views/pages/about.js',
  '/scripts/views/pages/chart.js',
  '/scripts/components/connected-status.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install: cache semua file penting
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activate: bersihkan cache lama
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: ambil dari cache dulu, baru jaringan
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request)
        .catch(() => caches.match('/index.html')); // fallback saat offline
    })
  );
});

// Push Notification
self.addEventListener('push', event => {
  const data = event.data?.json() || {};
  const title = data.title || 'Notifikasi';
  const options = {
    body: data.message || 'Ada pemberitahuan baru',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/logo.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/' }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Klik notifikasi
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
