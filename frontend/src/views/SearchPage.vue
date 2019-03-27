<template>
  <section class="search-page">
    <trip-list v-if="results" :trips="results" title="Search Results"></trip-list>
    <notification-list :notifications="getNotifications"/>
  </section>
</template>

<script>
// CMPS
import TripList from "@/components/TripList";
import NotificationList from "@/components/NotificationList";

export default {
  name: "searchResults",
  components: {
    TripList,
    NotificationList
  },
  computed: {
    results() {
      return this.$store.getters.searchResults;
    },
    searchQuery() {
      return this.$route.query.q;
    },
    tripDate() {
      return this.$route.query.tripDate;
    },
    getNotifications() {
      return this.$store.getters.notifications;
    }
  },
  created() {
    this.$store.dispatch({
      type: 'searchTrips',
      searchQuery: this.searchQuery,
      tripDate: this.tripDate
    });
  }
};
</script>

<style>
</style>
