import Axios from 'axios'
const axios = Axios.create({
    withCredentials: true
})

import StorageService from './StorageService.js';

export default {
    login,
    signup,
    logout,
    getById,
    getEmptyUser,
    getLoggedUser,
    getUsers,
    update,
    updateTripToUser,
    updateLikesToUser
}

const USER_KEY = 'loggedUser';

const API_USER = (process.env.NODE_ENV !== 'development')
    ? '/api'
    : '//localhost:3003/api';



async function update(userToUpdate) {
    const { data } = await axios.put(`${API_USER}/user/${userToUpdate._id}`, userToUpdate)
    StorageService.saveToLocal(USER_KEY, data)
    return data
}

async function updateTripToUser(userToTripId) {
    console.log('got to user service- updateTripToUser : ', userToTripId);
    const { data } = await axios.patch(`${API_USER}/user_trip/${userToTripId.user._id}`, userToTripId)
    return data
}

async function updateLikesToUser(like, userId) {
    const { data } = await axios.patch(`${API_USER}/user_likes/${userId}`, like)
    return data;
}

async function login(credentials) {
    const { data } = await axios.post(API_USER + '/login', credentials)
    StorageService.saveToLocal(USER_KEY, data);
    return data
}

async function signup(newUser) {
    const { data } = await axios.post(API_USER + '/signup', newUser)
    return data
}

async function logout() {
    const { data } = await axios.post(API_USER + '/logout')
    StorageService.removeFromLocal(USER_KEY);
    return data;
}

async function getById(id) {
    const { data } = await axios.get(`${API_USER}/user/${id}`);
    return data;
}

async function getUsers(userIds) {

    const query = { userIds }
    const { data } = await axios.post(API_USER + '/user', query)
    return data
}

function getLoggedUser() {
    return StorageService.getFromLocal(USER_KEY);
}

function getEmptyUser() {
    return {
        password: null,
        firstname: null,
        lastname: null,
        trips: [],
        pendingIn: [],
        memberIn: [],
        birthdate: null,
        gender: null,
        tripPrefs: { activities: [], gender: null, age: null },
        profilePic: null,
        from: null,
        likes: [],
    }
}