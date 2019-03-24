/* eslint-disable no-console */

import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'development') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready (reg) {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB', reg
      )
      reg.pushManager.getSubscription()
      .then(sub => {
        if (sub) console.log('found him', sub)
        else {
          reg.pushManager.subscribe({
            userVisibleOnly: true,
          }).then(sub => sub.toJSON()).then(sub => {
            console.log(sub);
          }).catch(err => console.log(err));
        }
      })
    },
    registered (reg) {
      console.log('Service worker has been registered.', reg)
    },
    cached () {
      console.log('Content has been cached for offline use.')
    },
    updatefound () {
      console.log('New content is downloading.')
    },
    updated () {
      console.log('New content is available; please refresh.')
    },
    offline () {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })
}
