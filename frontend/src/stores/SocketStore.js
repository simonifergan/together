import SocketService from '@/services/SocketService';
import UtilService from '@/services/UtilService';
import ChatService from '@/services/ChatService';
import NotificationService from '@/services/NotificationService';
import EventBusService from '@/services/EventBusService';
import { SHOW_NOTIFICATION } from '@/services/EventBusService';

export default {
    state: {
        isConnected: false,
        userChats: [],
        notifications: []
    },
    mutations: {
        setConnection(state) {
            state.isConnected = !state.isConnected;
            // console.log('connection status:', state.isConnected);
        },
        addNewChat(state, { chat }) {
            chat.isActive = true;
            state.userChats.push(chat);
        },
        activateChat(state, { chatId }) {
            const chat = state.userChats.find(chat => chat._id === chatId);
            if (chat) chat.isActive = true;
        },
        closeChat(state, { chatId }) {
            const chat = state.userChats.find(chat => chat._id === chatId);
            chat.isActive = false;
        },
        addMsg(state, { msg, chatId, recipients }) {
            console.log(recipients);
            const chat = state.userChats.find(chat => chat._id === chatId)
            if (chat) {
                chat.isActive = true
                chat.msgs.push(msg)
            } else {
                // A new chat has been created, so make sure to update user's state
                let newChat = {
                    _id: chatId,
                    msgs: [msg],
                    users: [...recipients],
                    isActive: true,
                }
                state.userChats.push(newChat);
            }
        },
        setUserChats(state, { chats }) {
            state.userChats = chats
        },
        setNotification(state, { notifications }) {
            state.notifications = notifications;
        },
        addNotification(state, { addedNotification }) {
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
            SocketService.on(SocketService.CHAT_RECEIVE_MSG, ({ chatId, msg, recipients }) => {
                context.commit({ type: 'addMsg', msg, chatId, recipients });
            })
            SocketService.on(SocketService.NOTIFICATION_ADDED, (addedNotification) => {
                context.commit({ type: 'addNotification', addedNotification });
            })
            SocketService.on(SocketService.NOTIFICATION_RECEIVE, payload => {
                console.log(payload)
                // send payload to usrmsg cmp
                EventBusService.$emit(SHOW_NOTIFICATION, payload);
            })
        },
        socketUserConnect({ getters }) {
            SocketService.emit(SocketService.SOCKET_CONNECT, getters.loggedUser._id);
        },
        socketSendMsg({ commit }, { msg, chatId, recipients }) {
            msg._id = UtilService.generateId()
            // commit({type: 'addMsg', msg, chatId})
            SocketService.emit(SocketService.CHAT_SEND_MSG, { msg, chatId, recipients });
        },
        socketSendNotification(context, { userId, payload }) {
            SocketService.emit(SocketService.NOTIFICATION_SEND, { userId, payload });
        },
        socketJoinPrivateChat(context, { userId }) {
            const chat = context.getters.userChats.find(chat => chat.users.some(user => user._id === userId))
            console.log(chat);
            let payload;
            if (chat) {
                payload = {
                    chatId: chat._id,
                    loggedUserId: context.getters.loggedUser._id,
                    users: [userId],
                };
                context.commit({ type: 'activateChat', chatId: chat._id });
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
        async loadNotification({ commit }) {
            const notifications = await NotificationService.query();
            commit({ type: 'setNotification', notifications });
        },
        addNotification(context, { newNotification }) {
            SocketService.emit(SocketService.NOTIFICATION_ADD, newNotification);
        }
    }
}