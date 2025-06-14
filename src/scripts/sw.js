const CACHE_NAME = 'firegas-cache-v1';
const urlsToCache = [
  '#/', // root
  '#/index.html',
  '#/styles/style.css',
  '#/styles/responsive.css',
  '#/scripts/index.js',
  '#/scripts/views/pages/home.js',
  '#/scripts/views/pages/about.js',
  '#/scripts/views/pages/chart.js',
  '#/scripts/components/connected-status.js',
  '#/manifest.json',
  '#/icons/icon-72x72.png',
  '#/icons/icon-192x192.png',
  '#/icons/icon-512x512.png',
];

self.addEventListener('install', async event => {
  console.log('[Service Worker] Installing');

  event.waitUntil(async function() {
    try {
      const cache = await caches.open(CACHE_NAME);
      console.log('[Service Worker] Caching app shell');
      await cache.addAll(urlsToCache);
    } catch (err) {
      console.error("Failed to cache:", err);
    }
  }());

  self.skipWaiting();
});

// Activate: bersihkan cache lama
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating');
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
  let notificationData = {
    title: "Notifikasi Default",
    message: "Ada pemberitahuan baru"
  };
  
  // Pastikan parsing data dilakukan dengan aman
  try {
    if (event.data) {
      notificationData = event.data.json();
    }
  } catch (error) {
    console.error('[Service Worker] Error parsing push data:', error);
  }
  
  const title = notificationData.title || "Notifikasi";
  const options = {
    body: notificationData.message || 'Ada pemberitahuan baru',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200, 100, 200],
    tag: `${Date.now()}`,
    // tag: 'firegas-notification', // Tambahkan tag untuk mengelompokkan notifikasi
    data: { 
      url: '/',
      timestamp: new Date().getTime()
    },
    requireInteraction: true // Pastikan notifikasi tetap muncul sampai user mengkliknya
  };

  // Gunakan waitUntil untuk memastikan Service Worker tetap aktif sampai notifikasi muncul
  event.waitUntil(
    self.registration.showNotification(title, options)
      .then(() => {
        console.log('[Service Worker] Notification shown successfully');
      })
      .catch(error => {
        console.error('[Service Worker] Error showing notification:', error);
      })
  );
});

// Klik notifikasi
self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] Notification click received');
  
  event.notification.close();
  
  // Logika untuk menangani klik notifikasi
  event.waitUntil(
    clients.matchAll({type: 'window'})
      .then(clientList => {
        // Cek apakah sudah ada jendela aplikasi yang terbuka
        for (const client of clientList) {
          if (client.url.startsWith(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        // Jika tidak ada jendela yang terbuka, buka jendela baru
        return clients.openWindow(event.notification.data.url || '/');
      })
  );
});