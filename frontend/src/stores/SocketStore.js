import SocketService from '@/services/SocketService';


export default {
    state: {
        isConnected: false,
        activeChats: [],
        userChats: [],
    },
    mutations: {
        setConnection(state) {
            state.isConnected = !state.isConnected;
            console.log('connection status:', state.isConnected);
        },
        activateChat(state, {chatId}) {
            if (!state.activeChats.find(_id => _id === chatId )) {
                state.activeChats.push(chatId);
            } else return;
        },
        addMsg(state, {msg}) {
            state.chatMsgs.push(msg);
        }
    },
    getters: {
        activeChats(state) {
            return state.activeChats;
        },
        userChats(state) {
            return state.chatMsgs;
        }
    },
    actions: {
        socketConnect({commit}) {
            SocketService.on(SocketService.CHAT_RECEIVE_MSG, (msg) => {
                commit({type: 'activateChat', chatId: msg.chatId})
                commit({type: 'addMsg', msg});
            })
        },
        socketSubscribe(context, {eventName, cb}){
            SocketService.on(eventName, cb);
        },
        socketSendMsg(context, {msg}) {
            SocketService.send(msg);
        },

    }

}