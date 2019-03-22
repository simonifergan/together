const chatService = require('./chat.service');
const notificationService = require('./notification.service');

// EVENTS LIST:
const SOCKET_CONNECT = 'socket-connect';
const SOCKET_DISCONNECT = 'socket-disconnect';
const CHAT_JOIN = 'chat-join';
const CHAT_JOIN_NEW = 'chat-join-new';
const CHAT_LEAVE = 'chat-leave';
const CHAT_SEND_MSG = 'chat-send-msg';
const CHAT_RECEIVE_MSG = 'chat-receive-msg';
const NOTIFICATION_ADD = 'notification-add';
const NOTIFICATION_ADDED = 'notification-added';

module.exports = (io) => {

    io.on('connection', socket => {
        console.log('Hi there socket ID:', socket.id);
        socket.on(SOCKET_CONNECT, userId => {
            socket.userId = userId;
            console.log('Hello user:', userId, 'in socket:', socket.userId);
        })

        socket.on('disconnect', () => {
            console.log('Bye user with socket:', socket.id);
            socket.broadcast.emit(SOCKET_DISCONNECT, 'HE IS GONE:', socket.id);
        })

        socket.on(CHAT_JOIN, async payload => {
            if (payload.chatId) socket.join(payload.chatId);
            else {
                // need to create new chat with:
                console.log(payload);
            }
            
        })

        socket.on(CHAT_SEND_MSG, async payload => {
            // console.log('got', msg)
            payload.msg.sender = socket.userId;
            await chatService.addMsg(payload);
            io.emit(CHAT_RECEIVE_MSG, payload);
        })

        // Notifications
        socket.on(NOTIFICATION_ADD, async notification => {
            notification.createdAt = Date.now();
            console.log('notification to add:', notification);
            
            await notificationService.add(notification)
            io.emit(NOTIFICATION_ADDED, notification);
        })
    });
}