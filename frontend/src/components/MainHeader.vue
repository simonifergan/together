<template>
  <header class="main-header" :class="isAbsolute">
    <div class="wrapper">

    <router-link title="Homepage" tag="div" class="logo" to="/">
      <!-- <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
        <path fill="none" d="M0 0h24v24H0V0z"></path>
        <path
          :fill="svgColor"
          d="M12 1C7.59 1 4 4.59 4 9c0 5.57 6.96 13.34 7.26 13.67l.74.82.74-.82C13.04 22.34 20 14.57 20 9c0-4.41-3.59-8-8-8zm0 19.47C9.82 17.86 6 12.54 6 9c0-3.31 2.69-6 6-6s6 2.69 6 6c0 3.83-4.25 9.36-6 11.47zM12 9c.83 0 1.5-.67 1.5-1.5S12.83 6 12 6s-1.5.68-1.5 1.5c0 .83.67 1.5 1.5 1.5zm0 1c-1 0-3 .5-3 1.5v.12c.73.84 1.8 1.38 3 1.38s2.27-.54 3-1.38v-.12c0-1-2-1.5-3-1.5z"
        ></path>
      </svg> -->
      <svg class="btn-nav" @click.stop="openNav" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0z" fill="none"></path>
        <path :fill="svgColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
      </svg>
      <h1>Together</h1>
    </router-link>
    <nav :class="{show: isNavOpen}">
      <router-link to="/">Home</router-link>
      <a href="#">About</a>
      <router-link to="/signup" v-if="!user">Sign up</router-link>
      <div class="requests-container" v-if="user">
        <a @click.stop="showReqs">Requests</a>
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
    isAbsolute() {
      return { "on-homepage": this.isHome };
    },
    svgColor() {
      return this.isHome ? "white" : "black";
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
    isOnMobile() {
      return this.isMobile();
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
