import TripService from '@/services/TripService';
import NotificationService from '@/services/NotificationService';
import GoogleService from '@/services/GoogleService';

export default {
    state: {
        trips: [],
        tripToDisplay: null,
        activityFilters: [],
        destinationFilters: []
    },
    mutations: {
        // trips section:
        loadTrips(state, { trips }) {
            state.trips = trips
        },
        updateTrip(state, { trip }) {
            // MIGHT BE USEELSSS
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
            if (state.tripToDisplay) state.tripToDisplay = trip;
        },
        toggleUserFromPendingList(state, { userId }) {
            console.log('toggle:', userId);

            const idx = state.tripToDisplay.pending.findIndex(existingUser => existingUser === userId);
            if (idx !== -1) state.tripToDisplay.pending.splice(idx, 1);
            else state.tripToDisplay.pending.push(userId);
        },
        removeUserFromPendingList(state, { userId, tripId }) {
            const trip = state.trips.find(trip => trip._id === tripId);
            const idx = trip.pending.findIndex(existingUser => existingUser === userId);
            if (idx !== -1) trip.pending.splice(idx, 1);
        },
        setActivityFilters(state, {filterImgs}) {
            state.activityFilters = filterImgs
        },
        setDestinationFilters(state, {filterImgs}) {
            state.destinationFilters = filterImgs
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
        },
        activityFilters(state) {
            return state.activityFilters
        },
        destinationFilters(state) {
            return state.destinationFilters
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
        async joinTrip({ commit, getters, dispatch }, { userToJoin, tripIdToJoin }) {
            const userIdToJoin = userToJoin._id;
            // get trip
            var tripToJoin = await TripService.getById(tripIdToJoin)
            if (!tripToJoin) return null;

            // check if the user is already a member:
            const isUserMember = tripToJoin.members.some(user => user._id === userIdToJoin);
            if (isUserMember) return null;

            // remove user from pending list
            const idx = tripToJoin.pending.findIndex(userId => userId === userIdToJoin);
            if (idx === -1) return null;
            tripToJoin.pending.splice(idx, 1);

            // add user to members list
            tripToJoin.members.unshift(userToJoin)

            // update trip to display
            commit({ type: 'updateTripToDisplay', trip: tripToJoin });
            commit({ type: 'toggleUserInUsersToDisplay', user: userToJoin })

            try {
                // update user & trip
                const updatedTrip = await TripService.save(tripToJoin);
                const updatedUser = await dispatch({
                    type: 'joinLeaveTripToUser',
                    userToTripId: {
                        tripId: updatedTrip._id,
                        user: userToJoin,
                        action: 'approve'
                    }
                })

                // notification
                let newNotification = {
                    userId: userIdToJoin,
                    tripId: getters.tripToDisplay._id,
                    action: NotificationService.TRIP_JOINED
                }
                dispatch({ type: 'addNotification', newNotification })

            } catch {
                // rollback
                commit({ type: 'toggleUserFromPendingList', userId: userIdToJoin })
            }
        },
        async leaveTrip({ commit, getters, dispatch }, {userToLeave, tripIdToLeave}) {
            const userIdToLeave = userToLeave._id;
            
            var tripToLeave = await TripService.getById(tripIdToLeave)
            if (!tripToLeave) return null;

            var action = '';
            // remove user from members
            const idxMember = tripToLeave.members.findIndex(user => user._id === userIdToLeave);
            if (idxMember !== -1) {
                action = 'remove from members';
                tripToLeave.members.splice(idxMember, 1);
            }

            // remove user from pending
            const idxPending = tripToLeave.pending.findIndex(userId => userId === userIdToLeave);
            if (idxPending !== -1) {
                action = 'remove from pending';
                tripToLeave.pending.splice(idxPending, 1);
            }

            // update trip to display
            commit({ type: 'updateTripToDisplay', trip: tripToLeave });
            commit({ type: 'removeUserInUsersToDisplay', user: userToLeave })

            try {
                // update user & trip
                const updatedTrip = await TripService.save(tripToLeave);
                const updatedUser = await dispatch({
                    type: 'joinLeaveTripToUser',
                    userToTripId: {
                        tripId: updatedTrip._id,
                        user: userToLeave,
                        action
                    }
                })
            } catch {
                // TODO simon
            }
        },
        async userRequestToJoinTrip({ commit, getters, dispatch }) {
            const trip = JSON.parse(JSON.stringify(getters.tripToDisplay));
            const user = getters.loggedUser;
            if (trip.pending.some(alreadyPending => alreadyPending === user._id)) return;
            trip.pending.push(user._id);
            commit({ type: 'toggleUserFromPendingList', userId: user._id });
            try {
                const updatedTrip = await TripService.save(trip);
                const updatedUser = await dispatch({
                    type: 'joinLeaveTripToUser',
                    userToTripId: {
                        tripId: updatedTrip._id,
                        user,
                        action: 'request'
                    }
                })
                // send to socket with userId and tripId
                dispatch({ type: 'socketSendNotification', userId: updatedTrip.userId, payload: 'CAN YOU SEE ME BABA??' });
            } catch {
                commit({ type: 'toggleUserFromPendingList', userId: user._id });
            }
        },
        async cancelTripJoinRequest({ commit, getters, dispatch }) {
            const trip = JSON.parse(JSON.stringify(getters.tripToDisplay));
            const user = getters.loggedUser;
            const idx = trip.pending.findIndex(alreadyPending => alreadyPending === user._id);
            if (idx === -1) return;
            trip.pending.splice(idx, 1);
            try {
                const updatedTrip = await TripService.save(trip);
                const updatedUser = await dispatch({
                    type: 'joinLeaveTripToUser',
                    userToTripId: {
                        tripId: updatedTrip._id,
                        user,
                        action: 'remove from pending'
                    }
                })
                commit({ type: 'toggleUserFromPendingList', userId: user._id });
            } catch {
                // TODO simon
            }
        },
        async searchTrips({ commit }, { searchQuery }) {
            const trips = await TripService.query(searchQuery)
            commit({ type: 'loadTrips', trips })
        },
        async getFilterImgs({commit}, {filterType, filters}) {
            const filterImgs = await Promise.all(filters.map(filter => TripService.getImgs(filter, filterType)))
            if (filterType === 'activities') commit({type: 'setActivityFilters', filterImgs})
            else if (filterType === 'destinations') commit({type: 'setDestinationFilters', filterImgs})
        },
        async connectToGoogle() {
            return GoogleService.connectGoogleApi()
        }
    }
}
