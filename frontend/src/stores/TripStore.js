import TripService from '@/services/TripService'

export default {
    state: {
        trips: [],
    },
    mutations: {
        loadTrips(state, { trips }) {
            state.trips = trips
        },
        addTrip(state, { trip }) {
            state.trips.unshift(trip)
        },
        updateTrip(state, { trip }) {
            let trips = state.trips
            let idx = trips.findIndex(currTrip => currTrip._id = trip._id)
            trips.splice(idx, 1, trip)
        },
        removeTrip(state, { tripId }) {
            const idx = state.trips.findIndex(trip => trip._id === tripId);
            state.trips.splice(idx, 1);
        }
    },
    getters: {
        trips(state) {
            return state.trips
        }
    },
    actions: {
        // TODO: implement optimistic updates
        async loadTrips({ commit }) {
            const trips = await TripService.query()
            commit({ type: 'loadTrips', trips })
        },
        async saveTrip({ commit }, { trip }) {
            const newTrip = await TripService.save(trip)
            if (trip._id) commit({ type: 'updateTrip', trip: newTrip })
            else commit({ type: 'addTrip', trip: newTrip })
        },
        async removeTrip({ commit }, { trip }) {
            const msg = await TripService.remove(trip._id)
            console.log(msg);
            commit({ type: 'removeTrip', tripId: trip._id })
        }
    }
}
