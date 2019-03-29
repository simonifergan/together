/* eslint-disable no-console */

import { register } from 'register-service-worker'
import {convertedVapidKey} from './services/PushNotificationService'

const SUB_KEY = 'pushSub'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready (sw) {
      sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      }).then(sub => {
        localStorage.setItem(SUB_KEY, JSON.stringify(sub));
      })
    },
    registered (gotit) {
      console.log('Service worker has been registered.', gotit)
      
    },
    cached () {
      console.log('Content has been cached for offline use.')
    },
    updatefound () {
      console.log('New content is downloading.')
    },
    updated (sup) {
      console.log('New content is available; please refresh.', sup)
    },
    offline () {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })
}
