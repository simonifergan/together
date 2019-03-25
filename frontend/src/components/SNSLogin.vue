<template>
  <section>
    <button @click.stop.prevent="fbLogin">FB LOGIN</button>
  </section>
</template>

<script>
export default {
  methods: {
    success() {
      this.$store.dispatch('checkFacebookUser')
      .then(isAuth => {
        this.$router.push(this.$route.path);
      });
    },
    fbLogin() {
      let self = this;
      FB.login(
        function(response) {
          if (response.status === "connected") {
            self.success();
          }
        },
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
