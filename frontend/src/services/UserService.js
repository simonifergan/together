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
    axios.post(API + 'login', credentials)
}

async function signup(newUser) {
    axios.post(API + 'signup', newUser)
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