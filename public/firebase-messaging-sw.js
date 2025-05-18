// public/firebase-messaging-sw.js
self.addEventListener('push', function (event) {
  const data = event.data.json();
  self.registration.showNotification(data.notification.title, {
    body: data.notification.body,
  });
});
