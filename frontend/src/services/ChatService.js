import Axios from 'axios'

const axios = Axios.create({
    withCredentials: true
})

export default {
    getChats
}

const CHAT_API = (process.env.NODE_ENV !== 'development')
    ? '/api/chat'
    : '//localhost:3003/api/chat';

async function getChats(userId) {
    let queryStr = '?userId=' + userId
    const {data} = await axios.get(CHAT_API + queryStr)
    return data;
}