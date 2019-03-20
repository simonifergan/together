import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import TripDetails from '@/views/TripDetails.vue'
import LoginPage from '@/views/LoginPage.vue'
import SignupPage from '@/views/SignupPage.vue'

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
    },
    {
      path: '/login',
      name: 'LoginPage',
      component: LoginPage
    },
    {
      path: '/signup',
      name: 'SignupPage',
      component: SignupPage
    },
  ]
})
