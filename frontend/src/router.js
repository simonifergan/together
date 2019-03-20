import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import TripDetails from '@/views/TripDetails.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/trip/:tripId',
      name: 'tripDetails',
      component: TripDetails
    }
  ]
})
