self.addEventListener('push', event => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.message,
    vibrate: [200, 100, 200],
    data: {
      url: '/home'  // bisa redirect ketika klik
    },
    icon: '../public/icons/icon-192x192.png',
    badge: '../public/icons/logo.png'
  });
});