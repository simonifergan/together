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
    getImgs,
    getTrending
    // getCategories
}

const TRIP_API = (process.env.NODE_ENV !== 'development')
    ? '/api/trip'
    : '//localhost:3003/api/trip';

async function getTrending() {
    const {data} = await axios.get(TRIP_API + '/trending');
    return data;
}

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
    const filter = {}
    filter.title = query
    if (type === 'destinations') {
        filter.imgSrc = await GoogleService.getGoogleLocation(query)
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
