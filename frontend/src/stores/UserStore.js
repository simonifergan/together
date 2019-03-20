import UserService from '@/services/UserService'

export default {
    state: {
        currLoggedUser: null
    },
    mutations: {
        setCurrLoggedUser(state, {user}) {
            state.currLoggedUser = user;
        }
    },
    getters: {
        currLoggedUser(state) {
            return state.currLoggedUser
        },
        getEmptyUser() {
            return UserService.getEmptyUser()
        }
    },
    actions: {
        async login({commit}, {credentials}) {
            const user = await UserService.login(credentials)
            commit({type: 'setCurrLoggedUser', user})
        },

        async signup({commit}, {newUser}) {
            const user = await UserService.signup(newUser)
            commit({type: 'setCurrLoggedUser', user})
        },
    }
}
