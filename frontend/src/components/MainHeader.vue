<template>
  <header class="main-header" :class="isAbsolute">
    <router-link title="Homepage" tag="h1" to="/">Bridge</router-link>
    <nav>
      <router-link to="/">Home</router-link>
      <a href="#">About</a>
      <a href="#">Placeholder</a>
      <router-link to="/signup">Sign up</router-link>
      <router-link to="/login">Log in</router-link>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'MainHeader',
  data() {
    return {
      isHome: true,
    };
  },
  created() {
    if (this.$route.name !== 'home') this.isHome = false;
  },
  computed: {
    isAbsolute() {
      return {'on-homepage': this.isHome}
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
