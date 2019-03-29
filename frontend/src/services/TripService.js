import Axios from 'axios'
import GoogleService from './GoogleService.js'
import UtilService from './UtilService.js'

const axios = Axios.create({
    withCredentials: true
})

export default {
    query,
    getById,
    save,
    updateUserOnTrip,
    remove,
    getEmpty,
    getImgs,
    getTrending,
    getByUserId,
    getPlacesAutocomplete,
    getCountryCode,
    getActivityTrips,
    getActivities,
    getRecommended,
    getCountries,
    getByCountry,
    getRequests
    // getCategories
}

const TRIP_API = (process.env.NODE_ENV !== 'development')
    ? '/api/trip'
    : '//localhost:3003/api/trip';

async function getTrending() {
    const {data} = await axios.get(TRIP_API + '/trending');
    return data;
}

async function getRecommended(prefs) {
    const {data} = await axios.post(TRIP_API + '/recommended', prefs);
    return data;
}

async function query(searchQuery, tripDate) {
    console.log('tripDate:', tripDate);
    
    let tripQuery = tripDate ? `&tripDate=${tripDate}` : ''
    let queryStr = '?searchQuery=' + searchQuery + tripQuery
    const {data} = await axios.get(TRIP_API + queryStr);
    return data;
}

async function getActivityTrips(activity) {
    let queryStr = '?activity=' + activity
    const {data} = await axios.get(TRIP_API + '/activity' + queryStr)
    return data
}

async function getByUserId(id) {
    try {
        const {data} = await axios.get(`${TRIP_API}/user/${id}`)
        return data;
    } catch(err) {
       
    }
}

async function getByCountry(country) {
    const {data} = await axios.get(`${TRIP_API}/country/${country}`)
    const cities = data.reduce((acc, trip) => {
        const tripCities = trip.destinations.cities        
        tripCities.forEach(city => {
            if (acc.indexOf(city) === -1) acc.push(city)
        })
        return acc
    }, [])
    let regex
    if (country === 'US') regex = /USA/i
    else regex = new RegExp(UtilService.worldCodeMap.get(country), 'i')
    return cities.filter(city => regex.test(city))
}

async function getById(id) {
    const {data} = await axios.get(`${TRIP_API}/${id}`);
    return data;
}

async function getRequests(userId) {
    const {data} = await axios.get(`${TRIP_API}/pending/${userId}`)
    return data
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

async function updateUserOnTrip(userIdToTrip) {
    console.log('got to trip service- updateUserOnTrip : ', userIdToTrip);
    try {
        const { data } = await axios.patch(`${TRIP_API}/trip_user/${userIdToTrip.trip._id}`, userIdToTrip);
        return data
    } catch (err) {
        console.log('updateUserOnTrip - error:', err);
    }
}

async function remove(id) {
    const {data} = await axios.delete(`${TRIP_API}/${id}`);
    return data;
}

function getEmpty() {
    return {
        title: '',
        desc: '',
        destinations: {countries: [], cities: []},
        startsAt: '',
        duration: '',
        activities: [],
        members: [],
        pending: [],
        groupSize: 1,
    }
}

function getActivities() {
    return ['art', 'beach', 'food', 'hiking', 'history', 'music', 'shopping', 'sports', 'theater']
}

function getCountries() {
    return ['ES', 'US', 'FR', 'MX', 'PT']
}

async function getPlacesAutocomplete(query, types) {
    const autocomplete = await GoogleService.getAutocomplete(query, types)
    return autocomplete
}

async function getCountryCode(placeId) {
    console.log('placeId trip service: ',placeId);
    
    const countryCode = await GoogleService.getPlaceDetails(placeId, ['photos'])
    return countryCode
}

async function getImgs(query, type) {    
    // if (type === 'destinations') query = UtilService.worldCodeMap.get(query)
    const filter = {}
    filter.title = query
    if (type === 'destinations') {
        filter.imgSrc = await GoogleService.getGoogleLocation(query, ['photos'])
    } else {
        filter.imgSrc = _getActivityImg(query)
    }
    return filter
}

function _getActivityImg(query) {
    switch (query) {
        case 'art':
        return `http://res.cloudinary.com/dcv2jyqvl/image/upload/v1553435772/user_imgs/ipfflonqbkr1vpxcc49a.jpg`
        case 'beach':
        return `http://res.cloudinary.com/dcv2jyqvl/image/upload/v1553435796/user_imgs/puuwebsjs2x8te2hy0fw.jpg`
        case 'food':
        return `http://res.cloudinary.com/dcv2jyqvl/image/upload/v1553435813/user_imgs/nr9q2xsqq2xkmm8jyssi.jpg`
        case 'hiking':
        return `http://res.cloudinary.com/dcv2jyqvl/image/upload/v1553435831/user_imgs/ltklohnva57abr4xyxys.jpg`
        case 'history':
        return `http://res.cloudinary.com/dcv2jyqvl/image/upload/v1553435847/user_imgs/zd8ubpkuzpak7fxuuxm2.jpg`
        case 'music':
        return `http://res.cloudinary.com/dcv2jyqvl/image/upload/v1553435863/user_imgs/d2gu6fmahxr1ojavtjxz.jpg`
        case 'shopping':
        return `http://res.cloudinary.com/dcv2jyqvl/image/upload/v1553435876/user_imgs/n4lbixndk2tgvanbl6b1.jpg`
        case 'sports':
        return `http://res.cloudinary.com/dcv2jyqvl/image/upload/v1553435889/user_imgs/gyq6cdfdqh6bgklcd9jo.jpg`
        case 'theater':
        return `http://res.cloudinary.com/dcv2jyqvl/image/upload/v1553435901/user_imgs/sf89vyq9zksgp5wqrt7l.jpg`
    }
}
