import Axios from 'axios'
const axios = Axios.create({
  withCredentials: true
})


export const PUSH_URL = (process.env.NODE_ENV !== 'development')
  ? 'https://together-pwa.herokuapp.com/#'
  : 'http://localhost:3003/#';

export const SUB_API = (process.env.NODE_ENV !== 'development')
  ? '/subscribe'
  : 'http://localhost:3003/subscribe';


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
    title: 'Together',
    payload: {
      body: '',
      icon: '',
      vibrate: [100, 50, 100],
      actions: [
        { action: 'close', title: 'Hide notification' },
      ],
      data: {
        url: '',
      }
    },
  }
}

export function subUserForPush() {
  return new Promise((resolve, reject) => {
    if ('Notification' in window) {

      // if you using sw, better to add this 'navigator.serviceWorker.ready' before the request to permissions
      Notification.requestPermission(results => {

        if (results === 'denied') {
          return reject(false);
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
          if (sub) return sub;


          return reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey
          });
        })
        .then(newSub => {
          if (!newSub) return;
          return axios.post(`${SUB_API}`, {pushSub: JSON.stringify(newSub)})
          
        })
        .then(res => {
          resolve(res);
        })
    }
  })
}
