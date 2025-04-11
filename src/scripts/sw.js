// self.addEventListener('push', (event) => {
//     console.log("Service worker pushing...")

//     const data = event.data.json();
//     const options = {
//     body: data.body,
//     vibrate: [200, 100, 200]
//   };

//     async function chainPromise() {
//         await self.registration.showNotification(data.title, options)
//     }

//     event.waitUntil(chainPromise())
// })
self.addEventListener('push', event => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.message,
    vibrate: [200, 100, 200]
    // icon: '/icons/icon-192.png',
    // badge: '/icons/icon-192.png'
  });
});