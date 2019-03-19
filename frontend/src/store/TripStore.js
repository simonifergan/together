import TripService from '../service/TripService'

export default {
    state: {
        trips: null
    },
    mutations: {
        setTrips(state, { trips }) {
            state.trips = trips
        }
    },
    getters: {
        trips(state) {
            return state.trips
        }
    },
    actions: {
        async getTrips({commit}) {
            const trips = await TripService.query()
            commit({type: 'setTrips', trips})
        }
    }
}
