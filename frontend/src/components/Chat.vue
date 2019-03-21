<template>
    <aside class="chat">
        <!-- <div v-if="chatId">{{}}</div> -->
        <h1>Chat</h1>
        <form @submit.prevent="send">
            <ul>
                <li v-for="msg in msgs" :key="msg._id">
                    {{msg.txt}}
                </li>
            </ul>
            <el-input v-model="newMsg" placeholder="Write Something"></el-input>
            <button type="submit">Send</button>
        </form>
    </aside>
</template>

<script>
export default {
    data() {
        return {
            newMsg: ''
        }
    },
    computed: {
        msgs() {
            return this.chat.msgs
        }
    },
    methods: {
        send() {
            this.$store.dispatch({type: 'socketSendMsg', msg: {text: this.newMsg}, chatId: this.chat._id})
        }
    },
    props: ['chat']
}
</script>

<style>

</style>
