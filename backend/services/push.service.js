const webpush = require('web-push');

const publicKey = 'BPTudf_2kdiCXX7F-mK4JfEvnRCRmyk7yNPKPwj4NjqcudODMIeCdQE7x8fi6J3VVz0-TF51963WyhansbFZiEc';
const privateKey = 'jUPH-cWH6gKwpP3GTnXhmpDZx9eUBcC3nq-lcqTwNCQ'
webpush.setVapidDetails(
    'mailto:travel@travelmaker.app',
    publicKey,
    privateKey
)

const userService = require('./user.service');

// PASTE THIS IN SERVICE WORKER:
// // EVENT LISTENER:
// self.addEventListener('push', function(e) {
//     console.log('Hi pushhhhh');
//     const data = e.data.json();
//     self.registration.showNotification(data.title, data.payload);
//   });
  
//   self.addEventListener('notificationclick', function(e) {
//     var notification = e.notification;
//     var action = e.action;
  
//     if (action === 'close') {
//       notification.close();
//     } else if (action === 'go') {
//       console.log(e.data, notification);
//       clients.openWindow(`${notification.data.url}`);
//       notification.close();
//     }
//   });

// OLD:
// // EVENT LISTENER:
// self.addEventListener('push', function(e) {
//     console.log('Hi pushhhhh');
//     const data = e.data.json();
//     self.registration.showNotification(data.title, data.payload);
//   });
  
//   self.addEventListener('notificationclick', function(e) {
//     var notification = e.notification;
//     var action = e.action;
  
//     if (action === 'close') {
//       notification.close();
//     } else if (action === 'go') {
//       console.log(e.data, notification);
//       clients.openWindow(`${notification.data.url}`);
//       notification.close();
//     }
//   });

async function send(userId, notification) {
        // // test push msg:
        // const notification = JSON.stringify({
        //     title: `WELCOME BACK`, payload: {
        //         body: 'Check what you have missed',
        //         icon: `http://res.cloudinary.com/dcv2jyqvl/image/upload/v1553768401/user_imgs/ocf9hizf2fmpea9laie4.jpg`,
        //     }
        // });

        console.log(notification)
        const subscriber = await userService.findSubscriber(userId);
        if (subscriber) {
            if (!subscriber.pushSub) return;
            webpush.sendNotification(subscriber.pushSub, JSON.stringify(notification))
                .then(something => {
                    console.log('WORKED?')
                })
                .catch(err => console.log(err));
        } else {
            console.log('Subscriber not found');
        }

}

module.exports = {
    send,
}