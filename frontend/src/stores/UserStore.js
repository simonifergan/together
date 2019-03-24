import UserService from '@/services/UserService'

export default {
    state: {
        loggedUser: null,
        usersToDisplay: [],
    },
    mutations: {
        setLoggedUser(state, { user }) {
            state.loggedUser = user;
        },
        joinTripToUser(state, { tripId }) {
            state.loggedUser.pendingIn.push(tripId);
        },
        leaveTripToUser(state, { tripId }) {
            const idx = state.loggedUser.pendingIn.findIndex(trip => trip === tripId);
            state.loggedUser.pendingIn.splice(idx, 1);
        },
        updateLoggedUser(state, { user }) {
            state.loggedUser = user;
        },
        // USER LIST FOR: Pending list
        setUsersToDisplay(state, {users}) {
            state.usersToDisplay = users;
        },
        toggleUserInUsersToDisplay(state, { user }) {
            console.log('toggleUserInUsersToDisplay', user._id)
            const idx = state.usersToDisplay.find(inUser => inUser._id === user._id);
            if (idx !== -1) state.usersToDisplay.splice(idx, 1);
            else state.usersToDisplay.push(user);
        },
    },
    getters: {
        loggedUser(state) {
            return state.loggedUser;
        },
        getEmptyUser() {
            return UserService.getEmptyUser();
        },
        userListToDisplay(state) {
            return state.usersToDisplay;
        }

    },
    actions: {
        async login({ commit, dispatch }, { credentials }) {
            const user = await UserService.login(credentials)
            commit({ type: 'setLoggedUser', user })
            dispatch({ type: "socketConnect" });
            dispatch({ type: "getUserChats" });
            dispatch({ type: "loadNotification" });
        },

        async signup({ commit }, { newUser }) {
            const user = await UserService.signup(newUser)
            commit({ type: 'setLoggedUser', user })
        },

        async joinTripToUser({ commit, getters }, { userToTripId }) {
            try {
                const updatedUser = await UserService.updateTripToUser(userToTripId);
                return updatedUser;
            } catch {
                throw 'failed to update user';
            }
        },
        async leaveTripToUser({ commit, getters }, { tripId }) {
            const backupUserLoggedUser = JSON.parse(JSON.stringify(getters.loggedUser));
            commit({ type: 'leaveTripToUser', tripId });
            try {
                const updatedUser = await UserService.update(getters.loggedUser);
                return updatedUser;
            } catch {
                commit({ type: 'updateLoggedUser', user: backupUserLoggedUser });
            }
        },
        async getUsers(context, { userIds }) {
            console.log(userIds)
            const users = await UserService.getUsers(userIds)
            context.commit({ type: 'setUsersToDisplay', users });
        }
    }
}
