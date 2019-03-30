<template>
  <header class="main-header" :class="isAbsolute">
    <router-link title="Homepage" tag="div" class="logo" to="/">
      <!-- <i class="fas fa-map-marker-alt"></i> -->
      <!-- <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
      <!-- <img src="@/assets/svg/person_pin_circle.svg"> -->
      <h1>Together</h1>
    </router-link>
    <nav :class="{show: isNavOpen}">
      <router-link to="/">Home</router-link>
      <a href="#">About</a>
      <router-link to="/signup" v-if="!user">Sign up</router-link>
      <div class="requests-container" v-if="user">
        <a @click.stop="showReqs">Requests</a>
        <request-list
          v-show="isShowReqs" 
          :requests="requests"
          :user="user"
        />
      </div>
      <div class="msgs-container" v-if="user">
        <a @click.stop="showMsgs">Messages&nbsp;<span class="unread-msgs" v-if="unreadChats">{{unreadChats}}</span></a>
        <message-list
          v-show="isShowMsgs" 
          :chats="chats"
          :user="user" 
        />
      </div>
      <div class="login-container" v-if="!user">
        <router-link :to="currentRoute + '#login'">Log in</router-link>
        <login v-if="isShowLogin"/>
      </div>
      <div v-if="user" class="user-dashboard" :style="profilePic" @click.stop="showDropdown">
        <div class="dropdown" v-if="isShowDropdown">
          <router-link to="/edit">Add a new trip</router-link>
          <router-link :to="'/user/' + user._id">Profile</router-link>
          <router-link :to="'/account/' + user._id">Account</router-link>
          <a @click="logout">Log out</a>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import Login from "@/components/Login";
import MessageList from "@/components/MessageList";
import RequestList from "@/components/RequestList";

export default {
  name: "MainHeader",
  components: {
    Login,
    MessageList,
    RequestList
  },
  data() {
    return {
      isHome: true,
      isShowDropdown: false,
      isShowMsgs: false,
      isShowReqs: false,
      isNavOpen: false,
    };
  },
  methods: {
    async logout() {
      if (this.user.isFBUser) {
        FB.logout();
      }
      try {
        await this.$store.dispatch("logout");
        this.$router.push("/");
      } catch {}
    },
    closeDropdown() {
      this.isShowDropdown = false;
      document
        .querySelector("#app")
        .removeEventListener("click", this.closeDropdown);
    },
    showDropdown() {
       if (this.isShowReqs) {
        this.closeReqs();
      }
       if (this.isShowMsgs) {
        this.closeMsgs();
      }
      if (this.isShowDropdown) {
        this.closeDropdown();
        return;
      }
      this.isShowDropdown = true;
      document
        .querySelector("#app")
        .addEventListener("click", this.closeDropdown);
    },
    closeMsgs() {
      this.isShowMsgs = false;
      document
        .querySelector("#app")
        .removeEventListener("click", this.closeMsgs);
    },
    showMsgs() {
      if (this.isShowReqs) {
        this.closeReqs();
      }
      if (this.isShowDropdown) {
        this.closeDropdown();
      }
      if (this.isShowMsgs) {
        this.closeMsgs();
        return;
      }
      this.isShowMsgs = true;
      document.querySelector("#app").addEventListener("click", this.closeMsgs);
    },
    closeReqs() {
      this.isShowReqs = false;
      document
        .querySelector("#app")
        .removeEventListener("click", this.closeReqs);
    },
    showReqs() {
      if (this.isShowDropdown) {
        this.closeDropdown();
      }
      if (this.showMsgs) {
        this.closeMsgs();
      }
      this.isShowReqs = true;
      document.querySelector("#app").addEventListener("click", this.closeReqs);
    },
  },
  created() {
    if (this.$route.name !== "home") this.isHome = false;
  },
  computed: {
    isAbsolute() {
      return { "on-homepage": this.isHome };
    },
    svgColor() {
      return this.isHome ? 'white' : 'black'
    },
    user() {
      return this.$store.getters.loggedUser;
    },
    profilePic() {
      return { "background-image": `url('${this.user.profilePic}')` };
    },
    currentRoute() {
      return this.$route.path;
    },
    isShowLogin() {
      if (this.$route.hash !== "#login") return false;
      return true;
    },
    chats() {
      return this.$store.getters.userChats;
    },
    unreadChats() {
      return this.chats.reduce((acc,chat) => {
        return (chat.unread.some(userId => userId === this.user._id))? ++acc : acc;
      }, 0)
    },
    requests() {
      return this.$store.getters.userRequests;
    }
  },
  watch: {
    $route: {
      handler(newRoute) {
        if (newRoute.name !== "home") this.isHome = false;
        else this.isHome = true;
      }
    }
  }
};
</script>

<style lang="scss">
</style>
