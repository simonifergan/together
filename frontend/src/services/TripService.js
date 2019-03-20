import Axios from 'axios'

const axios = Axios.create({
    withCredentials: true
})

export default {
    query,
    getById,
    save,
    remove,
    getEmpty,
    joinTrip
}

const TRIP_API = (process.env.NODE_ENV !== 'development')
    ? '/api/trip'
    : '//localhost:3003/api/trip';

async function query() {
    const {data} = await axios.get(TRIP_API);
    return data;
}

async function getById(id) {
    const {data} = await axios.get(`${TRIP_API}/${id}`);
    return data;
}

async function save(trip) {
    if (trip._id) {
        const {data} = await axios.put(`${TRIP_API}/${trip._id}`, trip);
        return data;
    }
    else {
        trip.createdAt = Date.now()
        const {data} = await axios.post(TRIP_API, trip);
        return data;
    }
}

async function remove(id) {
    const {data} = await axios.delete(`${TRIP_API}/${id}`);
    return data;
}

async function joinTrip(userId, tripId) {
    const {data} = await axios.post(`${TRIP_API}/jointrip`, {userId, tripId})
    return data;
}

function getEmpty() {
    return {
        userId: null,
        desc: null,
        locations: [],
        tripStart: null,
        tripDuration: null,
        openTo: {},
        interestedUsers: [],
        activities: [],
        travelersAmount: [],
    }
}

