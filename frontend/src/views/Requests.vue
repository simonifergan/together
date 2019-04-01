<template>
  <section class="requests-page">
    <request-list 
      :user="user" 
      :requests="requests"
      @requestApproved="requestApproved"
      @requestRejected="requestRejected" />
  </section>
</template>

<script>
// CMPS
import RequestList from "@/components/RequestList";

export default {
  components: {
    RequestList
  },
  data() {
    return {};
  },
  methods: {
    requestApproved({ pendingUser, tripId }) {
      this.$store.dispatch({
        type: "approveUserToTrip",
        userToJoin: pendingUser,
        tripIdToJoin: tripId
      });
    },
    requestRejected({ pendingUser, tripId }) {
      this.$store.dispatch({
        type: "removeUserFromTrip",
        userToLeave: pendingUser,
        tripIdToLeave: tripId
      });
    }
  },
  computed: {
    requests() {
      return this.$store.getters.userRequests;
    },
    user() {
      return this.$store.getters.loggedUser;
    }
  }
};
</script>

<style>
</style>
