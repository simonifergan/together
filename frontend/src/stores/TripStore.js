import TripService from '@/services/TripService';
import NotificationService from '@/services/NotificationService';
import { userInfo } from 'os';

export default {
    state: {
        trips: [],
        tripToDisplay: null
    },
    mutations: {
        // trips section:
        loadTrips(state, { trips }) {
            state.trips = trips
        },
        updateTrip(state, { trip }) {
            let trips = state.trips
            let idx = trips.findIndex(currTrip => currTrip._id = trip._id)
            trips.splice(idx, 1, trip)
        },
        removeTrip(state, { tripId }) {
            const idx = state.trips.findIndex(trip => trip._id === tripId);
            state.trips.splice(idx, 1);
        },
        // trip to display section:
        loadTrip(state, { trip }) {
            state.tripToDisplay = trip;
        },
        clearTrip(state) {
            state.tripToDisplay = null;
        },
        addTrip(state, { trip }) {
            state.trips.unshift(trip)
        },
        addMember(state, { newMember }) {
            state.tripToDisplay.members.unshift(newMember);
        },
        removeMember(state, { memberToRemove }) {
            const idx = state.tripToDisplay.members.findIndex(member => member._id === memberToRemove._id);
            state.tripToDisplay.members.splice(idx, 1);
        },
        updateTripToDisplay(state, { trip }) {
            state.tripToDisplay = trip;
        }
    },
    getters: {
        trips(state) {
            return state.trips;
        },
        tripToDisplay(state) {
            return state.tripToDisplay;
        },
        tripToEdit(state) {
            return JSON.parse(JSON.stringify(state.tripToDisplay));
        },
        emptyTrip(state) {
            return TripService.getEmpty();
        }
    },
    actions: {
        // TODO: implement optimistic updates
        async loadTrips({ commit }) {
            const trips = await TripService.query('')
            commit({ type: 'loadTrips', trips })
        },
        async loadTrip({ commit }, { tripId }) {
            const trip = await TripService.getById(tripId);
            commit({ type: 'loadTrip', trip });
        },
        async saveTrip({ commit, getters, dispatch}, { trip }) {
            const newTrip = await TripService.save(trip)
            if (trip._id) {
                commit({ type: 'updateTrip', trip: newTrip })
                // userId, trip id, actions - created a trip,
                let newNotification = {
                    action: NotificationService.TRIP_MODIFIED,
                    userId: getters.loggedUser,
                    tripId: trip._id
                }
                dispatch({type: 'addNotification', newNotification})
            }
            else {
                commit({ type: 'addTrip', trip: newTrip })
            }
        },
        async removeTrip({ commit }, { trip }) {
            const msg = await TripService.remove(trip._id)
            commit({ type: 'removeTrip', tripId: trip._id })
        },
        async joinTrip({ commit, getters, dispatch }) {
            const backupTripToDisplay = getters.tripToDisplay;
            const newMember = getters.loggedUser;
            commit({ type: 'addMember', newMember })
            // notification:
            let newNotification = {
                userId: getters.loggedUser._id,
                tripId: tripToDisplay._id,
                
            }
            dispatch({type: 'addNotification', })
            try {
                const msg = await TripService.save(getters.tripToDisplay);
                return msg;
            } catch {
                commit({ type: 'updateTripToDisplay', trip: backupTripToDisplay });
            }
            const msg = await TripService.joinTrip(getters.loggedUser._id, tripId)
            return msg
        },
        async leaveTrip({ commit, getters }) {
            const backupTripToDisplay = getters.tripToDisplay;
            const memberToRemove = getters.loggedUser;
            commit({ type: 'removeMember', memberToRemove })
            try {
                const msg = await TripService.save(getters.tripToDisplay);
                return msg;
            } catch {
                commit({ type: 'updateTripToDisplay', trip: backupTripToDisplay });
            }
        },
        async searchTrips({ commit }, { searchQuery }) {
            const trips = await TripService.query(searchQuery)
            commit({ type: 'loadTrips', trips })
        }
    }
}
