// ask for notifications' permission:
self.Notification.requestPermission()
  .then(() => {
    // User has agreed, hopefully.
  });


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
            {action: 'close', title: 'Hide notification'},
          ],
          data: {
            url: '',
          }
      } ,
  }
}