importScripts("/precache-manifest.c01d26bf8ac90b98ff0752b64a63cc8f.js", "https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");


self.addEventListener('push', function(e) {
  const data = e.data.json();
  self.registration.showNotification(data.title, data.payload);
});

self.addEventListener('notificationclick', function(e) {
  var notification = e.notification;
  var action = e.action;

  if (action === 'close') {
    notification.close();
  } else if (action === 'go') {
    clients.openWindow(`${notification.data.url}`);
    notification.close();
  }
});
