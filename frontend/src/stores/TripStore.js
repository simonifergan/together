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
        async saveTrip({ commit, getters, dispatch }, { trip }) {
            trip.userId = getters.loggedUser._id;
            const newTrip = await TripService.save(trip)
            if (trip._id) {
                commit({ type: 'updateTrip', trip: newTrip })
                // userId, trip id, actions - updated a trip,
                let newNotification = {
                    userId: getters.loggedUser,
                    tripId: trip._id,
                    action: NotificationService.TRIP_MODIFIED
                }
                dispatch({ type: 'addNotification', newNotification })
            }
            else {
                commit({ type: 'addTrip', trip: newTrip })
                // userId, trip id, actions - add new trip,
                let newNotification = {
                    userId: getters.loggedUser,
                    tripId: trip._id,
                    action: NotificationService.TRIP_CREATED
                }
                dispatch({ type: 'addNotification', newNotification })
            }
            return newTrip._id;
        },
        async removeTrip({ commit }, { trip }) {
            const msg = await TripService.remove(trip._id)
            commit({ type: 'removeTrip', tripId: trip._id })
        },
        async joinTrip({ commit, getters, dispatch }) {
            const backupTripToDisplay = getters.tripToDisplay;
            const newMember = getters.loggedUser;
            commit({ type: 'addMember', newMember })

            try {
                const updatedTrip = await TripService.save(getters.tripToDisplay);
                const updatedUser = await dispatch({ type: 'joinTripToUser', tripId: updatedTrip._id })
                
                // notification:
                let newNotification = {
                    userId: updatedUser._id,
                    tripId: getters.tripToDisplay._id,
                    action: NotificationService.TRIP_JOINED
                }
                dispatch({ type: 'addNotification', newNotification })

            } catch {
                commit({ type: 'updateTripToDisplay', trip: backupTripToDisplay });
            }
        },
        async leaveTrip({ commit, getters }) {
            const backupTripToDisplay = getters.tripToDisplay;
            const memberToRemove = getters.loggedUser;
            commit({ type: 'removeMember', memberToRemove })
            try {
                const updatedTrip = await TripService.save(getters.tripToDisplay);
                await dispatch({ type: 'leaveTripToUser', tripId: updatedTrip._id })
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
