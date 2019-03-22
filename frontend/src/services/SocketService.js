import io from 'socket.io-client';

const SOCKET_PORT = (process.env.NODE_ENV !== 'development')
    ? ''
    : '//localhost:3003';


const socket = io(SOCKET_PORT);

// BACKEND EVENTS LIST:
const SOCKET_CONNECT = 'socket-connect';
const SOCKET_DISCONNECT = 'socket-disconnect';
const CHAT_REGISTER_ROOMS = 'socket-register-rooms';
const CHAT_JOIN = 'chat-join';
const CHAT_JOIN_NEW = 'chat-join-new';
const CHAT_LEAVE = 'chat-leave';
const CHAT_SEND_MSG = 'chat-send-msg';
const CHAT_RECEIVE_MSG = 'chat-receive-msg';

const NOTIFICATION_ADD = 'notification-add'
const NOTIFICATION_ADDED = 'notification-added'

export default {
    on,
    emit,
    // SOCKET EVENTS
    SOCKET_CONNECT, 
    SOCKET_DISCONNECT, 
    CHAT_REGISTER_ROOMS,
    CHAT_JOIN,
    CHAT_JOIN_NEW,
    CHAT_LEAVE,
    CHAT_SEND_MSG, 
    CHAT_RECEIVE_MSG,
    NOTIFICATION_ADD,
    NOTIFICATION_ADDED,
}
// TODO: All ids should be converted by backend to ObjId, and all msgs should be stored in the DB like this:
// msgObj: {
//     roomId: String,
//     txt: String,
//     senderId: String,
//     receiverId: String,
// }

function on(eventName, cb) {
    socket.on(eventName, cb)
}

function emit(eventName, payload) {
    console.log('emittin event:', eventName, 'payload:', payload);
    socket.emit(eventName, payload);
}

// function send(msg) {
//     socket.emit(CHAT_SEND_MSG, msg)
// }