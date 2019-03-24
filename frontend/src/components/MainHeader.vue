<template>
  <header class="main-header" :class="isAbsolute">
    <router-link title="Homepage" tag="h1" to="/">Travel Maker</router-link>
    <nav>
      <router-link to="/">Home</router-link>
      <a href="#">About</a>
      <router-link to="/signup" v-if="!user">Sign up</router-link>
      <router-link :to="currentRoute + '#login'" v-if="!user">Log in</router-link>
      <div v-if="user" class="user-dashboard" :style="profilePic" @click="isShowDropdown = !isShowDropdown">
        <div class="dropdown" v-if="isShowDropdown" @click.stop="">
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
export default {
  name: 'MainHeader',
  data() {
    return {
      isHome: true,
      isShowDropdown: false,
    };
  },
  methods: {
    async logout() {
      try {
        await this.$store.dispatch('logout');
        this.$router.push('/');
      } catch {

      }
    }
  },
  created() {
    if (this.$route.name !== 'home') this.isHome = false;
  },
  computed: {
    isAbsolute() {
      return {'on-homepage': this.isHome}
    },
    user() {
      return this.$store.getters.loggedUser;
    },
    profilePic() {
      return { "background-image": `url('${this.user.profilePic}')` };
    },
    currentRoute() {
      return this.$route.path;
    }
  },
  watch: {
    $route: {
      handler(newRoute) {
        if (newRoute.name !== 'home') this.isHome = false;
        else this.isHome = true;
      }
    }
  }
}
</script>

<style lang="scss">

</style>
