import TripService from '@/services/TripService';
import NotificationService from '@/services/NotificationService';
import GoogleService from '@/services/GoogleService';

export default {
    state: {
        trips: [],
        tripToDisplay: null,
        searchResults: null,
        activityFilters: [],
        destinationFilters: []
    },
    mutations: {
        // trips section:
        loadTrips(state, { trips }) {
            state.trips = trips
        },
        setSearchResults(state, { trips }) {
            state.searchResults = trips
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
        toggleUserLikeTrip(state, { userId }) {
            const idx = state.tripToDisplay.user.likes.findIndex(id => id === userId);
            if (idx !== -1) state.tripToDisplay.user.likes.splice(idx, 1);
            else state.tripToDisplay.user.likes.push(userId);
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
        setActivityFilters(state, { filterImgs }) {
            state.activityFilters = filterImgs
        },
        setDestinationFilters(state, { filterImgs }) {
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
            if (state.tripToDisplay) return JSON.parse(JSON.stringify(state.tripToDisplay));
            else return null;
        },
        emptyTrip(state) {
            return TripService.getEmpty();
        },
        activityFilters(state) {
            return state.activityFilters
        },
        destinationFilters(state) {
            return state.destinationFilters
        },
        activities(state) {
            return TripService.getActivities()
        },
        countries(state) {
            return TripService.getCountries()
        },
        searchResults(state) {
            return state.searchResults
        }
    },
    actions: {
        async getTrendingTrips({ commit }) {
            const trendingTrips = await TripService.getTrending()
            return trendingTrips
        },
        async getRecommendedTrips({ getters }) {
            // TODO Yanai: fix case of none logged user to return some type of recommended trips...
            if (!getters.loggedUser) return []; // I added this for now (Simon).
            const prefs = getters.loggedUser.tripPrefs
            if (!prefs.activities.length && !prefs.gender && !prefs.age) return null
            const recommendedTrips = await TripService.getRecommended(prefs)
            return recommendedTrips
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

        // Get trips by User ID
        async loadTripsByUserId({ commit, getters }, { userId }) {
            const backupTrips = JSON.parse(JSON.stringify(getters.trips));
            try {
                const trips = await TripService.getByUserId(userId);
                commit({ type: 'loadTrips', trips });
                return true;
            } catch {
                commit({ type: 'loadTrips', trips: backupTrips });
                return false;
            }

        },

        async removeTrip({ commit }, { trip }) {
            const msg = await TripService.remove(trip._id)
            commit({ type: 'removeTrip', tripId: trip._id })
        },
        // Admin approve user request
        async ApproveUserToTrip({ commit, getters, dispatch }, { userToJoin, tripIdToJoin }) {
            const userIdToJoin = userToJoin._id;
            // get trip
            var tripToJoin = await TripService.getById(tripIdToJoin)
            if (!tripToJoin || tripToJoin.groupSize <= tripToJoin.members.length) return null;

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

                // general notification
                let newNotification = {
                    userId: userIdToJoin,
                    tripId: getters.tripToDisplay._id,
                    action: NotificationService.TRIP_JOINED
                }
                dispatch({ type: 'addNotification', newNotification })

                // User personal notification
                // send to socket with userId and tripId
                const payload = {
                    action: NotificationService.USER_TRIP_APPROVED,
                    user: getters.loggedUser,
                    tripId: updatedTrip._id,
                }
                dispatch({ type: 'socketSendNotification', userId: userIdToJoin, payload });

            } catch {
                // rollback
                commit({ type: 'toggleUserFromPendingList', userId: userIdToJoin })
            }
        },
        //  Admin removes user from members or pending list
        async removeUserFromTrip({ commit, dispatch }, { userToLeave, tripIdToLeave }) {
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
        // member leaves trip
        async leaveTrip({ commit, dispatch }, { userToLeave, tripIdToLeave }) {            
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

            // update trip to display
            commit({ type: 'updateTripToDisplay', trip: tripToLeave });

            try {
                // update user & trip
                let userIdToTrip = {
                    trip: tripToLeave,
                    user: userToLeave,
                    action
                };
                const updatedTrip = await TripService.updateUserOnTrip(userIdToTrip);
                console.log('trip store- got updatedTrip: ', updatedTrip);
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
        // user request to join trip
        async userRequestToJoinTrip({ commit, getters, dispatch }) {
            var action = 'request';
            const trip = JSON.parse(JSON.stringify(getters.tripToDisplay));
            const user = getters.loggedUser;
            if (trip.pending.some(alreadyPending => alreadyPending === user._id)) return;
            trip.pending.push(user._id);
            commit({ type: 'toggleUserFromPendingList', userId: user._id });
            try {
                let userIdToTrip = {
                    trip,
                    user,
                    action
                };
                const updatedTrip = await TripService.updateUserOnTrip(userIdToTrip);
                const updatedUser = await dispatch({
                    type: 'joinLeaveTripToUser',
                    userToTripId: {
                        tripId: updatedTrip._id,
                        user,
                        action
                    }
                })
                // send to socket with userId and tripId
                const payload = {
                    action: NotificationService.USER_TRIP_REQUEST,
                    user: getters.loggedUser,
                    tripId: updatedTrip._id,
                }
                dispatch({ type: 'socketSendNotification', userId: updatedTrip.userId, payload });
            } catch {
                commit({ type: 'toggleUserFromPendingList', userId: user._id });
            }
        },
        // cancel join request (remove from pending)
        async cancelTripJoinRequest({ commit, getters, dispatch }) {
            const trip = JSON.parse(JSON.stringify(getters.tripToDisplay));
            const user = getters.loggedUser;
            const idx = trip.pending.findIndex(alreadyPending => alreadyPending === user._id);
            if (idx === -1) return;
            trip.pending.splice(idx, 1);
            try {
                let userIdToTrip = {
                    trip,
                    user,
                    action: 'remove from pending'
                };
                const updatedTrip = await TripService.updateUserOnTrip(userIdToTrip)
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
        async searchTrips({ commit }, { searchQuery, tripDate }) {
            const trips = await TripService.query(searchQuery, tripDate)
            commit({ type: 'setSearchResults', trips })
        },
        async getActivityTrips(context, { activity }) {
            const trips = await TripService.getActivityTrips(activity)
            return trips
        },
        async getFilterImgs({ commit }, { filterType, filters }) {
            const filterImgs = await Promise.all(filters.map(filter => TripService.getImgs(filter, filterType)))
            return filterImgs
            // if (filterType === 'activities') commit({ type: 'setActivityFilters', filterImgs })
            // else if (filterType === 'destinations') commit({ type: 'setDestinationFilters', filterImgs })
        },
        async connectToGoogle() {
            return GoogleService.connectGoogleApi()
        },
        async getPlacesAutocomplete(context, { query }) {
            const autocomplete = await TripService.getPlacesAutocomplete(query)
            return autocomplete
        },
        async getCountryCode(context, { placeId }) {
            const countryCode = await TripService.getCountryCode(placeId)
            return countryCode
        },
        async getCitiesByCountry(context, { country }) {
            const cities = await TripService.getByCountry(country)
            return cities
        }
    }
}
