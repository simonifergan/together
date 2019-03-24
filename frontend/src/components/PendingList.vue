<template>
  <section class="pending-list" v-if="pendingUsers">
    <h1>Pending</h1>
    <div
      class="member-img"
      v-for="pendingUser in pendingUsers"
      :key="pendingUser._id"
      :style="{ backgroundImage: `url('${pendingUser.profilePic}')` }"
      :title="pendingUser.firstname"
    >
      <button @click="requestApproved(pendingUser)">Approve</button>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    pendingUsers() {
      console.log(this.$store.getters.userListToDisplay);
      return this.$store.getters.userListToDisplay;
    }
  },
  methods: {
    requestApproved(pendingUser) {
      this.$emit("requestApproved", pendingUser);
    }
  },
  created() {
    this.$emit("requestPendingUsers");
  },
  beforeDestroy() {
    this.$store.commit({ type: "setUsersToDisplay", users: [] });
  }
};
</script>
