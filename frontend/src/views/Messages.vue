<template>
    <section>
        <message-list :user="user" :chats="chats" />
    </section>
</template>

<script>
import MessageList from '@/components/MessageList';
export default {
    components: {
        MessageList
    },
    computed: {
        chats() {
            return this.$store.getters.userChats;
        },
        user() {
            return this.$store.getters.loggedUser;
        }
    }

}
</script>

<style>

</style>
