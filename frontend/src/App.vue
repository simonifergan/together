<template>
  <div id="app" class="app-container" ref="topOfPage">
    <main-header/>
    <!-- <user-msg /> -->
    <transition name="fade" mode="out-in">
      <router-view/>
    </transition>
    <div class="chat-container">
      <chat v-for="(chat,index) in chats" :chat="chat" :key="chat._id+index"/>
    </div>
    <notification-list :notifications="getNotifications"/>
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
      return this.$store.getters.userChats;
    },
    getNotifications() {
      return this.$store.getters.notifications;
    },
    loggedUser() {
      return this.$store.getters.loggedUser;
    }
  },
  created() {
    if (this.loggedUser) {
      this.$store.dispatch({ type: "socketConnect" });
      this.$store.dispatch({ type: "getUserChats" });
      this.$store.dispatch({ type: "loadNotification" });
    }
    if (!this.loggedUser) {
      this.$store.dispatch("checkFacebookUser").then(res => {
        if (res) this.$router.push(this.$route.path);
      });
    }
  },
};
</script>

<style lang="scss">
</style>