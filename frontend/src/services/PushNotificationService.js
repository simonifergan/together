// ask for notifications' permission:
self.Notification.requestPermission()
  .then(res => {
    // has user granted permission
    console.log(res);
  });;

self.addEventListener('push', function (e) {
  console.log('Hi pushhhhh', e);
  const data = e.data.json();
  console.log(data.payload);
  self.registration.showNotification(data.title, data.payload);
});



// if ('Notification' in window) {
//   console.log('Notification is supported!');

//   // if you using sw, better to add this 'navigator.serviceWorker.ready' before the request to permissions
//   Notification.requestPermission(results => {
//     console.log('notifications permisstions: ', results);

//     if (results === 'denied') {
//       console.log('notifications permisstions denied!');
//       return;
//     }

//   });
// }

export const PUSH_URL = (process.env.NODE_ENV !== 'development')
    ? 'https://travel-maker-app.herokuapp.com/#'
    : 'http://localhost:3003/#';



function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const publicKey = 'BPTudf_2kdiCXX7F-mK4JfEvnRCRmyk7yNPKPwj4NjqcudODMIeCdQE7x8fi6J3VVz0-TF51963WyhansbFZiEc';
export const convertedVapidKey = urlBase64ToUint8Array(publicKey);

export function getEmptyPushNotification() {
  return {
      title: 'Travel Maker',
      payload: {
          body: '',
          icon: '',
          vibrate: [100, 50, 100],
          actions: [
            {action: 'close', title: 'Hide notification'},
          ],
          data: {
            url: '',
          }
      } ,
  }
}