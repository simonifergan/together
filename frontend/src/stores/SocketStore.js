import SocketService from '@/services/SocketService';
import UtilService from '@/services/UtilService';
import ChatService from '@/services/ChatService';
import NotificationService from '@/services/NotificationService';

export default {
    state: {
        isConnected: false,
        // activeChats: [],
        userChats: [],
        notifications: null
    },
    mutations: {
        setConnection(state) {
            state.isConnected = !state.isConnected;
            console.log('connection status:', state.isConnected);
        },
        addMsg(state, {msg, chatId}) {
            const chat = state.userChats.find(chat => chat._id = chatId)
            chat.isActive = true
            chat.msgs.push(msg)
        },
        setUserChats(state, {chats}) {
            state.userChats = chats
        },
        setNotification(state, {notifications}) {
            state.notifications = notifications;
        }
    },
    getters: {
        // activeChats(state) {
        //     return state.activeChats;
        // },
        userChats(state) {
            return state.userChats;
        }
    },
    actions: {
        socketConnect({commit}) {
            SocketService.on(SocketService.CHAT_RECEIVE_MSG, (msg) => {
                // commit({type: 'activateChat', chatId: msg.chatId})
                commit({type: 'addMsg', msg});
            })
        },
        // socketSubscribe(context, {eventName, cb}){
        //     SocketService.on(eventName, cb);
        // },
        socketSendMsg({commit}, {msg, chatId}) {
            msg._id = UtilService.makeId()
            commit({type: 'addMsg', msg, chatId})
            SocketService.emit(SocketService.CHAT_SEND_MSG, {msg, chatId});
        },
        async getUserChats({commit, getters}) {
            const chats = await ChatService.getChats(getters.loggedUser._id)
            commit({type: 'setUserChats', chats})
        },
        async loadNotification({commit, getters}) {
            const notifications = await NotificationService.getNotifications(getters.loggedUser._id);
            commit({type: 'setNotification', notifications});
        }
    }
}