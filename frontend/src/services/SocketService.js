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

const TRIP_JOIN_REQUEST = 'trip-join-request';

const NOTIFICATION_RECEIVE = 'notification-receive';
const NOTIFICATION_SEND = 'notification-send';
const NOTIFICATION_ADD = 'notification-add';
const NOTIFICATION_ADDED = 'notification-added';

const PUSH_NOTIFICATION = 'push-notification';

export default {
    on,
    emit,
    off,
    
    // SOCKET EVENTS
    SOCKET_CONNECT, 
    SOCKET_DISCONNECT, 
    
    CHAT_REGISTER_ROOMS,
    CHAT_JOIN,
    CHAT_JOIN_NEW,
    CHAT_LEAVE,
    CHAT_SEND_MSG, 
    CHAT_RECEIVE_MSG,

    TRIP_JOIN_REQUEST, // not used so far

    NOTIFICATION_RECEIVE,
    NOTIFICATION_SEND,
    NOTIFICATION_ADD,
    NOTIFICATION_ADDED,
    PUSH_NOTIFICATION,
}

function on(eventName, cb) {
    socket.on(eventName, cb)
}

function emit(eventName, payload) {
    socket.emit(eventName, payload);
}

function off() {
    socket.off();
    socket.emit(SOCKET_DISCONNECT);
}