import UserService from '@/services/UserService'

export default {
    state: {
        loggedUser: {
            "_id" : "5c9110f3e7179a0e4088e8ad",
            "email" : "adi.binen@gmail.com",
            "password" : "$2a$10$Qpt4/L2jZGYLAppzzj8FR.jqg9qTyVC8hoEWu7WAlSnot9ONvK8dO",
            "firstname" : "Adi",
            "lastname" : "Binenbaum",
            "trips" : [],
            "interestedIn" : [ 
                "5c9115f5e7179a0e4088ebd2"
            ],
            "birthdate" : 774892500,
            "gender" : "female",
            "tripPrefs" : {},
            "profilePic" : "https://res.cloudinary.com/dcv2jyqvl/image/upload/v1553085988/user_imgs/adi.png"
        }
    },
    mutations: {
        setLoggedUser(state, { user }) {
            state.loggedUser = user;
        },
        joinTripToUser(state, { tripId }) {
            state.loggedUser.interestedIn.push(tripId);
        },
        leaveTripToUser(state, {tripId}) {
            const idx = state.loggedUser.interestedIn.findIndex(trip => trip === tripId);
            state.loggedUser.interestedIn.splice(idx, 1);
        },
        updateLoggedUser(state, { user }) {
            state.loggedUser = user;
        }
    },
    getters: {
        loggedUser(state) {
            return state.loggedUser
        },
        getEmptyUser() {
            return UserService.getEmptyUser()
        }
    },
    actions: {
        async login({ commit, dispatch }, { credentials }) {
            const user = await UserService.login(credentials)
            commit({ type: 'setLoggedUser', user })
            dispatch({ type: 'socketUserConnect' });
            dispatch({ type: 'getUserChats' });
        },

        async signup({ commit }, { newUser }) {
            const user = await UserService.signup(newUser)
            commit({ type: 'setLoggedUser', user })
        },

        async joinTripToUser({ commit, getters }, { tripId }) {
            const backupUserLoggedUser = getters.loggedUser;
            commit({ type: 'joinTripToUser', tripId })
            try {
                const updatedUser = await UserService.update(getters.loggedUser);
                return updatedUser;
            } catch {
                commit({ type: 'updateLoggedUser', user: backupUserLoggedUser });
                // throw Error ??
            }
        },

        async leaveTripToUser({commit, getters}, {tripId}) {
            const backupUserLoggedUser = getters.loggedUser;
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
