import Axios from 'axios'

const axios = Axios.create({
    withCredentials: true
})

export default {
    TRIP_REQUEST,
    TRIP_CREATED,
    TRIP_JOINED,
    TRIP_MODIFIED,
    USER_SIGNUP,
    USER_ONLINE,
    USER_OFFLINE,
    USER_COMMENT,
    query
}

const TRIP_REQUEST = 'trip_request';
const TRIP_CREATED = 'trip_created';
const TRIP_JOINED =  'trip_joined';
const TRIP_MODIFIED = 'trip_modified';
const USER_SIGNUP = 'user_signup';
const USER_ONLINE = 'user_online';
const USER_OFFLINE = 'user_offline';
const USER_COMMENT = 'user_comment';

const NOTIFICATION_API = (process.env.NODE_ENV !== 'development')
    ? '/api/notification'
    : '//localhost:3003/api/notification';

async function query() {
    const {data} = await axios.get(NOTIFICATION_API)
    return data;
}