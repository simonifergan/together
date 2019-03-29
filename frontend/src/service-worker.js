console.log('Hi?')

self.addEventListener('push', function(e) {
    console.log('Hi pushhhhh');
    const data = e.data.json();
    self.registration.showNotification(data.title, {
      body: 'Notified by me',
      icon: 'icon'
    });
  });
