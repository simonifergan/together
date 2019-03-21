import UserService from '@/services/UserService'

export default {
    state: {
        loggedUser: {
            "_id": "5c92afe7ffcd3525281f845b",
            "email": "johndoe@gmail.com",
            "firstname": "John",
            "lastname": "Doe",
            "proposals": [],
            "interestedIn": [
                "5c9115f5e7179a0e4088ebd2"
            ],
            "birthdate": 599608800,
            "gender": "male",
            "tripPrefs": {},
            "profilePic": "https://res.cloudinary.com/dcv2jyqvl/image/upload/v1553085562/user_imgs/qaibm9ad351l47s83gcn.jpg"
        }
    },
    mutations: {
        setLoggedUser(state, { user }) {
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
            dispatch({type: 'socketUserConnect'});
            dispatch({type: 'getUserChats'});
        },

        async signup({ commit }, { newUser }) {
            const user = await UserService.signup(newUser)
            commit({ type: 'setLoggedUser', user })
        },
    }
}
