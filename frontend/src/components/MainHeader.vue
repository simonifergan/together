<template>
  <header class="main-header" :class="isAbsolute">
    <router-link title="Homepage" tag="h1" to="/">Travel Maker</router-link>
    <nav>
      <router-link to="/">Home</router-link>
      <a href="#">About</a>
      <router-link to="/signup" v-if="!user">Sign up</router-link>
      <div class="msgs-container" v-else>
        <a>Messages</a>
        <!-- <message-list 
          :chats="chats"
          :user="user" 
        /> -->
      </div>
      <div class="login-container">
        <router-link :to="currentRoute + '#login'" v-if="!user">Log in</router-link>
        <login v-if="isShowLogin"/>
      </div>
      <div v-if="user" class="user-dashboard" :style="profilePic" @click.stop="showDropdown">
        <div class="dropdown" v-if="isShowDropdown" @click.stop>
          <a href="#">Profile</a>
          <a href="#">Account</a>
          <a href="#">Friends</a>
          <a href="#">My trips</a>
          <a href="#" @click="logout">Log out</a>
        </div>
      </div>
      <!-- <a href="#">Log out</a> -->
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
      isShowDropdown: false
    };
  },
  methods: {
    async logout() {
      try {
        await this.$store.dispatch("logout");
        this.$router.push("/");
      } catch {}
    },
    closeDropdown() {
      console.log("alive?");
      this.isShowDropdown = false;
      document
        .querySelector("#app")
        .removeEventListener("click", this.closeDropdown);
    },
    showDropdown() {
      console.log("activate");
      this.isShowDropdown = true;
      document
        .querySelector("#app")
        .addEventListener("click", this.closeDropdown);
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
