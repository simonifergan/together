<template>
  <section class="btn-sns-container">
    <button type="button" class="fb" @click.stop.prevent="fbLogin">Login with <i class="fab fa-facebook-square"></i></button>
  </section>
</template>

<script>
export default {
  methods: {
    success(response) {
      console.log('HI RESPONSE', response);
      if (response.status === 'connected') {
         FB.api('/me', 'GET', { fields: 'first_name, last_name, name, id, email, picture.width(300).height(300)' }, response => {
           this.authUser(response);
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
    },
    authUser(response) {
      this.$store.dispatch({type: 'checkFacebookUser', userFBInfo: response})
        .then(isAuth => {
          this.$router.push(this.$route.path);
        });
    }
  }
};
</script>

<style>
</style>
