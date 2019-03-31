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