import Vue from 'vue'
import Vuex from 'vuex'
import TripStore from'./TripStore'
import UserStore from'./UserStore'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

  },
  mutations: {

  },
  actions: {

  },
  modules: {
    TripStore,
    UserStore
  }
})
