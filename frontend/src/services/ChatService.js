import Axios from 'axios'

const axios = Axios.create({
    withCredentials: true
})

export default {
    getChats,
    getById,
    removeUserFromUnread
}

const CHAT_API = (process.env.NODE_ENV !== 'development')
    ? '/api/chat'
    : '//localhost:3003/api/chat';

async function getChats(userId) {
    let queryStr = '?userId=' + userId
    const { data } = await axios.get(CHAT_API + queryStr)
    return data;
}

async function getById(chatId) {
    const { data } = await axios.get(`${CHAT_API}/${chatId}`);
    return data;
}

async function removeUserFromUnread(chatId, userId) {
    const { data } = await axios.patch(`${CHAT_API}/${chatId}`, {userId});
    return data;
}