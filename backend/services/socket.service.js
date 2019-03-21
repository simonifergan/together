const chatService = require('./chat.service');

// EVENTS LIST:
const SOCKET_CONNECT = 'socket-connect';
const SOCKET_DISCONNECT = 'socket-disconnect';
const CHAT_JOIN = 'chat-join';
const CHAT_LEAVE = 'chat-leave';
const CHAT_SEND_MSG = 'chat-send-msg';
const CHAT_RECEIVE_MSG = 'chat-receive-msg';
const NOTIFICATION_ADD = 'notification-add';
const NOTIFICATION_ADDED = 'notification-added';

module.exports = (io) => {

    io.on('connection', socket => {
        // I AM CONNECTED, HERE IS MY USERSID:
        //  socket.userId = ^
        // CHAT Funcs
        console.log('Hi there socket ID:', socket.id);
        socket.on(SOCKET_CONNECT, userId => {
            socket.userId = userId;
            console.log('Hello user:', userId, 'in socket:', socket.userId);
        })
        io.emit(CHAT_JOIN, 'Hi there!');

        socket.on('disconnect', () => {
            console.log('Bye user with socket:', socket.id);
            socket.broadcast.emit(SOCKET_DISCONNECT, 'HE IS GONE:', socket.id);
        })

        socket.on(CHAT_SEND_MSG, async payload => {
            // console.log('got', msg)
            await chatService.addMsg(payload);
            io.emit(CHAT_RECEIVE_MSG, payload);
        })

        // Notifications Funcs
        socket.on(NOTIFICATION_ADD, notification => {
            console.log('got', notification)
            io.emit(NOTIFICATION_ADDED, notification);
        })
    });

}