<template>
  <section v-if="pendingUsers">
    <div class="pending-list">
      <user-preview v-for="pendingUser in pendingUsers" :key="pendingUser._id" :user="pendingUser">
        <div class="btns-pending" slot="btns-pending">
          <button @click="requestApproved(pendingUser)">
            <i class="fas fa-check"></i>
          </button>
          <button @click="requestRejected(pendingUser)">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </user-preview>
    </div>
  </section>
</template>

<script>
import UserPreview from "@/components/UserPreview.vue";

export default {
  components: {
    UserPreview
  },
  computed: {
    pendingUsers() {
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

<style lang="scss">
.pending-list {
  .btns-pending {
    button {
      background: none;
      border: none;
      padding: 5px;
      transition: .3s;
      i {
        font-size: 1.4em;
      }
      &:first-of-type:hover {
        color: #8bc34a;
      }
      &:last-of-type:hover {
        color: #e74c3c;
      }
    }
  }
}
</style>
