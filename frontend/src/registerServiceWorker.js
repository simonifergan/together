/* eslint-disable no-console */

import { register } from 'register-service-worker'
import { SUB_API, convertedVapidKey } from './services/PushNotificationService'
import Axios from 'axios'
const axios = Axios.create({
  withCredentials: true
})

// EVENT LISTENER:

const SUB_KEY = 'pushSub'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready(sw) {
      console.log('Service worker is ready');
      sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      }).then(sub => {
        const subStr = JSON.stringify(sub);
        sessionStorage.setItem(SUB_KEY, subStr);
        axios.post(SUB_API, {pushSub: subStr})
      })
    },
    registered() {
      console.log('Service worker has been registered.')
    },
    cached() {
      console.log('Content has been cached for offline use.')
    },
    updatefound() {
      console.log('New content is downloading.')
    },
    updated() {
      console.log('New content is available; please refresh.')
    },
    offline() {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error(error) {
      console.error('Error during service worker registration:')
    }
  })
}
