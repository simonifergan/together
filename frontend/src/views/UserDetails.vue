<template>
  <section class="user-details" v-if="user">
    <div class="top-fold">
      <div :style="profilePic" class="user-img" />
      <span>{{user.firstname}} {{user.lastname}}</span>
    </div>
    
    <ul class="user-trips">
      <h2>{{user.firstname}}'s trips</h2>
    </ul>
    
    <ul class="user-trips">
      <h2>{{user.firstname}}'s testimonies</h2>
    </ul>

  </section>
</template>

<script>
export default {
    created() {
      const {userId} = this.$route.params;
      if (userId) {
        this.$store.dispatch({type: 'getUserById', userId});
      }
    },
    computed: {
      user() {
        return this.$store.getters.userToDisplay;
      },
      profilePic() {
        if (!this.user) return '';
        return {backgroundImage: `url('${this.user.profilePic}')`}
      }
    },
    beforeDestroy() {
      this.$store.commit({type: 'setUserToDisplay', user: null});
    }
};
</script>

<style>
</style>
