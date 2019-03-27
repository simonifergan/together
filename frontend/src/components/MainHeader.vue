<template>
  <header class="main-header" :class="isAbsolute">
    <router-link title="Homepage" tag="div" class="logo" to="/">
      <!-- <i class="fas fa-map-marker-alt"></i> -->
      <img src="@/assets/svg/person_pin_circle.svg">
      <h1>Travel Maker</h1>
    </router-link>
    <nav>
      <router-link to="/">Home</router-link>
      <a href="#">About</a>
      <router-link to="/signup" v-if="!user">Sign up</router-link>
      <div class="msgs-container" v-else>
        <a @click.stop="showMsgs">Messages</a>
        <message-list
          v-show="isShowMsgs" 
          :chats="chats"
          :user="user" 
        />
      </div>
      <div class="login-container">
        <router-link :to="currentRoute + '#login'" v-if="!user">Log in</router-link>
        <login v-if="isShowLogin"/>
      </div>
      <div v-if="user" class="user-dashboard" :style="profilePic" @click.stop="showDropdown">
        <div class="dropdown" v-if="isShowDropdown">
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

export default {
  name: "MainHeader",
  components: {
    Login,
    MessageList
  },
  data() {
    return {
      isHome: true,
      isShowDropdown: false,
      isShowMsgs: false,
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
      if (this.isShowDropdown) {
        this.closeDropdown();
      }
      if (this.isShowMsgs) {
        this.closeMsgs();
        return;
      }
      this.isShowMsgs = true;
      document
        .querySelector("#app")
        .addEventListener("click", this.closeMsgs);
    }
  },
  created() {
    if (this.$route.name !== "home") this.isHome = false;
  },
  computed: {
    isAbsolute() {
      return { "on-homepage": this.isHome };
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
