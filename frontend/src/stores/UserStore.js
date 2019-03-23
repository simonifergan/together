import UserService from '@/services/UserService'

export default {
    state: {
        loggedUser: null,
    },
    mutations: {
        setLoggedUser(state, { user }) {
            state.loggedUser = user;
        },
        joinTripToUser(state, { tripId }) {
            state.loggedUser.interestedIn.push(tripId);
        },
        leaveTripToUser(state, { tripId }) {
            const idx = state.loggedUser.interestedIn.findIndex(trip => trip === tripId);
            state.loggedUser.interestedIn.splice(idx, 1);
        },
        updateLoggedUser(state, { user }) {
            state.loggedUser = user;
        }
    },
    getters: {
        loggedUser(state) {
            return state.loggedUser;
        },
        getEmptyUser() {
            return UserService.getEmptyUser();
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

        async joinTripToUser({ commit, getters }, { tripId }) {
            const backupUserLoggedUser = JSON.parse(JSON.stringify(getters.loggedUser));
            commit({ type: 'joinTripToUser', tripId })
            try {
                const updatedUser = await UserService.update(getters.loggedUser);
                return updatedUser;
            } catch {
                commit({ type: 'updateLoggedUser', user: backupUserLoggedUser });
                // throw Error ??
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
        }
    }
}
