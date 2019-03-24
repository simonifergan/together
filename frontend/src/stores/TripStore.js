import TripService from '@/services/TripService';
import NotificationService from '@/services/NotificationService';

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
        addUserToMembersList(state, { userId, tripId }) {
            // state.tripToDisplay.members.unshift(newMember);
            const trip = state.trips.find(trip => trip._id === tripId);
            const idx = trip.members.findIndex(existingUser => existingUser === userId);
            if (idx !== -1) trip.members.splice(idx, 1);
            else trip.members.unshift(userId);
        },
        removeMember(state, { memberToRemove }) {
            const idx = state.tripToDisplay.members.findIndex(member => member._id === memberToRemove._id);
            state.tripToDisplay.members.splice(idx, 1);
        },
        updateTripToDisplay(state, { trip }) {
            state.tripToDisplay = trip;
        },
        toggleUserFromPendingList(state, { userId }) {
            const idx = state.tripToDisplay.pending.findIndex(existingUser => existingUser === userId);
            if (idx !== -1) state.tripToDisplay.pending.splice(idx, 1);
            else state.tripToDisplay.pending.push(userId);
        },
        removeUserFromPendingList(state, { userId, tripId }) {
            const trip = state.trips.find(trip => trip._id === tripId);
            const idx = trip.pending.findIndex(existingUser => existingUser === userId);
            if (idx !== -1) trip.pending.splice(idx, 1);
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
        async joinTrip({ commit, getters, dispatch }, userIdToJoin, tripIdToJoin) {
            // get trip
            const tripToJoin = getters.trips.find(trip => trip._id === tripIdToJoin);
            if (!tripToJoin) return null;

            // check if the user is already a member:
            const isUserMember = tripToJoin.members.some(userId => userId === userIdToJoin);
            if (isUserMember) return null;

            // remove user from pending list
            const idx = tripToJoin.pending.findIndex(userId => userId === userIdToJoin);
            if (idx === -1) return null;
            commit({type: 'removeUserFromPendingList', userId: userIdToJoin, tripId: tripIdToJoin})
            
            // add user to members list
            commit({ type: 'addUserToMembersList', userId: userIdToJoin, tripId: tripIdToJoin })

            try {
                // update user & trip
                const updatedTrip = await TripService.save(getters.tripToDisplay);
                const updatedUser = await dispatch({ type: 'joinTripToUser', tripId: updatedTrip._id })

                // notification
                let newNotification = {
                    userId: updatedUser._id,
                    tripId: getters.tripToDisplay._id,
                    action: NotificationService.TRIP_JOINED
                }
                dispatch({ type: 'addNotification', newNotification })

            } catch {
                // rollback
                commit({type: 'toggleUserFromPendingList', userId: userIdToJoin, tripId: tripIdToJoin})
                commit({ type: 'toggleUserFromMembersList', userId: userIdToJoin, tripId: tripIdToJoin })
            }
        },
        // TODO: (Adi) get tripId and userId
        async leaveTrip({ commit, getters, dispatch }) {
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
        async userRequestToJoinTrip({ commit, getters, dispatch }) {
            const trip = JSON.parse(JSON.stringify(getters.tripToDisplay));
            const userId = getters.loggedUser._id;
            if (trip.pending.some(alreadyPending => alreadyPending === userId)) return;
            console.log(userId)
            console.log(trip);
            trip.pending.push( userId );
            commit({ type: 'toggleUserFromPendingList', userId });
            try {
                const updatedTrip = await TripService.save(trip);
                // send to socket with userId and tripId
                let payload = {
                    user: getters.loggedUser,
                    tripId: updatedTrip._id,
                    action: NotificationService.TRIP_PRIVATE_REQUEST,
                    toDo: 'approve',
                }
                dispatch({type: 'socketSendNotification', userId: updatedTrip.userId, payload})
                console.log('Here I am, once again, torn into pieces, cant deny cant pretend, behind these hazel eyessssss');
            } catch {
                console.log('YOUR CODE SUCKS!!!');
                commit({ type: 'toggleUserFromPendingList', userId });
            }
        },
        async cancelTripJoinRequest({commit, getters, dispatch}) {
            const trip = JSON.parse(JSON.stringify(getters.tripToDisplay));
            const userId = getters.loggedUser._id;
            const idx = trip.pending.findIndex(alreadyPending => alreadyPending === userId);
            if (idx === -1) throw 'Fuck off';
            trip.pending.splice(idx, 1);
            try {
                const updatedTrip = await TripService.save(trip);
                commit({ type: 'toggleUserFromPendingList', userId });
                console.log('Here I am, once again, torn into pieces, cant deny cant pretend, behind these hazel eyessssss');
            } catch {
                console.log('YOUR CODE SUCKS!!!');
            }
        },
        async searchTrips({ commit }, { searchQuery }) {
            const trips = await TripService.query(searchQuery)
            commit({ type: 'loadTrips', trips })
        }
    }
}
