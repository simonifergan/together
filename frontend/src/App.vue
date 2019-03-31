<template>
  <div id="app" class="app-container" ref="topOfPage">
    <main-header :class="isHomepage" />
    <user-msg />
    <transition name="fade" mode="out-in">
      <router-view class="main-view" :class="isHomepage" />
    </transition>
    <div class="chat-container" v-if="!isMessagesPage">
      <chat v-for="(chat,index) in chats" :chat="chat" :key="chat._id+index"/>
    </div>
  </div>
</template>

<script>
import MainHeader from "@/components/MainHeader";
import Chat from "@/components/Chat";
import UserMsg from '@/components/UserMsg';

export default {
  name: "App",
  components: {
    MainHeader,
    UserMsg,
    Chat
  },
  data() {
    return {
      isHome: true,
    };
  },
  computed: {
    chats() {
      return this.$store.getters.userChats;
    },
    requests() {
      return this.$store.getters.requests;
    },
    getNotifications() {
      return this.$store.getters.notifications;
    },
    loggedUser() {
      return this.$store.getters.loggedUser;
    },
    isMessagesPage() {
      return this.$route.path === '/messages';
    },
    isHomepage() {
      return { "on-homepage": this.isHome };
    },
  },
  created() {
    if (this.loggedUser) {
      this.$store.dispatch({ type: "socketConnect" });
      this.$store.dispatch({ type: "getUserChats" });
      this.$store.dispatch({ type: "getUserRequests" });
      this.$store.dispatch({ type: "loadNotification" });
    }
    if (!this.loggedUser) {
      this.$store.dispatch("checkFacebookUser").then(res => {
        if (res) this.$router.push(this.$route.path);
      });
    }
  },
  watch: {
    $route: {
      handler(newRoute) {
        if (newRoute.name !== "home") this.isHome = false;
        else this.isHome = true;
      }
    },
  }
};
</script>

<style lang="scss">
</style>