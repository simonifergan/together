import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import TripDetails from '@/views/TripDetails.vue'
import TripEdit from '@/views/TripEdit.vue'
import LoginPage from '@/views/LoginPage.vue'
import SignupPage from '@/views/SignupPage.vue'
import SearchPage from '@/views/SearchPage.vue'
import UserDetails from '@/views/UserDetails.vue'

import AwesomeMap from '@/components/OurSuperAwesomeMap.vue';
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/edit/:tripId?',
      name: 'TripEdit',
      component: TripEdit
    },
    {
      path: '/trip/:tripId',
      name: 'tripDetails',
      component: TripDetails
    },
    {
      path: '/user/:userId',
      name: 'userDetails',
      component: UserDetails
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
    {
      path: '/search',
      name: 'SearchPage',
      component: SearchPage
    },
    {
      path: '/map',
      component: AwesomeMap
    }
    
  ]
})
