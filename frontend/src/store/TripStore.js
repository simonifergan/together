import TripService from '../service/TripService'

export default {
    state: {
        trips: null
    },
    mutations: {
        setTrips(state, { trips }) {
            state.trips = trips
        },
        addTrip(state, { trip }) {
            state.trips.unshift(trip)
        },
        updateTrip(state, {trip}) {
            let trips = state.trips
            let idx = trips.findIndex(currTrip => currTrip._id = trip._id)
            trips.splice(idx, 1, trip)
        }
    },
    getters: {
        trips(state) {
            return state.trips
        }
    },
    actions: {
        async loadTrips({ commit }) {
            const trips = await TripService.query()
            commit({ type: 'setTrips', trips })
        },
        async saveTrip({ commit }, { trip }) {
            const newTrip = await TripService.saveTrip(trip)
            if (trip._id) commit({ type: 'updateTrip', trip: newTrip })
            else commit({ type: 'addTrip', trip: newTrip })
        },
        async deleteTrip({ commit }, { trip }) {
            const msg = await TripService.deleteTrip(trip)
            console.log(msg);
            commit({ type: 'deleteTrip', trip })
        }
    }
}
