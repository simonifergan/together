<template>
  <div id="app" class="app-container">
    <main-header/>
    <router-view/>
    <chat v-for="chat in activeChats" :key="chat._id" :chatId="chat"/>
    <chat v-for="chat in chats" :chat="chat" :key="chat._id"/>
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
    // UploadImage
  },
  computed: {
    activeChats() {
      return this.$store.getters.activeChats;
    },
    chats() {
      return this.$store.getters.userChats;
    }
  },
  created() {
    this.$store.dispatch({ type: "socketConnect" });
    this.$store.dispatch({ type: "getUserChats" });
    this.$store.dispatch({ type: "loadNotification"});
  }
};
</script>

<style lang="scss">
</style>