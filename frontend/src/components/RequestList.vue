<template>
  <ul class="request-dropdown">
    <request-preview
      v-for="request in requestsForRender"
      :request="request"
      :key="request.tripId + request.user.userId"
      @click.stop=""
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
      requestApproved(pendingUser) {
      this.$store.dispatch({
        type: "ApproveUserToTrip",
        userToJoin: pendingUser,
        tripIdToJoin: this.trip._id
      });
    },
    requestRejected(pendingUser) {
      this.$store.dispatch({
        type: "removeUserFromTrip",
        userToLeave: pendingUser,
        tripIdToLeave: this.trip._id
      });
    },
  },
  computed: {
    isExpanded() {
        return (this.$route.path === '/messages')
    },
    requestsForRender() {
        const reqs = []
        this.requests.forEach(tripReqs => {
            tripReqs.pendingusers.forEach(user => {
                reqs.push({user, trip: {id: tripReqs._id, title: tripReqs.title }})
            })
        })
        return reqs
    }
  },
  
  methods: {
    // initChat(chatId) {
    //   if (this.isExpanded) {
    //     this.$emit('changeChat', chatId);
    //   } else this.$store.dispatch({ type: "activateChat", chatId });
    // }
  }
};
</script>

<style>
</style>
