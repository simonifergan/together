/* eslint-disable no-console */
console.log('baseURL:', process.env.BASE_URL)
const BACKEND_SUBSCRIBE = (process.env.NODE_ENV !== 'development')
    ? '/subscribe'
    : '//localhost:3003/subscribe';

import { register } from 'register-service-worker'
import {convertedVapidKey} from './services/PushNotificationService'
import Axios from 'axios';
const axios = Axios.create({
  withCredentials: true
});

if (process.env.NODE_ENV === 'development') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready (sw) {
      sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      }).then(sub => {
        console.log('sending sub', sub)
        axios.post(BACKEND_SUBSCRIBE, sub)
        .then(res => {
          console.log('axios returned', res);
        });
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
