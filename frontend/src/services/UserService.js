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
const SUB_KEY = 'pushSub';

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
    const { data } = await axios.patch(`${API_USER}/user_like/${userId}`, like)
    return data;
}

async function login(credentials) {
    let pushSub = StorageService.getFromSession(SUB_KEY);
    if (pushSub) credentials.pushSub = pushSub;
    console.log('sending to user service:', pushSub);
    const { data } = await axios.post(API_USER + '/login', credentials)
    StorageService.saveToLocal(USER_KEY, data);
    return data
}

async function signup(newUser) {
    const { data } = await axios.post(API_USER + '/signup', newUser)
    StorageService.saveToLocal(USER_KEY, data);
    return data;
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
        password: '',
        firstname: '',
        lastname: '',
        pendingIn: [],
        memberIn: [],
        birthdate: '',
        gender: '',
        tripPrefs: { activities: [], gender: '', age: null },
        profilePic: "https://res.cloudinary.com/dcv2jyqvl/image/upload/v1553712810/user_imgs/default-user.png",
        from: '',
        likes: [],
    }
}