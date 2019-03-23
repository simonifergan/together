import Axios from 'axios'

const axios = Axios.create({
    withCredentials: true
})

export default {
    update,
    login,
    signup,
    getEmptyUser,
    getUsers
}

const API_USER = (process.env.NODE_ENV !== 'development')
    ? '/api'
    : '//localhost:3003/api';


    
async function update(userToUpdate) {    
    const {data} = await axios.put(`${API_USER}/user/${userToUpdate._id}`, userToUpdate)
    return data
}

async function login(credentials) {
    const {data} = await axios.post(API_USER + '/login', credentials)
    return data
}

async function signup(newUser) {
    const {data} = await axios.post(API_USER + '/signup', newUser)
    return data
}

async function getUsers(userIds) {
    const query = {userIds}
    const {data} = await axios.post(API_USER + '/user', query)
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