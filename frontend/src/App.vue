<template>
  <div id="app" class="app-container">
    <main-header/>
    <router-view/>
    <div class="chat-container">
      <chat v-for="(chat,index) in chats" :chat="chat" :key="chat._id+index"/>
    </div>
    <!-- {{notifications}} -->
    <ul class="notification-container">
      <!-- <notification 
        v-for="notification in notifications" 
        :key="notification._id" 
        :notification="notification" /> -->
    </ul>
  </div>
</template>

<script>
import MainHeader from "@/components/MainHeader";
import Chat from "@/components/Chat";
// import Notification from "@/components/Notification";

export default {
  name: "App",
  components: {
    MainHeader,
    // Notification,
    Chat
  },
  computed: {
    chats() {
      return this.$store.getters.userChats;
    },
    notifications() {
      return this.$store.getters.notifications;
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