import Vue from 'vue'
import Vuex from 'vuex'
import TripStore from '@/stores/TripStore'
import UserStore from '@/stores/UserStore'
import SocketStore from '@/stores/SocketStore'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {

  },
  mutations: {

  },
  actions: {

  },
  modules: {
    TripStore,
    UserStore,
    SocketStore
  }
})
