<template>
  <ul class="request-dropdown">
    <request-preview
      @requestApproved="$emit('requestApproved', $event)"
      @requestRejected="$emit('requestRejected', $event)"
      v-for="request in requestsForRender"
      :request="request"
      :key="request.trip._id + request.user._id"
      @click.stop
    />
    <footer v-if="!isExpanded">
      <router-link to="/requests">See all requests</router-link>
    </footer>
  </ul>
</template>

<script>
import RequestPreview from "@/components/RequestPreview";

export default {
  props: {
    requests: {
      type: Array,
      required: true,
      default: () => {
        return [];
      }
    },
    user: {
      type: Object,
      required: true,
      default: () => {
        return {};
      }
    }
  },
  components: {
    RequestPreview
  },
  methods: {
    // requestApproved({ pendingUser, tripId }) {
    //   this.$store.dispatch({
    //     type: "approveUserToTrip",
    //     userToJoin: pendingUser,
    //     tripIdToJoin: tripId
    //   });
    // },
    // requestRejected({ pendingUser, tripId }) {
    //   this.$store.dispatch({
    //     type: "removeUserFromTrip",
    //     userToLeave: pendingUser,
    //     tripIdToLeave: tripId
    //   });
    // }
  },
  computed: {
    isExpanded() {
      return this.$route.path === "/messages";
    },
    requestsForRender() {
      const reqs = [];
      this.requests.forEach(tripReqs => {
        tripReqs.pendingusers.forEach(user => {
          reqs.push({
            user,
            trip: { id: tripReqs._id, title: tripReqs.title }
          });
        });
      });
      return reqs;
    }
  },
};
</script>

<style>
</style>
