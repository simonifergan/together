import UserService from '@/services/UserService'

export default {
    state: {
        currLoggedUser: {
            _id: '5c9110f3e7179a0e4088e8ad',
            email: 'adi.binen@gmail.com',
            firstname: 'Adi',
            lastname: 'Binenbaum',
            proposals: [],
            interestedIn: [
                '5c9115f5e7179a0e4088ebd2'
            ],
            birthdate: 774892500,
            gender: 'female',
            tripPrefs: {},
            profilePic: 'https://res.cloudinary.com/dcv2jyqvl/image/upload/v1553085988/user_imgs/adi.png'
        }
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
