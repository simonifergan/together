<template>
  <router-link 
    :to="link"
    class="notification">
        <div class="profile-pic" :style="profilePic"/>
        <div class="notification-details">
        <p>{{notification.user.firstname}} {{notification.action | notificationAction}}</p>
        <p>{{notification.createdAt | fromNow}}</p>
        </div>
  </router-link>
</template>

<script>
export default {
  props: {
    notification: {
      type: Object,
      required: true
    }
  },
  computed: {
    profilePic() {
      return {
        "background-image": `url('${this.notification.user.profilePic}')`
      }
    },
    link() {
        if (this.notification.action.includes('trip')) return `/trip/${this.notification.tripId}`;
        else return `/user/${this.notification.userId}`;
    }
  }
}
</script>

<style lang="scss">

</style>