<template>
  <header class="main-header">
    <div class="wrapper">

    <router-link title="Homepage" tag="div" class="logo" to="/">
      <div @click.stop="openNav" class="btn-nav">
        <i class="fas fa-bars"></i>
      </div>
      <h1>Together</h1>
    </router-link>
    <nav :class="{show: isNavOpen}">
      <router-link to="/">Home</router-link>
      <router-link to="/signup" v-if="!user">Sign up</router-link>
      <div class="requests-container" v-if="user">
        <a @click.stop="showReqs">Requests&nbsp;<span class="unread-msgs" v-if="pendingRequests">{{pendingRequests}}</span></a>
        <request-list v-show="isShowReqs" :requests="requests" :user="user"/>
      </div>
      <div class="msgs-container" v-if="user">
        <a @click.stop="showMsgs">
          Messages&nbsp;
          <span class="unread-msgs" v-if="unreadChats">{{unreadChats}}</span>
        </a>
        <message-list v-show="isShowMsgs" :chats="chats" :user="user"/>
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
    <login class="login-mobile" :class="{show: isShowLogin}" />
    <div v-if="user" class="user-dashboard-mobile" :style="profilePic" @click.stop="showDropdown">
      <div class="dropdown-mobile" :class="{show: isShowDropdown}">
        <router-link to="/edit">Add a new trip</router-link>
        <router-link :to="'/user/' + user._id">Profile</router-link>
        <router-link :to="'/account/' + user._id">Account</router-link>
        <a @click="logout">Log out</a>
      </div>
    </div>
    </div>
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
      isNavOpen: false
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
    openNav() {
      if (this.isShowReqs) {
        this.closeReqs();
      }
      if (this.isShowMsgs) {
        this.closeMsgs();
      }
      if (this.isShowDropdown) {
        this.closeDropdown();
      }
      if (this.isNavOpen) {
        this.closeNav();
        return;
      }
      this.isNavOpen = true;
      document.querySelector("#app").addEventListener("click", this.closeNav);
    },
    closeNav() {
      this.isNavOpen = false;
      document
        .querySelector("#app")
        .removeEventListener("click", this.closeNav);
    },
    closeDropdown() {
      this.isShowDropdown = false;
      document
        .querySelector("#app")
        .removeEventListener("click", this.closeDropdown);
    },
    showDropdown() {
      if (this.isNavOpen) {
        this.closeNav();
      }
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
      if (this.isMobile()) {
        this.$router.push("/messages");
        this.isNavOpen = false;
        return;
      }
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
      if (this.isShowMsgs) {
        this.closeMsgs();
      }
      if (this.isShowReqs) {
        this.closeReqs();
        return;
      }
      this.isShowReqs = true;
      document.querySelector("#app").addEventListener("click", this.closeReqs);
    },
    isMobile() {
      return window.matchMedia("(max-width: 860px)").matches;
    }
  },
  created() {
    if (this.$route.name !== "home") this.isHome = false;
  },
  computed: {
    svgColor() {
      return (this.isHome) ? "white" : "black";
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
      return this.chats.reduce((acc, chat) => {
        return chat.unread.some(userId => userId === this.user._id)
          ? ++acc
          : acc;
      }, 0);
    },
    requests() {
      return this.$store.getters.userRequests;
    },
    pendingRequests() {
      if (!this.requests && !this.requests.length) return 0;
      const acc =this.requests.reduce((acc, tripReqs) => {
        return acc += tripReqs.pendingusers.length;
      }, 0);
      return acc;
    },
    isOnMobile() {
      return this.isMobile();
    }
  },
};
</script>

<style lang="scss">
</style>
