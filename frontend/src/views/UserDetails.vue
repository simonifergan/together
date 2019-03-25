<template>
  <section class="user-details" v-if="user">
    <div class="top-fold">
      <div :style="profilePic" class="user-img"/>
      <span>{{user.firstname}} {{user.lastname}}</span>
    </div>

    <ul class="user-trips">
      <h2>{{user.firstname}}'s trips</h2>
      <user-trip-preview v-for="trip in trips" :key="trip._id" :trip="trip">
        <!-- <pending-list
            slot="pending-list"
            @requestPendingUsers="requestPendingUsers"
            @requestApproved="requestApproved"
            @requestRejected="requestRejected"
            v-if="loggedInUser && loggedInUser._id === trip.userId"
        />-->
      </user-trip-preview>
    </ul>

    <ul class="user-trips">
      <h2>{{user.firstname}}'s testimonies</h2>
    </ul>
  </section>
</template>

<script>
import UserTripPreview from "@/components/UserTripPreview";

export default {
  components: {
    UserTripPreview
  },
  methods: {
    async initUser() {
      const { userId } = this.$route.params;
      if (userId) {
        const res = await this.$store.dispatch({ type: "getUserById", userId });
        if (res)
          await this.$store.dispatch({ type: "loadTripsByUserId", userId });
      }
    },
    requestPendingUsers(pending) {
      this.$store.dispatch({ type: "getUsers", userIds: pending });
    }
  },
  async created() {
    this.initUser();
  },
  computed: {
    user() {
      return this.$store.getters.userToDisplay;
    },
    profilePic() {
      if (!this.user) return "";
      return { backgroundImage: `url('${this.user.profilePic}')` };
    },
    trips() {
      return this.$store.getters.trips;
    }
  },
  beforeDestroy() {
    this.$store.commit({ type: "setUserToDisplay", user: null });
  },
  watch: {
    $route: {
      handler(newRoute) {
        this.initUser();
      },
      deep: true
    }
  }
};
</script>

<style>
</style>
