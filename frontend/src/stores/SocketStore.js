// IMPORT SERVICES
import SocketService from '@/services/SocketService';
import UtilService from '@/services/UtilService';
import ChatService from '@/services/ChatService';
import NotificationService from '@/services/NotificationService';
import EventBusService from '@/services/EventBusService';

// IMPORT SPECIFIC BUS EVENTS
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
            const idx = state.userChats.findIndex(loadedChat => loadedChat._id === chat._id);
            if (idx === -1) state.userChats.push(chat);
            else state.userChats.splice(idx, 1, chat);
        },
        activateChat(state, { chatId, userId }) {
            const chat = state.userChats.find(chat => chat._id === chatId);
            if (chat) {
                chat.isActive = true;
                const idx = chat.unread.findIndex(unreadId => unreadId === userId);
                if (idx !== -1) chat.unread.splice(idx, 1);
            }
        },
        deactivateChat(state, { chatId }) {
            const chat = state.userChats.find(chat => chat._id === chatId);
            if (chat) chat.isActive = false;
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
            };
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
            SocketService.on(SocketService.CHAT_JOIN_NEW, chat => {
                context.commit({ type: 'addNewChat', chat })
            })
            SocketService.on(SocketService.CHAT_JOIN, chatId => {
                context.commit({ type: 'activateChat', chatId })
            })
            SocketService.on(SocketService.CHAT_RECEIVE_MSG, async ({ chatId, msg }) => {
                if (!context.getters.userChats.some(chat => chat._id === chatId)) await context.dispatch({ type: 'loadChatById', chatId })
                else context.commit({ type: 'addMsg', msg, chatId });
            })
            SocketService.on(SocketService.NOTIFICATION_ADDED, (addedNotification) => {
                context.commit({ type: 'addNotification', addedNotification });
            })
            SocketService.on(SocketService.NOTIFICATION_RECEIVE, payload => {
                if (payload.tripId) {
                    if (context.getters.tripToDisplay && context.getters.tripToDisplay._id === payload.tripId) {
                        context.dispatch({ type: 'loadTrip', tripId: payload.tripId })
                        context.dispatch({ type: "getUserRequests" });
                    }
                }
                console.log(payload);
                EventBusService.$emit(SHOW_NOTIFICATION, payload);
            })
            context.dispatch({ type: 'socketUserConnect' })
        },

        socketDisconnect() {
            SocketService.off();
        },

        socketUserConnect({ getters }) {
            SocketService.emit(SocketService.SOCKET_CONNECT, getters.loggedUser._id);
        },

        socketSendMsg({ commit }, { msg, chatId, recipients }) {
            msg._id = UtilService.generateId()
            // commit({type: 'addMsg', msg, chatId})
            SocketService.emit(SocketService.CHAT_SEND_MSG, { msg, chatId, recipients });
        },

        socketPushNotification(context, { userId, notification }) {
            SocketService.emit(SocketService.PUSH_NOTIFICATION, { userId, notification })
        },

        socketSendNotification(context, { userId, payload }) {
            SocketService.emit(SocketService.NOTIFICATION_SEND, { userId, payload });
        },


        socketJoinPrivateChat(context, { userId }) {
            const chat = context.getters.userChats.find(chat => {
                if (chat.trip && chat.trip.title) return false;
                return chat.users.find(user => user._id === userId);
            })
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

        async socketInitGroupChat({ commit }, { chatId }) {
            try {
                const chat = await ChatService.getById(chatId);
                console.log('I AM IN SOCKET INIT GROUP', chat);
                SocketService.emit(SocketService.CHAT_REGISTER_ROOMS, [chatId])
                if (chat) commit({ type: 'addNewChat', chat });
            } catch {

            }

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
        async loadChatById({ commit }, { chatId }) {
            const chat = await ChatService.getById(chatId);
            if (chat) commit({ type: 'addNewChat', chat });
        },
        async activateChat({ commit, getters }, { chatId }) {
            const userId = getters.loggedUser._id;
            commit({ type: 'activateChat', chatId, userId})
            try {
                console.log(chatId, userId)
                const res = await ChatService.removeUserFromUnread(chatId, userId);
                console.log('Is all:', res);
            } catch (err) {
                console.log('failed in activateChat:', err);
            }


        },
        addNotification(context, { newNotification }) {
            SocketService.emit(SocketService.NOTIFICATION_ADD, newNotification);
        }
    }
}