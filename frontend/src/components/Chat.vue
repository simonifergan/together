<template>
    <aside class="chat">
        <!-- <div v-if="chatId">{{}}</div> -->
        <h1>Chat</h1>
        <form @submit.prevent="send">
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
    methods: {
        send() {
            this.$store.dispatch({type: 'socketSendMsg', msg: {text: this.newMsg}})
        }
    }
    // props: {
    //     chatId: {
    //         type: Number,
    //         // required: true,
    //     }
    // }
}
</script>

<style>

</style>
