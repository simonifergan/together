const chatService = require('./chat.service');
const notificationService = require('./notification.service');

// EVENTS LIST:
const SOCKET_CONNECT = 'socket-connect';
const SOCKET_DISCONNECT = 'socket-disconnect';
const CHAT_REGISTER_ROOMS = 'socket-register-rooms';
const CHAT_JOIN = 'chat-join';
const CHAT_JOIN_NEW = 'chat-join-new';
const CHAT_LEAVE = 'chat-leave';
const CHAT_SEND_MSG = 'chat-send-msg';
const CHAT_RECEIVE_MSG = 'chat-receive-msg';
const NOTIFICATION_ADD = 'notification-add';
const NOTIFICATION_ADDED = 'notification-added';

const connectedSockets = [];

module.exports = (io) => {

    io.on('connection', socket => {
        console.log('Hi there socket ID:', socket.id);
        socket.on(SOCKET_CONNECT, userId => {
            socket.userId = userId;
            connectedSockets.push(socket)
            console.log('Hi connected sockets:', connectedSockets);
            console.log('Hello user:', userId, 'in socket:', socket.userId);
        })

        socket.on(CHAT_REGISTER_ROOMS, chats => {
            chats.forEach(chat => {
                socket.join(chat._id);
            })
        })

        socket.on('disconnect', () => {
            const socketIdx = connectedSockets.find(inSocket => inSocket.userId === socket.userId);
            if (socketIdx !== -1) connectedSockets.splice(socketIdx, 1);
            console.log('Bye connected sockets:', connectedSockets);
            console.log('Bye user with socket:', socket.id, 'and userId', socket.userId);
        })

        socket.on(CHAT_JOIN, async payload => {
            console.log('ME HERE YOUR PAYLOAD', payload);
            if (payload.chatId) socket.join(payload.chatId);
            else {
                payload.users.push(payload.loggedUserId);
                let chat = {
                    users: payload.users,
                    msgs: [],
                }
                try {
                    chat = await chatService.createChat(chat);
                    socket.join(chat._id);
                    socket.emit(CHAT_JOIN_NEW, chat);
                } catch {

                }

            }

        })

        socket.on(CHAT_SEND_MSG, async payload => {
            console.log('got', payload)
            payload.msg.sender = socket.userId;
            // TODO: Force socket to reconnect to his room upon message sent and referred to him
            // payload.recipients.forEach(user => {
            //     const recipientSocket = connectedSockets.find(inSocket => inSocket.userId === user._id);
            //     console.log('recipientIs:', recipientSocket)
            //     if (recipientSocket) recipientSocket.join(payload.chatId);
            // })
            await chatService.addMsg(payload);
            io.to(payload.chatId).emit(CHAT_RECEIVE_MSG, payload);
        })

        // Notifications
        socket.on(NOTIFICATION_ADD, async notification => {
            notification.createdAt = Date.now();
            let addedNotification = await notificationService.add(notification)
            io.emit(NOTIFICATION_ADDED, addedNotification);
        })
    });
}