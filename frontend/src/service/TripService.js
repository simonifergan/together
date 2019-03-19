import Axios from 'axios'

const axios = Axios.create({
    withCredentials: true
})

async function query() {
    const trips = await axios.get('/api/trip')
    return trips
}

async function saveTrip(trip) {
    if (trip._id) trip = await axios.put('/api/trip', trip)
    else trip = await axios.post('/api/trip', trip)
    return trip
}

async function deleteTrip({_id}) {
    const msg = await axios.delete('/api/trip', _id)
    return msg
}

function getEmptyTrip() {
    return {
        
    }
}

export default {
    query,
    saveTrip,
    deleteTrip
}