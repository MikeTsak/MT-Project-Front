// sw.js
self.addEventListener('push', event => {
  const data = event.data.json();

  self.registration.showNotification(data.title || '🔔 Notification', {
    body: data.body || 'New update!',
    icon: '/mtlogo.png', // optional
    badge: '/mtlogo.png' // optional
  });
});
