import Axios from 'axios'

const axios = Axios.create({
    withCredentials: true
})

export default {
    login,
    signup,
    getEmptyUser
}

const API = (process.env.NODE_ENV !== 'development')
    ? '/api'
    : '//localhost:3003/api';

async function login(credentials) {
    const {data} = await axios.post(API + '/login', credentials)
    return data
}

async function signup(newUser) {
    const {data} = await axios.post(API + '/signup', newUser)
    return data
}

function getEmptyUser() {
    return {
        password: null,
        firstname: null,
        lastname: null, 
        proposals: [],
        interestedIn: [],
        birthdate: null,
        gender: null,
        tripPrefs: {},
        profilePic: null
    }
}