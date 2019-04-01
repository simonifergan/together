import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home';
import TripDetails from '@/views/TripDetails';
import TripEdit from '@/views/TripEdit';
import SignupPage from '@/views/SignupPage';
import SearchPage from '@/views/SearchPage';
import UserDetails from '@/views/UserDetails';
import Messages from '@/views/Messages';
import Requests from '@/views/Requests';
import UserAccount from '@/views/UserAccount';

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
      name: 'UserDetails',
      component: UserDetails
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
      path: '/account/:userId',
      name: 'UserAccount',
      component: UserAccount
    },
    {
      path: '/messages',
      name: 'Messages',
      component: Messages
    },
    {
      path: '/requests',
      name: 'Requests',
      component: Requests
    },
    
  ],
  scrollBehavior(to, from) {
    return {x: 0 , y:0};
  }
})
