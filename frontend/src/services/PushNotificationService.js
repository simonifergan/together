// ask for notifications' permission:
self.Notification.requestPermission()
    .then(res => {
        // has user granted permission
        console.log(res);
    });;

self.addEventListener('push', function (e) {
    console.log('Hi');
    const data = e.data.json();
    self.registration.showNotification(data.title, {
        body: 'Notified by Simon',
        icon: 'http://res.cloudinary.com/dcv2jyqvl/image/upload/v1553769707/user_imgs/xyuzf1b6morbgzeg0zwh.jpg'
    });
});

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

