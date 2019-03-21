import SocketService from '@/services/SocketService';

export default {
    state: {
        isConnected: false,
        activeChats: [],
        chatMsgs: [],
    },
    mutations: {
        setConnection(state) {
            state.isConnected = !state.isConnected;
            console.log('connection status:', state.isConnected);
        } 
    },
    getters: {
        activeChats(state) {
            return state.activeChats;
        },
        chatMsgs(state) {
            return state.chatMsgs;
        }
    },
    actions: {
        socketConnect({commit}) {
            
        },
        socketSubscribe(context, {eventName, cb}){
            SocketService.on(eventName, cb);
        },
        socketSendMsg(context, {msg}) {
            SocketService.send(msg);
        }
    }

}