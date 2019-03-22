import Axios from 'axios'

const axios = Axios.create({
    withCredentials: true
})

export default {
    query
}

const NOTIFICATION_API = (process.env.NODE_ENV !== 'development')
    ? '/api/notification'
    : '//localhost:3003/api/notification';

async function query() {
    const {data} = await axios.get(NOTIFICATION_API)
    return data;
}