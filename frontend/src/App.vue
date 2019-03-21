<template>
  <div id="app" class="app-container">
    <main-header/>
    <router-view/>
    <div class="chat-container">
      <chat v-for="(chat,index) in chats" :chat="chat" :key="chat._id+index"/>
    </div>
  </div>
</template>

<script>
import MainHeader from "@/components/MainHeader";
import Chat from "@/components/Chat";

export default {
  name: "App",
  components: {
    MainHeader,
    Chat
  },
  computed: {
    chats() {
      return this.$store.getters.userChats;
    }
  },
  created() {
    this.$store.dispatch({ type: "socketConnect" });
    this.$store.dispatch({ type: "getUserChats" });
    this.$store.dispatch({ type: "loadNotification" });
  }
};
</script>

<style lang="scss">
</style>