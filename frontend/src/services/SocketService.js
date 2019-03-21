import io from 'socket.io-client';

const SOCKET_PORT = (process.env.NODE_ENV !== 'development')
    ? ''
    : '//localhost:3003';


const socket = io(SOCKET_PORT);

export default {
    on,
    emit,
    send
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

function emit(event, payload) {
    socket.emit(event, payload);
}

function send(msg) {
    socket.emit('chat-msg-send', msg)
}