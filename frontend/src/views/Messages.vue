<template>
    <section class="messages-page">
        <message-list :user="user" :chats="chats" />
        <chat :chat="selectedChat"/>
    </section>
</template>

<script>
import MessageList from '@/components/MessageList';
import Chat from "@/components/Chat";

export default {
    components: {
        MessageList, Chat
    },
    data() {
        return {
            chatId: null,
        };
    },
    computed: {
        chats() {
            return this.$store.getters.userChats;
        },
        user() {
            return this.$store.getters.loggedUser;
        },
        selectedChat() {
            if (!this.chatId) return this.chats[0];
        }
    }

}
</script>

<style>

</style>
