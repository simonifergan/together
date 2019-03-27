import UserService from '@/services/UserService'
import FacebookService from '@/services/FacebookService'

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
        // USER LIST FOR: Pending list
        setUsersToDisplay(state, { users }) {
            state.usersToDisplay = users;
        },

        // ONE USER TO DISPLAY:
        setUserToDisplay(state, { user }) {
            state.userToDisplay = user;
        },
        toggleUserInUsersToDisplay(state, { user }) {
            const idx = state.usersToDisplay.find(inUser => inUser._id === user._id);
            if (idx !== -1) state.usersToDisplay.splice(idx, 1);
            else state.usersToDisplay.push(user);
        },
        removeUserInUsersToDisplay(state, { user }) {
            const idx = state.usersToDisplay.find(inUser => inUser._id === user._id);
            if (idx !== -1) state.usersToDisplay.splice(idx, 1);
        },
        toggleUserLikeUser(state, { userId }) {
            if (state.userToDisplay) {
                const likes = state.userToDisplay.likes;
                const idx = likes.findIndex(currUserId => currUserId === userId);
                if (idx !== -1) likes.push(userId);
                else likes.splice(idx, 1);
            }
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
        },
        userToEdit(state) {
            if (state.userToDisplay) return JSON.parse(JSON.stringify(state.userToDisplay))
            else return null;
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

        async getUserById({ commit }, { userId }) {
            try {
                const user = await UserService.getById(userId);
                commit({ type: 'setUserToDisplay', user });
                return true;

            } catch {
                return false;
            }
        },

        async joinLeaveTripToUser({ commit, getters }, { userToTripId }) {

            try {
                const updatedUser = await UserService.updateTripToUser(userToTripId);
                return updatedUser;
            } catch {
                throw 'failed to update user';
            }
        },
        async getUsers(context, { userIds }) {
            const users = await UserService.getUsers(userIds)
            context.commit({ type: 'setUsersToDisplay', users });
        },
        async getUserToEdit(context, { userId }) {
            let userToEdit = await UserService.getById(userId)
            userToEdit.confirmPassword = null;
            userToEdit.newPassword = null;
            return userToEdit
        },
        async saveUser({ commit, getters }, { user }) {
            let backupUser = getters.loggedUser;
            let userCopy = JSON.parse(JSON.stringify(user));
            delete userCopy.confirmPassword;
            delete userCopy.newPassword;


            commit({ type: 'setLoggedUser', user: userCopy })
            try {
                let updatedUser = await UserService.update(user)
                return updatedUser
            } catch {
                console.log('rollback');
                commit({ type: 'setLoggedUser', user: backupUser })
            }
        },
        async toggleUserLike({ commit, getters }, { userId }) {
            let action = 'like';
            // update on trip store
            let trip = JSON.parse(JSON.stringify(getters.tripToEdit));
            if (trip) {
                const idx = trip.user.likes.findIndex(currUserId => currUserId === userId);
                if (idx !== -1) action = 'unlike';
                commit({ type: 'toggleUserLikeTrip', userId });
            }

            // update on user store
            let user = JSON.parse(JSON.stringify(getters.userToEdit));
            if (user) {
                const idx = user.likes.findIndex(currUserId => currUserId === userId);
                if (idx !== -1) action = 'unlike';
                commit({ type: 'toggleUserLikeUser', userId });
            }

            try {
                let like = {
                    action,
                    likingUserId: getters.loggedUser._id
                }
                const updatedUser = await UserService.updateLikesToUser(like, userId);
                return updatedUser;
            } catch {
                console.log('rollback');
                if (trip) commit({ type: 'toggleUserLikeTrip', userId });
                if (user) commit({ type: 'toggleUserLikeUser', userId });
            }

        },
        // SOCIAL MEDIA user behavior:
        async checkFacebookUser({ commit }) {
            const userFBInfo = await FacebookService.getUserInfo();
            if (!userFBInfo) return false;
            else {
                // Prepare object for our database and decide whether to register or auth him
                const { id, first_name, last_name, picture, email } = userFBInfo;
                let user = UserService.getEmptyUser();
                user.facebookId = id;
                user.firstname = first_name;
                user.lastname = last_name;
                user.profilePic = picture.data.url;
                user.email = email;
                try {
                    const loggedUser = await UserService.login(user);
                    commit({ type: 'setLoggedUser', user: loggedUser });

                } catch (err) {
                }

                return true;
            }

        }
    }
}
