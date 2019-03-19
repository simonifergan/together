import Axios from 'axios'

const axios = Axios.create({
    withCredentials: true
})

async function query() {
    const trips = await axios.get('/api/trips')
    return trips
}

async function saveTrip(trip) {
    if (trip._id) const trip = await axios.put('/api/trips')
    else const trip = await axios.post('/api/trips')
    return trip
}

async function deleteTrip({_id}) {
    const msg = await axios.delete('/api/trips')
    return msg
}

export default {
    query,
    saveTrip,
    deleteTrip
}