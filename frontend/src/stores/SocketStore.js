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
        addMsg(state, {msg, chatId}) {
            const chat = state.userChats.find(chat => chat._id === chatId)
            chat.isActive = true
            chat.msgs.push(msg)
        },
        setUserChats(state, {chats}) {
            state.userChats = chats
        },
        setNotification(state, {notifications}) {
            state.notifications = notifications;
        },
        addNotification(state, {notification}) {
            state.notifications.unshift(notification);
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
            context.dispatch({type: 'socketUserConnect'})
            SocketService.on(SocketService.CHAT_RECEIVE_MSG, ({chatId, msg}) => {
                context.commit({type: 'addMsg', msg, chatId});
            })
            SocketService.on(SocketService.NOTIFICATION_ADDED, ({notification}) => {
                context.commit({type: 'addNotification', notification});
            })
        },
        socketUserConnect({getters}) {
            SocketService.emit(SocketService.SOCKET_CONNECT, getters.loggedUser._id);
        },
        socketSendMsg({commit}, {msg, chatId}) {
            msg._id = UtilService.generateId()
            // commit({type: 'addMsg', msg, chatId})
            SocketService.emit(SocketService.CHAT_SEND_MSG, {msg, chatId});
        },
        async getUserChats({commit, getters}) {
            const chats = await ChatService.getChats(getters.loggedUser._id)
            commit({type: 'setUserChats', chats})
        },
        async loadNotification({commit, getters}) {
            const notifications = await NotificationService.query();
            commit({type: 'setNotification', notifications});
        },
        addNotification({commit}, {newNotification}) {
            SocketService.emit(SocketService.NOTIFICATION_ADD, newNotification);
        }
    }
}