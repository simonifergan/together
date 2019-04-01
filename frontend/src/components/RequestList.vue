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
      <router-link class="see-all-reqs" v-if="requests.length" to="/requests">See all requests</router-link>
      <p v-else>No requests</p>
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
  computed: {
    isExpanded() {
      return this.$route.path === "/requests";
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
