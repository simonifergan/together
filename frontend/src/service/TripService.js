import Axios from 'axios'

const BASE_URL = process.env.NODE_ENV === 'development' ? '//localhost:3003/api/trip' : '/api/trip'
const axios = Axios.create({
    withCredentials: true
})

async function query() {
    const trips = await axios.get(BASE_URL)
    return trips
}

async function saveTrip(trip) {
    if (trip._id) trip = await axios.put(BASE_URL, trip)
    else {
        trip.createdAt = Date.now()
        trip = await axios.post(BASE_URL, trip)
    }
    return trip
}

async function deleteTrip({ _id }) {
    const msg = await axios.delete(BASE_URL, _id)
    return msg
}

function getEmptyTrip() {
    return {
        userId: null,
        desc: null,
        locations: [],
        tripStart: null,
        tripDuration: null,
        interestedUsers: [],
        activities: [],
        travelersAmount: []
    }
}

export default {
    query,
    saveTrip,
    deleteTrip,
    getEmptyTrip
}