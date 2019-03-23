<template>
  <div id="app" class="app-container">
    <main-header/>
    <router-view/>
    <div class="chat-container">
      <chat v-for="(chat,index) in chats" :chat="chat" :key="chat._id+index"/>
    </div>
    <notification-list :notifications="getNotifications" />
  </div>
</template>

<script>
import MainHeader from "@/components/MainHeader";
import Chat from "@/components/Chat";
import NotificationList from "@/components/NotificationList";

export default {
  name: "App",
  components: {
    MainHeader,
    NotificationList,
    Chat
  },
  computed: {
    chats() {
      // console.log(this.$store.getters.userChats)
      return this.$store.getters.userChats;
    },
    getNotifications() {
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