<template>
  <section v-if="pendingUsers">
    <h1>Pending</h1>
    <div class="pending-list">
      <user-preview 
        v-for="pendingUser in pendingUsers" 
        :key="pendingUser._id"
        :user="pendingUser">
          <div 
            class="btns-pending"
            slot="btns-pending">
              <button @click="requestApproved(pendingUser)">Approve</button>
              <button @click="requestRejected(pendingUser)">Cancel</button>
          </div>
      </user-preview>
    </div>
  </section>
</template>

<script>
import UserPreview from '@/components/UserPreview.vue';

export default {
  components: {
    UserPreview
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
    },
    requestRejected(pendingUser) {
      this.$emit("requestRejected", pendingUser);
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