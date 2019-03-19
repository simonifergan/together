import Axios from 'axios'

const axios = Axios.create({
    withCredentials: true
})

export default {
    query,
    save,
    remove,
    getEmpty
}

const TRIP_API = (process.env.NODE_ENV !== 'development')
    ? '/api/trip'
    : '//localhost:3003/api/trip';

async function query() {
    const {data} = await axios.get(TRIP_API);
    return data;
}

// PUT request to mongo does not return the updated object, so just return what you sent to it on success
// POST does return the object with it's correct id
async function save(trip) {
    if (trip._id) {
        await axios.put(`${TRIP_API}/${trip._id}`, trip);
        return trip;
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

