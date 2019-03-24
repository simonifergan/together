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
    remove,
    getEmpty,
    getImgs
    // getCategories
}

const TRIP_API = (process.env.NODE_ENV !== 'development')
    ? '/api/trip'
    : '//localhost:3003/api/trip';

async function query(searchQuery) {
    let queryStr = '?searchQuery=' + searchQuery
    const {data} = await axios.get(TRIP_API + queryStr);
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

function getEmpty() {
    return {
        title: '',
        desc: '',
        destinations: [],
        startsAt: '',
        duration: '',
        openTo: {},
        activities: [],
        members: [],
        pending: [],
        comments: [],
        groupSize: 2,
    }
}

async function getImgs(query, type) {
    
    if (type === 'destinations') query = UtilService.worldCodeMap.get(query)
    console.log('getting imgs', query);
    const filter = {}
    filter.title = query
    if (type === 'destinations') {
        
        filter.imgSrc = await GoogleService.getGoogleLocation(query)
        console.log('imgSrc', filter.imgSrc);
        
    } else {
        filter.imgSrc = _getActivityImg(query)
    }
    return filter
}

function _getActivityImg(query) {
    return {title: query, imgSrc: '@/src/assets/img/home/activity.jpg'}
}