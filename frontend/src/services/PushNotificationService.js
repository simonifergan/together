// // ask for notifications' permission:
// self.Notification.requestPermission()
//     .then(res => {
//         // has user granted permission
//         console.log(res);
//     });;

// self.addEventListener('push', function (e) {
//     console.log('Hi');
//     const data = e.data.json();
//     self.registration.showNotification(data.title, {
//         body: 'Notified by Simon',
//         icon: 'http://res.cloudinary.com/dcv2jyqvl/image/upload/v1553769707/user_imgs/xyuzf1b6morbgzeg0zwh.jpg'
//     });
// });

const BACKEND_SUBSCRIBE = (process.env.NODE_ENV !== 'development')
    ? '/subscribe'
    : '//localhost:3003/subscribe';


if ('Notification' in window) {
    console.log('Notification is supported!');
  
    // if you using sw, better to add this 'navigator.serviceWorker.ready' before the request to permissions
    Notification.requestPermission(results => {
      console.log('notifications permisstions: ', results);
  
      if (results === 'denied') {
        console.log('notifications permisstions denied!');
        return;
      }
  
      configurePushSub();
    });
  }
  
  // register to listen to incoming push message from server
  function configurePushSub() {
    if (!('serviceWorker' in navigator)) return;
  
    var reg;
    navigator.serviceWorker.ready
      .then(swreg => {
        reg = swreg;
        return swreg.pushManager.getSubscription();
      })
      .then(sub => {
        if (sub) return;
  
        return reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidPublicKey
        });
      })
      .then(newSub => {
        if (!newSub) return;
        return axios.post(BACKEND_SUBSCRIBE, newSub)
      })
      .then(res => {
        if (res && res.ok) {
          console.log('subscription added successfully');
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  

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

