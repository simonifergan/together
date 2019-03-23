<template>
    <section class="pending-list" v-if="pendingUsers">
      <h1>Pending</h1>
        <div 
        class="member-img"
        v-for="pendingUser in pendingUsers"
        :key="pendingUser._id"
        :style="{ backgroundImage: `url('${pendingUser.profilePic}')` }"
        :title="pendingUser.firstname"
        />
    </section>
</template>

<script>
export default {
  props: {
    pendingUserIds: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      pendingUsers: null
    }
  },
  computed: {
  },
  async created() {
    const users = await this.$store.dispatch({type: 'getUsers', userIds: this.pendingUserIds})
    this.pendingUsers = users
  }
}
</script>
