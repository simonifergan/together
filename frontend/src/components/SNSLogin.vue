<template>
  <section>
   <fb:login-button scope="public_profile,email" onlogin="checkLoginState();">
</fb:login-button>
  </section>
</template>

<script>

export default {
  methods: {
    checkLoginState() {
      console.log('hi');
    },
  }
};
</script>

<style>
</style>
