import UserService from '@/services/UserService'

export default {
    state: {
        loggedUser: UserService.getLoggedUser(),
        usersToDisplay: [], // multiple users
        userToDisplay: null, // single user
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
        setUsersToDisplay(state, { users }) {
            state.usersToDisplay = users;
        },

        // ONE USER TO DISPLAY:
        setUserToDisplay(state, {user}) {
            state.userToDisplay = user;
        },
        toggleUserInUsersToDisplay(state, { user }) {
            console.log('toggleUserInUsersToDisplay', user._id)
            const idx = state.usersToDisplay.find(inUser => inUser._id === user._id);
            if (idx !== -1) state.usersToDisplay.splice(idx, 1);
            else state.usersToDisplay.push(user);
        },
        removeUserInUsersToDisplay(state, {user}) {
            const idx = state.usersToDisplay.find(inUser => inUser._id === user._id);
            if (idx !== -1) state.usersToDisplay.splice(idx, 1);
        }
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
        },
        userToDisplay(state) {
            return state.userToDisplay;
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

        async logout(context) {
            try {
                await UserService.logout();
                context.commit({ type: 'setLoggedUser', user: null });
                context.commit({ type: 'setUserChats', chats: [] });
                context.commit({ type: 'setNotification', notifications: [] });
                context.dispatch('socketDisconnect');
                return true;
            } catch {

            }
        },

        async signup({ commit }, { newUser }) {
            const user = await UserService.signup(newUser)
            commit({ type: 'setLoggedUser', user })
        },

        async getUserById({commit}, {userId}) {
            try {
                const user = await UserService.getById(userId);
                commit({type: 'setUserToDisplay', user});
                return true;

            } catch {
                return false;
            }
        },

        async joinLeaveTripToUser({ commit, getters }, { userToTripId }) {
            console.log('here');
            
            try {
                const updatedUser = await UserService.updateTripToUser(userToTripId);
                return updatedUser;
            } catch {
                throw 'failed to update user';
            }
        },
        
        // async leaveTripToUser({ commit, getters }, { tripId }) {
        //     const backupUserLoggedUser = JSON.parse(JSON.stringify(getters.loggedUser));
        //     commit({ type: 'leaveTripToUser', tripId });
        //     try {
        //         const updatedUser = await UserService.update(getters.loggedUser);
        //         return updatedUser;
        //     } catch {
        //         commit({ type: 'updateLoggedUser', user: backupUserLoggedUser });
        //     }
        // },
        async getUsers(context, { userIds }) {
            const users = await UserService.getUsers(userIds)
            context.commit({ type: 'setUsersToDisplay', users });
        },
        async getUserForEdit(context, { userId }) {            
            const res = await UserService.getUsers([userId])
            const user = res[0]
            return user
        }
    }
}
