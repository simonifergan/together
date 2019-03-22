import SocketService from '@/services/SocketService';
import UtilService from '@/services/UtilService';
import ChatService from '@/services/ChatService';
import NotificationService from '@/services/NotificationService';

export default {
    state: {
        isConnected: false,
        userChats: [],
        notifications: []
    },
    mutations: {
        setConnection(state) {
            state.isConnected = !state.isConnected;
            console.log('connection status:', state.isConnected);
        },
        addNewChat(state, { chat }) {
            chat.isActive = true;
            state.userChats.push(chat);
        },
        activateChat(state, {chatId}) {
            const chat = state.userChats.find(chat => chat._id === chatId);
            if (chat) chat.isActive = true;
        },
        closeChat(state, { chatId }) {
            const chat = state.userChats.find(chat => chat._id === chatId);
            chat.isActive = false;
        },
        addMsg(state, { msg, chatId }) {
            const chat = state.userChats.find(chat => chat._id === chatId)
            if (chat) {
                chat.isActive = true
                chat.msgs.push(msg)
            } else return;
        },
        setUserChats(state, { chats }) {
            state.userChats = chats
        },
        setNotification(state, { notifications }) {
            state.notifications = notifications;
        },
        addNotification(state, { addedNotification }) {
            console.log(addedNotification);
            state.notifications.unshift(addedNotification);
        }
    },
    getters: {
        userChats(state) {
            return state.userChats;
        },
        notifications(state) {
            return state.notifications;
        }
    },
    actions: {
        socketConnect(context) {
            context.dispatch({ type: 'socketUserConnect' })
            SocketService.on(SocketService.CHAT_JOIN_NEW, chat => {
                    context.commit({ type: 'addNewChat', chat })
            })
            SocketService.on(SocketService.CHAT_JOIN, chatId => {
                    context.commit({ type: 'activateChat', chatId })
            })
            SocketService.on(SocketService.CHAT_RECEIVE_MSG, ({ chatId, msg }) => {
                context.commit({ type: 'addMsg', msg, chatId });
            })
            SocketService.on('notification-added', (addedNotification) => {
                console.log('NOTIFICATION ADDED:', addedNotification);
                context.commit({ type: 'addNotification', addedNotification });
            })
        },
        socketUserConnect({ getters }) {
            SocketService.emit(SocketService.SOCKET_CONNECT, getters.loggedUser._id);
        },
        socketSendMsg({ commit }, { msg, chatId }) {
            msg._id = UtilService.generateId()
            // commit({type: 'addMsg', msg, chatId})
            SocketService.emit(SocketService.CHAT_SEND_MSG, { msg, chatId });
        },
        socketJoinPrivateChat(context, { userId }) {
            const chat = context.getters.userChats.find(chat => {
                if (chat.users.length > 2) return false;
                if (chat.users.some(user => user._id === userId)) return true;
            })
            let payload;
            if (chat) {
                payload = {
                    chatId: chat._id,
                    loggedUserId: context.getters.loggedUser._id,
                    users: [userId],
                };
                context.commit({type: 'activateChat', chatId: chat._id});
            } else {
                payload = {
                    chatId: null,
                    loggedUserId: context.getters.loggedUser._id,
                    users: [userId],
                };
            }
            SocketService.emit(SocketService.CHAT_JOIN, payload);

        },
        async getUserChats({ commit, getters }) {
            let chats = await ChatService.getChats(getters.loggedUser._id)
            chats = chats.map(chat => {
                chat.isActive = false;
                return chat;
            })
            commit({ type: 'setUserChats', chats });
            SocketService.emit(SocketService.CHAT_REGISTER_ROOMS, chats);
        },
        async loadNotification({ commit, getters }) {
            const notifications = await NotificationService.query();
            commit({ type: 'setNotification', notifications });
        },
        addNotification(context, { newNotification }) {
            console.log('socket store');
            SocketService.emit(SocketService.NOTIFICATION_ADD, newNotification);
        }
    }
}