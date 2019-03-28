<template>
  <section class="btn-sns-container">
    <button type="button" class="fb" @click.stop.prevent="fbLogin">Login with <i class="fab fa-facebook-square"></i></button>
  </section>
</template>

<script>
export default {
  methods: {
    success(response) {
      console.log(response);
      if (response === 'connected') {
        this.$store.dispatch('checkFacebookUser')
        .then(isAuth => {
          this.$router.push(this.$route.path);
        });
      }
    },
    fbLogin() {
      FB.login(this.success,
        {
          scope: "email",
          return_scopes: true
        }
      );
    }
  }
};
</script>

<style>
</style>
