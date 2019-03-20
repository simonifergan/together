<template>
  <header class="main-header" :class="isAbsolute">
    <router-link title="Homepage" tag="h1" to="/">Bridge</router-link>
    <nav>
      <a href="#">Home</a>
      <a href="#">About</a>
      <a href="#">Placeholder</a>
      <a href="#">Sign up</a>
      <a href="#">Log in</a>
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
  computed: {
    isAbsolute() {
      return {'on-homepage': this.isHome}
    }
  },
  watch: {
    $route: {
      handler(newRoute, oldRoute) {
        if (newRoute.name !== 'home') this.isHome = false;
        else this.isHome = true;
      }
    }
  }
}
</script>

<style lang="scss">

</style>
