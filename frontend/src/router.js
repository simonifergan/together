import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import TripDetails from '@/views/TripDetails.vue';
import TripEdit from '@/views/TripEdit.vue';
import SignupPage from '@/views/SignupPage.vue';
import SearchPage from '@/views/SearchPage.vue';
import UserDetails from '@/views/UserDetails.vue';
import Messages from '@/views/Messages';
import EditProfile from '@/views/EditProfile.vue';

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
      name: 'editProfile',
      component: EditProfile
    },
    {
      path: '/messages',
      name: 'Messages',
      component: Messages
    },
    
  ],
  scrollBehavior(to, from) {
    return {x: 0 , y:0};
  }
})
