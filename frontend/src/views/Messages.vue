<template>
  <section class="messages-page">
    <message-list @changeChat="changeChat" :user="user" :chats="chats"/>
    <chat :chat="selectedChat"/>
  </section>
</template>

<script>
import MessageList from "@/components/MessageList";
import Chat from "@/components/Chat";

export default {
  components: {
    MessageList,
    Chat
  },
  data() {
    return {
      chatId: null
    };
  },
  mounted() {
       this.$nextTick(() => {
           this.$store.dispatch({ type: "activateChat", chatId: this.chatId });
       });
  },
  beforeDestroy() {
    this.$store.commit({ type: "deactivateChat", chatId: this.chatId });
  },
  methods: {
    changeChat(chatId) {
      this.$store.commit({ type: "deactivateChat", chatId: this.chatId });
      this.$store.dispatch({ type: "activateChat", chatId });
      this.chatId = chatId;
    }
  },
  computed: {
    chats() {
      return this.$store.getters.userChats;
    },
    user() {
      return this.$store.getters.loggedUser;
    },
    selectedChat() {
      if (!this.chatId && this.chats) return this.chats[0];
      else return this.chats.find(chat => chat._id === this.chatId);
    }
  }
};
</script>

<style>
</style>
